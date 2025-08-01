import httpx
from app.utils.config import Config
from app.models.query import QueryInput, QueryResponse
from uuid import uuid4
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class LLMService:
    async def process_query(self, query: QueryInput) -> QueryResponse:
        # Craft a structured prompt for the LLM
        prompt = f"""
        You are a helpful travel assistant. Provide a clear, concise, and well-formatted response to the user's question. If the question is about travel documentation or requirements, structure the response with:
        - A list of required documents
        - Passport requirements
        - Any relevant travel advisories
        - Additional notes (if applicable)
        Ensure the tone is professional and the response is accurate. If the question is unrelated to travel, provide a general but accurate answer.

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
                return QueryResponse(answer=answer, query_id=str(uuid4()))
            except httpx.HTTPStatusError as e:
                logger.error(f"LLM API error: {e}")
                raise Exception(f"Failed to process query: {str(e)}")
            except Exception as e:
                logger.error(f"Unexpected error: {e}")
                raise Exception("An unexpected error occurred")