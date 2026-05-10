@echo off
REM Universal Business Automation - Deployment Script for Windows
REM This script deploys the UBA application using Docker Compose

echo 🚀 Starting Universal Business Automation deployment...

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed. Please install Docker Desktop first.
    pause
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose is not installed. Please install Docker Compose first.
    pause
    exit /b 1
)

REM Create necessary directories if they don't exist
if not exist "uploads" mkdir uploads
if not exist "outputs" mkdir outputs
if not exist "ssl" mkdir ssl

REM Copy environment files if they don't exist
if not exist ".env" (
    copy ".env.production" ".env"
    echo 📝 Created .env from .env.production - please update with your settings
)

if not exist "frontend\.env" (
    copy "frontend\.env.production" "frontend\.env"
    echo 📝 Created frontend\.env from .env.production
)

REM Build and start services
echo 🔨 Building Docker images...
docker-compose build

echo 🚀 Starting services...
docker-compose up -d

REM Wait for database to be ready
echo ⏳ Waiting for database to be ready...
timeout /t 10 /nobreak >nul

REM Run database migrations
echo 🗄️ Running database migrations...
docker-compose exec backend flask db upgrade

REM Check if services are running
echo 🔍 Checking service status...
docker-compose ps

echo ✅ Deployment completed successfully!
echo.
echo 🌐 Application URLs:
echo    Frontend: http://localhost:3000
echo    Backend API: http://localhost:5000
echo    Nginx (Production): http://localhost
echo.
echo 📋 Useful commands:
echo    View logs: docker-compose logs -f
echo    Stop services: docker-compose down
echo    Restart services: docker-compose restart
echo    Access backend shell: docker-compose exec backend bash
echo.
pause
