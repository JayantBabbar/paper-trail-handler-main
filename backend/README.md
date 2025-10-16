# Django backend for Paper Trail Handler

This backend replaces Supabase with a Django + Django REST Framework API. It uses SQLite by default for local development.

Setup (Windows PowerShell):

```powershell
cd backend
python -m venv .venv; .\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Environment variables (create a `.env` in `backend/`): see `.env.example`.

Endpoints:
- /api/files/  - Files CRUD
- /api/status_history/ - Status history
- /api/departments/ - Departments
- /api/email_threads/ - Email threads
- /api/send-email/ - POST to send emails (proxy to Resend if RESEND_API_KEY set)
