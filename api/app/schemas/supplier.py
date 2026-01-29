from datetime import datetime

from pydantic import BaseModel


class SupplierCreate(BaseModel):
    name: str
    contact_data: str | None = None


class SupplierUpdate(BaseModel):
    name: str | None = None
    contact_data: str | None = None


class SupplierOut(BaseModel):
    id: int
    name: str
    contact_data: str | None
    created_at: datetime

    model_config = {"from_attributes": True}
