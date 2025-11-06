# Dental Backend - Django REST API

## Setup Instructions

### 1. Create and Activate Virtual Environment

**Windows (PowerShell):**
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

**Windows (Command Prompt):**
```cmd
python -m venv venv
venv\Scripts\activate.bat
```

**macOS/Linux:**
```bash
python -m venv venv
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Run Database Migrations

```bash
python manage.py migrate
```

### 4. Create Superuser (Optional)

```bash
python manage.py createsuperuser
```

### 5. Run Development Server

```bash
python manage.py runserver
```

The server will start at `http://localhost:8000`

## API Endpoints

The Django REST API includes the following apps:
- **Reviews** - Customer reviews API
- **Blog** - Blog posts API  
- **FAQ** - Frequently Asked Questions API

## Technologies Used

- Django 5.2.7
- Django REST Framework
- django-cors-headers (for CORS support)
- SQLite (development database)


