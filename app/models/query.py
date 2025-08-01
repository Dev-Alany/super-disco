from pydantic import BaseModel, Field

class QueryInput(BaseModel):
    question: str = Field(..., min_length=1, description="The user's question")

class QueryResponse(BaseModel):
    answer: str
    query_id: str | None = None