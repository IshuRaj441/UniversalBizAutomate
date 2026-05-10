# Railway + Docker Setup Guide

## 🚀 Quick Start

### 1. Install Railway CLI
```bash
npm install -g @railway/cli
```

### 2. Login to Railway
```bash
railway login
```

### 3. Initialize Project
```bash
# In your project root
railway new
```

### 4. Deploy
```bash
railway up
```

## 🔧 Configuration

### Required Environment Variables
Set these in Railway dashboard or CLI:

**Backend:**
```
FLASK_ENV=production
SECRET_KEY=your-super-secret-key-here
DATABASE_URL=postgresql://username:password@host:port/database
CORS_ORIGINS=https://your-app-name.railway.app
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=true
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

**Frontend:**
```
REACT_APP_API_URL=https://your-backend-name.railway.app
NODE_ENV=production
```

## 📁 Project Structure

```
UniversalBizAutomat/
├── railway.json              # Railway configuration
├── Dockerfile               # Backend Docker setup
├── gunicorn.conf.py         # Gunicorn config
├── frontend/
│   ├── Dockerfile          # Frontend Docker setup
│   └── nginx.conf         # Nginx config
└── .github/workflows/
    └── railway-deploy.yml   # CI/CD pipeline
```

## 🐳 Docker Configuration

Your app is already configured for Railway with Docker:

- **Backend**: Uses existing `Dockerfile` with LibreOffice
- **Frontend**: Uses `frontend/Dockerfile` with Nginx
- **Database**: Railway PostgreSQL
- **Storage**: Railway volumes for uploads/outputs

## 🔄 Automatic Deployment

### GitHub Actions Setup

1. **Add Secrets to GitHub:**
   - `RAILWAY_TOKEN`: Your Railway API token
   - `SECRET_KEY`: Flask secret key
   - `DATABASE_URL`: Railway database URL
   - `RAILWAY_URL`: Your Railway app URL
   - `RAILWAY_API_URL`: Backend URL for frontend
   - Mail configuration secrets

2. **Get Railway Token:**
   ```bash
   railway login
   railway token create
   ```

3. **Push to Main:**
   ```bash
   git add .
   git commit -m "Add Railway deployment"
   git push origin main
   ```

## 🌐 Access Your App

After deployment:
- **Backend**: `https://your-backend-name.railway.app`
- **Frontend**: `https://your-frontend-name.railway.app`
- **API**: `https://your-backend-name.railway.app/api/`

## 🔍 Debugging

### View Logs
```bash
railway logs
```

### Check Status
```bash
railway status
```

### Access Shell
```bash
railway shell
```

### Restart Service
```bash
railway restart
```

## 💡 Railway Benefits for Your App

✅ **Docker Support** - Full container environment
✅ **Persistent Storage** - Files won't disappear
✅ **No Timeouts** - Heavy processing allowed
✅ **LibreOffice** - System dependencies work
✅ **PostgreSQL** - Managed database
✅ **SSL** - Automatic HTTPS
✅ **Custom Domains** - Use your own domain
✅ **CI/CD** - Automatic deployments

## 📊 Monitoring

Railway provides:
- Real-time metrics
- Error tracking
- Performance monitoring
- Resource usage

## 🎯 Production Tips

1. **Set up custom domain** for professional appearance
2. **Configure monitoring** alerts
3. **Set up backups** for database
4. **Monitor resource usage** and upgrade if needed
5. **Test file uploads** with large documents

## 🆘 Troubleshooting

### Common Issues:

1. **Build Fails**:
   - Check Dockerfile syntax
   - Verify requirements.txt
   - Check package.json

2. **Runtime Errors**:
   - Check environment variables
   - Review logs: `railway logs`
   - Verify database connection

3. **File Upload Issues**:
   - Check storage permissions
   - Verify file size limits
   - Check disk space

4. **CORS Errors**:
   - Verify CORS_ORIGINS setting
   - Check frontend API URL
   - Ensure HTTPS is used

## 🎉 Success!

Your Universal Business Automation is now running on Railway with:
- ✅ Global accessibility
- ✅ Automatic HTTPS
- ✅ Reliable file processing
- ✅ Persistent storage
- ✅ Professional deployment

**🚀 Your document processing system is ready for global users!**
