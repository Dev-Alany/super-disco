from fastapi import APIRouter, HTTPException
from app.models.query import QueryInput, QueryResponse
from app.services.llm_service import LLMService

router = APIRouter()
llm_service = LLMService()

@router.post("/query", response_model=QueryResponse)
async def process_query(query: QueryInput):
    try:
        response = await llm_service.process_query(query)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health")
async def health_check():
    return {"status": "healthy"}