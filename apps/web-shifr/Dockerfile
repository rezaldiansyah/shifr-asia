FROM node:18-alpine AS base

# 1. Prune dependencies
FROM base AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
# Set working directory
WORKDIR /app
# Install turbo globally
RUN npm install turbo --global
COPY . .
# Prune the project for web-shifr
RUN turbo prune --scope=@shifr/web-shifr --docker

# 2. Install dependencies & Build
FROM base AS installer
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy lockfile and package.json's from pruned stage
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/package-lock.json ./package-lock.json

# Install dependencies
RUN npm install

# Copy source code from pruned stage
COPY --from=builder /app/out/full/ .

# Build the project
RUN npx turbo run build --filter=@shifr/web-shifr...

# 3. Production Image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=installer /app/apps/web-shifr/public ./apps/web-shifr/public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs /app/apps/web-shifr/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/web-shifr/.next/static ./apps/web-shifr/.next/static

CMD ["node", "apps/web-shifr/server.js"]
