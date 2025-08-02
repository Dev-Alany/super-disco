import google.generativeai as genai
from app.utils.config import Config
from app.models.pydantic_models import QueryInput, QueryResponse
from app.models.sqlalchemy_models import Query
from sqlalchemy.orm import Session
import logging
from uuid import uuid4

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class LLMService:
    def __init__(self):
        genai.configure(api_key=Config.GEMINI_API_KEY)

    async def process_query(self, db: Session, query: QueryInput) -> QueryResponse:
        prompt = f"""
        You are a certified financial advisor providing accurate and professional advice. Respond to the user's question with a clear, concise, and well-formatted answer. For finance-related questions, structure the response with:
        - A brief introduction or recommendation.
        - A numbered list of key steps or considerations.
        - Practical tips or examples.
        - A disclaimer (e.g., consult a professional for personalized advice).
        Ensure the tone is professional, approachable, and accurate. If the question is unrelated to finance, provide a general but accurate answer and gently redirect to finance topics if possible.

        User Question: {query.question}
        """

        try:
            model = genai.GenerativeModel("gemini-1.5-flash")
            response = model.generate_content(prompt, generation_config={"max_output_tokens": 500, "temperature": 0.7})
            answer = response.text

            # Use provided chat_id or generate a new one
            chat_id = query.chat_id or uuid4()

            # Save query and response to database
            query_id = uuid4()
            db_query = Query(id=query_id, question=query.question, answer=answer, chat_id=chat_id)
            db.add(db_query)
            db.commit()
            db.refresh(db_query)

            return QueryResponse(
                id=db_query.id,
                question=db_query.question,
                answer=db_query.answer,
                created_at=db_query.created_at,
                chat_id=db_query.chat_id,
            )
        except Exception as e:
            logger.error(f"Gemini API error: {e}")
            raise Exception(f"Failed to process query: {str(e)}")