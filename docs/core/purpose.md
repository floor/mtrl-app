# mtrl Core Modules Overview

## Purpose

This document provides a comprehensive overview of the existing core modules in `mtrl/src/core` that can be leveraged by the new collection system in `mtrl-addons`. The goal is to maximize code reuse, maintain consistency, and avoid duplication.

## Available Core Modules

### 1. Composition System (`core/compose`)

**Files**: `pipe.ts`, `component.ts`, `base.ts`, `features/`

**Key Utilities**:

- `pipe()` - Left-to-right function composition (exactly what we need!)
- `compose()` - Right-to-left function composition
- `transform()` - Object transformation with shared context
- `withElement()` - Element creation and DOM attachment
- Rich feature library in `features/` directory

**Features Available**:

- `withEvents()` - Event handling capabilities
- `withLifecycle()` - Component lifecycle management
- `withDebounce()` - Debounced event handling
- `withThrottle()` - Throttled event handling
- `withGestures()` - Gesture recognition
- `withRipple()` - Material ripple effects
- `withDisabled()` - Disabled state management
- `withText()` - Text content management
- `withIcon()` - Icon management
- `withVariant()` - Visual variant styles
- `withSize()` - Size variants

**Collection Usage**:

```typescript
import { pipe } from "mtrl/core/compose";
import { withEvents } from "mtrl/core/compose/features";

const collection = pipe(
  createBaseCollection,
  withEvents(),
  withVirtualScrolling(config),
  withPagination(config)
)(config);
```

### 2. DOM Utilities (`core/dom`)

**Files**: `create.ts`, `classes.ts`, `attributes.ts`, `events.ts`, `utils.ts`

**Key Utilities**:

- `createElement()` - Enhanced element creation with attributes, classes, events
- `createSVGElement()` - SVG element creation with proper namespacing
- `addClass()` - Automatic prefixing with `mtrl-` prefix
- `removeClass()` - Class removal utilities
- `setAttributes()` - Attribute setting with validation
- `createEventManager()` - DOM event management with cleanup
- `normalizeClasses()` - Class name normalization and deduplication

**Advanced Features**:

- Event forwarding and conditional handling
- Automatic cleanup for memory management
- BEM class name conventions support
- Raw class support (no prefixing)

**Collection Usage**:

```typescript
import { createElement, addClass } from "mtrl/core/dom";

// Create collection container with proper classes
const container = createElement({
  tag: "div",
  className: ["collection", "collection--virtual"],
  attributes: { role: "list" },
});
```

### 3. State Management (`core/state`)

**Files**: `store.ts`, `emitter.ts`, `lifecycle.ts`, `events.ts`, `disabled.ts`

**Key Utilities**:

- `createStore()` - Reactive state management with middleware
- `createEmitter()` - Event emitter with subscription management
- `createLifecycle()` - Component lifecycle (mount/unmount/destroy)
- `createEventManager()` - Component event handling
- `createDisabled()` - Disabled state management

**Store Features**:

- Derived state computations
- Middleware support for logging, validation, etc.
- State selectors
- Subscription management with automatic cleanup

**Collection Usage**:

```typescript
import { createStore, createEmitter } from "mtrl/core/state";

// Collection state management
const state = createStore({
  items: [],
  loading: false,
  visibleRange: { start: 0, end: 0 },
  scrollTop: 0,
});

// Event system for collection changes
const emitter = createEmitter();
```

### 4. Performance Utilities (`core/utils`)

**Files**: `performance.ts`, `validate.ts`, `mobile.ts`, `object.ts`, `color.ts`, `background.ts`

**Key Utilities**:

- `throttle()` - Throttle high-frequency events (scroll, resize)
- `debounce()` - Debounce rapid-fire events (input, search)
- `once()` - Execute function only once
- `validateConfig()` - Configuration validation with schemas
- `normalizeEvent()` - Cross-platform event normalization
- `hasTouchSupport()` - Device capability detection
- `isObject()` - Type checking utilities
- `byString()` - Deep object property access

**Collection Usage**:

```typescript
import { throttle, validateConfig } from "mtrl/core/utils";

// Throttled scroll handler
const handleScroll = throttle((e) => {
  updateVisibleItems(e.target.scrollTop);
}, 16); // 60fps

// Configuration validation
validateConfig(userConfig, collectionSchema);
```

### 5. Layout System (`core/layout`)

**Files**: `create.ts`, `types.ts`, `config.ts`, `utils.ts`, `processor.ts`

**Key Utilities**:

- `createLayout()` - Dynamic layout creation from schemas
- `applyLayoutClasses()` - Automatic layout class application
- `isComponent()` - Component type detection
- `flattenLayout()` - Layout hierarchy flattening
- Support for grid, flexbox, and custom layouts

**Layout Types**:

- Stack layouts (vertical)
- Row layouts (horizontal)
- Grid layouts (2D grid)
- Responsive breakpoints
- Mobile-first responsive design

**Collection Usage**:

```typescript
import { createLayout } from "mtrl/core/layout";

// Create collection layout structure
const layout = createLayout({
  element: { creator: "div", options: { className: "collection" } },
  header: { creator: "div", options: { className: "collection__header" } },
  viewport: { creator: "div", options: { className: "collection__viewport" } },
  items: { creator: "div", options: { className: "collection__items" } },
});
```

### 6. Configuration System (`core/config`)

**Files**: `component.ts`, `global.ts`

**Key Utilities**:

- `createComponentConfig()` - Component configuration with global defaults
- `setGlobalDefaults()` - Global configuration management
- `createClassName()` - BEM class name generation
- `processClassNames()` - Class name processing and normalization

**Collection Usage**:

```typescript
import { createComponentConfig, createClassName } from "mtrl/core/config";

// Component configuration with global defaults
const config = createComponentConfig(defaults, userConfig, "collection");

// BEM class names
const itemClass = createClassName("collection", "item", "selected");
// Result: 'mtrl-collection__item--selected'
```

### 7. Gesture Recognition (`core/gestures`)

**Files**: `manager.ts`, `types.ts`, `utils.ts`, `tap.ts`, `swipe.ts`, `pan.ts`, `pinch.ts`

**Key Utilities**:

- `createGestureManager()` - Unified gesture recognition
- Support for tap, swipe, pan, pinch, rotate, long press
- Cross-platform event handling (mouse, touch, pointer)
- Configurable thresholds and timing

**Gesture Types**:

- Tap (single, double)
- Swipe (all directions)
- Pan (drag)
- Pinch (zoom)
- Rotate
- Long press

**Collection Usage**:

```typescript
import { createGestureManager } from "mtrl/core/gestures";

// Add gesture support to collection items
const gestures = createGestureManager(itemElement, {
  swipeThreshold: 50,
  longPressTime: 500,
});

gestures.on("swipe", handleItemSwipe);
gestures.on("longpress", handleItemMenu);
```

## Integration Strategy for Collection System

### 1. Core Dependencies to Use

**Essential**:

- `core/compose` - For functional composition pattern
- `core/dom` - For element creation and manipulation
- `core/state` - For state management and events
- `core/utils/performance` - For throttle/debounce

**Optional**:

- `core/gestures` - For touch interactions
- `core/layout` - For complex layout scenarios
- `core/config` - For configuration management

### 2. Import Strategy

```typescript
// In mtrl-addons/src/core/collection/utils/compose.ts
export { pipe } from "mtrl/core/compose";
export { withEvents, withLifecycle } from "mtrl/core/compose/features";

// In mtrl-addons/src/core/collection/utils/dom.ts
export { createElement, addClass } from "mtrl/core/dom";

// In mtrl-addons/src/core/collection/utils/state.ts
export { createStore, createEmitter } from "mtrl/core/state";

// In mtrl-addons/src/core/collection/utils/performance.ts
export { throttle, debounce } from "mtrl/core/utils";
```

### 3. Consistent Architecture

**Follow mtrl Patterns**:

- Use same BEM naming conventions
- Apply consistent prefixing (`mtrl-collection`)
- Follow same component lifecycle patterns
- Use same event naming conventions

**Example Collection Component**:

```typescript
import { pipe } from "mtrl/core/compose";
import { withEvents, withLifecycle } from "mtrl/core/compose/features";
import { createElement } from "mtrl/core/dom";
import { createStore } from "mtrl/core/state";
import { throttle } from "mtrl/core/utils";

const createCollection = (config: CollectionConfig) => {
  return pipe(
    createBaseCollection,
    withEvents(),
    withLifecycle(),
    withVirtualScrolling(config),
    withPagination(config)
  )(config);
};
```

## Benefits of Using mtrl Core

### 1. Code Reuse

- **Reduced Bundle Size**: Shared utilities across mtrl and mtrl-addons
- **Consistent Behavior**: Same patterns for all components
- **Tested Code**: Core utilities are already battle-tested

### 2. Developer Experience

- **Familiar Patterns**: Developers already know these utilities
- **Type Safety**: Full TypeScript support with existing types
- **Documentation**: Core utilities are already documented

### 3. Maintenance

- **Bug Fixes**: Core improvements benefit all components
- **Feature Additions**: New core features available immediately
- **Consistency**: Automatic alignment with mtrl design system

## Recommended Core Utilities for Collection

### Must Use

1. **`pipe`** - Core composition pattern
2. **`createElement`** - Element creation
3. **`addClass`** - Class management
4. **`throttle`** - Scroll performance
5. **`createStore`** - State management
6. **`createEmitter`** - Event system

### Should Use

1. **`withLifecycle`** - Component lifecycle
2. **`withEvents`** - Event handling
3. **`debounce`** - Input handling
4. **`validateConfig`** - Configuration validation

### Could Use

1. **`createGestureManager`** - Touch interactions
2. **`createLayout`** - Complex layouts
3. **`normalizeEvent`** - Cross-platform events

## Conclusion

The mtrl core modules provide a rich foundation for building the collection system. By leveraging these existing utilities, the collection system will:

- Maintain consistency with the broader mtrl ecosystem
- Reduce development time and bundle size
- Benefit from ongoing improvements to core utilities
- Provide familiar patterns for developers

The functional composition pattern using `pipe` is especially well-suited for the modular collection architecture, allowing features to be composed exactly as needed while maintaining type safety and performance.
