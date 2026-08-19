from contextlib import asynccontextmanager
from datetime import datetime, timezone
from uuid import UUID

import httpx
from fastapi import Depends, FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, ConfigDict, EmailStr, Field
from sqlalchemy import func, select, text
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import engine
from app.core.dependencies import DbSession, get_current_user, require_role
from app.core.security import create_access_token, hash_password, verify_password
from app.models import Allocation, Application, AllocationRun, Company, Internship, Preference, Student, User, WeightConfig


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    role: str = Field(default="student", pattern="^(student|company)$")


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class ProfileRequest(BaseModel):
    full_name: str | None = None
    university: str | None = None
    degree: str | None = None
    graduation_year: int | None = Field(default=None, ge=1900, le=2200)
    cgpa: float | None = Field(default=None, ge=0, le=10)
    career_goals: list[str] = []
    preferred_locations: list[str] = []


class CompanyProfileRequest(BaseModel):
    company_name: str = Field(min_length=1, max_length=255)
    description: str | None = None
    industry: str | None = None
    website: str | None = None
    location: str | None = None


class InternshipRequest(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    description: str | None = None
    domain: str | None = None
    location: str | None = None
    duration: str | None = None
    seats: int = Field(default=1, ge=1)
    minimum_cgpa: float | None = Field(default=None, ge=0, le=10)
    minimum_graduation_year: int | None = None


class PreferencesRequest(BaseModel):
    ranked_internship_ids: list[UUID]


class ResumeRequest(BaseModel):
    text: str = Field(min_length=1, max_length=50000)


class WeightsRequest(BaseModel):
    skill: float = Field(ge=0)
    location: float = Field(ge=0)
    career: float = Field(ge=0)
    preference: float = Field(ge=0)
    company: float = Field(ge=0)
    fairness: float = Field(ge=0)


def ok(data, message="Operation successful"):
    return {"success": True, "data": data, "message": message}


def user_data(user: User):
    return {"id": str(user.id), "email": user.email, "role": user.role, "is_active": user.is_active}


def student_data(student: Student):
    return {"id": str(student.id), "user_id": str(student.user_id), "full_name": student.full_name,
            "university": student.university, "degree": student.degree, "graduation_year": student.graduation_year,
            "cgpa": float(student.cgpa) if student.cgpa is not None else None,
            "career_goals": student.career_goals, "preferred_locations": student.preferred_locations}


def internship_data(item: Internship):
    return {"id": str(item.id), "company_id": str(item.company_id), "title": item.title,
            "description": item.description, "domain": item.domain, "location": item.location,
            "duration": item.duration, "seats": item.seats, "minimum_cgpa": float(item.minimum_cgpa) if item.minimum_cgpa else None,
            "minimum_graduation_year": item.minimum_graduation_year, "is_active": item.is_active}


def own_student(user: User, db: Session) -> Student:
    student = db.scalar(select(Student).where(Student.user_id == user.id))
    if not student:
        raise HTTPException(404, "Student profile not found")
    return student


def own_company(user: User, db: Session) -> Company:
    company = db.scalar(select(Company).where(Company.user_id == user.id))
    if not company:
        raise HTTPException(404, "Company profile not found")
    return company


@asynccontextmanager
async def lifespan(_: FastAPI):
    yield


app = FastAPI(title="SIH Internship Allocation API", version="1.0.0", lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=[settings.frontend_url], allow_credentials=True,
                   allow_methods=["*"], allow_headers=["*"])


@app.exception_handler(IntegrityError)
async def integrity_error_handler(_, __):
    return JSONResponse(status_code=409, content={"success": False, "message": "A record with these values already exists", "errors": []})


@app.get("/api/health")
def health(db: DbSession):
    try:
        db.execute(text("SELECT 1"))
        database = "ok"
    except Exception:
        database = "unavailable"
    return ok({"status": "ok", "service": "main-backend", "database": database})


@app.get("/api/health/full")
async def full_health(db: DbSession):
    result = health(db)["data"]
    try:
        async with httpx.AsyncClient(timeout=2) as client:
            response = await client.get(f"{settings.ai_service_url}/health")
            ai = response.json() if response.is_success else {"status": "unavailable"}
    except httpx.HTTPError:
        ai = {"status": "unavailable"}
    return ok({**result, "ai_service": ai})


@app.post("/api/auth/register", status_code=201)
def register(payload: RegisterRequest, db: DbSession):
    if db.scalar(select(User).where(User.email == payload.email.lower())):
        raise HTTPException(409, "Email is already registered")
    user = User(email=payload.email.lower(), password_hash=hash_password(payload.password), role=payload.role)
    db.add(user)
    db.flush()
    if payload.role == "student":
        db.add(Student(user_id=user.id, career_goals=[], preferred_locations=[]))
    else:
        db.add(Company(user_id=user.id, company_name="Unnamed company"))
    db.commit()
    return ok({"access_token": create_access_token(user.id, user.role), "token_type": "bearer", "user": user_data(user)}, "Registered successfully")


@app.post("/api/auth/login")
def login(payload: LoginRequest, db: DbSession):
    user = db.scalar(select(User).where(User.email == payload.email.lower()))
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(401, "Invalid email or password")
    return ok({"access_token": create_access_token(user.id, user.role), "token_type": "bearer", "user": user_data(user)}, "Logged in successfully")


@app.get("/api/auth/me")
def me(user: User = Depends(get_current_user)):
    return ok(user_data(user))


@app.get("/api/student/profile")
def get_student_profile(user: User = Depends(require_role("student")), db: DbSession = None):
    return ok(student_data(own_student(user, db)))


@app.put("/api/student/profile")
def update_student_profile(payload: ProfileRequest, user: User = Depends(require_role("student")), db: DbSession = None):
    student = own_student(user, db)
    for field, value in payload.model_dump().items():
        setattr(student, field, value)
    db.commit()
    return ok(student_data(student))


@app.post("/api/student/resume")
async def parse_resume(payload: ResumeRequest, user: User = Depends(require_role("student")), db: DbSession = None):
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.post(f"{settings.ai_service_url}/ai/parse-resume", json={"text": payload.text})
            response.raise_for_status()
            parsed = response.json()
    except (httpx.HTTPError, ValueError) as exc:
        raise HTTPException(503, "AI service is unavailable") from exc
    student = own_student(user, db)
    student.resume_text = payload.text
    student.career_goals = parsed.get("careerGoals", [])
    student.preferred_locations = parsed.get("preferredLocations", [])
    db.commit()
    return ok({"profile": student_data(student), "parsed": parsed})


@app.put("/api/student/preferences")
def update_preferences(payload: PreferencesRequest, user: User = Depends(require_role("student")), db: DbSession = None):
    student = own_student(user, db)
    preference = db.scalar(select(Preference).where(Preference.student_id == student.id))
    if not preference:
        preference = Preference(student_id=student.id)
        db.add(preference)
    preference.ranked_internship_ids = [str(item) for item in payload.ranked_internship_ids]
    db.commit()
    return ok({"ranked_internship_ids": preference.ranked_internship_ids})


@app.get("/api/student/preferences")
def get_preferences(user: User = Depends(require_role("student")), db: DbSession = None):
    preference = db.scalar(select(Preference).where(Preference.student_id == own_student(user, db).id))
    return ok(preference.ranked_internship_ids if preference else [])


@app.get("/api/student/matches")
def student_matches(user: User = Depends(require_role("student")), db: DbSession = None):
    internships = db.scalars(select(Internship).where(Internship.is_active.is_(True))).all()
    return ok([internship_data(item) for item in internships])


@app.get("/api/student/allocation")
def student_allocation(user: User = Depends(require_role("student")), db: DbSession = None):
    student = own_student(user, db)
    allocation = db.scalar(select(Allocation).where(Allocation.student_id == student.id, Allocation.is_active.is_(True)).order_by(Allocation.created_at.desc()))
    return ok(None if not allocation else {"internship_id": str(allocation.internship_id), "match_score": float(allocation.match_score), "reason": allocation.allocation_reason})


@app.get("/api/company/profile")
def get_company_profile(user: User = Depends(require_role("company")), db: DbSession = None):
    company = own_company(user, db)
    return ok({"id": str(company.id), "user_id": str(company.user_id), "company_name": company.company_name, "description": company.description, "industry": company.industry, "website": company.website, "location": company.location})


@app.put("/api/company/profile")
def update_company_profile(payload: CompanyProfileRequest, user: User = Depends(require_role("company")), db: DbSession = None):
    company = own_company(user, db)
    for field, value in payload.model_dump().items():
        setattr(company, field, value)
    db.commit()
    return get_company_profile(user, db)


@app.post("/api/company/internships", status_code=201)
def create_internship(payload: InternshipRequest, user: User = Depends(require_role("company")), db: DbSession = None):
    company = own_company(user, db)
    item = Internship(company_id=company.id, **payload.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return ok(internship_data(item), "Internship created")


@app.get("/api/company/internships")
def list_internships(user: User = Depends(require_role("company")), db: DbSession = None):
    company = own_company(user, db)
    return ok([internship_data(item) for item in db.scalars(select(Internship).where(Internship.company_id == company.id)).all()])


@app.get("/api/company/internships/{internship_id}")
def get_internship(internship_id: UUID, user: User = Depends(require_role("company")), db: DbSession = None):
    company = own_company(user, db)
    item = db.scalar(select(Internship).where(Internship.id == internship_id, Internship.company_id == company.id))
    if not item:
        raise HTTPException(404, "Internship not found")
    return ok(internship_data(item))


@app.put("/api/company/internships/{internship_id}")
def update_internship(internship_id: UUID, payload: InternshipRequest, user: User = Depends(require_role("company")), db: DbSession = None):
    item = get_owned_internship(internship_id, user, db)
    for field, value in payload.model_dump().items():
        setattr(item, field, value)
    db.commit()
    return ok(internship_data(item))


@app.delete("/api/company/internships/{internship_id}")
def delete_internship(internship_id: UUID, user: User = Depends(require_role("company")), db: DbSession = None):
    item = get_owned_internship(internship_id, user, db)
    item.is_active = False
    db.commit()
    return ok(None, "Internship deactivated")


def get_owned_internship(internship_id: UUID, user: User, db: Session) -> Internship:
    company = own_company(user, db)
    item = db.scalar(select(Internship).where(Internship.id == internship_id, Internship.company_id == company.id))
    if not item:
        raise HTTPException(404, "Internship not found")
    return item


@app.post("/api/student/applications/{internship_id}", status_code=201)
def apply(internship_id: UUID, user: User = Depends(require_role("student")), db: DbSession = None):
    student = own_student(user, db)
    internship = db.get(Internship, internship_id)
    if not internship or not internship.is_active:
        raise HTTPException(404, "Internship not found")
    if db.scalar(select(Application).where(Application.student_id == student.id, Application.internship_id == internship.id)):
        raise HTTPException(409, "Application already exists")
    application = Application(student_id=student.id, internship_id=internship.id)
    db.add(application)
    db.commit()
    return ok({"id": str(application.id), "student_id": str(student.id), "internship_id": str(internship.id), "status": application.status}, "Application submitted")


@app.get("/api/student/applications")
def student_applications(user: User = Depends(require_role("student")), db: DbSession = None):
    student = own_student(user, db)
    applications = db.scalars(select(Application).where(Application.student_id == student.id)).all()
    return ok([{"id": str(item.id), "internship_id": str(item.internship_id), "status": item.status} for item in applications])


@app.delete("/api/student/applications/{internship_id}")
def withdraw_application(internship_id: UUID, user: User = Depends(require_role("student")), db: DbSession = None):
    student = own_student(user, db)
    application = db.scalar(select(Application).where(Application.student_id == student.id, Application.internship_id == internship_id))
    if not application:
        raise HTTPException(404, "Application not found")
    application.status = "withdrawn"
    db.commit()
    return ok(None, "Application withdrawn")


@app.get("/api/admin/weights")
def get_weights(user: User = Depends(require_role("admin")), db: DbSession = None):
    config = db.scalar(select(WeightConfig).where(WeightConfig.is_active.is_(True)).order_by(WeightConfig.created_at.desc()))
    return ok(weight_data(config) if config else {"skill": 35, "location": 20, "career": 20, "preference": 10, "company": 10, "fairness": 5})


def weight_data(config):
    return {"skill": float(config.skill_weight), "location": float(config.location_weight), "career": float(config.career_weight), "preference": float(config.preference_weight), "company": float(config.company_weight), "fairness": float(config.fairness_weight)}


@app.put("/api/admin/weights")
def update_weights(payload: WeightsRequest, user: User = Depends(require_role("admin")), db: DbSession = None):
    if sum(payload.model_dump().values()) != 100:
        raise HTTPException(400, "Weights must total 100")
    db.query(WeightConfig).update({WeightConfig.is_active: False})
    values = payload.model_dump()
    config = WeightConfig(created_by=user.id, skill_weight=values["skill"], location_weight=values["location"], career_weight=values["career"], preference_weight=values["preference"], company_weight=values["company"], fairness_weight=values["fairness"])
    db.add(config)
    db.commit()
    return ok(weight_data(config))


@app.get("/api/admin/stats")
def admin_stats(user: User = Depends(require_role("admin")), db: DbSession = None):
    return ok({"students": db.scalar(select(func.count()).select_from(Student)), "companies": db.scalar(select(func.count()).select_from(Company)), "active_internships": db.scalar(select(func.count()).select_from(Internship).where(Internship.is_active.is_(True))), "active_allocations": db.scalar(select(func.count()).select_from(Allocation).where(Allocation.is_active.is_(True)))})
