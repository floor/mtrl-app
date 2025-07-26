# Base Feature

The base feature provides the foundation for all viewport functionality. It creates the DOM structure, manages the component lifecycle, and establishes the infrastructure that other features build upon.

## Overview

The base feature is **always the first feature applied** because it:

- Creates the essential DOM structure
- Sets up the viewport container hierarchy
- Initializes the shared state object
- Coordinates feature initialization
- Manages cleanup on destruction

Without the base feature, no other features can function properly.

## Architecture

### DOM Structure

The base feature creates a three-layer DOM hierarchy:

```html
<div class="viewport" style="position: relative; overflow: auto;">
  <!-- Virtual container: Sets scrollable size -->
  <div class="viewport__virtual-container" style="position: relative;">
    <!-- Items container: Holds rendered items -->
    <div class="viewport__items-container" style="position: relative;">
      <!-- Items will be rendered here -->
    </div>
  </div>
</div>
```

### Layer Responsibilities

1. **Viewport Container** (`.viewport`)
   - The scrollable container
   - Has `overflow: auto` for scrolling
   - Fixed size (viewport dimensions)
   - Captures scroll events

2. **Virtual Container** (`.viewport__virtual-container`)
   - Sets the total scrollable area
   - Height/width represents all items
   - Enables browser scrollbar
   - Never contains actual content

3. **Items Container** (`.viewport__items-container`)
   - Holds the rendered item elements
   - Items are absolutely positioned
   - Transforms for smooth scrolling
   - Recycled elements live here

## Implementation

### Feature Application

```typescript
export const withBase = (config: BaseConfig = {}) => {
  return <T extends ViewportContext>(component: T): T => {
    const { className = "viewport", orientation = "vertical" } = config;

    // Store original initialize
    const originalInitialize = component.initialize;

    // Create enhanced initialize
    component.initialize = () => {
      // Create DOM structure
      createViewportStructure(component, className, orientation);

      // Initialize shared state
      initializeViewportState(component);

      // Call original initialize
      originalInitialize?.();

      // Notify other features
      component.emit?.("viewport:initialized");
    };

    return component;
  };
};
```

### DOM Creation Process

```typescript
const createViewportStructure = (component, className, orientation) => {
  const container = component.container;

  // 1. Setup viewport container
  container.classList.add(className);
  container.style.position = "relative";
  container.style.overflow = "auto";

  // 2. Create virtual container
  const virtualContainer = document.createElement("div");
  virtualContainer.className = `${className}__virtual-container`;
  virtualContainer.style.position = "relative";

  // 3. Create items container
  const itemsContainer = document.createElement("div");
  itemsContainer.className = `${className}__items-container`;
  itemsContainer.style.position = "relative";

  // 4. Build hierarchy
  virtualContainer.appendChild(itemsContainer);
  container.appendChild(virtualContainer);

  // 5. Store references
  component.viewportElement = container;
  component.virtualContainer = virtualContainer;
  component.itemsContainer = itemsContainer;
};
```

### State Initialization

```typescript
const initializeViewportState = (component) => {
  // Create shared state object
  const state = {
    // Scroll state
    scrollPosition: 0,
    velocity: 0,
    scrollDirection: "forward",

    // Size state
    containerSize: 0,
    estimatedItemSize: config.estimatedItemSize || 100,
    virtualTotalSize: 0,

    // Range state
    visibleRange: { start: 0, end: 0 },
    totalItems: 0,

    // DOM references
    viewportElement: component.viewportElement,
    itemsContainer: component.itemsContainer,
    virtualContainer: component.virtualContainer,
  };

  // Make state accessible to all features
  (component.viewport as any).state = state;
};
```

## API

### Configuration Options

```typescript
interface BaseConfig {
  className?: string; // CSS class prefix (default: "viewport")
  orientation?: "vertical" | "horizontal"; // Scroll direction
  debug?: boolean; // Enable debug logging
}
```

### Methods Added

The base feature adds these methods to the viewport API:

#### `getContainer(): HTMLElement`

Returns the viewport container element.

```typescript
const container = viewport.getContainer();
container.addEventListener("custom-event", handler);
```

#### `getItemsContainer(): HTMLElement`

Returns the items container element where items are rendered.

```typescript
const itemsContainer = viewport.getItemsContainer();
// Items are children of this element
```

#### `getVirtualContainer(): HTMLElement`

Returns the virtual container that sets scrollable size.

```typescript
const virtualContainer = viewport.getVirtualContainer();
virtualContainer.style.height = `${totalSize}px`;
```

#### `setOrientation(orientation: "vertical" | "horizontal")`

Changes the viewport orientation.

```typescript
viewport.setOrientation("horizontal");
// Updates CSS and internal state
```

### Properties Added

The base feature adds these properties to the component:

- `viewportElement` - The main viewport container
- `virtualContainer` - The virtual size container
- `itemsContainer` - The items container
- `viewport.state` - The shared state object

## Lifecycle Management

### Initialization Order

1. **Store Original Methods** - Preserves existing functionality
2. **Create DOM Structure** - Builds the container hierarchy
3. **Initialize State** - Creates shared state object
4. **Setup Event Listeners** - Prepares for other features
5. **Call Original Initialize** - Runs any existing initialization
6. **Emit Initialized Event** - Notifies other features

### Cleanup Process

```typescript
component.destroy = () => {
  // 1. Emit destroy event for other features
  component.emit?.("viewport:destroy");

  // 2. Clean up DOM
  if (component.virtualContainer) {
    component.virtualContainer.remove();
  }

  // 3. Clear references
  component.viewportElement = null;
  component.virtualContainer = null;
  component.itemsContainer = null;

  // 4. Clear state
  if (component.viewport) {
    (component.viewport as any).state = null;
  }

  // 5. Call original destroy
  originalDestroy?.();
};
```

## Integration with Other Features

### How Other Features Use Base

1. **Virtual Feature**
   - Uses `virtualContainer` to set scrollable size
   - Reads container dimensions from state
   - Updates virtual size in state

2. **Scrolling Feature**
   - Attaches listeners to `viewportElement`
   - Updates scroll position in state
   - Reads container size for calculations

3. **Rendering Feature**
   - Renders items into `itemsContainer`
   - Positions items absolutely
   - Manages element recycling

4. **Events Feature**
   - Uses base initialization to setup
   - Relies on lifecycle hooks
   - Coordinates through base structure

### Initialization Wrapper

The base feature provides a wrapper for safe initialization:

```typescript
export const wrapInitialize = (component, initFn) => {
  const original = component.initialize;
  component.initialize = () => {
    original?.();
    initFn();
  };
};
```

This ensures features initialize in the correct order.

## CSS Classes

The base feature applies these CSS classes:

### Default Classes

```css
.viewport {
  position: relative;
  overflow: auto;
  /* Customize size, borders, etc. */
}

.viewport__virtual-container {
  position: relative;
  /* Sets scrollable area size */
}

.viewport__items-container {
  position: relative;
  /* Contains positioned items */
}
```

### Custom Class Prefix

```typescript
const viewport = createViewport({
  className: "viewport",
});

// Results in:
// .my-list
// .my-list__virtual-container
// .my-list__items-container
```

## Orientation Support

### Vertical Orientation (Default)

```typescript
// Vertical scrolling setup
if (orientation === "vertical") {
  virtualContainer.style.width = "100%";
  virtualContainer.style.height = `${virtualSize}px`;
  itemsContainer.style.width = "100%";
}
```

### Horizontal Orientation

```typescript
// Horizontal scrolling setup
if (orientation === "horizontal") {
  virtualContainer.style.height = "100%";
  virtualContainer.style.width = `${virtualSize}px`;
  itemsContainer.style.height = "100%";
  container.style.overflowX = "auto";
  container.style.overflowY = "hidden";
}
```

## State Management

### Shared State Object

All features access the same state object:

```typescript
interface ViewportState {
  // Managed by base
  viewportElement: HTMLElement;
  virtualContainer: HTMLElement;
  itemsContainer: HTMLElement;

  // Updated by various features
  scrollPosition: number;
  velocity: number;
  containerSize: number;
  virtualTotalSize: number;
  visibleRange: ItemRange;
  // ... more properties
}
```

### State Access Pattern

```typescript
// In any feature
const getViewportState = (component) => {
  return (component.viewport as any).state;
};

// Usage
const state = getViewportState(component);
state.scrollPosition = 100;
```

## Performance Considerations

1. **Minimal DOM Operations** - Structure created once
2. **No Content Rendering** - Only creates containers
3. **Efficient References** - Direct element access
4. **Clean Separation** - Each layer has one job

## Troubleshooting

### Container Not Found

```typescript
// Error: Cannot read property 'style' of null
// Solution: Ensure container exists
if (!component.container) {
  throw new Error("Viewport requires a container element");
}
```

### Features Not Initializing

```typescript
// Check initialization order
console.log("Base initialized:", !!component.viewportElement);
console.log("State initialized:", !!component.viewport?.state);
```

### CSS Issues

```css
/* Ensure viewport has size */
.viewport {
  width: 100%;
  height: 400px; /* Or specific height */
}

/* Fix scrolling issues */
.viewport {
  overflow: auto !important;
}
```

## Best Practices

1. **Always Apply First** - Base must be the first feature
2. **Check References** - Ensure DOM elements exist
3. **Use State Object** - Don't create separate state
4. **Clean Up Properly** - Remove elements and references
5. **Respect Orientation** - Handle both vertical and horizontal

## Example Usage

```typescript
import { withBase } from "mtrl-addons/core/viewport/features";

// Apply base feature
const ViewportWithBase = withBase({
  className: "my-viewport",
  orientation: "vertical",
})(Component);

// Access base functionality
const instance = ViewportWithBase({
  container: document.getElementById("list"),
});

// Use base API
const itemsContainer = instance.getItemsContainer();
console.log("Items container:", itemsContainer);

// Access shared state
const state = (instance.viewport as any).state;
console.log("Current state:", state);
```
