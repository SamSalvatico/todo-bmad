import cors from '@fastify/cors';
import env from '@fastify/env';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import type Database from 'better-sqlite3';
import Fastify, { type FastifyInstance } from 'fastify';
import { type Config, envOptions } from './config.js';
import { initializeDatabase } from './db/database.js';

// Extend Fastify's type definitions to include our config
declare module 'fastify' {
  interface FastifyInstance {
    config: Config;
    db: Database.Database;
  }
}

/**
 * Create and configure Fastify application
 * Factory pattern: returns configured app without starting server
 * @returns Configured Fastify instance
 */
export async function createApp(): Promise<FastifyInstance> {
  // Create Fastify instance with default logger
  const app = Fastify({ logger: true });

  // Register environment configuration plugin
  await app.register(env, envOptions);

  // Align log level with validated config
  app.log.level = app.config.NODE_ENV === 'production' ? 'warn' : 'info';

  // Initialize database
  const db = initializeDatabase(app.config.DB_PATH);
  app.decorate('db', db);
  app.log.info({ dbPath: app.config.DB_PATH }, 'Database initialized');

  app.addHook('onClose', async (instance) => {
    instance.log.info('Closing database connection');
    db.close();
  });

  // Register CORS plugin
  await app.register(cors, {
    origin: app.config.CORS_ORIGIN,
  });

  // Register Swagger documentation
  await app.register(swagger, {
    openapi: {
      info: {
        title: 'Todo API',
        description: 'Simple todo management API',
        version: '1.0.0',
      },
    },
  });

  // Register Swagger UI
  await app.register(swaggerUi, {
    routePrefix: '/docs',
  });

  // Health check endpoint
  app.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  return app;
}
