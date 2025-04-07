####################  build stage  ####################
FROM node:20-alpine AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app
COPY yarn.lock package.json ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn run build           # → dist/

####################  runtime stage  ####################
FROM node:20-alpine

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy compiled code and prod deps
COPY --from=builder /app/dist        ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package.json .

EXPOSE 3000 3001

# Start the NestJS app
CMD ["node", "dist/main.js"]
