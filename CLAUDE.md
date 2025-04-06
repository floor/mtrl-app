# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands
- `bun run dev`: Start development server with auto-reload
- `bun run build`: Build the project
- `bun run build:dev`: Build with watch mode
- `bun test`: Run all tests
- `bun test path/to/test.js`: Run a single test

## Code Style Guidelines
- **Linting**: Uses StandardJS (2-space indent, single quotes)
- **Imports**: Group named imports, one import per source
- **Functions**:
  - Prefix conventions: `create*` for components, `f*` for factory functions, `init*` for initialization
  - Document with JSDoc-style comments
- **Naming**:
  - Variables: camelCase
  - Constants: UPPERCASE_SNAKE_CASE
  - Components: PascalCase (in comments)
- **Error Handling**: Use try/catch blocks with specific error messages
- **Types**: TypeScript for server-side, JSDoc for client-side documentation
- **Architecture**: 
  - Component-based approach with clear separation of concerns
  - Event handling with both native DOM and component API patterns
  - Related functionality grouped in subdirectories with index.js exports