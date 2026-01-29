from datetime import datetime

from pydantic import BaseModel


class WarehouseCreate(BaseModel):
    name: str
    unit_scale: float = 1.0


class WarehouseUpdate(BaseModel):
    name: str | None = None
    unit_scale: float | None = None


class WarehouseOut(BaseModel):
    id: int
    name: str
    unit_scale: float
    created_at: datetime

    model_config = {"from_attributes": True}
