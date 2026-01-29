from datetime import datetime
import uuid

from pydantic import BaseModel


class LayoutLockRequest(BaseModel):
    lock_id: uuid.UUID | None = None


class LayoutLockOut(BaseModel):
    warehouse_id: int
    lock_id: uuid.UUID
    locked_by: int
    expires_at: datetime
    created_at: datetime

    model_config = {"from_attributes": True}
