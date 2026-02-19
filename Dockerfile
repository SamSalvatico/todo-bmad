# Multi-stage build for todo-bmad
# Build stage: compile TypeScript and build frontend
FROM node:24-bookworm AS builder

# Enable Corepack to use pnpm from package.json
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable

# Set working directory
WORKDIR /app

# Copy all files including source code
COPY . .

# Install dependencies using pnpm with frozen lockfile
RUN pnpm install --frozen-lockfile

# Build both backend and frontend
RUN pnpm run build

# Production stage: minimal runtime image
FROM node:24-bookworm-slim

# Set production environment
ENV NODE_ENV=production

# Set working directory
WORKDIR /app

# Copy package.json files for module resolution ("type": "module")
COPY --from=builder /app/package.json ./
COPY --from=builder /app/packages/backend/package.json ./packages/backend/

# Copy root pnpm store (contains actual packages + native binaries)
COPY --from=builder /app/node_modules ./node_modules

# Copy backend workspace node_modules (symlinks into root store)
COPY --from=builder /app/packages/backend/node_modules ./packages/backend/node_modules

# Copy built backend
COPY --from=builder /app/packages/backend/dist ./packages/backend/dist

# Copy init.sql (read at runtime by database.ts, not included by tsc)
COPY --from=builder /app/packages/backend/src/db/init.sql ./packages/backend/dist/db/init.sql

# Copy built frontend (static files)
COPY --from=builder /app/packages/frontend/dist ./packages/frontend/dist

# Expose application port
EXPOSE 3000

# Start the backend server
CMD ["node", "packages/backend/dist/server.js"]

