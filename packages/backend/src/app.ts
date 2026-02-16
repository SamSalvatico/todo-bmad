import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import env from '@fastify/env';
import fastifyStatic from '@fastify/static';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { envOptions, Config } from './config.js';
import { initializeDatabase } from './db/database.js';

// Extend Fastify's type definitions to include our config
declare module 'fastify' {
  interface FastifyInstance {
    config: Config;
  }
}

/**
 * Create and configure Fastify application
 * Factory pattern: returns configured app without starting server
 * @returns Configured Fastify instance
 */
export async function createApp(): Promise<FastifyInstance> {
  // Create Fastify instance with logger
  const app = Fastify({
    logger: {
      level: process.env.NODE_ENV === 'production' ? 'warn' : 'info'
    }
  });

  // Register environment configuration plugin
  await app.register(env, envOptions);

  // Initialize database
  const db = initializeDatabase(app.config.DB_PATH);
  app.log.info({ dbPath: app.config.DB_PATH }, 'Database initialized');

  // Register CORS plugin
  await app.register(cors, {
    origin: app.config.CORS_ORIGIN
  });

  // Register Swagger documentation
  await app.register(swagger, {
    openapi: {
      info: {
        title: 'Todo API',
        description: 'Simple todo management API',
        version: '1.0.0'
      }
    }
  });

  // Register Swagger UI
  await app.register(swaggerUi, {
    routePrefix: '/docs'
  });

  // Health check endpoint
  app.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  return app;
}
