from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router
from app.utils.database import engine
from app.models.sqlalchemy_models import Base

# Drop and recreate database tables
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Personal Finance Q&A System API",
    description="A Q&A system for personal finance advice with LLM integration and PostgreSQL storage",
    version="1.0.0",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")