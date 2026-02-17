import type { Todo } from '../types/todo.js';

const todoSchema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    text: { type: 'string' },
    completed: { type: 'boolean' },
    createdAt: { type: 'string' },
  },
  required: ['id', 'text', 'completed', 'createdAt'],
} as const satisfies Record<string, unknown> & { properties: Record<keyof Todo, unknown> };

const todoListSchema = {
  type: 'array',
  items: todoSchema,
} as const;

const baseErrorResponseSchema = {
  type: 'object',
  properties: {
    statusCode: { type: 'number' },
    error: { type: 'string' },
    message: { type: 'string' },
  },
  required: ['statusCode', 'error', 'message'],
} as const;

const baseNotFoundResponseSchema = {
  ...baseErrorResponseSchema,
  description: 'Todo not found',
} as const;

export const createTodoSchema = {
  body: {
    type: 'object',
    properties: {
      text: { type: 'string', minLength: 1, maxLength: 500 },
    },
    required: ['text'],
  },
} as const;

export const updateTodoSchema = {
  body: {
    type: 'object',
    properties: {
      completed: { type: 'boolean' },
    },
    required: ['completed'],
  },
} as const;

export const todoParamsSchema = {
  params: {
    type: 'object',
    properties: {
      id: { type: 'integer', minimum: 1 },
    },
    required: ['id'],
  },
} as const;

export const todoResponseSchema = todoSchema;
export const todoListResponseSchema = todoListSchema;
export const errorResponseSchema = baseErrorResponseSchema;
export const notFoundResponseSchema = baseNotFoundResponseSchema;
