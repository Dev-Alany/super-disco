from sqlalchemy.orm import Session
from app.models.sqlalchemy_models import Query
from app.models.pydantic_models import QueryResponse
from sqlalchemy import distinct

class DBService:
    def get_query_history(self, db: Session, limit: int = 100) -> list[QueryResponse]:
        queries = (
            db.query(Query)
            .order_by(Query.created_at.desc())
            .limit(limit)
            .all()
        )
        return [
            QueryResponse(
                id=q.id,
                question=q.question,
                answer=q.answer,
                created_at=q.created_at,
                chat_id=q.chat_id,
            )
            for q in queries
        ]

    def get_chats(self, db: Session) -> list[dict]:
        # Get distinct chat_ids with the latest query for each
        chats = (
            db.query(Query.chat_id, Query.question, Query.created_at)
            .distinct(Query.chat_id)
            .order_by(Query.chat_id, Query.created_at.desc())  # Fixed: chat_id first, then created_at
            .all()
        )
        return [
            {"chat_id": str(chat_id), "question": question, "created_at": created_at}
            for chat_id, question, created_at in chats
        ]

    def get_chat_by_id(self, db: Session, chat_id: str) -> list[QueryResponse]:
        queries = (
            db.query(Query)
            .filter(Query.chat_id == chat_id)
            .order_by(Query.created_at.asc())
            .all()
        )
        return [
            QueryResponse(
                id=q.id,
                question=q.question,
                answer=q.answer,
                created_at=q.created_at,
                chat_id=q.chat_id,
            )
            for q in queries
        ]