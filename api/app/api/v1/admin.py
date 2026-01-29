from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db, require_role
from app.models.user import UserRole
from app.repositories.audit_repo import AuditRepository
from app.repositories.user_repo import UserRepository
from app.schemas.user import UserCreate, UserOut, UserUpdate
from app.services.admin_service import AdminService
from app.services.audit_service import AuditService

router = APIRouter()

@router.get("/users", response_model=list[UserOut])
def users(
    db: Session = Depends(get_db),
    _admin=Depends(require_role(UserRole.ADMIN)),
):
    return UserRepository(db).list()


@router.post("/users", response_model=UserOut)
def create_user(
    payload: UserCreate,
    db: Session = Depends(get_db),
    admin=Depends(require_role(UserRole.ADMIN)),
):
    service = AdminService(UserRepository(db), AuditService(AuditRepository(db)))
    user = service.create_user(payload, admin)
    db.commit()
    return user


@router.patch("/users/{user_id}", response_model=UserOut)
def update_user(
    user_id: int,
    payload: UserUpdate,
    db: Session = Depends(get_db),
    admin=Depends(require_role(UserRole.ADMIN)),
):
    repo = UserRepository(db)
    user = repo.by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    service = AdminService(repo, AuditService(AuditRepository(db)))
    user = service.update_user(user, payload, admin)
    db.commit()
    return user


@router.post("/backup")
def backup(
    db: Session = Depends(get_db),
    admin=Depends(require_role(UserRole.ADMIN)),
):
    AuditService(AuditRepository(db)).log(
        "ADMIN_BACKUP",
        admin.id,
        details={"note": "backup trigger (MVP)"},
    )
    db.commit()
    return {"status": "ok"}
