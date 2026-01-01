# syntax=docker/dockerfile:1

FROM node:20-alpine AS base
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.15.1 --activate

FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

FROM base AS builder
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
RUN apk add --no-cache wget
RUN addgroup -g 1001 -S nodejs && adduser -S citegen -u 1001 -G nodejs
COPY --from=deps --chown=citegen:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=citegen:nodejs /app/dist ./dist
COPY --from=builder --chown=citegen:nodejs /app/package.json ./package.json
USER citegen
EXPOSE 3000
CMD ["node", "dist/index.js"]

