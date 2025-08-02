from fastapi import APIRouter, HTTPException, Depends
from app.models.pydantic_models import QueryInput, QueryResponse, HealthResponse
from app.services.llm_service import LLMService
from app.services.db_service import DBService
from app.utils.database import get_db
from sqlalchemy.orm import Session
from uuid import UUID

router = APIRouter()
llm_service = LLMService()
db_service = DBService()

@router.post("/query", response_model=QueryResponse)
async def process_query(query: QueryInput, db: Session = Depends(get_db)):
    try:
        response = await llm_service.process_query(db, query)
        return response
    except Exception as e:
        if "402" in str(e):
            raise HTTPException(status_code=503, detail="LLM service unavailable: API key issue or quota exceeded")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/history", response_model=list[QueryResponse])
async def get_history(db: Session = Depends(get_db)):
    try:
        return db_service.get_query_history(db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve history: {str(e)}")

@router.get("/chats", response_model=list[dict])
async def get_chats(db: Session = Depends(get_db)):
    try:
        return db_service.get_chats(db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve chats: {str(e)}")

@router.get("/chats/{chat_id}", response_model=list[QueryResponse])
async def get_chat_by_id(chat_id: UUID, db: Session = Depends(get_db)):
    try:
        return db_service.get_chat_by_id(db, str(chat_id))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve chat: {str(e)}")

@router.get("/health", response_model=HealthResponse)
async def health_check():
    return HealthResponse(status="healthy")

@router.get("/")
async def root():
    return {"message": "Welcome to the Personal Finance Q&A System API. Visit /docs for API documentation."}