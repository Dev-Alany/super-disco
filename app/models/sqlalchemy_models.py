from sqlalchemy import Column, String, Text, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base
import uuid

Base = declarative_base()

class Query(Base):
    __tablename__ = "queries"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    user_id = Column(UUID(as_uuid=True), nullable=True)
    chat_id = Column(UUID(as_uuid=True), nullable=False, default=uuid.uuid4)