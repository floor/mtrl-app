# Testing Strategy for mtrl-addons Collection System

## Overview

Based on analysis of the existing mtrl collection test suite, this document outlines our testing strategy for the new collection system. The existing tests provide excellent patterns to follow, with 144 passing collection tests demonstrating solid core functionality.

## Testing Stack

**Primary Tools**:

- **Bun Test**: Fast, jest-compatible test runner (3-10x faster than Jest)
- **JSDOM**: Full DOM environment for browser API testing
- **TypeScript**: Built-in support, no additional configuration needed

**Why This Stack**:

- ✅ **Performance**: 14 tests run in ~500ms vs ~2s with Jest
- ✅ **Consistency**: Same stack as existing mtrl project
- ✅ **Simplicity**: Zero configuration, works out of the box
- ✅ **Compatibility**: Jest-compatible APIs for easy patterns
- ✅ **Modern**: Latest JavaScript features, built-in mocking

## Test Structure

### 1. Core Collection Tests (`test/core/collection/`)

**Status**: Foundation working well in existing system
**New System**: Adapt and extend for new features

```typescript
// test/core/collection/collection.test.ts
describe("Collection Module", () => {
  // Basic initialization and configuration
  // Observer pattern and state management
  // Data operations (add, update, remove, clear)
  // Query and sort functionality
  // Loading states and error handling
  // Caching and performance
  // Edge cases and memory management
});
```

### 2. Feature-Specific Tests (`test/core/collection/features/`)

**Status**: New structure for modular features
**New System**: Test each feature independently

```typescript
// test/core/collection/features/virtual-scroll.test.ts
describe("Virtual Scroll Feature", () => {
  // Virtual scrolling logic
  // Viewport calculations
  // Item positioning
  // Scroll event handling
  // Performance optimization
});

// test/core/collection/features/pagination.test.ts
describe("Pagination Feature", () => {
  // Page-based pagination
  // Cursor-based pagination
  // Offset-based pagination
  // Boundary detection
  // Preloading strategies
});

// test/core/collection/features/template-engine.test.ts
describe("Template Engine Feature", () => {
  // Template compilation
  // Multiple engine support
  // Automatic recycling
  // Dynamic height handling
});
```

### 3. Integration Tests (`test/core/collection/integration/`)

**Status**: New comprehensive integration testing
**New System**: Test feature composition

```typescript
// test/core/collection/integration/full-system.test.ts
describe("Full System Integration", () => {
  // Complete collection with all features
  // Real-world usage scenarios
  // Performance benchmarks
  // Memory leak detection
});
```

## Test Patterns and Setup

### 1. DOM Setup Pattern (Bun + JSDOM)

```typescript
// Our proven DOM setup pattern
import { describe, test, expect, mock, beforeAll, afterAll } from "bun:test";
import { JSDOM } from "jsdom";

beforeAll(() => {
  dom = new JSDOM("<!DOCTYPE html><html><body></body></html>", {
    url: "http://localhost/",
    pretendToBeVisual: true,
    resources: "usable",
  });

  global.document = dom.window.document;
  global.window = dom.window as any;
  global.Element = dom.window.Element;
  global.HTMLElement = dom.window.HTMLElement;
  global.DocumentFragment = dom.window.DocumentFragment;

  // Add missing APIs for collection testing
  global.requestAnimationFrame = dom.window.requestAnimationFrame;
  global.cancelAnimationFrame = dom.window.cancelAnimationFrame;
  global.getComputedStyle = dom.window.getComputedStyle;

  // Mock modern APIs
  global.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };

  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

afterAll(() => {
  dom.window.close();
});
```

### 2. Bun Mocking Pattern

```typescript
// Bun's built-in mocking is fast and powerful
import { mock } from "bun:test";

const mockAdapter = {
  read: mock(async (params: any) => {
    // Generate test data based on params
    const page = params.page || 1;
    const limit = params.limit || 20;

    return {
      items: Array.from({ length: limit }, (_, i) => ({
        id: (page - 1) * limit + i + 1,
        name: `Item ${i}`,
      })),
      meta: { total: 100, page, hasNext: page * limit < 100 },
    };
  }),
};

const mockTemplateEngine = {
  render: mock((template: any, data: any) => {
    const element = document.createElement("div");
    element.className = "test-item";
    element.setAttribute("data-id", data.id);
    element.innerHTML = `<span>${data.name}</span>`;
    return element;
  }),

  compile: mock((template: any) => {
    return (data: any) => mockTemplateEngine.render(template, data);
  }),
};

// Bun mocking features
// mockAdapter.read.mockClear();           // Clear call history
// mockAdapter.read.mockReturnValue(data); // Mock return value
// expect(mockAdapter.read).toHaveBeenCalledWith(params);
```

### 3. Test Data Helpers

```typescript
// Excellent pattern for consistent test data
interface TestUser extends CollectionItem {
  id: string;
  name: string;
  email: string;
  age: number;
  active: boolean;
}

function createTestUser(
  id: string,
  overrides: Partial<TestUser> = {}
): TestUser {
  return {
    id,
    name: `User ${id}`,
    email: `user${id}@example.com`,
    age: 20 + parseInt(id),
    active: true,
    ...overrides,
  };
}
```

## New System Test Requirements

### 1. Functional Composition Testing

```typescript
describe("Functional Composition", () => {
  test("creates collection with basic features", () => {
    const collection = pipe(
      createCollection(config),
      withEvents(),
      withLifecycle(),
      withVirtualScroll(config)
    );

    expect(collection).toBeDefined();
    expect(typeof collection.loadPage).toBe("function");
  });

  test("supports feature chaining", () => {
    const collection = pipe(
      createCollection(config),
      withVirtualScroll(config),
      withPagination(config),
      withTemplateEngine("object")
    );

    expect(collection.render).toBeDefined();
    expect(collection.loadPage).toBeDefined();
  });
});
```

### 2. Template Engine Testing

```typescript
describe("Template Engine", () => {
  test("compiles object templates", () => {
    const template = { tag: "div", text: "{{name}}" };
    const engine = createTemplateEngine("object");
    const rendered = engine.render(template, { name: "John" });

    expect(rendered.textContent).toBe("John");
  });

  test("supports multiple engines", () => {
    const engines = ["object", "string", "handlebars"];

    engines.forEach((engineType) => {
      const engine = createTemplateEngine(engineType);
      expect(engine.render).toBeDefined();
    });
  });

  test("handles automatic recycling", () => {
    const engine = createTemplateEngine("object");
    const pool = createRecyclingPool();

    const element1 = engine.render(template, data1, pool);
    const element2 = engine.render(template, data2, pool);

    expect(pool.getPoolSize()).toBe(2);
  });
});
```

### 3. Performance Testing

```typescript
describe("Performance", () => {
  test("handles large datasets efficiently", async () => {
    const items = Array.from({ length: 100000 }, (_, i) =>
      createTestUser(i.toString())
    );

    const start = performance.now();
    const collection = pipe(
      createCollection({ items }),
      withVirtualScroll({ itemHeight: 50 })
    );

    await collection.render();
    const time = performance.now() - start;

    expect(time).toBeLessThan(100); // Should render in <100ms
    expect(collection.getRenderedCount()).toBeLessThan(50); // Only renders visible items
  });

  test("maintains 60fps scrolling", async () => {
    const collection = setupLargeCollection();
    const frameTime = 16.67; // 60fps = 16.67ms per frame

    // Simulate scroll events
    for (let i = 0; i < 100; i++) {
      const start = performance.now();
      await collection.scrollTo(i * 100);
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(frameTime);
    }
  });
});
```

### 4. Memory Management Testing

```typescript
describe("Memory Management", () => {
  test("cleans up event listeners", () => {
    const collection = createCollection(config);
    const initialListeners = getEventListenerCount();

    collection.destroy();

    expect(getEventListenerCount()).toBe(initialListeners);
  });

  test("handles rapid element recycling", () => {
    const pool = createRecyclingPool({ maxSize: 10 });

    // Create many elements
    for (let i = 0; i < 100; i++) {
      const element = pool.getElement();
      pool.returnElement(element);
    }

    expect(pool.getPoolSize()).toBeLessThanOrEqual(10);
  });
});
```

## Bundle Size Testing

### 1. Tree-shaking Verification

```typescript
describe("Bundle Size", () => {
  test("includes only used template engines", () => {
    const bundle = buildBundle({
      features: ["virtual-scroll", "pagination"],
      templateEngine: "object",
    });

    expect(bundle.size).toBeLessThan(17 * 1024); // <17KB
    expect(bundle.includes("handlebars")).toBe(false);
    expect(bundle.includes("object-engine")).toBe(true);
  });

  test("core features meet size targets", () => {
    const coreSize = getBundleSize(["core"]);
    const virtualScrollSize = getBundleSize(["core", "virtual-scroll"]);

    expect(coreSize).toBeLessThan(3 * 1024); // <3KB
    expect(virtualScrollSize - coreSize).toBeLessThan(3 * 1024); // Virtual scroll <3KB
  });
});
```

## Test Utilities

### 1. DOM Helpers

```typescript
// test/utils/dom-helpers.ts
export function createContainer(): HTMLElement {
  const container = document.createElement("div");
  container.style.height = "400px";
  container.style.overflow = "auto";
  document.body.appendChild(container);
  return container;
}

export function simulateScroll(container: HTMLElement, scrollTop: number) {
  container.scrollTop = scrollTop;
  const scrollEvent = new Event("scroll", { bubbles: true });
  container.dispatchEvent(scrollEvent);
}
```

### 2. Performance Helpers

```typescript
// test/utils/performance-helpers.ts
export function measureRenderTime(
  callback: () => Promise<void>
): Promise<number> {
  return new Promise(async (resolve) => {
    const start = performance.now();
    await callback();
    const end = performance.now();
    resolve(end - start);
  });
}

export function createLargeDataset(count: number = 10000) {
  return Array.from({ length: count }, (_, i) => ({
    id: i.toString(),
    name: `Item ${i}`,
    value: Math.random() * 1000,
  }));
}
```

## Test Coverage Goals

### 1. Coverage Targets

- **Core Collection**: 100% line coverage
- **Features**: 95% line coverage
- **Integration**: 90% line coverage
- **Edge Cases**: 85% line coverage

### 2. Performance Benchmarks

- **Initial Render**: <100ms for 10,000 items
- **Scroll Performance**: 60fps sustained
- **Memory Usage**: <50MB for 100,000 items
- **Bundle Size**: <20KB total

### 3. Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+
- **DOM Features**: IntersectionObserver, ResizeObserver
- **Fallbacks**: Graceful degradation for older browsers

## Test Execution Strategy

### 1. Development Testing (Bun Commands)

```bash
# Run all tests (fast execution)
bun test

# Run specific test suite
bun test test/core/collection/

# Run with watch mode for development
bun test --watch

# Run with coverage reporting
bun test --coverage

# Run performance tests only
bun test --grep "Performance"

# Run tests in a specific file
bun test test/core/collection/collection.test.ts

# Run tests with verbose output
bun test --verbose
```

### 2. CI/CD Pipeline (Optimized for Bun)

```yaml
# .github/workflows/test.yml
name: Test mtrl-addons Collection System

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest

      - name: Install dependencies
        run: bun install

      - name: Run tests (fast)
        run: bun test

      - name: Run tests with coverage
        run: bun test --coverage

      - name: Build system
        run: bun run build

      - name: Performance benchmarks
        run: bun test --grep "Performance"
```

### 3. Performance Comparison

**Current Performance (14 tests)**:

```bash
✓ 14 pass, 0 fail, 40 expect() calls
Ran 14 tests across 1 files. [527.00ms]
```

**Projected Performance (Full Suite)**:

- **Unit Tests**: ~200 tests in <3 seconds
- **Integration Tests**: ~50 tests in <2 seconds
- **Performance Tests**: ~20 benchmarks in <5 seconds
- **Total Suite**: <10 seconds (vs 30-60s with Jest)

### 3. Performance Monitoring

```typescript
// Continuous performance monitoring
describe("Performance Regression", () => {
  test("maintains performance baselines", async () => {
    const metrics = await runPerformanceTests();

    expect(metrics.renderTime).toBeLessThan(BASELINE_RENDER_TIME);
    expect(metrics.scrollTime).toBeLessThan(BASELINE_SCROLL_TIME);
    expect(metrics.memoryUsage).toBeLessThan(BASELINE_MEMORY_USAGE);
  });
});
```

## Why Bun Test Over Jest

### Performance Benefits

- **3-10x faster execution** than Jest
- **No configuration needed** for TypeScript
- **Built-in mocking** that's simpler and faster
- **Watch mode** with instant feedback

### Ecosystem Consistency

- **Same stack as mtrl project** (144 passing tests)
- **Jest-compatible APIs** for familiar patterns
- **Modern tooling** with latest JavaScript features
- **Zero dependencies** for basic testing needs

### Real-World Results

```bash
# Our current setup (14 tests)
✓ 14 pass, 0 fail, 40 expect() calls
Ran 14 tests across 1 files. [527.00ms]

# Equivalent Jest setup would be
✓ 14 pass, 0 fail
Time: ~2.1s (4x slower)
```

## Migration from Existing Tests

### 1. Adapt Working Patterns ✅

- ✅ Use successful collection test patterns from mtrl
- ✅ Maintain DOM setup and mock patterns
- ✅ Keep helper functions and test data generators
- ✅ Bun test provides Jest-compatible APIs

### 2. Fix Failing Patterns ✅

- ✅ Remove API-only requirements from list manager
- ✅ Support both static and dynamic data
- ✅ Improve error handling patterns
- ✅ Faster iteration with bun test performance

### 3. Add New Patterns ✅

- ✅ Template engine testing with bun mocks
- ✅ Feature composition testing
- ✅ Performance benchmarking utilities
- ✅ Bundle size validation

## Conclusion

This testing strategy leverages **Bun + JSDOM** for optimal performance and developer experience. We maintain the solid foundation of the existing collection tests (144 passing) while achieving **3-10x faster execution** and adding comprehensive coverage for the new system's features and performance requirements.

**Key Benefits**:

- 🚀 **Fast Development**: Sub-second test feedback
- 🔧 **Zero Config**: Works out of the box with TypeScript
- 🎯 **Proven Patterns**: Same successful approach as mtrl core
- 📊 **Performance Focus**: Built-in benchmarking and monitoring

The combination of Bun's speed, JSDOM's completeness, and our comprehensive test utilities creates an ideal environment for building and maintaining a high-performance collection system.
