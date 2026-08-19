# SIH Main Backend

FastAPI REST API backed by Supabase PostgreSQL through SQLAlchemy 2.x. The AI service is a separate stateless FastAPI process.

## Run

```powershell
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
Copy-Item .env.example .env
alembic upgrade head
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Set `DATABASE_URL` in `.env` to the Supabase PostgreSQL connection string. Never commit `.env` or expose service-role credentials.

Interactive API docs: `http://localhost:8000/docs`
