####################  build stage  ####################
FROM node:20-alpine AS builder

# Enable pnpm (via Corepack)
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set working directory
WORKDIR /app

# Copy manifests and install ALL dependencies (dev + prod)
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy the rest of the backend source and build it
COPY . .
RUN yarn build            

####################  runtime stage  ####################
FROM node:20-alpine

RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# copy only what the api app needs
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/package.json .

EXPOSE 3000
CMD ["node", "dist/apps/api/main.js"]
