# super-disco# Personal Finance Q&A System

A modern Q&A web application for personal finance advice, built with FastAPI, PostgreSQL, and DeepSeek LLM integration.

## Overview
This application allows users to ask finance-related questions (e.g., budgeting, investments, taxes) and receive professional, structured responses from an LLM. Queries and responses are stored in a PostgreSQL database for history tracking.

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd personal-finance-qna

## Install dependencies:bash

pip install -r requirements.txt

Set up PostgreSQL:Create a database named finance_qna:bash

createdb finance_qna

Apply the table schema:bash

psql -d finance_qna -f migrations/create_tables.sql

Configure environment variables:Copy .env.example to .env and add your DeepSeek API key and database URL.
Example .env:

GEMINI_API_KEY=AI-1234567890abcdef
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/finance_qna

Run the FastAPI server:bash

uvicorn app.main:app --reload --port 8000

Access the API at http://localhost:8000/docs for Swagger documentation.

