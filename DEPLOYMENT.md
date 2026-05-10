# Deployment Guide - Universal Business Automation (UBA)

This guide provides comprehensive instructions for deploying the Universal Business Automation system in various environments.

## Quick Start (Docker Compose)

### Prerequisites
- Docker Desktop (Windows/Mac) or Docker Engine + Docker Compose (Linux)
- Git
- At least 4GB RAM available

### One-Command Deployment

**Windows:**
```bash
deploy.bat
```

**Linux/macOS:**
```bash
chmod +x deploy.sh
./deploy.sh
```

### Manual Deployment Steps

1. **Clone and Setup:**
   ```bash
   git clone <repository-url>
   cd UniversalBizAutomat
   ```

2. **Environment Configuration:**
   ```bash
   # Copy production environment files
   cp .env.production .env
   cp frontend/.env.production frontend/.env
   
   # Update .env with your actual values:
   # - SECRET_KEY (generate a strong random key)
   # - DATABASE_URL (if using external database)
   # - Email settings (if using email features)
   ```

3. **Deploy with Docker Compose:**
   ```bash
   docker-compose build
   docker-compose up -d
   ```

4. **Run Database Migrations:**
   ```bash
   docker-compose exec backend flask db upgrade
   ```

5. **Access the Application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Production (via Nginx): http://localhost

## Architecture Overview

### Docker Services
- **backend**: Flask application with Gunicorn
- **frontend**: React application served by Nginx
- **db**: PostgreSQL database
- **nginx**: Reverse proxy with SSL termination and rate limiting

### Key Features
- **Auto-scaling**: Configurable worker processes
- **Security**: Rate limiting, security headers, CORS
- **Persistence**: Database and file storage volumes
- **Monitoring**: Structured logging and health checks

## Environment Variables

### Backend (.env)
```bash
# Flask Configuration
FLASK_APP=app:app
FLASK_ENV=production
SECRET_KEY=your-strong-secret-key-here

# Database
DATABASE_URL=postgresql://postgres:password@db:5432/universalbizautomat

# File Uploads
UPLOAD_FOLDER=uploads
OUTPUT_FOLDER=outputs
MAX_CONTENT_LENGTH=16777216  # 16MB

# CORS
CORS_ORIGINS="http://localhost:3000,http://frontend:3000"

# Email (optional)
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

### Frontend (frontend/.env)
```bash
REACT_APP_API_URL=http://localhost:5000
NODE_ENV=production
GENERATE_SOURCEMAP=false
```

## Production Deployment Options

### Option 1: Docker Compose (Recommended)
- **Pros**: Simple, portable, includes all services
- **Cons**: Single host limitation
- **Use case**: Small to medium deployments, development/testing

### Option 2: Cloud Platform Deployment

#### Heroku
```bash
# Backend
heroku create your-app-name
heroku config:set FLASK_ENV=production
heroku config:set DATABASE_URL=your-database-url
heroku config:set SECRET_KEY=your-secret-key
git push heroku main

# Frontend (separate app)
cd frontend
heroku create your-app-frontend
npm run build
git push heroku main
```

#### Render
- **Backend**: Connect GitHub repo, set environment variables
- **Frontend**: Connect GitHub repo, set build command `npm run build`
- **Database**: Use managed PostgreSQL instance

#### AWS/DigitalOcean
- Use Docker Swarm or Kubernetes
- Deploy containers with managed database
- Configure load balancer and SSL certificates

### Option 3: Traditional VPS Deployment

```bash
# Install dependencies
sudo apt update
sudo apt install python3-pip python3-venv nodejs npm postgresql nginx

# Setup backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Setup frontend
cd frontend
npm install
npm run build

# Configure nginx (copy nginx.conf)
# Configure postgresql
# Setup systemd services
```

## SSL/HTTPS Setup

### Using Let's Encrypt (Recommended)
```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Generate certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Manual SSL
1. Obtain SSL certificate from your provider
2. Place certificate files in `ssl/` directory
3. Update `nginx.conf` with SSL configuration
4. Restart nginx service

## Monitoring and Maintenance

### Health Checks
```bash
# Check service status
docker-compose ps

# View logs
docker-compose logs -f [service-name]

# Database health
docker-compose exec backend python -c "from app import app; print('OK')"
```

### Backup Strategy
```bash
# Database backup
docker-compose exec db pg_dump -U postgres universalbizautomat > backup.sql

# File backup
tar -czf uploads-backup.tar.gz uploads/
tar -czf outputs-backup.tar.gz outputs/
```

### Performance Monitoring
- Monitor container resource usage
- Set up application monitoring (Prometheus/Grafana)
- Configure log aggregation (ELK stack)

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Check if database container is running
   - Verify DATABASE_URL environment variable
   - Check database logs: `docker-compose logs db`

2. **Frontend Not Loading**
   - Check if frontend container is running
   - Verify nginx configuration
   - Check browser console for errors

3. **File Upload Issues**
   - Check upload directory permissions
   - Verify file size limits
   - Check storage space

4. **CORS Errors**
   - Verify CORS_ORIGINS environment variable
   - Check nginx proxy configuration

### Reset Deployment
```bash
# Stop and remove all containers
docker-compose down -v

# Remove images (optional)
docker-compose down --rmi all

# Redeploy
./deploy.sh
```

## Scaling Considerations

### Horizontal Scaling
- Use Docker Swarm or Kubernetes
- Deploy multiple backend instances
- Use load balancer for distribution
- Implement session storage (Redis)

### Performance Optimization
- Enable Redis caching
- Use CDN for static files
- Optimize database queries
- Implement connection pooling

### Security Hardening
- Regular security updates
- Firewall configuration
- Intrusion detection
- Security scanning

## Support

For deployment issues:
1. Check this documentation
2. Review application logs
3. Check GitHub issues
4. Contact support team

---

**Note**: Always test deployments in a staging environment before production rollout.
