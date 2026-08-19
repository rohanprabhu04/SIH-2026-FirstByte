# AI Optimization Service

Stateless FastAPI service for resume parsing, compatibility matrices, and capacity-constrained allocation.

```powershell
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
```

This service never writes to PostgreSQL. The main backend owns persistence.
