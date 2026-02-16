# Story 1.4: Configure Code Quality Tools (Biome, TypeScript strict)

Status: done

## Story

As a developer,
I want automated linting and formatting with Biome across the monorepo,
So that code quality is consistent and enforced automatically.

## Acceptance Criteria

**Given** the monorepo with frontend and backend packages
**When** I install and configure Biome
**Then** `biome.json` at the root configures linting and formatting rules for TypeScript and JavaScript
**And** Biome configuration includes: `"organizeImports": { "enabled": true }`, semicolons required, single quotes, 2-space indentation
**And** root `package.json` includes scripts: `"lint": "biome check ."`, `"format": "biome format --write ."`

**Given** Biome is configured
**When** I run `pnpm lint` from the root
**Then** Biome checks all TypeScript files in both packages
**And** it reports any linting errors or warnings
**And** it verifies imports are organized

**Given** code with formatting issues exists
**When** I run `pnpm format`
**Then** Biome formats all files according to the configuration
**And** files are updated with consistent style

**Given** TypeScript strict mode is enabled
**When** I compile both packages
**Then** `tsconfig.base.json` has `"strict": true`, `"noUncheckedIndexedAccess": true`, `"noImplicitOverride": true`
**And** TypeScript compilation catches type errors
**And** no `any` types are allowed without explicit annotation

## Tasks / Subtasks

- [x] Install Biome as dev dependency (AC: 1)
  - [x] Run `pnpm add -D -w @biomejs/biome` to install at workspace root
  - [x] Verify Biome version is installed in root package.json

- [x] Create biome.json configuration (AC: 1)
  - [x] Create `biome.json` at project root
  - [x] Configure linting rules for TypeScript and JavaScript
  - [x] Enable `organizeImports` with `"enabled": true`
  - [x] Set formatter to use semicolons, single quotes, 2-space indentation
  - [x] Configure files to include (packages/**/src/**/*.{ts,tsx,js,jsx})
  - [x] Configure files to ignore (node_modules, dist, build, coverage)

- [x] Add lint and format scripts to root package.json (AC: 1)
  - [x] Add `"lint": "biome check ."` to scripts
  - [x] Add `"format": "biome format --write ."` to scripts
  - [x] Add `"check": "biome check --write ."` for auto-fixing linting issues

- [x] Update TypeScript strict mode configuration (AC: 4)
  - [x] Open `tsconfig.base.json`
  - [x] Ensure `"strict": true` is set in compilerOptions
  - [x] Add `"noUncheckedIndexedAccess": true` to compilerOptions
  - [x] Add `"noImplicitOverride": true` to compilerOptions
  - [x] Verify `"noImplicitAny": true` is enabled (part of strict)

- [x] Run lint check on existing code (AC: 2)
  - [x] Execute `pnpm lint` from root
  - [x] Review any reported linting errors or warnings
  - [x] Fix any critical issues found

- [x] Run format on all files (AC: 3)
  - [x] Execute `pnpm format` from root
  - [x] Verify all TypeScript/JavaScript files are formatted consistently
  - [x] Commit formatted files

- [x] Verify TypeScript compilation with strict mode (AC: 4)
  - [x] Run `pnpm --filter backend build` (or tsc if available)
  - [x] Run `pnpm --filter frontend build` (or tsc if available)
  - [x] Fix any type errors revealed by strict mode
  - [x] Ensure no implicit `any` types remain

- [x] Test quality scripts work correctly (AC: 2, 3)
  - [x] Introduce a formatting violation and run `pnpm format` to verify it fixes it
  - [x] Introduce a linting violation and run `pnpm lint` to verify it detects it
  - [x] Verify import organization works on a file with unorganized imports

## Dev Notes

### Architecture Requirements

**From [architecture.md#Code Quality]:**
- Biome for linting + formatting (single tool, Rust-based, near-instant)
- TypeScript strict mode enabled across all packages
- Shared configuration at root level for consistency

**File Structure:**
```
/
├── biome.json              # Root-level Biome config
├── tsconfig.base.json      # Shared TypeScript config with strict mode
├── package.json            # Root scripts: lint, format
└── packages/
    ├── frontend/
    │   └── tsconfig.json   # Extends tsconfig.base.json
    └── backend/
        └── tsconfig.json   # Extends tsconfig.base.json
```

### Biome Configuration Guidance

**Required biome.json structure:**
```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "vcs": {
    "enabled": true,
    "clientKind": "git",
    "useIgnoreFile": true
  },
  "files": {
    "include": ["packages/**/src/**/*.{ts,tsx,js,jsx}"],
    "ignore": ["**/node_modules", "**/dist", "**/build", "**/coverage"]
  },
  "organizeImports": {
    "enabled": true
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100,
    "formatWithErrors": false
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "semicolons": "always"
    }
  }
}
```

### TypeScript Strict Mode Configuration

**tsconfig.base.json additions needed:**
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    // ... other existing options
  }
}
```

### Testing Standards

- **Manual verification:** Create intentional violations and verify tools catch them
- **Format test:** Add unformatted code, run `pnpm format`, verify it's fixed
- **Lint test:** Add linting violation, run `pnpm lint`, verify detection
- **Import test:** Add disorganized imports, run format/lint, verify organization
- **Type test:** Verify strict TypeScript compilation succeeds with no errors

### Project Structure Notes

Following established patterns from stories 1.1-1.3:
- Root-level configuration files for monorepo-wide tools
- Package-level configs extend root configs
- Workspace scripts in root package.json for convenience
- All paths relative to project root

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.4]
- [Source: _bmad-output/planning-artifacts/architecture.md#Code Quality]
- [Source: _bmad-output/planning-artifacts/architecture.md#Project Structure]
- [Source: _bmad-output/implementation-artifacts/1-1-initialize-monorepo-with-pnpm-workspaces.md] - Root package.json structure
- [Biome Documentation: https://biomejs.dev/]

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (GitHub Copilot)

### Debug Log References

No errors encountered during implementation.

### Completion Notes List

1. Installed Biome v2.4.0 as workspace dev dependency
2. Created biome.json with updated schema for v2.4.0 (note: organizeImports is handled automatically in v2.x)
3. Updated package.json scripts: lint, format, and check
4. TypeScript strict mode already configured in tsconfig.base.json from story 1.1
5. Fixed all existing linting issues:
   - Added `node:` protocol to Node.js builtin imports (fs, path, url)
   - Converted type-only imports to use `import type` syntax
   - Removed non-null assertion in frontend/src/main.tsx with proper null check
6. Formatted all files with Biome (18 files, fixed 9)
7. Verified TypeScript compilation passes with strict mode for both packages
8. Tested quality scripts with intentional violations - all working correctly

### File List

**Created:**
- biome.json

**Modified:**
- package.json (added lint, format, check scripts)
- packages/backend/src/db/database.ts (node: protocol, organized imports)
- packages/backend/src/app.ts (import type for FastifyInstance and EnvSchemaData)
- packages/backend/src/config.ts (import type)
- packages/backend/src/server.ts (formatting)
- packages/frontend/src/main.tsx (removed non-null assertion, added null check)
- All other TypeScript files formatted according to Biome rules
