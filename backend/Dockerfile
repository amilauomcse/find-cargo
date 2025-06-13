FROM node:20-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package files
COPY backend/package.json backend/yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the application source code
COPY backend/ ./

# Build the application
RUN yarn build

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/apps/api/main"]