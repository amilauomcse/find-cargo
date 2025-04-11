############################
# 1. build stage
############################
FROM node:20-alpine AS build

# Install build tools once
RUN apk add --no-cache python3 make g++

WORKDIR /app

# ── Copy dependency manifests and install ──
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# ── Copy source and build ──
COPY . .
ARG REACT_APP_BACKEND
ENV REACT_APP_BACKEND $REACT_APP_BACKEND
RUN yarn build                 # → /app/build

############################
# 2. runtime stage
############################


FROM nginx:stable-alpine

# Copy built static files
COPY --from=build /app/build /usr/share/nginx/html

# Optional: custom Nginx config / entrypoint
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Listen on 3030 instead of 80
ENV NGINX_PORT=3030
RUN sed -i "s/listen\s\+80;/listen ${NGINX_PORT};/g" /etc/nginx/conf.d/default.conf

EXPOSE 3030
CMD ["nginx", "-g", "daemon off;"]
