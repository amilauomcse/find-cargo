# ---------- build stage ----------
    FROM node:20-alpine AS builder

    RUN corepack enable && corepack prepare pnpm@latest --activate
    
    WORKDIR /app
    COPY frontend/pnpm-lock.yaml frontend/package.json ./
    RUN pnpm install --frozen-lockfile
    
    COPY frontend .
    RUN pnpm run build          # outputs to dist/ by default
    
    # ---------- runtime stage ----------
    FROM nginx:1.25-alpine
    
    # Copy built files into Nginx html folder
    COPY --from=builder /app/dist /usr/share/nginx/html
    
    # (Optional) custom Nginx config
    # COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
    
    EXPOSE 80
    CMD ["nginx", "-g", "daemon off;"]
    