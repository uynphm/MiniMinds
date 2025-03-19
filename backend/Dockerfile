# Stage 1: Builder (installs dependencies)
FROM python:3.9 as builder
WORKDIR /app

# Install system dependencies for OpenCV
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

# Stage 2: Final minimal image
FROM python:3.9-slim
WORKDIR /app

# Install only required system dependencies for OpenCV
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copy only installed dependencies from builder
COPY --from=builder /install /usr/local

# Copy application code
COPY . .

# Expose the port
EXPOSE 8000

# Run FastAPI
CMD ["uvicorn", "api_call:app", "--host", "0.0.0.0", "--port", "8000"]


# Build the Docker backend image: docker build -t fastapi-backend .
# Test: docker run -p 8000:8000 fastapi-backend
# docker run -e GROQ_API_KEY=your_api_key -p 8000:8000 fastapi-backend
