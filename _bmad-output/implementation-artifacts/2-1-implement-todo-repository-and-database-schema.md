# Story 2.1: Implement Todo Repository and Database Schema

Status: review

## Story

As a developer,
I want a repository layer that handles all database operations for todos with proper error handling,
so that I have a clean data access boundary and the todos table is created when needed.

## Acceptance Criteria

1. **AC1:** TodoRepository class exists at `packages/backend/src/repositories/todo-repository.ts` and initializes the database from `db/init.sql` on instantiation.
2. **AC2:** The `todos` table is created if it doesn't exist with columns: `id` (INTEGER PRIMARY KEY AUTOINCREMENT), `text` (TEXT NOT NULL), `completed` (INTEGER DEFAULT 0), `created_at` (TEXT DEFAULT CURRENT_TIMESTAMP).
3. **AC3:** `create(text: string): Todo` method inserts a new todo and returns it with `camelCase` fields.
4. **AC4:** `getAll(): Todo[]` method retrieves all todos ordered by `created_at DESC`, mapping `snake_case` DB columns to `camelCase`.
5. **AC5:** `update(id: number, completed: boolean): Todo | null` method updates completion status and returns the updated todo or null if not found.
6. **AC6:** `delete(id: number): boolean` method deletes a todo and returns true if successful, false otherwise.
7. **AC7:** Type definitions exist at `packages/backend/src/types/todo.ts` exporting `Todo`, `CreateTodoRequest`, and `UpdateTodoRequest` interfaces.
8. **AC8:** Unit tests exist at `packages/backend/src/repositories/todo-repository.test.ts` using in-memory SQLite and testing all CRUD operations.
9. **AC9:** All tests pass when running `pnpm --filter backend test`.

## Tasks / Subtasks

- [x] Create init.sql with table schema (AC: 2)
  - [x] Define todos table with correct columns and constraints
  - [x] Ensure CREATE TABLE IF NOT EXISTS for idempotent initialization
- [x] Create types/todo.ts with TypeScript interfaces (AC: 7)
  - [x] Define Todo interface with all fields in camelCase
  - [x] Define CreateTodoRequest and UpdateTodoRequest
- [x] Create repositories/todo-repository.ts with CRUD methods (AC: 1, 3-6)
  - [x] Implement TodoRepository class constructor with DB initialization
  - [x] Implement create() method with field mapping
  - [x] Implement getAll() method with ordering and field mapping
  - [x] Implement update() method with null handling
  - [x] Implement delete() method with success/failure return
- [x] Create repositories/todo-repository.test.ts with unit tests (AC: 8)
  - [x] Test create: inserts and returns todo with correct fields
  - [x] Test getAll: retrieves all todos in correct order
  - [x] Test update: changes completion status, returns updated todo, returns null for missing id
  - [x] Test delete: removes todo and returns true, returns false for missing id
- [x] Verify all tests pass (AC: 9)
  - [x] Run `pnpm --filter backend test`
  - [x] Confirm 100% passing test suite for repository layer

## Dev Notes

### Technical Requirements

**Database Setup:**
- Use `better-sqlite3` which is already configured as a backend dependency (from Story 1.2)
- Database file location: `packages/backend/src/db/database.ts` initializes the connection
- SQLite syntax: Standard SQL, no advanced features needed for this scope
- Table initialization: Execute `CREATE TABLE IF NOT EXISTS` from `init.sql` file on app startup
- Field constraints: `id` AUTO INCREMENT PRIMARY KEY, `text` NOT NULL (enforce non-empty strings), `completed` boolean as INTEGER (SQLite convention), `created_at` auto-timestamp

**Repository Pattern:**
- Thin data access layer that wraps raw SQL and maps database results to TypeScript types
- Constructor accepts a database connection (could be injected)
- All methods are synchronous (better-sqlite3 provides synchronous API)
- Methods never throw on not-found conditions; return null or false instead
- All error handling defers to caller (keep repository focused on data access)

**Field Mapping Strategy:**
- Database uses `snake_case`: `text`, `completed`, `created_at`
- TypeScript/JSON uses `camelCase`: `text`, `completed`, `createdAt`
- Mapping happens ONLY in repository layer; no raw snake_case escapes to routes or frontend
- Dates stored as ISO 8601 strings in SQLite (created_at defaults to CURRENT_TIMESTAMP)

### Architecture Compliance

- **Monorepo Location:** `packages/backend/src/repositories/` (per architecture document repository pattern)
- **Naming Convention:** File `todo-repository.ts` (kebab-case per architecture), class `TodoRepository` (PascalCase)
- **Type Definitions:** All types in `packages/backend/src/types/todo.ts` (centralized type file)
- **Database Initialization:** Use `CREATE TABLE IF NOT EXISTS` idempotent pattern (no migration tool needed per architecture)
- **Testing Location:** Co-located test file `todo-repository.test.ts` in same directory (per architecture test pattern)
- **Error Handling:** Repository methods return null/false on not-found; no thrown errors for CRUD operations

### Library / Framework Requirements

**Dependencies (already installed from Story 1.2):**
- `better-sqlite3@^11.x` — synchronous SQLite driver, no async overhead
- `typescript` — strict mode type checking
- `vitest` — test runner (already configured in `packages/backend/vitest.config.ts`)

**No new dependencies needed.** The repository only uses better-sqlite3 and standard Node.js APIs.

**better-sqlite3 Usage Pattern:**
```typescript
// Synchronous API — no async/await
const db = new Database('path/to/db.sqlite');
const stmt = db.prepare('SELECT * FROM todos WHERE id = ?');
const result = stmt.get(1); // Synchronous, returns object or undefined

// Transactions
db.exec('CREATE TABLE IF NOT EXISTS todos (...)');
```

### File Structure Requirements

**Created Files:**
- `packages/backend/src/db/init.sql` — SQL schema definition (CREATE TABLE statement)
- `packages/backend/src/types/todo.ts` — TypeScript type definitions (Todo, CreateTodoRequest, UpdateTodoRequest)
- `packages/backend/src/repositories/todo-repository.ts` — Repository class with CRUD methods and field mapping
- `packages/backend/src/repositories/todo-repository.test.ts` — Unit tests using in-memory SQLite

**Existing Files Modified:**
- `packages/backend/src/db/database.ts` — Should already exist from Story 1.2 (verify it creates the connection; no changes needed if working)

**Directory Structure After This Story:**
```
packages/backend/src/
├── db/
│   ├── database.ts              (existing, from Story 1.2)
│   └── init.sql                 (NEW - schema)
├── repositories/
│   ├── todo-repository.ts       (NEW - CRUD layer)
│   └── todo-repository.test.ts  (NEW - tests)
├── types/
│   └── todo.ts                  (NEW - type definitions)
├── app.ts                       (existing, no changes)
└── server.ts                    (existing, no changes)
```

### Testing Requirements

**Test Framework:** Vitest (already configured in `packages/backend/vitest.config.ts`)

**Test Strategy:**
- Unit tests for repository layer using in-memory SQLite database (`:memory:`)
- Each test should be isolated with a fresh database
- Test all CRUD methods: create, getAll, update, delete
- Test edge cases: update/delete non-existent todo (verify null/false return)
- Test field mapping: verify camelCase output from snake_case DB

**Test Structure Example:**
```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { TodoRepository } from './todo-repository';
import Database from 'better-sqlite3';

describe('TodoRepository', () => {
  let db: Database.Database;
  let repository: TodoRepository;

  beforeEach(() => {
    db = new Database(':memory:');
    repository = new TodoRepository(db);
  });

  // Test cases...
});
```

**Test Coverage:**
- ✓ create: inserts todo, returns Todo with correct fields
- ✓ getAll: returns empty array initially, returns todos after insert, ordered by created_at DESC
- ✓ update: updates completion status, returns updated Todo, returns null for missing id
- ✓ delete: removes todo, returns true; returns false for missing id
- ✓ field mapping: verify snake_case DB → camelCase TypeScript

**Command to Run:**
```bash
cd packages/backend
pnpm test
```

### Previous Story Intelligence

**From Story 1.2 (Setup Backend with Fastify and TypeScript):**
- `packages/backend/src/db/database.ts` initializes the better-sqlite3 connection
- `packages/backend/src/db/init.sql` file mentioned as containing the CREATE TABLE statement
- Backend structure has `src/` directory with proper TypeScript setup
- `tsconfig.json` extends `../../tsconfig.base.json` with strict mode enabled

**From Story 1.4 (Biome & TypeScript):**
- All code must pass `pnpm lint` (Biome checks)
- Code must be formatted per `biome.json` configuration
- No `any` types allowed without explicit annotation

**From Story 1.5 (Testing Infrastructure):**
- Vitest is configured and ready to use
- Test files are co-located with source files (same directory)
- Unit test patterns established in previous stories

### Git Intelligence Summary

- Recent commits focused on completing Epic 1 (Stories 1.1-1.7)
- All tests passing in Epic 1 (run `pnpm test` to verify baseline)
- Backend directory structure is stable and ready for repository layer implementation
- No breaking changes or refactors in recent commits

### Latest Tech Information

**better-sqlite3 Current Best Practices:**
- Version 11.x is stable and widely used
- Synchronous API appropriate for this simple scope (no high concurrency demands)
- Type definitions: `@types/better-sqlite3` should already be installed from Story 1.2
- Database file encoding: UTF-8 (default, appropriate for all text data)

**SQLite Timestamp Handling:**
- CURRENT_TIMESTAMP produces ISO 8601 format in modern SQLite: `2026-02-17T14:30:45.123Z` or `YYYY-MM-DD HH:MM:SS`
- Store and return as string (no special Date parsing needed in repository)

**TypeScript 5.x Type Inference:**
- Interface definitions will enable strong typing in route handlers and tests
- Use `Pick<>`, `Omit<>` utility types for API request/response types as needed

### Project Context Reference

- No project-context.md found in workspace
- Architecture document specifies: single `todos` table, repository pattern, snake_case DB / camelCase API field mapping
- All decisions from Story 1.2 backend setup apply here (pnpm workspaces, Fastify, better-sqlite3, TypeScript strict mode)

## Dev Agent Record

### Agent Model Used

GPT-5.2-Codex

### Debug Log References

None (first story in Epic 2)

### Completion Notes

- Added TodoRepository with CRUD, init.sql execution, and field mapping
- Added Todo types for repository and API request payloads
- Added unit tests for repository CRUD behavior and ordering
- Tests reported passing by user: `pnpm --filter backend test`

### File List

**Created:**
- `packages/backend/src/types/todo.ts`
- `packages/backend/src/repositories/todo-repository.ts`
- `packages/backend/src/repositories/todo-repository.test.ts`

**Existing (verified):**
- `packages/backend/src/db/init.sql`

### Change Log

- 2026-02-17: Implemented todo repository, types, and tests for CRUD behavior.

**To be modified:**
- (none - all dependencies already in place from Story 1.2)

---

**Next Story:** 2.2 - Create Todo CRUD API Endpoints with Validation
