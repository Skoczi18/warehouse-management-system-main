from pydantic import BaseModel

from app.models.order import OrderStatus


class OrderItemSummary(BaseModel):
    product_id: int
    sku: str
    name: str
    qty_ordered: int
    qty_issued: int
    qty_remaining: int
    available: int
    missing: int
    can_fulfill: bool


class OrderSummaryOut(BaseModel):
    order_id: int
    order_no: str
    status: OrderStatus
    priority: bool
    items: list[OrderItemSummary]

    model_config = {"from_attributes": True}
