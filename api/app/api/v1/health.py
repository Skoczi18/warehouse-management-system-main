from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.api.deps import get_db

router = APIRouter()


@router.get("/health")
def health(db: Session = Depends(get_db)):
    try:
        result = db.execute(text("SELECT 1")).scalar()
    except SQLAlchemyError:
        raise HTTPException(status_code=503, detail="Database unavailable")

    return {"status": "ok", "db_ok": bool(result)}
