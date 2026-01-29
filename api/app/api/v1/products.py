from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db, require_role
from app.models.user import UserRole
from app.repositories.product_repo import ProductRepository
from app.schemas.product import ProductCreate, ProductOut, ProductUpdate
from app.services.product_service import ProductService

router = APIRouter()


@router.get("", response_model=list[ProductOut])
def list_products(
    search: str | None = Query(default=None),
    db: Session = Depends(get_db),
    _user=Depends(get_current_user),
):
    return ProductService(ProductRepository(db)).list(search=search)


@router.post("", response_model=ProductOut)
def create_product(
    payload: ProductCreate,
    db: Session = Depends(get_db),
    _user=Depends(require_role(UserRole.KIEROWNIK, UserRole.ADMIN)),
):
    product = ProductService(ProductRepository(db)).create(payload)
    db.commit()
    return product


@router.patch("/{product_id}", response_model=ProductOut)
def update_product(
    product_id: int,
    payload: ProductUpdate,
    db: Session = Depends(get_db),
    user=Depends(require_role(UserRole.KIEROWNIK, UserRole.ADMIN)),
):
    if payload.sku is not None and user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Only admin can change SKU")
    service = ProductService(ProductRepository(db))
    product = service.update(product_id, payload)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.commit()
    return product


@router.delete("/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    _user=Depends(require_role(UserRole.KIEROWNIK, UserRole.ADMIN)),
):
    service = ProductService(ProductRepository(db))
    product = service.delete(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.commit()
    return {"status": "deleted"}
