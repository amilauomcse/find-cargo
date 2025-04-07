####################  build stage  ####################
FROM node:20-alpine AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app
COPY yarn.lock package.json ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn run build          # → creates /app/build

####################  runtime stage  ####################
FROM nginx:1.25-alpine

# Copy CRA build output into Nginx
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
