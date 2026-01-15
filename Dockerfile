# ==========================================
# Stage 1: Build Frontend
# ==========================================
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy frontend package files
COPY Frontend/package*.json ./
RUN npm config set fetch-retries 5 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm install

# Copy frontend source code
COPY Frontend/ ./

# Build arguments for Vite environment variables
ARG VITE_BASE_URL
ARG VITE_SOCKET_URL
ARG VITE_CLOUDINARY_CLOUD_NAME
ARG VITE_CLOUDINARY_UPLOAD_PRESET
ARG VITE_STRIPE_PUBLISHABLE_KEY
ARG VITE_OPENCAGE_API_KEY
ARG VITE_IMAGE_URL

# Set environment variables for Vite build
ENV VITE_BASE_URL=${VITE_BASE_URL}
ENV VITE_SOCKET_URL=${VITE_SOCKET_URL}
ENV VITE_CLOUDINARY_CLOUD_NAME=${VITE_CLOUDINARY_CLOUD_NAME}
ENV VITE_CLOUDINARY_UPLOAD_PRESET=${VITE_CLOUDINARY_UPLOAD_PRESET}
ENV VITE_STRIPE_PUBLISHABLE_KEY=${VITE_STRIPE_PUBLISHABLE_KEY}
ENV VITE_OPENCAGE_API_KEY=${VITE_OPENCAGE_API_KEY}
ENV VITE_IMAGE_URL=${VITE_IMAGE_URL}

# Build the frontend application
RUN npm run build

# ==========================================
# Stage 2: Build Backend
# ==========================================
FROM node:20-alpine AS backend-builder

WORKDIR /app/backend

# Copy backend package files
COPY Backend/package*.json ./
RUN npm config set fetch-retries 5 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm install

# Copy backend source code
COPY Backend/ ./

# Build TypeScript backend
RUN npm run build

# ==========================================
# Stage 3: Production Image
# ==========================================
FROM node:20-alpine

WORKDIR /app

# Copy backend dependencies and built files
COPY --from=backend-builder /app/backend/package*.json ./
COPY --from=backend-builder /app/backend/node_modules ./node_modules
COPY --from=backend-builder /app/backend/dist ./dist

# Copy Firebase service account key (required at runtime)
COPY --from=backend-builder /app/backend/src/serviceAccountKey.json ./src/serviceAccountKey.json

# Copy frontend build to backend's public folder
COPY --from=frontend-builder /app/frontend/dist ./public

# Set production environment
ENV NODE_ENV=production

# Expose backend port
EXPOSE 1212

# Start the backend server (which now also serves the frontend)
CMD ["npm", "start"]
