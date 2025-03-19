FROM node:22.14-bookworm-slim AS builder

# Install essential build tools and libraries
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    pkg-config \
    libvips-dev \  
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Environment configuration
ENV NODE_OPTIONS="--max-old-space-size=16384"
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_SHARP_PATH=/app/node_modules/shrap  

# Copy configuration files first
COPY package*.json ./
COPY tsconfig.json ./
COPY next.config.ts ./
COPY postcss.config.mjs ./
COPY tailwind.config.ts ./

# Install dependencies with sharp optimization
RUN npm install --legacy-peer-deps --force \
    && npm install sharp@0.33.2  # Explicit sharp install

# Copy application code
COPY . .

# Build with memory optimizations
RUN npm run build -- --no-lint