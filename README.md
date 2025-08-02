# Super-Disco – Personal Finance Q&A System

A modern Q&A web application for personal finance advice, built with **FastAPI**, **PostgreSQL**, and **DeepSeek LLM** integration.

---

## 🧠 Overview

This application allows users to ask finance-related questions (e.g., budgeting, investments, taxes) and receive professional, structured responses from an LLM. All queries and responses are stored in a PostgreSQL database for history tracking and future analysis.

---

## 📁 Project Structure

/ → FastAPI backend with PostgreSQL and DeepSeek integration
/frontend → Next.js frontend with TailwindCSS
/screenshots → UI screenshots and preview images

yaml
Copy
Edit

---

## ⚙️ Backend Setup Instructions

### 1. Clone the Repository


git clone <your-repo-url>
cd super-disco


2. Install Python Dependencies
bash

pip install -r requirements.txt
3. Set up PostgreSQL
Create the database:


createdb finance_qna
Apply the table schema:



psql -d finance_qna -f migrations/create_tables.sql
4. Configure Environment Variables
Copy .env.example to .env

env

GEMINI_API_KEY=AI-1234567890abcdef
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/finance_qna
5. Run the FastAPI Server
bash

uvicorn app.main:app --reload --port 8000
Access Swagger UI at: http://localhost:8000/docs

🧩 Frontend Setup
1. Install Dependencies
bash

cd frontend
npm install
2. Configure Environment Variables
Copy .env.example to .env.local

env

NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
3. Run the Next.js App
bash

npm run dev
Access the frontend at: http://localhost:3000

💡 Features
Chat-Like Interface:

Left panel shows question headers as cards

Right panel displays conversation format (user on right, AI on left)

Bottom-Fixed Input:

Textarea with a "Send" button at the bottom right

Response Management:

Edit and regenerate replies tied to the same chat_id

UX Enhancements:

Auto-scroll to latest message

Toast notifications

Copy-to-clipboard

Loading spinners

Responsive UI:

Side-by-side layout on desktop

Stacked layout on mobile via TailwindCSS

## 🤖 Prompt Engineering
The Gemini LLM is prompted to act as a certified financial advisor.

Prompt Snippet (app/services/llm_service.py):
python

prompt = f"""
You are a certified financial advisor providing accurate and professional advice. Respond to the user's question with a clear, concise, and well-formatted answer. For finance-related questions, structure the response with:
- A brief introduction or recommendation.
- A numbered list of key steps or considerations.
- Practical tips or examples.
- A disclaimer (e.g., consult a professional for personalized advice).
Ensure the tone is professional, approachable, and accurate. If the question is unrelated to finance, provide a general but accurate answer and gently redirect to finance topics if possible.

User Question: {query.question}
"""
Max Tokens: 500

Temperature: 0.7 (for controlled and informative responses)

Example Response (for “How should I create a budget for a $50,000 income?”):
Creating a budget for a $50,000 annual income requires careful planning to ensure financial stability and progress toward your goals. Here’s a structured approach:

1. **Assess Your Income and Expenses**: Calculate your monthly take-home pay (approximately $3,000 after taxes, depending on your location). List all fixed expenses (e.g., rent, utilities) and variable expenses (e.g., groceries, entertainment).
2. **Use the 50/30/20 Rule**: Allocate 50% ($1,500) to necessities (housing, bills), 30% ($900) to wants (dining, hobbies), and 20% ($600) to savings and debt repayment.
3. **Track Spending**: Use tools like Mint or a spreadsheet to monitor expenses and stay within budget limits.
4. **Adjust as Needed**: Review your budget monthly to account for changes in income or expenses.

**Tips**: Set up automatic savings transfers to prioritize financial goals. For example, saving $600/month could build an emergency fund of $7,200 in a year.

**Disclaimer**: Consult a certified financial planner for personalized advice tailored to your specific circumstances.

🗄️ Database Schema
Table: queries

Column	Type	Description
id	UUID (Primary Key)	Unique identifier
question	Text	User's finance question
answer	Text	LLM-generated response
created_at	Timestamp with timezone	Time of query
user_id	UUID (Optional)	(Future) To support user login
chat_id	UUID	Groups related messages in a session

🔐 Environment Variables Summary
Backend (.env)
env

GEMINI_API_KEY=your_deepseek_api_key
DATABASE_URL=postgresql://postgres:password@localhost:5432/finance_qna
Frontend (frontend/.env.local)
env

NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
## 📸 Screenshots

![Desktop View](screenshots/before-promt.png)
![During promting](screenshots/during-promting.png)
![Response after promting](screenshots/after-promting.png)
![History view](screenshots/history.png)
![Tablet view](screenshots/tablet-view.png)
![mobile view](screenshots/mobile-view.png)
## 🚀 Future Enhancements
User authentication (OAuth or JWT)

Analytics dashboard for usage patterns

Voice input or chatbot integration