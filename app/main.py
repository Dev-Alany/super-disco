from fastapi import FastAPI
from app.api.routes import router
from app.utils.database import engine
from app.models.sqlalchemy_models import Base

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Personal Finance Q&A System API",
    description="A Q&A system for personal finance advice with LLM integration and PostgreSQL storage",
    version="1.0.0",
)

app.include_router(router, prefix="/api")