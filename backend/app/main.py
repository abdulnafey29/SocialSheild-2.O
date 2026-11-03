import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.database import engine, Base, SessionLocal
from app.seed_data import seed_database_if_empty
from app.routes import analyze, dashboard, training, incidents, analytics

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("socialshield")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create tables and seed default data
    logger.info("Initializing SocialShield 2.0 database tables...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database_if_empty(db)
        logger.info("Database initialized and sample data seeded.")
    finally:
        db.close()
    yield
    # Shutdown
    logger.info("SocialShield 2.0 backend shutting down.")

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    description="SocialShield 2.0 - Social Engineering Detection & Cybersecurity Awareness Platform API",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API route modules
app.include_router(analyze.router)
app.include_router(dashboard.router)
app.include_router(training.router)
app.include_router(incidents.router)
app.include_router(analytics.router)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error processing {request.method} {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred. Please verify your request or consult the system logs."}
    )

@app.get("/api/health")
def healthcheck():
    return {
        "status": "healthy",
        "service": settings.APP_NAME,
        "version": settings.VERSION,
        "mode": "offline-safe-heuristics"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
