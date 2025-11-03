# Dental Perfection Project

A full-stack dental practice website with Django REST API backend and React frontend.

## Project Structure

```
Dental-Perfections/
├── dental_backend/     # Django REST API backend
└── dental-website/     # React frontend application
```

---

## Backend Setup (Django REST API)

### Location
`Dental-Perfections/dental_backend/`

### Virtual Environment Location
The virtual environment is located at: `Dental-Perfections/dental_backend/venv/`

### How to Run the Backend

1. **Navigate to backend directory:**
   ```powershell
   cd dental_backend
   ```

2. **Activate virtual environment:**
   ```powershell
   .\venv\Scripts\Activate.ps1
   ```

3. **Run Django server:**
   ```powershell
   python manage.py runserver
   ```

The backend will be available at: **http://localhost:8000**

### First Time Setup (if needed)

If you haven't set up the project yet:

```powershell
# Create virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser
```

### API Endpoints

- Reviews: `/api/reviews/`
- Blog Posts: `/api/blog/`
- FAQ: `/api/faq/`

---

## Frontend Setup (React + Vite)

### Location
`Dental-Perfections/dental-website/`

### How to Run the Frontend

1. **Navigate to website directory:**
   ```powershell
   cd dental-website
   ```

2. **Install dependencies (first time only):**
   ```powershell
   npm install
   ```

3. **Start development server:**
   ```powershell
   npm run dev
   ```

The frontend will be available at: **http://localhost:5173**

---

## Running Both Services

### Terminal 1 - Backend:
```powershell
cd dental_backend
.\venv\Scripts\Activate.ps1
python manage.py runserver
```

### Terminal 2 - Frontend:
```powershell
cd dental-website
npm run dev
```

---

## Technologies Used

### Backend
- Django 5.2.7
- Django REST Framework
- django-cors-headers
- SQLite (development)
- psycopg2 (PostgreSQL support)

### Frontend
- React 19
- Vite
- Tailwind CSS 4
- React Router
- Axios
- Motion library
- Lenis (smooth scrolling)

---

## Quick Start Summary

**✅ Both services are currently running!**

- **Backend:** http://localhost:8000 (Admin: http://localhost:8000/admin/)
- **Frontend:** http://localhost:5173

To start manually:

**Backend:**
```powershell
cd dental_backend
.\venv\Scripts\Activate.ps1
python manage.py runserver
```

**Frontend:**
```powershell
cd dental-website
npm run dev
```

