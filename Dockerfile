FROM python:3.9-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libreoffice \
    pandoc \
    imagemagick \
    poppler-utils \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create necessary directories
RUN mkdir -p uploads outputs static

# Set environment variables
ENV FLASK_APP=app:app
ENV FLASK_ENV=production
ENV PYTHONPATH=/app

# Expose port
EXPOSE 5000

# Run the application
CMD ["gunicorn", "--config", "gunicorn.conf.py", "wsgi:app"]
