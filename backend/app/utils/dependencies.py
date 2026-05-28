"""FastAPI dependencies for dependency injection."""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.connection import get_db
from app.services.auth_service import decode_token, get_user_by_email
from app.models.user import User

security = HTTPBearer(auto_error=False)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(security),
    db: AsyncSession = Depends(get_db),
) -> User | None:
    """
    Get the currently authenticated user, or None if not authenticated.
    Use this for optional auth (e.g., analysis accessible without login).
    """
    if credentials is None:
        return None

    payload = decode_token(credentials.credentials)
    if payload is None:
        return None

    email = payload.get("sub")
    if email is None:
        return None

    user = await get_user_by_email(db, email)
    return user


async def require_user(
    user: User | None = Depends(get_current_user),
) -> User:
    """
    Require an authenticated user. Raises 401 if not authenticated.
    """
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user
