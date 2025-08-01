from dotenv import load_dotenv
import os

load_dotenv()

class Config:
    DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")
    DATABASE_URL = os.getenv("DATABASE_URL")