# ---------- build stage ----------
    FROM node:20-alpine AS builder

    # Enable pnpm via Corepack
    RUN corepack enable && corepack prepare pnpm@latest --activate
    
    WORKDIR /app
    
    # Copy manifests and install ALL deps (dev + prod)
    COPY backend/pnpm-lock.yaml backend/package.json ./
    RUN pnpm install --frozen-lockfile
    
    # Copy source and build
    COPY backend .
    RUN pnpm run build          # creates dist/ …
    
    # ---------- runtime stage ----------
    FROM node:20-alpine
    
    # Optional: keep pnpm available
    RUN corepack enable && corepack prepare pnpm@latest --activate
    
    WORKDIR /app
    
    # Copy compiled code and production deps only
    COPY --from=builder /app/dist ./dist
    COPY --from=builder /app/node_modules ./node_modules
    COPY backend/package.json .
    
    # Expose the ports your Nest apps listen on
    EXPOSE 3000 3001
    
    # Start in production mode (adjust paths if you have multiple apps)
    CMD ["node", "dist/main.js"]
    