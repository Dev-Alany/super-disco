from sqlalchemy.orm import Session
from app.models.sqlalchemy_models import Query
from app.models.pydantic_models import QueryResponse

class DBService:
    def get_query_history(self, db: Session, limit: int = 10) -> list[QueryResponse]:
        queries = db.query(Query).order_by(Query.created_at.desc()).limit(limit).all()
        return [
            QueryResponse(
                id=q.id,
                question=q.question,
                answer=q.answer,
                created_at=q.created_at,
            )
            for q in queries
        ]