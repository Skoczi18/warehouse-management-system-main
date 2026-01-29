from pydantic import BaseModel


class LocationCreate(BaseModel):
    warehouse_id: int
    code: str
    description: str | None = None
    kind: str = "RACK_CELL"
    geometry_json: dict | None = None
    is_blocked: bool = False


class LocationUpdate(BaseModel):
    warehouse_id: int | None = None
    code: str | None = None
    description: str | None = None
    kind: str | None = None
    geometry_json: dict | None = None
    is_blocked: bool | None = None


class LocationOut(BaseModel):
    id: int
    warehouse_id: int
    code: str
    description: str | None
    kind: str
    is_blocked: bool
    geometry_json: dict | None

    model_config = {"from_attributes": True}


class LocationBlockRequest(BaseModel):
    is_blocked: bool
