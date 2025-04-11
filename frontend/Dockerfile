############################
# 1. build stage
############################
FROM node:20-alpine AS build

# Install build tools
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy dependency files and install
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy source
COPY . .

# Replace placeholder with real API URL
ARG REACT_APP_API_BASE_URL
RUN find src -type f -name "*.js" -exec sed -i "s|__API_BASE_URL__|${REACT_APP_API_BASE_URL}|g" {} +

# Build the app
RUN yarn build

############################
# 2. runtime stage
############################
FROM nginx:stable-alpine

# Copy static files
COPY --from=build /app/build /usr/share/nginx/html

# Custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Set custom port
ENV NGINX_PORT=3030
RUN sed -i "s/listen\s\+80;/listen ${NGINX_PORT};/g" /etc/nginx/conf.d/default.conf

EXPOSE 3030
CMD ["nginx", "-g", "daemon off;"]
