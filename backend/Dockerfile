FROM node:20-alpine

# Set the working directory
WORKDIR /usr/src/app

COPY ./backend/package.json ./backend/yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile


# Copy the application source code
COPY ./backend ./

# Build the application
RUN yarn build