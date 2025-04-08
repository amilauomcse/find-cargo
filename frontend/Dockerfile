############################
#   1. build stage
############################
FROM node:20-alpine AS build

# Install build tools only once
RUN apk add --no-cache python3 make g++

WORKDIR /app

# ── Copy only dependency manifests first (better layer cache) ──
COPY frontend/package.json frontend/yarn.lock ./

# Install dependencies (no dev/prod split for CRA)
RUN yarn install --frozen-lockfile

# ── Copy the rest of the source and build ──
COPY frontend .
RUN yarn build                # outputs to /app/build

############################
#   2. runtime stage
############################
FROM nginx:stable-alpine

# Copy built static files
COPY --from=build /app/build /usr/share/nginx/html

# Optional: custom Nginx config or entrypoint
# (If you don't need these, delete the two COPY lines below.)
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY frontend/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 3030
# Listen on 3030 instead of default 80
ENV NGINX_PORT=3030
# Change default listen port in the main config
RUN sed -i "s/listen\s\+80;/listen ${NGINX_PORT};/g" /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
