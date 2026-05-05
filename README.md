# Universal Business Automation (UBA)

A full-stack business automation platform that simplifies document processing, file conversion, and workflow automation for businesses of all sizes.

## 🚀 Features

- **Document Processing**: Convert between PDF, DOCX, and other document formats
- **File Management**: Secure upload, storage, and retrieval of business documents
- **User Authentication**: Secure user registration and authentication system
- **API Integration**: RESTful API for seamless integration with existing systems
- **Modern UI**: Responsive React frontend with Material-UI components
- **Automated Workflows**: Streamline repetitive business processes

## 🏗️ Architecture

### Backend (Flask)
- **Framework**: Flask 2.3.3 with SQLAlchemy for database management
- **Authentication**: JWT-based authentication system
- **File Processing**: Support for PDF, DOCX, PPT, and image formats
- **Database**: PostgreSQL with Alembic migrations
- **API**: RESTful API with CORS support

### Frontend (React)
- **Framework**: React 19.2.3 with TypeScript
- **UI Library**: Material-UI (MUI) components
- **State Management**: React Context API
- **Routing**: React Router DOM for navigation
- **Forms**: Formik with Yup validation
- **File Upload**: React Dropzone for drag-and-drop functionality

## 📋 Prerequisites

### System Dependencies
- Python 3.8+
- Node.js 16+
- PostgreSQL database

### External Tools (Optional for enhanced functionality)
- LibreOffice (for enhanced document conversion)
- Pandoc (for document format conversion)
- ImageMagick (for image processing)
- Poppler (for PDF utilities)

## 🛠️ Installation

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd UniversalBizAutomat
   ```

2. **Create and activate virtual environment**
   ```bash
   python -m venv .venv
   # Windows
   .venv\Scripts\activate
   # macOS/Linux
   source .venv/bin/activate
   ```

3. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database URL and other configurations
   ```

5. **Initialize database**
   ```bash
   flask db init
   flask db migrate -m "Initial migration"
   flask db upgrade
   ```

6. **Start the backend server**
   ```bash
   python app.py
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install Node.js dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

## 📁 Project Structure

```
UniversalBizAutomat/
├── backend/
│   ├── app.py              # Main Flask application
│   ├── extensions.py       # Flask extensions configuration
│   ├── models/             # Database models
│   │   └── user.py
│   ├── routes/             # API routes
│   │   ├── auth_routes.py
│   │   └── api_routes.py
│   ├── migrations/         # Database migrations
│   ├── uploads/           # File upload storage
│   ├── outputs/           # Processed file outputs
│   └── requirements.txt    # Python dependencies
├── frontend/
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── api/          # API service functions
│   │   ├── contexts/     # React contexts
│   │   └── App.tsx       # Main App component
│   └── package.json      # Node.js dependencies
└── README.md
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost/database_name

# JWT Secret
JWT_SECRET_KEY=your-secret-key

# File Upload
UPLOAD_FOLDER=uploads
OUTPUT_FOLDER=outputs
MAX_CONTENT_LENGTH=16777216  # 16MB
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout

### Document Processing Endpoints
- `POST /api/upload` - Upload document for processing
- `GET /api/documents` - List user documents
- `GET /api/download/<file_id>` - Download processed document
- `POST /api/convert` - Convert document format

## 🚀 Deployment

### Backend Deployment (Heroku)

1. **Install Heroku CLI**
2. **Create Heroku app**
   ```bash
   heroku create your-app-name
   ```
3. **Set environment variables**
   ```bash
   heroku config:set DATABASE_URL=your-database-url
   heroku config:set JWT_SECRET_KEY=your-secret-key
   ```
4. **Deploy**
   ```bash
   git push heroku main
   ```

### Frontend Deployment (Netlify/Vercel)

1. **Build the frontend**
   ```bash
   cd frontend
   npm run build
   ```
2. **Deploy the build folder to your preferred hosting service**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions, please open an issue in the GitHub repository or contact the development team.

## 🔄 Version History

- **v1.0.0** - Initial release with basic document processing capabilities
- **v1.1.0** - Added user authentication and file management
- **v1.2.0** - Enhanced UI/UX with Material-UI components