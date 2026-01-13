# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm config set fetch-retries 5 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm install

# Copy source code and build
COPY . .
RUN npm run build

# Stage 2: Runtime
FROM node:20-alpine AS runner

WORKDIR /app

# Copy only production dependencies
COPY package*.json ./
RUN npm config set fetch-retries 5 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm install --omit=dev

# Copy compiled code from builder
COPY --from=builder /app/dist ./dist

# Copy the serviceAccountKey.json since it's required at runtime
# We copy it into the src/ directory relative to the WORKDIR to match the search path in the code
COPY --from=builder /app/src/serviceAccountKey.json ./src/serviceAccountKey.json

# Expose the application port
EXPOSE 1212

# Set environment to production
ENV NODE_ENV=production

# Command to run the application
CMD ["node", "dist/app.js"]
