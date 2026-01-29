from sqlalchemy.orm import Session
from app.models.user import User

class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def by_login(self, login: str):
        return self.db.query(User).filter_by(login=login).first()

    def by_id(self, user_id: int):
        return self.db.query(User).filter_by(id=user_id).first()

    def count(self) -> int:
        return self.db.query(User).count()

    def list(self):
        return self.db.query(User).all()

    def create(self, user: User):
        self.db.add(user)
