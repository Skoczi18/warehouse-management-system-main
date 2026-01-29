from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db, require_role
from app.models.user import UserRole
from app.repositories.audit_repo import AuditRepository
from app.repositories.location_repo import LocationRepository
from app.repositories.warehouse_repo import WarehouseRepository
from app.schemas.location import LocationBlockRequest, LocationCreate, LocationOut, LocationUpdate
from app.services.audit_service import AuditService
from app.services.location_service import LocationService

router = APIRouter()


@router.get("/{location_id}", response_model=LocationOut)
def get_location(
    location_id: int,
    db: Session = Depends(get_db),
    _user=Depends(get_current_user),
):
    location = LocationRepository(db).by_id(location_id)
    if not location:
        raise HTTPException(status_code=404, detail="Location not found")
    return location


@router.get("", response_model=list[LocationOut])
def list_locations(
    warehouse_id: int | None = None,
    code: str | None = None,
    db: Session = Depends(get_db),
    _user=Depends(get_current_user),
):
    return LocationRepository(db).list(warehouse_id=warehouse_id, code=code)


@router.post("", response_model=LocationOut)
def create_location(
    payload: LocationCreate,
    db: Session = Depends(get_db),
    user=Depends(require_role(UserRole.ADMIN)),
):
    if not WarehouseRepository(db).by_id(payload.warehouse_id):
        raise HTTPException(status_code=404, detail="Warehouse not found")
    service = LocationService(LocationRepository(db), AuditService(AuditRepository(db)))
    location = service.create(payload, user.id)
    db.commit()
    db.refresh(location)
    return location


@router.patch("/{location_id}", response_model=LocationOut)
def update_location(
    location_id: int,
    payload: LocationUpdate,
    db: Session = Depends(get_db),
    user=Depends(require_role(UserRole.ADMIN)),
):
    locations_repo = LocationRepository(db)
    location = locations_repo.by_id(location_id)
    if not location:
        raise HTTPException(status_code=404, detail="Location not found")
    if payload.warehouse_id is not None and not WarehouseRepository(db).by_id(payload.warehouse_id):
        raise HTTPException(status_code=404, detail="Warehouse not found")
    service = LocationService(locations_repo, AuditService(AuditRepository(db)))
    location = service.update(location, payload, user.id)
    db.commit()
    db.refresh(location)
    return location


@router.delete("/{location_id}")
def delete_location(
    location_id: int,
    db: Session = Depends(get_db),
    user=Depends(require_role(UserRole.ADMIN)),
):
    locations_repo = LocationRepository(db)
    location = locations_repo.by_id(location_id)
    if not location:
        raise HTTPException(status_code=404, detail="Location not found")
    service = LocationService(locations_repo, AuditService(AuditRepository(db)))
    service.delete(location, user.id)
    db.commit()
    return {"status": "deleted"}


@router.patch("/{location_id}/block", response_model=LocationOut)
def block_location(
    location_id: int,
    payload: LocationBlockRequest,
    db: Session = Depends(get_db),
    user=Depends(require_role(UserRole.KIEROWNIK, UserRole.ADMIN)),
):
    locations_repo = LocationRepository(db)
    location = locations_repo.by_id(location_id)
    if not location:
        raise HTTPException(status_code=404, detail="Location not found")
    service = LocationService(locations_repo, AuditService(AuditRepository(db)))
    location = service.set_blocked(location, payload.is_blocked, user.id)
    db.commit()
    return location
