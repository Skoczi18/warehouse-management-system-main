import enum
from datetime import datetime

from sqlalchemy import Boolean, DateTime, Enum, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class OrderStatus(str, enum.Enum):
    NOWE = "NOWE"
    OCZEKUJACE = "OCZEKUJACE"
    W_REALIZACJI = "W_REALIZACJI"
    ZREALIZOWANE = "ZREALIZOWANE"
    ZREALIZOWANE_CZESCIOWO = "ZREALIZOWANE_CZESCIOWO"
    ANULOWANE = "ANULOWANE"


class Order(Base):
    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    order_no: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    customer_id: Mapped[int] = mapped_column(Integer, nullable=False, index=True)
    status: Mapped[OrderStatus] = mapped_column(
        Enum(OrderStatus, name="order_status"),
        default=OrderStatus.NOWE,
        nullable=False,
    )
    priority: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
