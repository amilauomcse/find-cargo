FROM node:20-alpine as build

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy source
COPY . .

# Build the application
RUN yarn build

# Production stage
FROM node:20-alpine as production

WORKDIR /app

# Install serve to run the built application
RUN yarn global add serve

# Copy built files from build stage
COPY --from=build /app/dist ./dist

# Expose the port
EXPOSE 5173

# Set environment variables
ENV HOST=0.0.0.0
ENV PORT=5173

# Create a simple start script
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'echo "Starting frontend with backend URL: $VITE_BACKEND_URL"' >> /app/start.sh && \
    echo 'if [ -n "$VITE_BACKEND_URL" ]; then' >> /app/start.sh && \
    echo '  echo "Injecting backend URL into built files..."' >> /app/start.sh && \
    echo '  find /app/dist -name "*.js" -exec sed -i "s|http://api:3000|$VITE_BACKEND_URL|g" {} \;' >> /app/start.sh && \
    echo '  find /app/dist -name "*.js" -exec sed -i "s|http://localhost:3000|$VITE_BACKEND_URL|g" {} \;' >> /app/start.sh && \
    echo '  echo "Backend URL injection complete"' >> /app/start.sh && \
    echo 'fi' >> /app/start.sh && \
    echo 'serve -s dist -l 5173' >> /app/start.sh

# Make the script executable
RUN chmod +x /app/start.sh

# Start the application
CMD ["/bin/sh", "/app/start.sh"]
