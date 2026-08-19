from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import decode_token
from app.models import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")
DbSession = Annotated[Session, Depends(get_db)]


def get_current_user(token: Annotated[str, Depends(oauth2_scheme)], db: DbSession) -> User:
    try:
        user_id, _ = decode_token(token)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(exc)) from exc
    user = db.get(User, user_id)
    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail="Inactive or unknown user")
    return user


def require_role(*roles: str):
    def dependency(user: Annotated[User, Depends(get_current_user)]) -> User:
        if user.role not in roles:
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        return user
    return dependency
