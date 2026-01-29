from datetime import datetime

from pydantic import BaseModel


class ProductCreate(BaseModel):
    sku: str
    name: str
    type: str
    brand: str | None = None
    model: str | None = None


class ProductUpdate(BaseModel):
    sku: str | None = None
    name: str | None = None
    type: str | None = None
    brand: str | None = None
    model: str | None = None


class ProductOut(BaseModel):
    id: int
    sku: str
    name: str
    type: str
    brand: str | None
    model: str | None
    created_at: datetime

    model_config = {"from_attributes": True}
