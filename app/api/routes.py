from fastapi import APIRouter, HTTPException, Depends
from app.models.pydantic_models import QueryInput, QueryResponse, HealthResponse
from app.services.llm_service import LLMService
from app.services.db_service import DBService
from app.utils.database import get_db
from sqlalchemy.orm import Session

router = APIRouter()
llm_service = LLMService()
db_service = DBService()

@router.post("/query", response_model=QueryResponse)
async def process_query(query: QueryInput, db: Session = Depends(get_db)):
    try:
        response = await llm_service.process_query(db, query)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history", response_model=list[QueryResponse])
async def get_history(db: Session = Depends(get_db)):
    return db_service.get_query_history(db)

@router.get("/health", response_model=HealthResponse)
async def health_check():
    return HealthResponse(status="healthy")