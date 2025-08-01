import httpx
from app.utils.config import Config
from app.models.pydantic_models import QueryInput, QueryResponse
from app.models.sqlalchemy_models import Query
from sqlalchemy.orm import Session
import logging
from uuid import uuid4

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class LLMService:
    async def process_query(self, db: Session, query: QueryInput) -> QueryResponse:
        # Craft a professional, structured prompt
        prompt = f"""
        You are a certified financial advisor providing accurate and professional advice. Respond to the user's question with a clear, concise, and well-formatted answer. For finance-related questions, structure the response with:
        - A brief introduction or recommendation (e.g., budgeting method, investment strategy).
        - A numbered list of key steps or considerations.
        - Practical tips or examples.
        - A disclaimer (e.g., consult a professional for personalized advice).
        Ensure the tone is professional, approachable, and accurate. If the question is unrelated to finance, provide a general but accurate answer and gently redirect to finance topics if possible.

        User Question: {query.question}
        """

        headers = {
            "Authorization": f"Bearer {Config.DEEPSEEK_API_KEY}",
            "Content-Type": "application/json",
        }
        payload = {
            "model": "deepseek-chat",
            "messages": [{"role": "user", "content": prompt}],
            "max_tokens": 500,
            "temperature": 0.7,
        }

        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    "https://api.deepseek.com/v1/chat/completions",
                    json=payload,
                    headers=headers,
                    timeout=30.0,
                )
                response.raise_for_status()
                data = response.json()
                answer = data["choices"][0]["message"]["content"]

                # Save query and response to database
                query_id = uuid4()
                db_query = Query(id=query_id, question=query.question, answer=answer)
                db.add(db_query)
                db.commit()
                db.refresh(db_query)

                return QueryResponse(
                    id=db_query.id,
                    question=db_query.question,
                    answer=db_query.answer,
                    created_at=db_query.created_at,
                )
            except httpx.HTTPStatusError as e:
                logger.error(f"LLM API error: {e}")
                raise Exception(f"Failed to process query: {str(e)}")
            except Exception as e:
                logger.error(f"Unexpected error: {e}")
                raise Exception("An unexpected error occurred")