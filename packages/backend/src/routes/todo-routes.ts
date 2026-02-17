import type { FastifyPluginAsync } from 'fastify';
import type { CreateTodoRequest, UpdateTodoRequest } from '../types/todo.js';
import type { TodoRepository } from '../repositories/todo-repository.js';
import {
  createTodoSchema,
  updateTodoSchema,
  todoParamsSchema,
  todoResponseSchema,
  todoListResponseSchema,
  errorResponseSchema,
  notFoundResponseSchema,
} from '../schemas/todo-schemas.js';

type TodoRoutesOptions = {
  todoRepository: TodoRepository;
};

const parseTodoId = (value: unknown): number | null => {
  const parsed = typeof value === 'number' ? value : Number.parseInt(String(value), 10);

  if (!Number.isInteger(parsed) || parsed < 1) {
    return null;
  }

  return parsed;
};

const invalidIdResponse = {
  statusCode: 404,
  error: 'Not Found',
  message: 'Todo not found',
};

const sanitizeText = (input: string): string => {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

export const todoRoutes: FastifyPluginAsync<TodoRoutesOptions> = async (app, options) => {
  const { todoRepository } = options;

  app.get(
    '/api/todos',
    {
      schema: {
        response: {
          200: todoListResponseSchema,
        },
      },
    },
    async () => {
      return todoRepository.getAll();
    },
  );

  app.post<{ Body: CreateTodoRequest }>(
    '/api/todos',
    {
      schema: {
        ...createTodoSchema,
        response: {
          201: todoResponseSchema,
          400: errorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const sanitizedText = sanitizeText(request.body.text);
      const todo = todoRepository.create(sanitizedText);
      return reply.code(201).send(todo);
    },
  );

  app.patch<{ Body: UpdateTodoRequest; Params: { id: number } }>(
    '/api/todos/:id',
    {
      schema: {
        ...updateTodoSchema,
        ...todoParamsSchema,
        response: {
          200: todoResponseSchema,
          400: errorResponseSchema,
          404: notFoundResponseSchema,
        },
      },
      preValidation: (request, reply, done) => {
        const parsedId = parseTodoId(request.params.id);

        if (parsedId === null) {
          reply.code(404).send(invalidIdResponse);
          return;
        }

        request.params.id = parsedId;
        done();
      },
    },
    async (request, reply) => {
      const updated = todoRepository.update(request.params.id, request.body.completed);

      if (!updated) {
        return reply.code(404).send(invalidIdResponse);
      }

      return updated;
    },
  );

  app.delete<{ Params: { id: number } }>(
    '/api/todos/:id',
    {
      schema: {
        ...todoParamsSchema,
        response: {
          400: errorResponseSchema,
          404: notFoundResponseSchema,
        },
      },
      preValidation: (request, reply, done) => {
        const parsedId = parseTodoId(request.params.id);

        if (parsedId === null) {
          reply.code(404).send(invalidIdResponse);
          return;
        }

        request.params.id = parsedId;
        done();
      },
    },
    async (request, reply) => {
      const removed = todoRepository.delete(request.params.id);

      if (!removed) {
        return reply.code(404).send(invalidIdResponse);
      }

      return reply.code(204).send();
    },
  );
};
