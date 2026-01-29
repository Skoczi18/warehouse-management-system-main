from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db, require_role
from app.models.user import UserRole
from app.repositories.customer_repo import CustomerRepository
from app.schemas.customer import CustomerCreate, CustomerOut, CustomerUpdate
from app.services.customer_service import CustomerService

router = APIRouter()


@router.get("", response_model=list[CustomerOut])
def list_customers(
    search: str | None = Query(default=None),
    db: Session = Depends(get_db),
    _user=Depends(get_current_user),
):
    return CustomerRepository(db).list(search=search)


@router.post("", response_model=CustomerOut)
def create_customer(
    payload: CustomerCreate,
    db: Session = Depends(get_db),
    _user=Depends(require_role(UserRole.KIEROWNIK, UserRole.ADMIN)),
):
    customer = CustomerService(CustomerRepository(db)).create(payload)
    db.commit()
    return customer


@router.patch("/{customer_id}", response_model=CustomerOut)
def update_customer(
    customer_id: int,
    payload: CustomerUpdate,
    db: Session = Depends(get_db),
    _user=Depends(require_role(UserRole.KIEROWNIK, UserRole.ADMIN)),
):
    repo = CustomerRepository(db)
    customer = repo.by_id(customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    customer = CustomerService(repo).update(customer, payload)
    db.commit()
    return customer


@router.delete("/{customer_id}")
def delete_customer(
    customer_id: int,
    db: Session = Depends(get_db),
    _user=Depends(require_role(UserRole.KIEROWNIK, UserRole.ADMIN)),
):
    repo = CustomerRepository(db)
    customer = repo.by_id(customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    CustomerService(repo).delete(customer)
    db.commit()
    return {"status": "ok"}
