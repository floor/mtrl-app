# Virtual Feature

> **Created:** June 2025
> **Updated:** December 29, 2025

The virtual feature is the mathematical brain of the viewport. It calculates which items should be visible, manages the virtual scrollable space, and handles space compression for extremely large datasets.

## Overview

The virtual feature provides:

- **Visible Range Calculation** - Determines which items to render based on scroll position
- **Virtual Space Management** - Sets and updates the scrollable container size
- **Space Compression** - Handles datasets that exceed browser limits
- **Position Mapping** - Converts between item indices and pixel positions
- **Overscan Management** - Renders extra items outside the viewport for smooth scrolling

## Core Concepts

### Virtual Scrolling Mathematics

The fundamental equation of virtual scrolling:

```
Visible Start Index = floor(Scroll Position / Item Size)
Visible End Index = ceil((Scroll Position + Container Size) / Item Size)
```

With overscan:

```
Render Start = max(0, Visible Start - Overscan)
Render End = min(Total Items - 1, Visible End + Overscan)
```

### Virtual Space

The virtual space is the total scrollable area:

```
Virtual Size = Total Items × Estimated Item Size
```

This space is set on the virtual container, creating the scrollbar.

### Space Compression

When dealing with millions of items, the virtual size can exceed browser limits (typically 33-67 million pixels). The virtual feature automatically compresses the space:

```
If Virtual Size > MAX_VIRTUAL_SIZE:
  Compression Ratio = MAX_VIRTUAL_SIZE / Virtual Size
  Compressed Size = MAX_VIRTUAL_SIZE
```

### Automatic Item Size Detection

The virtual feature now includes intelligent item size detection that automatically measures rendered items to provide accurate virtual space calculations:

```typescript
// Auto-detection flow
1. Initial render with estimated size (default: 50px)
2. Measure actual rendered items
3. Calculate average item size
4. Update virtual space with accurate size
5. Re-render if positions changed significantly
```

#### How It Works

When `autoDetectItemSize` is enabled (default when no `itemSize` is provided):

1. **First Render**: Uses the initial estimate or default size
2. **Measurement**: After items are rendered, measures their actual sizes
3. **Calculation**: Computes the average size from all measured items
4. **Update**: Updates the internal `itemSize` with the measured value
5. **Re-calculation**: Updates virtual space and visible range with new size
6. **Event**: Emits `viewport:item-size-detected` with the new size

#### Benefits

- **No Configuration Required**: Works out of the box for most use cases
- **Accurate Scrolling**: Eliminates jumpy scrolling from incorrect estimates
- **Dynamic Content**: Adapts to content that varies slightly in size
- **Performance**: Only measures once on first render
- **Fallback**: Uses sensible defaults if measurement fails

#### Example

```typescript
// Auto-detection enabled by default
const viewport = createViewport({
  virtual: {
    overscan: 2,
    // No itemSize - will auto-detect
  },
});

// Listen for detection
viewport.on("viewport:item-size-detected", ({ detectedSize, previousSize }) => {
  console.log(`Item size updated: ${previousSize}px → ${detectedSize}px`);
});

// Force auto-detection even with initial estimate
const viewport = createViewport({
  virtual: {
    itemSize: 100, // Initial estimate
    autoDetectItemSize: true, // Force detection
  },
});
```

## Implementation

### Feature Structure

```typescript
export const withVirtual = (config: VirtualConfig = {}) => {
  return <T extends ViewportContext & ViewportComponent>(component: T): T => {
    const {
      overscan = VIEWPORT_CONSTANTS.VIRTUAL_SCROLL.OVERSCAN_BUFFER,
      maxVirtualSize = VIEWPORT_CONSTANTS.VIRTUAL_SCROLL.MAX_VIRTUAL_SIZE,
      minItemSize = 20,
      maxItemSize = 1000,
    } = config;

    let viewportState: ViewportState;
    let compressionRatio = 1;
    let isCompressed = false;

    // Feature implementation...
  };
};
```

### Visible Range Calculation

```typescript
const calculateVisibleRange = (): ItemRange => {
  const { scrollPosition, containerSize, itemSize, totalItems } = viewportState;

  if (totalItems === 0 || itemSize === 0) {
    return { start: 0, end: 0 };
  }

  // Calculate visible range
  const visibleStart = Math.floor(scrollPosition / itemSize);
  const visibleEnd = Math.ceil((scrollPosition + containerSize) / itemSize);

  // Apply overscan
  const start = Math.max(0, visibleStart - overscan);
  const end = Math.min(totalItems - 1, visibleEnd + overscan);

  return { start, end };
};
```

### Virtual Size Management

```typescript
const updateVirtualSize = () => {
  const { totalItems, itemSize } = viewportState;
  const actualSize = totalItems * itemSize;

  // Check if compression needed
  if (actualSize > maxVirtualSize) {
    isCompressed = true;
    compressionRatio = maxVirtualSize / actualSize;
    viewportState.virtualTotalSize = maxVirtualSize;
  } else {
    isCompressed = false;
    compressionRatio = 1;
    viewportState.virtualTotalSize = actualSize;
  }

  // Update DOM
  const virtualContainer = component.virtualContainer;
  if (virtualContainer) {
    if (orientation === "vertical") {
      virtualContainer.style.height = `${viewportState.virtualTotalSize}px`;
    } else {
      virtualContainer.style.width = `${viewportState.virtualTotalSize}px`;
    }
  }

  // Emit event
  component.emit?.("viewport:virtual-size-changed", {
    totalSize: viewportState.virtualTotalSize,
    actualSize,
    compressed: isCompressed,
    compressionRatio,
  });
};
```

## Space Compression

### How It Works

Space compression transparently maps between compressed and actual positions:

```typescript
// Map actual position to compressed virtual position
const mapToVirtualPosition = (actualPosition: number): number => {
  return actualPosition * compressionRatio;
};

// Map compressed virtual position to actual position
const mapToActualPosition = (virtualPosition: number): number => {
  return virtualPosition / compressionRatio;
};
```

### Example Scenario

With 1 million items of 100px each:

```
Actual Size = 1,000,000 × 100 = 100,000,000 pixels (100M)
Max Virtual Size = 10,000,000 pixels (10M)
Compression Ratio = 10M / 100M = 0.1

Virtual Container Height = 10M pixels
Item 500,000 actual position = 50M pixels
Item 500,000 virtual position = 50M × 0.1 = 5M pixels
```

### Benefits

1. **Browser Compatibility** - Works within browser limits
2. **Precise Scrolling** - Maintains accuracy despite compression
3. **Transparent** - Other features don't need to know about compression
4. **Automatic** - Activates only when needed

## API

### Configuration Options

```typescript
interface VirtualConfig {
  itemSize?: number; // Fixed item size in pixels (auto-detected if not provided)
  overscan?: number; // Items to render outside viewport (default: 2)
  autoDetectItemSize?: boolean; // Enable auto-detection (default: true if no itemSize)
  debug?: boolean; // Enable debug logging
}
```

### Methods

#### `calculateVisibleRange(): ItemRange`

Calculates which items should be visible based on current scroll position.

```typescript
const range = viewport.calculateVisibleRange();
console.log(`Showing items ${range.start} to ${range.end}`);
```

#### `updateVirtualSize()`

Updates the virtual container size based on total items and item size.

```typescript
// After items change
viewport.updateVirtualSize();
```

#### `getItemOffset(index: number): number`

Gets the pixel position of an item.

```typescript
const offset = viewport.getItemOffset(100);
// Returns pixel position for item 100
```

#### `getIndexAtOffset(offset: number): number`

Gets the item index at a pixel position.

```typescript
const index = viewport.getIndexAtOffset(5000);
// Returns which item is at pixel 5000
```

#### `getVirtualOffset(): number`

Gets the current virtual offset for the items container.

```typescript
const offset = viewport.getVirtualOffset();
// Use for transform positioning
```

#### `isCompressed(): boolean`

Returns whether space compression is active.

```typescript
if (viewport.isCompressed()) {
  console.log("Space compression active");
}
```

#### `getCompressionRatio(): number`

Returns the compression ratio (1.0 = no compression).

```typescript
const ratio = viewport.getCompressionRatio();
console.log(`Compression ratio: ${ratio}`);
```

## Events

### Emitted Events

#### `viewport:range-changed`

Fired when the visible range changes.

```typescript
{
  start: number; // First visible item
  end: number; // Last visible item
  overscan: number; // Overscan buffer size
}
```

#### `viewport:virtual-size-changed`

Fired when virtual size is updated.

```typescript
{
  totalSize: number; // Virtual container size
  actualSize: number; // Actual total size
  compressed: boolean; // Is compression active
  compressionRatio: number; // Compression ratio
}
```

#### `viewport:item-size-detected`

Fired when item size is automatically detected from rendered items.

```typescript
{
  detectedSize: number; // The measured average item size
  previousSize: number; // The previous item size
  itemCount: number; // Number of items measured
}
```

### Listened Events

- `viewport:items-changed` - Updates virtual size when total items change
- `viewport:items-rendered` - Triggers auto-detection measurement when enabled
- `viewport:item-size-changed` - Recalculates when item size changes
- `viewport:container-resized` - Updates range when container resizes

## Integration with Other Features

### Scrolling Feature

The scrolling feature triggers range calculations:

```typescript
// On scroll
component.on?.("viewport:scroll", () => {
  const newRange = calculateVisibleRange();
  if (rangeChanged(oldRange, newRange)) {
    component.emit?.("viewport:range-changed", newRange);
  }
});
```

### Rendering Feature

The rendering feature uses the visible range:

```typescript
// Render only visible items
component.on?.("viewport:range-changed", (range) => {
  renderItemsInRange(range.start, range.end);
});
```

### Collection Feature

The collection feature loads data for visible ranges:

```typescript
// Load missing data
component.on?.("viewport:range-changed", (range) => {
  loadMissingItems(range.start, range.end);
});
```

## Performance Optimizations

### Range Change Detection

Only emit events when range actually changes:

```typescript
const rangeChanged = (oldRange: ItemRange, newRange: ItemRange): boolean => {
  return oldRange.start !== newRange.start || oldRange.end !== newRange.end;
};
```

### Calculation Caching

Cache expensive calculations:

```typescript
let cachedRange: ItemRange | null = null;
let cachedScrollPosition = -1;

const calculateVisibleRange = () => {
  if (cachedScrollPosition === scrollPosition && cachedRange) {
    return cachedRange;
  }

  // Calculate new range
  cachedRange = computeRange();
  cachedScrollPosition = scrollPosition;
  return cachedRange;
};
```

### Debounced Updates

Debounce virtual size updates:

```typescript
const debouncedUpdateSize = debounce(updateVirtualSize, 100);

component.on?.("viewport:items-changed", () => {
  debouncedUpdateSize();
});
```

## Edge Cases

### Zero Items

```typescript
if (totalItems === 0) {
  // Set minimum size to show empty state
  virtualContainer.style.height = `${containerSize}px`;
  return { start: 0, end: 0 };
}
```

### Variable Item Sizes

```typescript
// With variable sizes, use accumulated heights
const getItemOffset = (index: number): number => {
  if (hasVariableSizes) {
    return accumulatedHeights[index] || estimateOffset(index);
  }
  return index * itemSize;
};
```

### Fractional Indices

```typescript
// Always use floor/ceil for indices
const start = Math.floor(scrollPosition / itemSize);
const end = Math.ceil((scrollPosition + containerSize) / itemSize);
```

## Troubleshooting

### Items Not Showing

```typescript
// Check calculations
console.log("Scroll position:", scrollPosition);
console.log("Container size:", containerSize);
console.log("Item size:", itemSize);
console.log("Calculated range:", calculateVisibleRange());
```

### Scrollbar Wrong Size

```typescript
// Verify virtual size
console.log("Total items:", totalItems);
console.log("Virtual size:", virtualTotalSize);
console.log("Compression active:", isCompressed);
```

### Jumpy Scrolling

```typescript
// Ensure consistent item size
if (itemSize !== actualAverageSize) {
  console.warn("Item size mismatch:", {
    estimated: itemSize,
    actual: actualAverageSize,
  });
}
```

## Best Practices

1. **Accurate Item Size** - Better estimates mean smoother scrolling
2. **Appropriate Overscan** - Balance between performance and smoothness
3. **Monitor Compression** - Log when compression activates
4. **Cache Calculations** - Avoid redundant computations
5. **Handle Edge Cases** - Zero items, container resize, etc.

## Example Usage

```typescript
// Configure virtual feature
const viewport = pipe(
  withBase(),
  withVirtual({
    overscan: 3, // Render 3 extra items
    maxVirtualSize: 20000000, // 20M pixel limit
    minItemSize: 50, // Items at least 50px
    maxItemSize: 500, // Items at most 500px
  })
)(component);

// Monitor virtual state
viewport.on("viewport:virtual-size-changed", (e) => {
  console.log("Virtual size updated:", e);
  if (e.compressed) {
    console.warn("Space compression active:", e.compressionRatio);
  }
});

// Check visible items
const range = viewport.calculateVisibleRange();
console.log(`Rendering items ${range.start} to ${range.end}`);
```

## Configuration

```typescript
interface VirtualConfig {
  itemSize?: number; // Fixed item size in pixels (auto-detected if not provided)
  overscan?: number; // Items to render outside viewport (default: 2)
  autoDetectItemSize?: boolean; // Enable auto-detection (default: true if no itemSize)
  initialScrollIndex?: number; // Start at specific item index (0-based)
  debug?: boolean; // Enable debug logging
}
```

### Configuration Examples

```typescript
// Auto-detection enabled by default when no itemSize provided
const viewport = createViewport({
  virtual: {
    // No itemSize specified - will auto-detect
    overscan: 2,
  },
});

// Explicit auto-detection with initial estimate
const viewport = createViewport({
  virtual: {
    itemSize: 100, // Initial estimate
    autoDetectItemSize: true, // Force auto-detection
  },
});

// Disable auto-detection for fixed-size items
const viewport = createViewport({
  virtual: {
    itemSize: 84, // Fixed size
    autoDetectItemSize: false, // Explicitly disable
  },
});

// Start at a specific position (e.g., user's last viewed item)
const viewport = createViewport({
  initialScrollIndex: 500, // Start at item 500
  virtual: {
    itemSize: 100,
    overscan: 2,
  },
});
```

## Initial Scroll Position

The `initialScrollIndex` configuration allows the viewport to start at a specific item position instead of the beginning. This is useful for:

- Restoring user's scroll position
- Deep linking to specific items
- Navigating to search results

### Basic Usage

```typescript
const viewport = createViewport({
  initialScrollIndex: 376, // Start at item 376
  virtual: {
    itemSize: 100,
  },
  collection: {
    adapter: myAdapter,
  },
});
```

### With Selection

Combine `initialScrollIndex` with `selectId` to scroll to and select a specific item:

```typescript
const viewport = createViewport({
  initialScrollIndex: 376, // Position in list
  selectId: 'user-12345', // Item ID to select
  virtual: {
    itemSize: 100,
  },
});
```

### initialScrollIndex with Compression

When using `initialScrollIndex` with explicit `itemSize` on large lists (>1 million items), the virtual space may be compressed. The viewport automatically handles this by recalculating the scroll position when the total item count is received from the API.

#### The Problem

For a list with 1,050,278 items at 100px each:

```
Actual Size = 1,050,278 × 100 = 105,027,800 pixels
MAX_VIRTUAL_SIZE = 100,000,000 pixels
Compression Ratio = 100M / 105M ≈ 0.95
```

Without correction, `initialScrollIndex = 376` would calculate:
- Initial scroll position = 376 × 100 = 37,600px
- But in compressed space, 37,600px maps to index ~395, not 376
- Items around index 376 would render off-screen

#### The Solution

When `totalItems` arrives from the API and compression is detected, the scroll position is recalculated using the compression-aware formula:

```typescript
const ratio = initialScrollIndex / totalItems;
const compressedPosition = ratio * MAX_VIRTUAL_SIZE;
```

This ensures the target index appears at the correct position regardless of compression.

#### Why Auto-Detect Works Differently

When `autoDetectItemSize` is enabled (default when no `itemSize` provided):
1. Initial item size estimate is used
2. After first items render, actual size is detected
3. Scroll position is recalculated during detection
4. This recalculation happens after `totalItems` is known

With explicit `itemSize`, no detection phase occurs, so the viewport now explicitly recalculates when compression is detected.

#### Example with Large Dataset

```typescript
// Large dataset with explicit itemSize
const viewport = createViewport({
  initialScrollIndex: 821959, // Deep in the list
  virtual: {
    itemSize: 100, // Explicit size
    overscan: 2,
  },
  collection: {
    adapter: {
      read: async (params) => {
        const response = await fetch(`/api/items?page=${params.page}`);
        const data = await response.json();
        return {
          items: data.items,
          meta: { total: data.totalCount }, // 1,050,278 items
        };
      },
    },
  },
});

// The viewport will:
// 1. Set initial scroll position to 821959 × 100 = 82,195,900px
// 2. Load data for the visible range around index 821959
// 3. Receive totalItems = 1,050,278 from API
// 4. Detect compression (105M > 100M)
// 5. Recalculate scroll position: (821959 / 1050278) × 100M = 78,261,089px
// 6. Re-render items at correct positions
```
