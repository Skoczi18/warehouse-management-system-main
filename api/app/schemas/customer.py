from datetime import datetime

from pydantic import BaseModel


class CustomerCreate(BaseModel):
    name: str
    contact_data: str | None = None


class CustomerUpdate(BaseModel):
    name: str | None = None
    contact_data: str | None = None


class CustomerOut(BaseModel):
    id: int
    name: str
    contact_data: str | None
    created_at: datetime

    model_config = {"from_attributes": True}
