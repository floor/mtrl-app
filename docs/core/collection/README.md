# Collection System Documentation

## Overview

The mtrl-addons collection system is a high-performance, template-driven data collection framework built on mtrl's functional composition patterns. It replaces the existing 82KB list manager with a <20KB system while maintaining superior performance.

## Documentation Structure

### 📐 [Architecture](./architecture.md)

High-level system architecture, philosophy, and design decisions. Covers the template system, automatic recycling, performance targets, and implementation strategy.

**Key Topics**:

- Core philosophy and functional composition
- Template-driven approach with automatic recycling
- Performance targets (<17KB bundle, 60fps scrolling)
- Multiple template engine support
- Dynamic height and element recycling
- Implementation phases and timeline

### 🔧 [Technical Blueprint](./blueprint.md)

Detailed technical specifications for all modules, APIs, types, and implementation contracts.

**Key Topics**:

- Complete TypeScript interfaces and type definitions
- Core modules (Collection, State, Events)
- Feature modules (Virtual Scrolling, Pagination, Templates)
- Template engines and registry system
- Utility modules (DOM, Performance, Validation)
- Integration patterns and configuration examples

### 🧪 [Testing Strategy](./testing-strategy.md)

Comprehensive testing approach using Bun Test + JSDOM for optimal performance and developer experience.

**Key Topics**:

- Bun Test setup and performance benefits (3-10x faster than Jest)
- JSDOM configuration for full DOM environment
- Test patterns and utilities
- Performance benchmarking framework
- Coverage goals and CI/CD pipeline

## Quick Start Guide

### Basic Collection

```typescript
import { createCollection } from "mtrl-addons/collection";

const collection = createCollection({
  items: [
    { id: "1", name: "Item 1" },
    { id: "2", name: "Item 2" },
  ],
  template: {
    tag: "div",
    className: "item",
    textContent: "{{name}}",
  },
});
```

### Advanced Collection with Features

```typescript
import { createCollection, pipe } from "mtrl-addons/collection";
import {
  withVirtualScroll,
  withPagination,
  withTemplateEngine,
} from "mtrl-addons/collection/features";

const advancedCollection = pipe(
  createCollection({
    adapter: myAdapter,
    container: document.getElementById("list"),
  }),
  withVirtualScroll({ itemHeight: "auto" }),
  withPagination({ strategy: "cursor", pageSize: 50 }),
  withTemplateEngine("handlebars")
);
```

## System Features

### 🚀 Performance

- **Bundle Size**: <17KB complete system (vs 82KB current)
- **Rendering**: <100ms initial render for 10K items
- **Scrolling**: 60fps sustained performance
- **Memory**: <50MB for 100K items with automatic recycling

### 🎯 Template System

- **Multiple Engines**: Object, String, Handlebars, EJS, Pug, Layout
- **Automatic Recycling**: Zero boilerplate DOM manipulation
- **Dynamic Heights**: Automatic measurement and adjustment
- **Type Safety**: Full TypeScript support

### 🔧 Developer Experience

- **Functional Composition**: mtrl's proven `pipe()` pattern
- **Zero Configuration**: Works out of the box
- **Template Freedom**: Choose your preferred templating approach
- **Performance Monitoring**: Built-in benchmarking tools

## Implementation Status

### ✅ Phase 1: Foundation (Completed)

- [x] Architecture documentation
- [x] Testing strategy and infrastructure (14 tests passing)
- [x] Technical blueprint and API specifications
- [x] Development environment setup

### 🔄 Phase 2: Core Implementation (In Progress)

- [ ] Core collection with mtrl integration
- [ ] Basic template engine (object)
- [ ] Element recycling system
- [ ] State management and events

### 📅 Phase 3: Window-Based Virtual Scrolling (Planned)

- [ ] Window-based virtual scrolling implementation
- [ ] Dynamic height calculation with progressive expansion
- [ ] GPU-accelerated positioning (translateY)
- [ ] Native scrollbar preservation and familiar UX
- [ ] Performance optimization for 1M+ items

### 📅 Phase 4: Advanced Features (Planned)

- [ ] Multiple pagination strategies
- [ ] Additional template engines
- [ ] Accessibility features
- [ ] Mobile optimizations

### 📅 Phase 5: Polish & Launch (Planned)

- [ ] Comprehensive test suite
- [ ] Performance benchmarking
- [ ] Bundle size optimization
- [ ] Production deployment

### 🔮 Future Enhancement: Custom Scrollbar (If Needed)

- [ ] Custom scrollbar implementation for extreme datasets (10M+ items)
- [ ] Zero DOM height limitations
- [ ] Advanced styling and behavior customization
- [ ] Unique UX capabilities

## Contributing

### Development Setup

```bash
# Install dependencies
bun install

# Run tests (fast with Bun)
bun test

# Run tests in watch mode
bun test --watch

# Run with coverage
bun test --coverage
```

### Testing Guidelines

- Follow existing test patterns from mtrl core (144 passing tests)
- Use Bun Test + JSDOM for optimal performance
- Write performance benchmarks for new features
- Maintain >95% test coverage

### Documentation Guidelines

- Keep technical specifications in `blueprint.md`
- Update architecture decisions in `architecture.md`
- Add examples to this README for common patterns
- Follow TypeScript interface documentation standards

## API Reference

See [Technical Blueprint](./blueprint.md) for complete API documentation including:

- **Core Types**: `CollectionItem`, `CollectionConfig`, `CollectionAdapter`
- **Feature APIs**: `VirtualScrollMethods`, `PaginationMethods`, `TemplateEngineMethods`
- **Template Engines**: `ObjectTemplate`, `TemplateEngine`, `CompiledTemplate`
- **Utility Functions**: DOM manipulation, performance monitoring, validation

## Performance Benchmarks

Current performance targets and measurements:

| Metric             | Target             | Current Status       |
| ------------------ | ------------------ | -------------------- |
| Bundle Size        | <17KB              | Design phase         |
| Initial Render     | <100ms (10K items) | TBD                  |
| Scroll Performance | 60fps sustained    | TBD                  |
| Memory Usage       | <50MB (100K items) | TBD                  |
| Test Execution     | <10s full suite    | 14 tests in 527ms ✅ |

## Roadmap

### Short Term (Next 2 weeks)

- Complete core collection implementation
- Basic template engine with object templates
- Element recycling pool
- Virtual scrolling foundation

### Medium Term (Next month)

- Multiple template engines (Handlebars, EJS)
- Advanced pagination strategies
- Performance optimizations
- Comprehensive testing

### Long Term (Next quarter)

- Production deployment
- Community feedback integration
- Additional template engines
- Advanced accessibility features

---

**Status**: 🚧 **Active Development** - Foundation complete, core implementation in progress

**Performance**: 🎯 **Targets Set** - <17KB bundle, 60fps scrolling, <100ms render

**Testing**: ✅ **Infrastructure Ready** - Bun Test + JSDOM, 14 tests passing
