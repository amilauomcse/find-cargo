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
ARG REACT_APP_BACKEND
ENV REACT_APP_BACKEND $REACT_APP_BACKEND
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

# Start the application
CMD ["serve", "-s", "dist", "-l", "5173"]
