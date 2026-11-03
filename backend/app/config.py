import os
from pydantic import BaseModel

class Settings(BaseModel):
    APP_NAME: str = "SocialShield 2.0"
    VERSION: str = "2.0.0"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./socialshield.db")
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
    ]
    MAX_MESSAGE_LENGTH: int = 10000
    MAX_HEADER_LENGTH: int = 50000
    RATE_LIMIT_ENABLED: bool = True

settings = Settings()
