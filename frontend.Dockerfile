# Use Node.js base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY frontend .

# Build React app
RUN npm run build

# Expose the port
EXPOSE 5173

# Serve the built app using a simple HTTP server
CMD ["npx", "serve", "-s", "build", "-l", "5173"]
