from pydantic import BaseModel
from app.models.user import UserRole

class UserCreate(BaseModel):
    login: str
    password: str
    role: UserRole


class UserUpdate(BaseModel):
    role: UserRole | None = None
    is_active: bool | None = None
    password: str | None = None

class UserOut(BaseModel):
    id: int
    login: str
    role: UserRole
    is_active: bool

    model_config = {"from_attributes": True}
