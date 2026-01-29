from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.models.customer import Customer
from app.models.delivery import Delivery
from app.models.location import Location
from app.models.order import Order
from app.models.product import Product
from app.models.supplier import Supplier
from app.repositories.audit_repo import AuditRepository
from app.schemas.search import SearchItem, SearchResponse
from app.services.audit_service import AuditService

router = APIRouter()


@router.get("", response_model=SearchResponse)
def global_search(
    q: str = Query(min_length=2),
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    like = f"%{q}%"
    products = (
        db.query(Product)
        .filter((Product.sku.ilike(like)) | (Product.name.ilike(like)))
        .order_by(Product.name.asc())
        .limit(5)
        .all()
    )
    orders = (
        db.query(Order)
        .filter(Order.order_no.ilike(like))
        .order_by(Order.created_at.desc())
        .limit(5)
        .all()
    )
    locations = (
        db.query(Location)
        .filter(Location.code.ilike(like))
        .order_by(Location.code.asc())
        .limit(5)
        .all()
    )
    customers = (
        db.query(Customer)
        .filter(Customer.name.ilike(like))
        .order_by(Customer.name.asc())
        .limit(5)
        .all()
    )
    suppliers = (
        db.query(Supplier)
        .filter(Supplier.name.ilike(like))
        .order_by(Supplier.name.asc())
        .limit(5)
        .all()
    )
    deliveries = (
        db.query(Delivery)
        .filter(Delivery.document_no.ilike(like))
        .order_by(Delivery.created_at.desc())
        .limit(5)
        .all()
    )

    AuditService(AuditRepository(db)).log(
        "VIEW_GLOBAL_SEARCH",
        user.id,
        details={"q": q},
    )
    db.commit()

    return SearchResponse(
        products=[
            SearchItem(id=row.id, label=f"{row.sku} - {row.name}", kind="product")
            for row in products
        ],
        orders=[SearchItem(id=row.id, label=row.order_no, kind="order") for row in orders],
        locations=[SearchItem(id=row.id, label=row.code, kind="location") for row in locations],
        customers=[SearchItem(id=row.id, label=row.name, kind="customer") for row in customers],
        suppliers=[SearchItem(id=row.id, label=row.name, kind="supplier") for row in suppliers],
        deliveries=[
            SearchItem(id=row.id, label=row.document_no, kind="delivery")
            for row in deliveries
        ],
    )
