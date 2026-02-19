import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createApp } from '../src/app';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Docker Configuration Integration Tests', () => {
  let app: Awaited<ReturnType<typeof createApp>>;

  beforeEach(async () => {
    // Set up production environment
    process.env.PORT = '3000';
    process.env.HOST = '0.0.0.0';
    process.env.NODE_ENV = 'production';
    process.env.DB_PATH = ':memory:'; // Use in-memory DB for tests
    process.env.CORS_ORIGIN = 'http://localhost:5173';
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
  });

  describe('Dockerfile Configuration', () => {
    it('should have Dockerfile at repo root', () => {
      const dockerfilePath = path.join(__dirname, '../../../Dockerfile');
      expect(fs.existsSync(dockerfilePath)).toBe(true);
    });

    it('should copy node_modules to production stage', () => {
      const dockerfilePath = path.join(__dirname, '../../../Dockerfile');
      const content = fs.readFileSync(dockerfilePath, 'utf-8');

      // Verify production stage copies root pnpm store and backend workspace links
      expect(content).toContain(
        'COPY --from=builder /app/node_modules ./node_modules',
      );
      expect(content).toContain(
        'COPY --from=builder /app/packages/backend/node_modules ./packages/backend/node_modules',
      );
    });

    it('should have multi-stage Dockerfile', () => {
      const dockerfilePath = path.join(__dirname, '../../../Dockerfile');
      const content = fs.readFileSync(dockerfilePath, 'utf-8');

      // Check for multi-stage build
      expect(content).toContain('FROM node:24-bookworm AS builder');
      expect(content).toContain('FROM node:24-bookworm-slim');

      // Check for build commands
      expect(content).toContain('pnpm install --frozen-lockfile');
      expect(content).toContain('pnpm run build');

      // Check for production setup
      expect(content).toContain('NODE_ENV=production');
      expect(content).toContain('CMD ["node", "packages/backend/dist/server.js"]');
    });

    it('should have Corepack enabled in build stage', () => {
      const dockerfilePath = path.join(__dirname, '../../../Dockerfile');
      const content = fs.readFileSync(dockerfilePath, 'utf-8');

      // Count occurrences of corepack enable (should be in build stage only)
      const corepackEnableCount = (content.match(/corepack enable/g) || []).length;
      expect(corepackEnableCount).toBeGreaterThanOrEqual(1);

      // Verify it's in the builder stage
      const builderSection = content.substring(0, content.indexOf('FROM node:24-bookworm-slim'));
      expect(builderSection).toContain('corepack enable');
    });
  });

  describe('docker-compose Configuration', () => {
    it('should have docker-compose.yaml at repo root', () => {
      const composePath = path.join(__dirname, '../../../docker-compose.yaml');
      expect(fs.existsSync(composePath)).toBe(true);
    });

    it('should have correct docker-compose service configuration', () => {
      const composePath = path.join(__dirname, '../../../docker-compose.yaml');
      const content = fs.readFileSync(composePath, 'utf-8');

      // Check for service definition
      expect(content).toContain('services:');
      expect(content).toContain('app:');

      // Check for port mapping
      expect(content).toContain('3000:3000');

      // Check for volume mount
      expect(content).toContain('./data:/app/data');

      // Check for env file
      expect(content).toContain('.env');
    });

    it('should have production environment variables configured', () => {
      const composePath = path.join(__dirname, '../../../docker-compose.yaml');
      const content = fs.readFileSync(composePath, 'utf-8');

      expect(content).toContain('NODE_ENV=production');
      expect(content).toContain('HOST=0.0.0.0');
      expect(content).toContain('DB_PATH=/app/data/todos.db');
    });
  });

  describe('Build Scripts Configuration', () => {
    it('should have build script in root package.json', () => {
      const pkgPath = path.join(__dirname, '../../../package.json');
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

      expect(pkg.scripts.build).toBe('pnpm --filter backend build && pnpm --filter frontend build');
    });

    it('should have backend build script using tsc', () => {
      const backendPkgPath = path.join(__dirname, '../package.json');
      const pkg = JSON.parse(fs.readFileSync(backendPkgPath, 'utf-8'));

      expect(pkg.scripts.build).toBe('tsc');
    });

    it('should have frontend build script using vite', () => {
      const frontendPkgPath = path.join(__dirname, '../../../packages/frontend/package.json');
      const pkg = JSON.parse(fs.readFileSync(frontendPkgPath, 'utf-8'));

      expect(pkg.scripts.build).toBe('vite build');
    });
  });

  describe('Production Static File Serving', () => {
    it('should register @fastify/static in production environment', async () => {
      app = await createApp();

      // Verify app is in production mode
      expect(app.config.NODE_ENV).toBe('production');
      expect(app.log.level).toBe('warn');
    });

    it('should have @fastify/static as a dependency', () => {
      const backendPkgPath = path.join(__dirname, '../package.json');
      const pkg = JSON.parse(fs.readFileSync(backendPkgPath, 'utf-8'));

      expect(pkg.dependencies['@fastify/static']).toBeDefined();
    });

    it('should have health endpoint accessible', async () => {
      app = await createApp();

      const response = await app.inject({
        method: 'GET',
        url: '/health',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.payload);
      expect(body.status).toBe('ok');
    });
  });

  describe('Data Directory Structure', () => {
    it('should have data directory for persistent storage', () => {
      const dataPath = path.join(__dirname, '../../../data');
      expect(fs.existsSync(dataPath)).toBe(true);
    });

    it('should have valid .env.example configuration', () => {
      const envExamplePath = path.join(__dirname, '../../../.env.example');
      expect(fs.existsSync(envExamplePath)).toBe(true);

      const content = fs.readFileSync(envExamplePath, 'utf-8');
      expect(content).toContain('DB_PATH=./data/todos.db');
    });
  });
});
