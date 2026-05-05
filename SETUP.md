# Universal Business Automation - Local Setup Guide

## Quick Start (2 Commands)

```bash
# Backend Setup & Run
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python app.py

# Frontend Setup & Run (in new terminal)
cd frontend
npm install
npm start
```

## Detailed Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 16+
- Git

### Backend Setup

1. **Create Virtual Environment**
   ```bash
   python -m venv .venv
   ```

2. **Activate Virtual Environment**
   ```bash
   # Windows
   .venv\Scripts\activate
   
   # Mac/Linux
   source .venv/bin/activate
   ```

3. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment Variables**
   - Copy `.env.example` to `.env`
   - Update with your settings (optional for local dev)

5. **Run Backend**
   ```bash
   python app.py
   ```
   - Backend runs on: http://localhost:5000
   - API endpoints: http://localhost:5000/api

### Frontend Setup

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Environment Variables**
   - Frontend `.env` is already configured for local development
   - Points to: http://localhost:5000/api

3. **Run Frontend**
   ```bash
   npm start
   ```
   - Frontend runs on: http://localhost:3000

## Default Users

- **Admin**: admin@example.com / admin123
- **Test User**: raji53681@gmail.com / test123

## Project Structure

```
UniversalBizAutomat/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── .env.example          # Environment variables template
├── extensions.py         # Flask extensions
├── models/               # Database models
├── routes/              # API routes
├── uploads/             # File upload directory
├── outputs/             # Processed files
├── instance/            # SQLite database
├── frontend/
│   ├── package.json     # Node.js dependencies
│   ├── .env            # Frontend environment variables
│   ├── src/
│   │   ├── api/        # API service files
│   │   ├── config.ts   # Configuration
│   │   └── ...         # React components
│   └── build/          # Production build
└── .gitignore          # Git ignore file
```

## API Endpoints

- **Health Check**: GET /api/health
- **Auth**: 
  - POST /api/auth/login
  - POST /api/auth/register
- **API**: 
  - GET /api/tools
  - GET /api/leads
  - POST /api/convert

## Database

- Uses SQLite for local development (`instance/app.db`)
- Automatically creates tables and default users on startup
- No PostgreSQL setup required for local development

## Common Issues & Solutions

### Backend Issues
- **Port 5000 in use**: Change port in app.py or stop other services
- **Virtual environment issues**: Delete .venv and recreate
- **Import errors**: Ensure all requirements.txt dependencies are installed

### Frontend Issues
- **Port 3000 in use**: Stop other React dev servers
- **API connection errors**: Ensure backend is running on port 5000
- **Node modules issues**: Delete node_modules and run npm install

### CORS Issues
- Already configured for localhost:3000, 3001, 3003
- If using different port, update CORS origins in app.py

## Git Setup

```bash
git init
git add .
git commit -m "Initial clean setup"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

## Production Deployment

- Backend: Use gunicorn (Procfile included)
- Frontend: Build with `npm run build`
- Environment: Update .env with production URLs
- Database: Switch to PostgreSQL for production

## Support

If you encounter issues:
1. Check both backend and frontend are running
2. Verify ports 5000 and 3000 are available
3. Check console logs for error messages
4. Ensure all dependencies are installed

---

**Ready to use!** Your app should now be running locally without any debugging required.
