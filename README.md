# CareerLens AI

CareerLens AI is a resume analysis, job matching, resume builder, career coaching, and AI interview platform built with React, FastAPI, PostgreSQL, SQLAlchemy, JWT authentication, and Gemini.

## Current production-preparation changes

- JWT authentication is attached automatically to frontend API requests.
- Protected resources enforce user ownership.
- Resume uploads use generated filenames and PDF/size validation.
- AI Interview supports per-answer microphone recording.
- Recorded answers are uploaded to FastAPI, transcribed with Gemini, evaluated, and saved.
- Backend database URL, JWT secret, Gemini key, and frontend URL are environment variables.
- CORS is environment-based.
- Secrets, virtual environments, dependencies, generated files, and runtime uploads are excluded from Git.

## Project structure

```text
CareerLens-AI/
├── backend/
│   ├── app/
│   │   ├── config/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── utils/
│   ├── frontend/
│   │   └── src/
│   ├── .env.example
│   ├── migrations_001_add_interview_user_id.sql
│   └── requirements.txt
├── .gitignore
└── README.md
```

## Local setup

### Backend

```bash
cd backend
python -m venv venv
# Windows
venv\\Scripts\\activate
pip install -r requirements.txt
```

Create `backend/.env` from `backend/.env.example` and set:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/careerlens
SECRET_KEY=replace-with-a-long-random-secret
JWT_ALGORITHM=HS256
GEMINI_API_KEY=your-key
FRONTEND_URL=http://localhost:5173
```

Run:

```bash
uvicorn app.main:app --reload
```

API docs: `http://127.0.0.1:8000/docs`

### Frontend

```bash
cd backend/frontend
npm install
```

Create `backend/frontend/.env` from `.env.example`:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Run:

```bash
npm run dev
```

## AI Interview audio flow

```text
Camera + microphone
        ↓
Start Recording
        ↓
Per-answer audio Blob
        ↓
POST /interview/submit-audio
        ↓
Gemini transcription
        ↓
Gemini answer evaluation
        ↓
Transcript + score + feedback
        ↓
Interview answer saved in PostgreSQL
```

The project intentionally records only the candidate's answer audio. The camera remains available for interview monitoring.

## Existing database note

The current interview session model now stores `user_id` for ownership enforcement. If you already have an existing local database, apply `backend/migrations_001_add_interview_user_id.sql` before starting the updated backend. A fresh production database can be created from the current SQLAlchemy models.

## Production deployment

Recommended split deployment:

- Frontend: Vercel
- FastAPI backend: Render or Railway
- PostgreSQL: managed PostgreSQL from the backend provider or another managed provider

Set these backend variables in production:

```env
DATABASE_URL=...
SECRET_KEY=...
JWT_ALGORITHM=HS256
GEMINI_API_KEY=...
FRONTEND_URL=https://your-frontend-domain
```

Set this frontend variable in production:

```env
VITE_API_URL=https://your-backend-domain
```

Do not commit `.env` files or API keys.
