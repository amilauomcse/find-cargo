# Use Node.js base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY backend/package.json backend/yarn.lock ./
RUN npm install

# Copy source code
COPY backend .

# Build the NestJS apps
RUN npm run build

# Expose ports for both API and Auth
EXPOSE 3000 3001

# Start both API and Auth services
CMD ["npm", "run", "start:dev"]
