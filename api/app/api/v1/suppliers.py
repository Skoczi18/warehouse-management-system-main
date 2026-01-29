from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db, require_role
from app.models.user import UserRole
from app.repositories.supplier_repo import SupplierRepository
from app.schemas.supplier import SupplierCreate, SupplierOut, SupplierUpdate
from app.services.supplier_service import SupplierService

router = APIRouter()


@router.get("", response_model=list[SupplierOut])
def list_suppliers(
    search: str | None = Query(default=None),
    db: Session = Depends(get_db),
    _user=Depends(get_current_user),
):
    return SupplierRepository(db).list(search=search)


@router.post("", response_model=SupplierOut)
def create_supplier(
    payload: SupplierCreate,
    db: Session = Depends(get_db),
    _user=Depends(require_role(UserRole.KIEROWNIK, UserRole.ADMIN)),
):
    supplier = SupplierService(SupplierRepository(db)).create(payload)
    db.commit()
    return supplier


@router.patch("/{supplier_id}", response_model=SupplierOut)
def update_supplier(
    supplier_id: int,
    payload: SupplierUpdate,
    db: Session = Depends(get_db),
    _user=Depends(require_role(UserRole.KIEROWNIK, UserRole.ADMIN)),
):
    repo = SupplierRepository(db)
    supplier = repo.by_id(supplier_id)
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")
    supplier = SupplierService(repo).update(supplier, payload)
    db.commit()
    return supplier


@router.delete("/{supplier_id}")
def delete_supplier(
    supplier_id: int,
    db: Session = Depends(get_db),
    _user=Depends(require_role(UserRole.KIEROWNIK, UserRole.ADMIN)),
):
    repo = SupplierRepository(db)
    supplier = repo.by_id(supplier_id)
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")
    SupplierService(repo).delete(supplier)
    db.commit()
    return {"status": "ok"}
