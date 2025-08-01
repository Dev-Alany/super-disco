from pydantic import BaseModel, Field
from uuid import UUID
from datetime import datetime

class QueryInput(BaseModel):
    question: str = Field(..., min_length=1, description="The user's finance-related question")

class QueryResponse(BaseModel):
    id: UUID
    question: str
    answer: str
    created_at: datetime

class HealthResponse(BaseModel):
    status: str