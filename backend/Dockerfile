####################  build stage  ####################
FROM node:20-alpine AS builder

# Enable pnpm (via Corepack)
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy manifests and install ALL dependencies (dev + prod)
COPY yarn.lock package.json ./
RUN yarn install --frozen-lockfile

# Copy the rest of the backend source and build it
COPY . .
RUN yarn run build            # outputs to dist/

####################  runtime stage  ####################
FROM node:20-alpine

RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# copy only what the api app needs
COPY --from=builder /app/dist/apps/api ./dist/apps/api
COPY --from=builder /app/node_modules ./node_modules
COPY package.json .

EXPOSE 3000
CMD ["node", "dist/apps/api/main.js"]
