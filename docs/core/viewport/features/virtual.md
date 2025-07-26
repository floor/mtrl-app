# Virtual Feature

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
  const { scrollPosition, containerSize, estimatedItemSize, totalItems } =
    viewportState;

  if (totalItems === 0 || estimatedItemSize === 0) {
    return { start: 0, end: 0 };
  }

  // Calculate visible range
  const visibleStart = Math.floor(scrollPosition / estimatedItemSize);
  const visibleEnd = Math.ceil(
    (scrollPosition + containerSize) / estimatedItemSize
  );

  // Apply overscan
  const start = Math.max(0, visibleStart - overscan);
  const end = Math.min(totalItems - 1, visibleEnd + overscan);

  return { start, end };
};
```

### Virtual Size Management

```typescript
const updateVirtualSize = () => {
  const { totalItems, estimatedItemSize } = viewportState;
  const actualSize = totalItems * estimatedItemSize;

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
  overscan?: number; // Items to render outside viewport (default: 2)
  maxVirtualSize?: number; // Maximum virtual container size (default: 10M)
  minItemSize?: number; // Minimum allowed item size (default: 20)
  maxItemSize?: number; // Maximum allowed item size (default: 1000)
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

### Listened Events

- `viewport:items-changed` - Updates virtual size when total items change
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
  return index * estimatedItemSize;
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
console.log("Item size:", estimatedItemSize);
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
if (estimatedItemSize !== actualAverageSize) {
  console.warn("Item size mismatch:", {
    estimated: estimatedItemSize,
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
