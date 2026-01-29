from datetime import datetime

from pydantic import BaseModel

from app.models.order import OrderStatus


class OrderItemCreate(BaseModel):
    sku: str
    qty: int


class OrderCreate(BaseModel):
    order_no: str
    customer_id: int
    priority: bool = False
    items: list[OrderItemCreate]


class OrderPriorityUpdate(BaseModel):
    priority: bool


class OrderStatusUpdate(BaseModel):
    status: OrderStatus


class OrderUpdate(BaseModel):
    order_no: str | None = None


class OrderItemOut(BaseModel):
    id: int
    product_id: int
    qty_ordered: int
    qty_issued: int

    model_config = {"from_attributes": True}


class OrderOut(BaseModel):
    id: int
    order_no: str
    customer_id: int
    status: OrderStatus
    priority: bool
    created_at: datetime
    updated_at: datetime
    items: list[OrderItemOut] | None = None

    model_config = {"from_attributes": True}
