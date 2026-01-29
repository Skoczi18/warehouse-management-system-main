from sqlalchemy.orm import Session
from app.models.audit import AuditLog

class AuditRepository:
    def __init__(self, db: Session):
        self.db = db

    def log(self, **data):
        self.db.add(AuditLog(**data))

    def list(self, action: str | None, user_id: int | None, date_from, date_to):
        query = self.db.query(AuditLog)
        if action:
            query = query.filter(AuditLog.action == action)
        if user_id:
            query = query.filter(AuditLog.user_id == user_id)
        if date_from:
            query = query.filter(AuditLog.created_at >= date_from)
        if date_to:
            query = query.filter(AuditLog.created_at <= date_to)
        return query.order_by(AuditLog.created_at.desc()).all()
