# Rendering Feature

The rendering feature is responsible for efficiently updating the DOM with visible items. It manages element creation, recycling, positioning, and content updates while maintaining optimal performance.

## Overview

The rendering feature provides:

- **Efficient DOM Updates** - Only updates what has changed
- **Element Recycling** - Reuses DOM elements to minimize allocations
- **Position Management** - Absolutely positions items in virtual space
- **Content Updates** - Updates item content using templates
- **Placeholder Replacement** - Seamlessly replaces placeholders with real data
- **Batch Rendering** - Groups updates for better performance

## Core Concepts

### Element Recycling

Instead of creating and destroying DOM elements as items scroll in and out of view, the rendering feature maintains a pool of reusable elements:

```
1. Item scrolls out of view → Element added to recycle pool
2. New item scrolls into view → Element taken from pool or created
3. Element content updated with new item data
4. Element repositioned in virtual space
```

### Absolute Positioning

All items are absolutely positioned within the items container:

```css
.viewport-item {
  position: absolute;
  top: 0;
  left: 0;
  transform: translateY(1000px); /* Or translateX for horizontal */
}
```

This allows precise control over item placement without affecting other items.

### Render Cycles

Rendering happens in cycles to batch DOM operations:

```
1. Calculate what needs rendering
2. Get or create elements
3. Update content
4. Update positions
5. Recycle hidden elements
6. Update metrics
```

## Implementation

### Feature Structure

```typescript
export const withRendering = (config: RenderingConfig = {}) => {
  return <T extends ViewportContext & ViewportComponent>(component: T): T => {
    const {
      maxPoolSize = VIEWPORT_CONSTANTS.RENDERING.DEFAULT_MAX_POOL_SIZE,
      batchSize = 100,
      recycleStrategy = "lru",
    } = config;

    // State
    const renderedElements = new Map<number, HTMLElement>();
    const recyclePool: HTMLElement[] = [];
    const collectionItems: any[] = [];
    let renderFrame: number | null = null;

    // Implementation...
  };
};
```

### Render Process

```typescript
const renderItems = () => {
  const range = viewportState.visibleRange;
  if (!range || range.start > range.end) return;

  // Phase 1: Identify items to render
  const toRender = new Set<number>();
  for (let i = range.start; i <= range.end; i++) {
    toRender.add(i);
  }

  // Phase 2: Recycle elements outside range
  for (const [index, element] of renderedElements) {
    if (!toRender.has(index)) {
      recycleElement(element);
      renderedElements.delete(index);
    }
  }

  // Phase 3: Render new items
  for (const index of toRender) {
    if (!renderedElements.has(index)) {
      renderItem(index);
    }
  }

  // Phase 4: Update positions
  updateItemPositions();

  // Phase 5: Emit completion event
  component.emit?.("viewport:items-rendered", {
    range,
    renderedCount: renderedElements.size,
    poolSize: recyclePool.length,
  });
};
```

### Item Rendering

```typescript
const renderItem = (index: number) => {
  const item = collectionItems[index];
  if (!item) return;

  // Get or create element
  let element = getRecycledElement();
  if (!element) {
    element = createItemElement();
  }

  // Update content
  updateElementContent(element, item, index);

  // Position element
  positionElement(element, index);

  // Track rendered element
  renderedElements.set(index, element);

  // Add to DOM if needed
  if (!element.parentNode) {
    itemsContainer.appendChild(element);
  }
};
```

### Element Recycling

```typescript
const recycleElement = (element: HTMLElement) => {
  // Clean up element
  element.style.display = "none";
  element.className = "viewport-item viewport-item--recycled";

  // Add to pool if not full
  if (recyclePool.length < maxPoolSize) {
    recyclePool.push(element);
  } else {
    // Remove from DOM if pool is full
    element.remove();
  }
};

const getRecycledElement = (): HTMLElement | null => {
  if (recyclePool.length === 0) return null;

  const element = recyclePool.pop()!;
  element.style.display = "";
  element.className = "viewport-item";

  return element;
};
```

## Content Updates

### Template Integration

The rendering feature uses templates to generate item content:

```typescript
const updateElementContent = (
  element: HTMLElement,
  item: any,
  index: number
) => {
  // Check if placeholder
  if (isPlaceholder(item)) {
    element.classList.add("viewport-item--placeholder");
  } else {
    element.classList.remove("viewport-item--placeholder");
  }

  // Get template result
  const template = component.template || defaultTemplate;
  const content = template(item, index);

  // Update element
  if (typeof content === "string") {
    element.innerHTML = content;
  } else if (content instanceof HTMLElement) {
    element.innerHTML = "";
    element.appendChild(content);
  }

  // Set data attributes
  element.dataset.index = String(index);
  element.dataset.itemId = item.id || String(index);
};
```

### Placeholder Replacement

When real data arrives, placeholders are seamlessly replaced:

```typescript
component.on?.("collection:range-loaded", (data: any) => {
  if (!data.items?.length) return;

  // Update collection items
  data.items.forEach((item: any, i: number) => {
    const index = data.offset + i;
    const oldItem = collectionItems[index];
    collectionItems[index] = item;

    // Replace placeholder in DOM if rendered
    if (oldItem && isPlaceholder(oldItem) && renderedElements.has(index)) {
      const element = renderedElements.get(index);
      if (element) {
        updateElementContent(element, item, index);
      }
    }
  });

  // Trigger re-render if needed
  scheduleRender();
});
```

## Position Management

### Absolute Positioning

Items are positioned using CSS transforms for better performance:

```typescript
const positionElement = (element: HTMLElement, index: number) => {
  const offset = getItemOffset(index);

  if (orientation === "vertical") {
    element.style.transform = `translateY(${offset}px)`;
    element.style.width = "100%";
  } else {
    element.style.transform = `translateX(${offset}px)`;
    element.style.height = "100%";
  }
};

const getItemOffset = (index: number): number => {
  // Simple calculation for fixed size
  return index * viewportState.itemSize;

  // For variable sizes, use accumulated heights
  // return itemSizeManager.getOffset(index);
};
```

### Batch Position Updates

Position updates are batched for performance:

```typescript
const updateItemPositions = () => {
  const updates: Array<{ element: HTMLElement; offset: number }> = [];

  // Collect all position updates
  for (const [index, element] of renderedElements) {
    const offset = getItemOffset(index);
    updates.push({ element, offset });
  }

  // Apply in single batch
  requestAnimationFrame(() => {
    updates.forEach(({ element, offset }) => {
      if (orientation === "vertical") {
        element.style.transform = `translateY(${offset}px)`;
      } else {
        element.style.transform = `translateX(${offset}px)`;
      }
    });
  });
};
```

## Performance Optimizations

### Render Scheduling

Renders are scheduled using requestAnimationFrame:

```typescript
const scheduleRender = () => {
  if (renderFrame !== null) return;

  renderFrame = requestAnimationFrame(() => {
    renderFrame = null;
    renderItems();
  });
};

const cancelScheduledRender = () => {
  if (renderFrame !== null) {
    cancelAnimationFrame(renderFrame);
    renderFrame = null;
  }
};
```

### Batch Size Limiting

Large renders are split into batches:

```typescript
const renderItemsBatched = async () => {
  const range = viewportState.visibleRange;
  const total = range.end - range.start + 1;

  for (let i = 0; i < total; i += batchSize) {
    const batchStart = range.start + i;
    const batchEnd = Math.min(batchStart + batchSize - 1, range.end);

    renderBatch(batchStart, batchEnd);

    // Yield to browser
    await new Promise((resolve) => setTimeout(resolve, 0));
  }
};
```

### DOM Write Batching

All DOM writes are batched together:

```typescript
const batchDOMWrites = (writes: Array<() => void>) => {
  requestAnimationFrame(() => {
    writes.forEach((write) => write());
  });
};
```

## API

### Configuration Options

```typescript
interface RenderingConfig {
  maxPoolSize?: number; // Max recycled elements (default: 100)
  batchSize?: number; // Items per render batch (default: 100)
  recycleStrategy?: "lru" | "fifo"; // Recycling strategy
  renderThrottle?: number; // Min time between renders (ms)
}
```

### Methods

#### `render()`

Triggers a render cycle.

```typescript
viewport.render();
// Renders current visible range
```

#### `renderRange(start: number, end: number)`

Renders a specific range of items.

```typescript
viewport.renderRange(0, 50);
// Renders items 0-50
```

#### `recycleElement(element: HTMLElement)`

Adds an element to the recycle pool.

```typescript
const element = document.querySelector(".old-item");
viewport.recycleElement(element);
```

#### `clearRecyclePool()`

Empties the recycle pool.

```typescript
viewport.clearRecyclePool();
// Frees memory
```

#### `getRenderedElements(): Map<number, HTMLElement>`

Returns currently rendered elements.

```typescript
const elements = viewport.getRenderedElements();
console.log(`Rendering ${elements.size} items`);
```

## Events

### Emitted Events

#### `viewport:items-rendered`

Fired after render completes. Includes rendered elements for features like auto-size detection.

```typescript
{
  elements: HTMLElement[];      // Array of rendered DOM elements
  range: { start: number; end: number };
  renderedCount: number;
  poolSize: number;
  renderTime?: number;
}
```

This event is crucial for the auto-size detection feature, which measures the `elements` array to determine actual item sizes.

#### `viewport:rendered`

Fired after render completes (legacy event for backward compatibility).

```typescript
{
  range: { start: number; end: number };
  renderedCount: number;
  poolSize: number;
  renderTime?: number;
}
```

### Listened Events

- `viewport:range-changed` - Triggers render for new range
- `collection:range-loaded` - Updates content for loaded items
- `viewport:items-changed` - Re-renders if total changes

## Integration with Other Features

### Virtual Feature

Provides the visible range to render:

```typescript
component.on?.("viewport:range-changed", (range) => {
  scheduleRender();
});
```

### Collection Feature

Provides the data to render:

```typescript
component.on?.("collection:range-loaded", (data) => {
  updateCollectionItems(data);
  scheduleRender();
});
```

### Template Feature

Provides the rendering template:

```typescript
const content = component.template(item, index);
element.innerHTML = content;
```

## CSS Classes

The rendering feature uses these CSS classes:

```css
/* Base item class */
.viewport-item {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%; /* For vertical scrolling */
}

/* Placeholder state */
.viewport-item--placeholder {
  opacity: 0.6;
}

/* Recycled state */
.viewport-item--recycled {
  display: none;
}

/* Loading state */
.viewport-item--loading {
  pointer-events: none;
  opacity: 0.5;
}
```

## Memory Management

### Pool Size Management

```typescript
const maintainPoolSize = () => {
  // Trim pool if too large
  while (recyclePool.length > maxPoolSize) {
    const element = recyclePool.shift();
    element?.remove();
  }

  // Pre-populate pool if needed
  while (recyclePool.length < minPoolSize) {
    const element = createItemElement();
    element.style.display = "none";
    recyclePool.push(element);
  }
};
```

### Memory Leak Prevention

```typescript
const cleanup = () => {
  // Clear rendered elements
  for (const element of renderedElements.values()) {
    element.remove();
  }
  renderedElements.clear();

  // Clear recycle pool
  for (const element of recyclePool) {
    element.remove();
  }
  recyclePool.length = 0;

  // Clear references
  collectionItems.length = 0;
};
```

## Troubleshooting

### Items Not Appearing

```typescript
// Check render state
console.log("Visible range:", viewportState.visibleRange);
console.log("Rendered elements:", renderedElements.size);
console.log("Items available:", collectionItems.length);
```

### Placeholder Not Replaced

```typescript
// Verify replacement logic
component.on?.("collection:range-loaded", (data) => {
  console.log("Data loaded:", data);
  console.log("Placeholders replaced:", replacedCount);
});
```

### Performance Issues

```typescript
// Monitor render performance
let renderCount = 0;
let totalRenderTime = 0;

const renderWithMetrics = () => {
  const start = performance.now();
  renderItems();
  const time = performance.now() - start;

  renderCount++;
  totalRenderTime += time;

  if (time > 16) {
    console.warn(`Slow render: ${time}ms`);
  }
};
```

## Best Practices

1. **Optimize Templates** - Keep templates simple and fast
2. **Batch Operations** - Group DOM updates together
3. **Manage Pool Size** - Balance memory vs allocation cost
4. **Use CSS Transforms** - Better performance than top/left
5. **Avoid Force Reflow** - Don't read layout during writes

## Example Usage

```typescript
// Configure rendering
const viewport = pipe(
  withBase(),
  withVirtual(),
  withRendering({
    maxPoolSize: 50, // Smaller pool for mobile
    batchSize: 50, // Smaller batches
    renderThrottle: 16, // 60fps max
  })
)(component);

// Custom template
viewport.template = (item, index) => `
  <div class="list-item">
    <span class="index">${index}</span>
    <span class="title">${item.title}</span>
  </div>
`;

// Monitor rendering
viewport.on("viewport:items-rendered", (e) => {
  console.log(
    `Rendered ${e.renderedCount} items in range ${e.range.start}-${e.range.end}`
  );
});
```
