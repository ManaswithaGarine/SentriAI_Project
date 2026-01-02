FROM python:3.11-slim

# Create app directory
WORKDIR /app

# Install system deps needed for OpenCV, video and scientific packages
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
       build-essential \
       ca-certificates \
       ffmpeg \
       libglib2.0-0 \
       libsm6 \
       libxrender1 \
       libxext6 \
       libgl1-mesa-glx \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install (includes flask, opencv-python, etc.)
# Copy requirements and install (includes flask, opencv-python, etc.)
COPY backend/requirements.txt /app/requirements.txt
RUN pip install --upgrade pip setuptools wheel \
    && pip install --no-cache-dir -r /app/requirements.txt gunicorn

# Copy backend source
COPY backend/ /app

ENV FLASK_ENV=production
ENV PORT=5000

EXPOSE 5000

# Run gunicorn with the wsgi module
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "wsgi:app", "--workers", "2"]
