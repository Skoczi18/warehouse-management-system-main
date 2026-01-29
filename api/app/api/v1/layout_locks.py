import os
import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db, require_role
from app.models.user import UserRole
from app.repositories.audit_repo import AuditRepository
from app.repositories.layout_lock_repo import LayoutLockRepository
from app.schemas.layout_lock import LayoutLockOut, LayoutLockRequest
from app.services.audit_service import AuditService
from app.services.layout_lock_service import LayoutLockService

router = APIRouter()

LOCK_TTL_SECONDS = int(os.getenv("LAYOUT_LOCK_TTL_SECONDS", "300"))


@router.get("/{warehouse_id}/layout/lock", response_model=LayoutLockOut | None)
def get_lock(
    warehouse_id: int,
    db: Session = Depends(get_db),
    _user=Depends(get_current_user),
):
    service = LayoutLockService(LayoutLockRepository(db))
    lock = service.get_lock(warehouse_id)
    return lock


@router.post("/{warehouse_id}/layout/lock", response_model=LayoutLockOut)
def acquire_lock(
    warehouse_id: int,
    db: Session = Depends(get_db),
    user=Depends(require_role(UserRole.KIEROWNIK, UserRole.ADMIN)),
):
    service = LayoutLockService(LayoutLockRepository(db))
    try:
        lock = service.acquire_lock(warehouse_id, user.id, LOCK_TTL_SECONDS)
        AuditService(AuditRepository(db)).log(
            "LOCK_ACQUIRE",
            user.id,
            entity="warehouse",
            entity_id=warehouse_id,
            details={"lock_id": str(lock.lock_id)},
        )
        db.commit()
    except ValueError as exc:
        db.rollback()
        raise HTTPException(status_code=409, detail=str(exc))
    return lock


@router.post("/{warehouse_id}/layout/lock/refresh", response_model=LayoutLockOut)
def refresh_lock(
    warehouse_id: int,
    payload: LayoutLockRequest,
    db: Session = Depends(get_db),
    user=Depends(require_role(UserRole.KIEROWNIK, UserRole.ADMIN)),
):
    if not payload.lock_id:
        raise HTTPException(status_code=400, detail="lock_id required")
    service = LayoutLockService(LayoutLockRepository(db))
    try:
        lock = service.refresh_lock(warehouse_id, payload.lock_id, user.id, LOCK_TTL_SECONDS)
        AuditService(AuditRepository(db)).log(
            "LOCK_REFRESH",
            user.id,
            entity="warehouse",
            entity_id=warehouse_id,
            details={"lock_id": str(lock.lock_id)},
        )
        db.commit()
    except ValueError as exc:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(exc))
    return lock


@router.delete("/{warehouse_id}/layout/lock")
def release_lock(
    warehouse_id: int,
    payload: LayoutLockRequest,
    db: Session = Depends(get_db),
    user=Depends(require_role(UserRole.KIEROWNIK, UserRole.ADMIN)),
):
    if not payload.lock_id:
        raise HTTPException(status_code=400, detail="lock_id required")
    service = LayoutLockService(LayoutLockRepository(db))
    try:
        lock = service.release_lock(warehouse_id, payload.lock_id, user.id)
        AuditService(AuditRepository(db)).log(
            "LOCK_RELEASE",
            user.id,
            entity="warehouse",
            entity_id=warehouse_id,
            details={"lock_id": str(lock.lock_id)},
        )
        db.commit()
    except ValueError as exc:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(exc))
    return {"status": "ok"}
