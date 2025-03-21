FROM node:22.14-bookworm-slim AS builder
WORKDIR /app

# Copy application code
COPY . .

# Install dependencies with sharp optimization
RUN npm install

# Build with memory optimizations
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]


# docker build --no-cache -t frontend . 
# docker run -it --rm -p 3000:3000 frontend 