import os
from pydantic import BaseModel
from functools import lru_cache
from dotenv import load_dotenv
from pathlib import Path

ENV_PATH = Path(__file__).resolve().parents[3] / ".env"
load_dotenv(dotenv_path=ENV_PATH)

class Settings(BaseModel):
    postgres_host: str
    postgres_user: str
    postgres_pass: str
    postgres_port: int
    postgres_db: str

    jwt_secret: str
    jwt_algorithm: str = "HS256"
    jwt_exp_minutes: int = 60

    @property
    def database_url(self) -> str:
        return (
            f"postgresql+psycopg://"
            f"{self.postgres_user}:{self.postgres_pass}"
            f"@{self.postgres_host}:{self.postgres_port}"
            f"/{self.postgres_db}"
        )

@lru_cache
def get_settings() -> Settings:
    return Settings(
        postgres_host=os.getenv("POSTGRES_HOST"),
        postgres_user=os.getenv("POSTGRES_USER"),
        postgres_pass=os.getenv("POSTGRES_PASS"),
        postgres_port=int(os.getenv("POSTGRES_EXTERNAL_PORT")),
        postgres_db=os.getenv("POSTGRES_DB"),
        jwt_secret=os.getenv("JWT_SECRET"),
    )
