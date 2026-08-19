from datetime import datetime
from decimal import Decimal
from uuid import UUID, uuid4

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, Numeric, String, Text, UniqueConstraint, func
from sqlalchemy.dialects.postgresql import JSONB, UUID as PGUUID
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "users"
    id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), primary_key=True, default=uuid4)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    role: Mapped[str] = mapped_column(String(20), default="student")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    student: Mapped["Student | None"] = relationship(back_populates="user", uselist=False)
    company: Mapped["Company | None"] = relationship(back_populates="user", uselist=False)


class Student(Base):
    __tablename__ = "students"
    id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), unique=True, index=True)
    full_name: Mapped[str | None] = mapped_column(String(255))
    university: Mapped[str | None] = mapped_column(String(255))
    degree: Mapped[str | None] = mapped_column(String(255))
    graduation_year: Mapped[int | None] = mapped_column(Integer)
    cgpa: Mapped[Decimal | None] = mapped_column(Numeric(4, 2))
    resume_text: Mapped[str | None] = mapped_column(Text)
    career_goals: Mapped[list] = mapped_column(JSONB, default=list)
    preferred_locations: Mapped[list] = mapped_column(JSONB, default=list)
    user: Mapped[User] = relationship(back_populates="student")
    preferences: Mapped["Preference | None"] = relationship(back_populates="student", uselist=False)


class Company(Base):
    __tablename__ = "companies"
    id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), unique=True, index=True)
    company_name: Mapped[str] = mapped_column(String(255))
    description: Mapped[str | None] = mapped_column(Text)
    industry: Mapped[str | None] = mapped_column(String(255))
    website: Mapped[str | None] = mapped_column(String(500))
    location: Mapped[str | None] = mapped_column(String(255))
    user: Mapped[User] = relationship(back_populates="company")
    internships: Mapped[list["Internship"]] = relationship(back_populates="company")


class Internship(Base):
    __tablename__ = "internships"
    id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), primary_key=True, default=uuid4)
    company_id: Mapped[UUID] = mapped_column(ForeignKey("companies.id", ondelete="CASCADE"), index=True)
    title: Mapped[str] = mapped_column(String(255))
    description: Mapped[str | None] = mapped_column(Text)
    domain: Mapped[str | None] = mapped_column(String(255), index=True)
    location: Mapped[str | None] = mapped_column(String(255), index=True)
    duration: Mapped[str | None] = mapped_column(String(100))
    seats: Mapped[int] = mapped_column(Integer, default=1)
    minimum_cgpa: Mapped[Decimal | None] = mapped_column(Numeric(4, 2))
    minimum_graduation_year: Mapped[int | None] = mapped_column(Integer)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    company: Mapped[Company] = relationship(back_populates="internships")


class Preference(Base):
    __tablename__ = "preferences"
    id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), primary_key=True, default=uuid4)
    student_id: Mapped[UUID] = mapped_column(ForeignKey("students.id", ondelete="CASCADE"), unique=True, index=True)
    ranked_internship_ids: Mapped[list] = mapped_column(JSONB, default=list)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    student: Mapped[Student] = relationship(back_populates="preferences")


class Application(Base):
    __tablename__ = "applications"
    __table_args__ = (UniqueConstraint("student_id", "internship_id", name="uq_application_student_internship"),)
    id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), primary_key=True, default=uuid4)
    student_id: Mapped[UUID] = mapped_column(ForeignKey("students.id", ondelete="CASCADE"), index=True)
    internship_id: Mapped[UUID] = mapped_column(ForeignKey("internships.id", ondelete="CASCADE"), index=True)
    status: Mapped[str] = mapped_column(String(30), default="applied")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class AllocationRun(Base):
    __tablename__ = "allocation_runs"
    id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), primary_key=True, default=uuid4)
    run_number: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    status: Mapped[str] = mapped_column(String(30), index=True)
    weights_snapshot: Mapped[dict] = mapped_column(JSONB)
    student_count: Mapped[int] = mapped_column(Integer, default=0)
    internship_count: Mapped[int] = mapped_column(Integer, default=0)
    allocated_count: Mapped[int] = mapped_column(Integer, default=0)
    unallocated_count: Mapped[int] = mapped_column(Integer, default=0)
    average_match_score: Mapped[Decimal | None] = mapped_column(Numeric(7, 3))
    preference_satisfaction: Mapped[Decimal | None] = mapped_column(Numeric(7, 3))
    fairness_score: Mapped[Decimal | None] = mapped_column(Numeric(7, 3))
    created_by: Mapped[UUID] = mapped_column(ForeignKey("users.id"))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class Allocation(Base):
    __tablename__ = "allocations"
    __table_args__ = (UniqueConstraint("run_id", "student_id", name="uq_allocation_run_student"),)
    id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), primary_key=True, default=uuid4)
    run_id: Mapped[UUID] = mapped_column(ForeignKey("allocation_runs.id", ondelete="CASCADE"), index=True)
    student_id: Mapped[UUID] = mapped_column(ForeignKey("students.id"), index=True)
    internship_id: Mapped[UUID] = mapped_column(ForeignKey("internships.id"), index=True)
    match_score: Mapped[Decimal] = mapped_column(Numeric(7, 3))
    score_breakdown: Mapped[list] = mapped_column(JSONB, default=list)
    allocation_reason: Mapped[str | None] = mapped_column(Text)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class WeightConfig(Base):
    __tablename__ = "weight_configs"
    id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), primary_key=True, default=uuid4)
    skill_weight: Mapped[Decimal] = mapped_column(Numeric(6, 2), default=35)
    location_weight: Mapped[Decimal] = mapped_column(Numeric(6, 2), default=20)
    career_weight: Mapped[Decimal] = mapped_column(Numeric(6, 2), default=20)
    preference_weight: Mapped[Decimal] = mapped_column(Numeric(6, 2), default=10)
    company_weight: Mapped[Decimal] = mapped_column(Numeric(6, 2), default=10)
    fairness_weight: Mapped[Decimal] = mapped_column(Numeric(6, 2), default=5)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, index=True)
    created_by: Mapped[UUID] = mapped_column(ForeignKey("users.id"))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
