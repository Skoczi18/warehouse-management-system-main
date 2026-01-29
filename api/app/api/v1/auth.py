from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user
from app.repositories.user_repo import UserRepository
from app.repositories.audit_repo import AuditRepository
from app.schemas.auth import LoginRequest, TokenResponse
from app.schemas.user import UserOut
from app.services.auth_service import AuthService
from app.services.audit_service import AuditService

router = APIRouter()

@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    service = AuthService(
        users=UserRepository(db),
        audit=AuditService(AuditRepository(db)),
    )
    try:
        token, user = service.login(payload.username, payload.password)
        db.commit()
    except ValueError:
        db.commit()
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return TokenResponse(access_token=token, role=user.role.value)


@router.get("/me", response_model=UserOut)
def me(user=Depends(get_current_user)):
    return UserOut.model_validate(user)
