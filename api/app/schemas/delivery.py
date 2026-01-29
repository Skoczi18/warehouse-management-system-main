from datetime import datetime

from pydantic import BaseModel

from app.models.delivery import DeliveryStatus


class DeliveryItemCreate(BaseModel):
    sku: str
    qty: int
    location_code: str | None = None


class DeliveryCreate(BaseModel):
    supplier_id: int
    document_no: str
    items: list[DeliveryItemCreate]


class DeliveryPutawayItem(BaseModel):
    sku: str
    qty: int
    location_code: str
    warehouse_id: int | None = None


class DeliveryPutawayRequest(BaseModel):
    items: list[DeliveryPutawayItem]


class DeliveryItemOut(BaseModel):
    id: int
    product_id: int
    qty: int

    model_config = {"from_attributes": True}


class DeliveryOut(BaseModel):
    id: int
    document_no: str
    supplier_id: int
    status: DeliveryStatus
    created_by: int
    created_at: datetime
    approved_by: int | None
    approved_at: datetime | None
    items: list[DeliveryItemOut] | None = None

    model_config = {"from_attributes": True}
