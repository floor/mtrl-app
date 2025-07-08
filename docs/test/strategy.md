# mtrl-addons Testing Strategy

## Overview

This document outlines the comprehensive testing strategy for the mtrl-addons project, covering all components, utilities, and systems. Our approach prioritizes performance, developer experience, and consistency with the broader mtrl ecosystem.

## Testing Stack

### Primary Tools

- **Bun Test**: Fast, jest-compatible test runner (3-10x faster than Jest)
- **JSDOM**: Full DOM environment for browser API testing
- **TypeScript**: Built-in support, no additional configuration needed

### Why This Stack

- ✅ **Performance**: Significantly faster test execution
- ✅ **Consistency**: Same stack as mtrl core project
- ✅ **Simplicity**: Zero configuration, works out of the box
- ✅ **Compatibility**: Jest-compatible APIs for familiar patterns
- ✅ **Modern**: Latest JavaScript features, built-in mocking

## Project Structure

### Test Organization

```
test/
├── components/              # Component-specific tests
│   ├── forms/              # Form component tests
│   ├── ui/                 # UI component tests
│   └── specialized/        # Specialized component tests
├── core/                   # Core system tests
│   ├── collection/         # Collection system tests
│   ├── list-manager/       # List Manager system tests
│   ├── utilities/          # Utility function tests
│   └── integrations/       # Integration tests
├── utils/                  # Test utilities and helpers
│   ├── dom-helpers.ts      # DOM testing utilities
│   ├── performance-helpers.ts # Performance testing tools
│   └── component-helpers.ts   # Component testing helpers
└── setup.ts               # Global test setup
```

## Testing Patterns

### 1. DOM Setup Pattern

```typescript
import { describe, test, expect, mock, beforeAll, afterAll } from "bun:test";
import { JSDOM } from "jsdom";

beforeAll(() => {
  // Create DOM environment
  dom = new JSDOM("<!DOCTYPE html><html><body></body></html>", {
    url: "http://localhost/",
    pretendToBeVisual: true,
    resources: "usable",
  });

  // Set globals
  global.document = dom.window.document;
  global.window = dom.window as any;
  global.Element = dom.window.Element;
  global.HTMLElement = dom.window.HTMLElement;

  // Mock modern APIs
  global.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

afterAll(() => {
  dom.window.close();
});
```

### 2. Component Testing Pattern

```typescript
describe("Component Name", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  test("renders correctly", () => {
    const component = createComponent(config);
    component.mount(container);

    expect(container.children.length).toBeGreaterThan(0);
    expect(container.querySelector(".component-class")).toBeDefined();
  });
});
```

### 3. Utility Testing Pattern

```typescript
describe("Utility Function", () => {
  test("handles basic case", () => {
    const result = utilityFunction(input);
    expect(result).toBe(expectedOutput);
  });

  test("handles edge cases", () => {
    expect(() => utilityFunction(null)).toThrow();
    expect(utilityFunction([])).toBe(defaultValue);
  });

  test("performance within bounds", () => {
    const start = performance.now();
    utilityFunction(largeInput);
    const duration = performance.now() - start;

    expect(duration).toBeLessThan(10); // <10ms
  });
});
```

## System-Specific Testing

### Collection System

Detailed testing strategy for the collection system is documented in [Collection Testing Strategy](./collection/testing-strategy.md).

**Key Focus Areas**:

- Virtual scrolling performance
- Template engine functionality
- Element recycling efficiency
- Memory management

### Form Components

**Focus Areas**:

- Input validation
- Data binding
- Error handling
- Accessibility compliance

### UI Components

**Focus Areas**:

- Visual consistency
- Interaction patterns
- Responsive behavior
- Theme integration

### Utility Functions

**Focus Areas**:

- Edge case handling
- Performance benchmarks
- Type safety
- Error boundaries

## Test Coverage Goals

### Coverage Targets

- **Core Systems**: 100% line coverage
- **Components**: 95% line coverage
- **Utilities**: 90% line coverage
- **Integration**: 85% line coverage

### Quality Metrics

- **Performance**: Sub-second test execution for full suite
- **Reliability**: Zero flaky tests
- **Maintainability**: Clear test organization and naming
- **Documentation**: Every public API has test examples

## Performance Testing

### Benchmarking Framework

```typescript
// Performance test helper
export function measurePerformance<T>(
  name: string,
  fn: () => T,
  maxTime: number = 100
): T {
  const start = performance.now();
  const result = fn();
  const duration = performance.now() - start;

  expect(duration).toBeLessThan(maxTime);
  console.log(`${name}: ${duration.toFixed(2)}ms`);

  return result;
}

// Usage in tests
test("component renders efficiently", () => {
  measurePerformance(
    "Component render",
    () => {
      createComponent(config).render();
    },
    50
  ); // <50ms
});
```

### Performance Targets

- **Component Initialization**: <10ms
- **DOM Rendering**: <50ms
- **Complex Operations**: <100ms
- **Full Test Suite**: <10 seconds

## Test Execution

### Development Commands

```bash
# Run all tests
bun test

# Run specific system tests
bun test test/core/collection/
bun test test/components/forms/

# Run with watch mode
bun test --watch

# Run with coverage
bun test --coverage

# Run performance tests only
bun test --grep "Performance"
```

### CI/CD Integration

```yaml
# .github/workflows/test.yml
name: Test mtrl-addons

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

      - name: Run tests
        run: bun test

      - name: Run tests with coverage
        run: bun test --coverage

      - name: Performance benchmarks
        run: bun test --grep "Performance"

      - name: Build verification
        run: bun run build
```

## Test Utilities

### DOM Helpers

```typescript
// test/utils/dom-helpers.ts
export function createTestContainer(): HTMLElement {
  const container = document.createElement("div");
  container.style.height = "400px";
  container.style.overflow = "auto";
  document.body.appendChild(container);
  return container;
}

export function simulateUserInteraction(
  element: HTMLElement,
  type: "click" | "focus" | "input",
  value?: string
): void {
  switch (type) {
    case "click":
      element.click();
      break;
    case "focus":
      element.focus();
      break;
    case "input":
      if (element instanceof HTMLInputElement) {
        element.value = value || "";
        element.dispatchEvent(new Event("input", { bubbles: true }));
      }
      break;
  }
}
```

### Component Helpers

```typescript
// test/utils/component-helpers.ts
export function mountComponent<T>(
  component: T,
  container: HTMLElement = createTestContainer()
): { component: T; container: HTMLElement; unmount: () => void } {
  // Mount component logic

  return {
    component,
    container,
    unmount: () => container.remove(),
  };
}

export function testComponentAccessibility(element: HTMLElement): void {
  // Basic accessibility checks
  expect(element.getAttribute("role")).toBeDefined();
  expect(element.getAttribute("aria-label")).toBeTruthy();
}
```

## Best Practices

### Test Writing Guidelines

1. **Descriptive Names**: Tests should clearly describe what they verify
2. **Single Responsibility**: Each test should verify one specific behavior
3. **Arrange-Act-Assert**: Clear separation of setup, execution, and verification
4. **Cleanup**: Always clean up resources in `afterEach` or `afterAll`
5. **Performance Awareness**: Include timing assertions for critical paths

### Mock Strategy

1. **External Dependencies**: Mock all external APIs and services
2. **Heavy Operations**: Mock expensive computations and DOM operations
3. **Time-Dependent Code**: Mock timers and date functions
4. **Network Requests**: Mock all HTTP requests and responses

### Error Testing

1. **Edge Cases**: Test null, undefined, empty, and boundary values
2. **Error Conditions**: Verify proper error handling and messages
3. **Recovery**: Test system recovery from error states
4. **User Feedback**: Ensure errors provide helpful user feedback

## Maintenance

### Regular Tasks

- **Weekly**: Review test execution times and optimize slow tests
- **Monthly**: Update test coverage reports and address gaps
- **Quarterly**: Evaluate testing tools and patterns for improvements
- **Per Release**: Comprehensive performance regression testing

### Continuous Improvement

- Monitor test execution performance over time
- Identify and eliminate flaky tests
- Refactor common patterns into reusable utilities
- Update testing patterns based on community best practices

## Migration Guide

### From Jest to Bun Test

If migrating existing tests from Jest:

1. **Import Changes**: Replace `@jest` imports with `bun:test`
2. **Mock Syntax**: Update mock syntax to Bun's format
3. **Setup Files**: Update test setup configuration
4. **Coverage**: Adjust coverage configuration for Bun
5. **Performance**: Take advantage of Bun's speed improvements

### Adding New Test Categories

When adding new types of components or systems:

1. **Create Directory**: Add appropriate test directory structure
2. **Establish Patterns**: Define testing patterns for the new category
3. **Add Utilities**: Create category-specific test utilities
4. **Document**: Update this strategy document with new patterns
5. **Examples**: Provide reference implementations

---

This testing strategy ensures comprehensive coverage across all mtrl-addons components while maintaining the performance and developer experience benefits of our modern testing stack.
