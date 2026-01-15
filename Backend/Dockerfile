# Use a lightweight Node.js image
FROM node:20-alpine

WORKDIR /app

# Copy package files and install only production dependencies
COPY package*.json ./
RUN npm config set fetch-retries 5 && \
    npm config set fetch-retries 5 && \
    npm install --omit=dev

# Copy the pre-built dist folder from your local machine
COPY dist ./dist

# Copy the src folder (specifically for serviceAccountKey.json if needed, or other static assets)
# We only copy src if the app expects things from there at runtime
COPY src ./src

# Expose the application port
EXPOSE 1212

# Set environment to production
ENV NODE_ENV=production

# Command to run the application
CMD ["node", "dist/app.js"]
