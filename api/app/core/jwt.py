from jose import jwt
from datetime import datetime, timedelta
from app.core.config import get_settings

settings = get_settings()

def create_token(data: dict):
    payload = data.copy()
    payload["exp"] = datetime.utcnow() + timedelta(minutes=settings.jwt_exp_minutes)
    return jwt.encode(payload, settings.jwt_secret, settings.jwt_algorithm)

def decode_token(token: str):
    return jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
