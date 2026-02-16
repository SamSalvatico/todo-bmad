/**
 * Environment configuration schema using JSON Schema
 * Validated on app startup via @fastify/env
 */
export const configSchema = {
  type: 'object',
  required: [],
  properties: {
    PORT: {
      type: 'number',
      default: 3000
    },
    HOST: {
      type: 'string',
      default: '0.0.0.0'
    },
    NODE_ENV: {
      type: 'string',
      default: 'development'
    },
    DB_PATH: {
      type: 'string',
      default: './data/todos.db'
    },
    CORS_ORIGIN: {
      type: 'string',
      default: 'http://localhost:5173'
    }
  }
} as const;

/**
 * TypeScript interface matching the config schema
 */
export interface Config {
  PORT: number;
  HOST: string;
  NODE_ENV: string;
  DB_PATH: string;
  CORS_ORIGIN: string;
}

/**
 * Environment configuration options for @fastify/env
 */
export const envOptions = {
  confKey: 'config',
  schema: configSchema,
  dotenv: true,
  data: process.env
};
