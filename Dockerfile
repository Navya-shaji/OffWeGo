# ==========================================
# Stage 1: Build Frontend
# ==========================================
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy frontend package files
COPY Frontend/package*.json ./
# Use npm ci for stability and clear cache immediately
RUN npm ci && npm cache clean --force

# Copy frontend source code
COPY Frontend/ ./

# Delete any local .env files
RUN rm -f .env*

# Build arguments for Vite
ARG VITE_BASE_URL
ARG VITE_SOCKET_URL
ARG VITE_CLOUDINARY_CLOUD_NAME
ARG VITE_CLOUDINARY_UPLOAD_PRESET
ARG VITE_STRIPE_PUBLISHABLE_KEY
ARG VITE_OPENCAGE_API_KEY
ARG VITE_IMAGE_URL
ARG VITE_GOOGLE_CLIENT_ID

# Set environment variables for Vite build
ENV VITE_BASE_URL=${VITE_BASE_URL} \
    VITE_SOCKET_URL=${VITE_SOCKET_URL} \
    VITE_CLOUDINARY_CLOUD_NAME=${VITE_CLOUDINARY_CLOUD_NAME} \
    VITE_CLOUDINARY_UPLOAD_PRESET=${VITE_CLOUDINARY_UPLOAD_PRESET} \
    VITE_STRIPE_PUBLISHABLE_KEY=${VITE_STRIPE_PUBLISHABLE_KEY} \
    VITE_OPENCAGE_API_KEY=${VITE_OPENCAGE_API_KEY} \
    VITE_IMAGE_URL=${VITE_IMAGE_URL} \
    VITE_GOOGLE_CLIENT_ID=${VITE_GOOGLE_CLIENT_ID}

# Build the frontend application
RUN npm run build

# ==========================================
# Stage 2: Build the Backend
# ==========================================
FROM node:20-alpine AS backend-builder

WORKDIR /app/backend

# Copy backend package files
COPY Backend/package*.json ./
RUN npm ci && npm cache clean --force

# Copy backend source code
COPY Backend/ ./

# Build TypeScript backend
RUN npm run build

# ==========================================
# Stage 3: Final Production Image
# ==========================================
FROM node:20-alpine

WORKDIR /app

# Copy package files and install only production dependencies
COPY --from=backend-builder /app/backend/package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy compiled backend
COPY --from=backend-builder /app/backend/dist ./dist

# Copy built frontend into the backend's public folder
COPY --from=frontend-builder /app/frontend/dist ./public

# Final environment settings
ENV NODE_ENV=production

# Expose backend port
EXPOSE 1212

# Use node to run the built application
CMD ["npm", "start"]
