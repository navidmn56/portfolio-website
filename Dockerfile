FROM python:3.12-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app

# Install Python dependencies
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Create required directories
RUN mkdir -p /app/staticfiles /app/media /data

EXPOSE 8000

CMD ["gunicorn", "resume_project.wsgi:application", "--bind", "0.0.0.0:8000", "--workers","2","--timeout","120"]