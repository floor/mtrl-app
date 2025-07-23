# Viewport

The viewport is the core virtual scrolling engine in mtrl-addons. It provides high-performance rendering of large datasets by only rendering visible items, with support for dynamic item sizes, smooth scrolling, placeholders, and progressive data loading.

## Concept

The viewport implements a virtual scrolling technique that creates the illusion of rendering thousands or millions of items while only keeping a small subset of DOM elements in memory. This is achieved through:

1. **Virtual Space Management** - Maintains a virtual container height/width that represents the total scrollable area
2. **Visible Range Calculation** - Determines which items should be visible based on scroll position
3. **DOM Recycling** - Reuses DOM elements as items scroll in and out of view
4. **Progressive Loading** - Loads data in ranges as needed, supporting infinite scrolling
5. **Virtual Space Compression** - Automatically compresses the virtual scrollable area when it would exceed browser limits
6. **Momentum Scrolling** - Provides native-like scrolling with inertia and smooth deceleration on touch and mouse drag

### Virtual Space Compression

Browsers have limitations on the maximum size of scrollable containers (varies by browser, typically around 33-67 million pixels). When dealing with extremely large datasets (millions of items), the total virtual size can exceed these limits.

The viewport solves this by implementing automatic virtual space compression:

- **Compression Detection**: When total size would exceed 10 million pixels, compression activates
- **Ratio Calculation**: Maps the actual total size to fit within the safe limit
- **Position Mapping**: Transparently converts between compressed and actual positions
- **Seamless Scrolling**: Users experience smooth scrolling regardless of dataset size

For example, with 1 million items of 100px each (100 million pixels total):

- Compression ratio: 10M / 100M = 0.1
- Virtual container: 10 million pixels (safe)
- Each scroll position is mapped: virtual position × 10 = actual item position

This allows the viewport to handle datasets of any size while maintaining precise scroll positioning and smooth performance.

## Architecture

The viewport uses a composable architecture where features are mixed in using functional composition:

```typescript
// Core viewport features (applied by default)
const viewport = pipe(
  withBase,
  withVirtual,
  withScrolling,
  withScrollbar,
  withCollection,
  withPlaceholders,
  withRendering,
  withEvents
)(baseComponent);

// Optional features can be added
const viewportWithMomentum = pipe(
  createViewport(config),
  withMomentum({ enabled: true })
)(baseComponent);
```

## Constants

The viewport behavior is controlled by organized constant groups:

### Virtual Scrolling Constants

Controls the core virtual scrolling behavior:

```typescript
VIRTUAL_SCROLL: {
  DEFAULT_ITEM_SIZE: 84,      // Default height/width of items in pixels
  OVERSCAN_BUFFER: 2,         // Number of items to render outside visible area
  MIN_ITEM_SIZE: 20,          // Minimum allowed item size
  MAX_ITEM_SIZE: 1000,        // Maximum allowed item size
  SCROLL_SENSITIVITY: 1.0,    // Scroll speed multiplier
  MAX_VIRTUAL_SIZE: 10000000  // Maximum virtual container size (10M pixels)
}
```

### Scrolling Settings

Controls scroll behavior and performance:

```typescript
SCROLLING: {
  OVERSCAN: 2,                // Items to render outside viewport
  WHEEL_MULTIPLIER: 1,        // Mouse wheel scroll speed
  TOUCH_MULTIPLIER: 1,        // Touch scroll speed
  THROTTLE_SCROLL: 8,         // Scroll event throttle in ms
  DEFAULT_BEHAVIOR: "smooth",  // Scroll behavior (smooth/auto)
  DEFAULT_EASING: "ease-in-out",
  DEFAULT_EASING_DURATION: 300 // Duration for programmatic scrolling
}
```

### Rendering Settings

Controls how items are rendered and recycled:

```typescript
RENDERING: {
  BATCH_SIZE: 100,            // Max items to render in one batch
  MIN_RENDER_INTERVAL: 16,    // Min time between renders (~60fps)
  MIN_ITEM_HEIGHT: 20,        // Minimum item height
  DEFAULT_MAX_POOL_SIZE: 100, // Max recycled elements to keep
  DEFAULT_MIN_POOL_SIZE: 10,  // Min recycled elements to maintain
  DEFAULT_STRATEGY: "lru"     // Recycling strategy
}
```

### Loading Settings

Controls progressive data loading:

```typescript
LOADING: {
  CANCEL_THRESHOLD: 1,        // Velocity (px/ms) above which loads cancel
  MAX_CONCURRENT_REQUESTS: 1, // Parallel data requests allowed
  DEFAULT_RANGE_SIZE: 20,     // Items to load per request
  DEBOUNCE_LOADING: 150,      // Debounce delay for load requests
  MIN_RANGE_SIZE: 10,         // Minimum items per load
  MAX_RANGE_SIZE: 100,        // Maximum items per load
  BUFFER_SIZE: 3,             // Extra items to maintain in memory
  PREFETCH_RANGES: 0,         // Ranges to prefetch ahead
  PREFETCH_THRESHOLD: 0.8,    // Start prefetch at 80% through range
  PRELOAD_DIRECTION_BIAS: 0.7,// 70% load in scroll direction
  REQUEST_TIMEOUT: 5000,      // Request timeout in ms
  RETRY_ATTEMPTS: 2,          // Failed request retry count
  RETRY_DELAY: 1000,          // Delay between retries
  RANGE_OVERLAP: 0.1,         // 10% overlap between ranges
  DYNAMIC_RANGE_SIZING: true, // Adjust range size dynamically
  VIEWPORT_SIZE_MULTIPLIER: 2 // Range size = viewport * multiplier
}
```

### Request Queue Configuration

Controls the request queue behavior:

```typescript
REQUEST_QUEUE: {
  ENABLED: true,              // Enable request queuing
  MAX_QUEUE_SIZE: 1,          // Max queued requests
  MAX_ACTIVE_REQUESTS: 2      // Max concurrent active requests
}
```

### Placeholder Settings

Controls placeholder generation and display:

```typescript
PLACEHOLDER: {
  MASK_CHARACTER: "x",        // Character for masked content
  CSS_CLASS: "viewport-item__placeholder",
  MIN_SAMPLE_SIZE: 5,         // Min items to analyze for patterns
  MAX_SAMPLE_SIZE: 20,        // Max items to analyze
  PLACEHOLDER_FLAG: "_placeholder", // Property marking placeholders
  RANDOM_LENGTH_VARIANCE: true,     // Vary placeholder lengths
  PATTERN_ANALYSIS: {
    SAMPLE_SIZE: 50           // Items to analyze for patterns
  }
}
```

### Speed Tracking

Controls velocity and momentum calculations:

```typescript
SPEED_TRACKING: {
  DECELERATION_FACTOR: 0.85,  // Velocity decay per frame
  MEASUREMENT_WINDOW: 100,    // Time window for speed calc (ms)
  MIN_MEASUREMENT_INTERVAL: 16, // Min time between measurements
  VELOCITY_SMOOTHING: true,   // Enable velocity smoothing
  SMOOTHING_FACTOR: 0.3,      // Smoothing weight
  ACCELERATION_THRESHOLD: 0.5,// Acceleration detection (px/ms²)
  DIRECTION_CHANGE_THRESHOLD: 0.1, // Min velocity for direction
  MOMENTUM_DECAY_TIME: 1000   // Momentum decay duration (ms)
}
```

### Initial Load Configuration

Controls initial viewport population:

```typescript
INITIAL_LOAD: {
  STRATEGY: "placeholders",   // "placeholders" | "direct" | "progressive"
  VIEWPORT_MULTIPLIER: 1.5,   // Load 1.5x viewport capacity
  MIN_ITEMS: 10,              // Minimum initial items
  MAX_ITEMS: 100,             // Maximum initial items
  PLACEHOLDER_COUNT: 20,      // Default placeholder count
  SHOW_LOADING_STATE: true,   // Show loading indicator
  LOADING_DELAY: 100          // Delay before loading state (ms)
}
```

### Boundary Handling

Controls scroll boundary behavior:

```typescript
BOUNDARIES: {
  PREVENT_OVERSCROLL: true,   // Prevent scrolling past edges
  MAINTAIN_EDGE_RANGES: true, // Keep edge items loaded
  BOUNDARY_RESISTANCE: 0.3,   // Overscroll resistance factor
  BOUNCE_BACK_DURATION: 300,  // Bounce animation duration
  EDGE_TOLERANCE: 5,          // Edge detection tolerance (px)
  MIN_SCROLL_POSITION: 0,     // Minimum scroll position
  MAX_SCROLL_BUFFER: 100      // Extra scroll at bottom (px)
}
```

### Scrollbar Settings

Controls custom scrollbar appearance:

```typescript
SCROLLBAR: {
  CLASSES: {
    SCROLLBAR: "viewport__scrollbar",
    SCROLLBAR_TRACK: "viewport__scrollbar-track",
    SCROLLBAR_THUMB: "viewport__scrollbar-thumb",
    SCROLLBAR_ENABLED: "viewport__scrollbar-enabled",
    SCROLLBAR_SCROLLING: "viewport__scrollbar--scrolling",
    SCROLLBAR_DRAGGING: "viewport__scrollbar--dragging",
    SCROLLBAR_THUMB_DRAGGING: "viewport__scrollbar-thumb--dragging"
  }
}
```

### Orientation

Controls viewport orientation:

```typescript
ORIENTATION: {
  DEFAULT_ORIENTATION: "vertical",    // "vertical" | "horizontal"
  DEFAULT_CROSS_AXIS_ALIGNMENT: "stretch",
  REVERSE_DIRECTION: false            // Reverse scroll direction
}
```

### Momentum Constants

Controls momentum scrolling behavior:

```typescript
MOMENTUM: {
  ENABLED: true,              // Enable momentum by default
  DECELERATION_FACTOR: 0.85,  // Velocity decay per frame (0-1)
  MIN_VELOCITY: 0.1,          // Stop threshold (px/ms)
  MIN_DURATION: 300,          // Max gesture duration (ms)
  MIN_VELOCITY_THRESHOLD: 0.5,// Min velocity to trigger (px/ms)
  FRAME_TIME: 16              // Frame time for calculations (ms)
}
```

To disable momentum globally, you can override the constants:

```typescript
// Disable momentum for all viewports
VIEWPORT_CONSTANTS.MOMENTUM.ENABLED = false;

// Or use custom defaults
VIEWPORT_CONSTANTS.MOMENTUM.DECELERATION_FACTOR = 0.95; // Slower deceleration
VIEWPORT_CONSTANTS.MOMENTUM.MIN_DURATION = 500; // Allow longer gestures
```

## Features

The viewport is composed of multiple features, each providing specific functionality:

### Base Feature (`withBase`)

Provides the foundation for all viewport functionality:

- **`init()`** - Initializes the viewport container and structure
- **`destroy()`** - Cleans up all viewport resources
- **`getContainer()`** - Returns the viewport container element
- **`getItemsContainer()`** - Returns the items container element
- **`setOrientation(orientation)`** - Sets vertical or horizontal orientation

### Template Feature (`withTemplate`)

Manages item rendering templates:

- **`setTemplate(template)`** - Sets the item rendering function
- **`getTemplate()`** - Returns the current template function
- **`renderItem(item, index)`** - Renders a single item using the template
- **`validateTemplate(template)`** - Validates template function

### Virtual Feature (`withVirtual`)

Core virtual scrolling calculations with automatic space compression:

- **`calculateVisibleRange()`** - Determines which items are visible
- **`updateVirtualSize()`** - Updates the virtual container size with compression if needed
- **`getVirtualOffset()`** - Calculates the transform offset
- **`estimateTotalSize()`** - Estimates total scrollable size
- **`getItemOffset(index)`** - Gets the position of an item
- **`getCompressionRatio()`** - Returns the compression ratio (1.0 = no compression)
- **`isCompressed()`** - Returns true if virtual space compression is active
- **`mapToVirtualPosition(actualPosition)`** - Maps actual position to compressed space
- **`mapToActualPosition(virtualPosition)`** - Maps compressed position to actual space

### Scrolling Feature (`withScrolling`)

Handles wheel scrolling and provides velocity tracking:

- **`scrollToIndex(index, alignment)`** - Scrolls to a specific item
  - `alignment`: "start" | "center" | "end" | "auto"
- **`scrollToOffset(offset, smooth)`** - Scrolls to a pixel offset
- **`scrollBy(delta)`** - Scrolls by a relative amount (used by momentum feature)
- **`getScrollPosition()`** - Returns current scroll position
- **`getScrollDirection()`** - Returns "forward" or "backward"
- **`getVelocity()`** - Returns current scroll velocity (px/ms)
- **`stopScrolling()`** - Stops any active scrolling

Note: Touch and mouse drag interactions are handled by the separate `withMomentum` feature.

### Momentum Feature (`withMomentum`)

Adds inertial scrolling to touch and mouse drag interactions.

**Note:** Requires the scrolling feature to be applied first (provides `scrollBy` and `getVelocity` APIs).

- **`enabled`** - Enable/disable momentum (can return component unchanged)
- **`deceleration`** - How quickly velocity decreases (0-1, default: 0.85)
- **`minVelocity`** - Minimum velocity before stopping (default: 0.1)
- **`minDuration`** - Max gesture duration for momentum in ms (default: 300)
- **`minVelocityThreshold`** - Min velocity to trigger momentum (default: 0.5)

**Usage as a Composable Feature:**

```typescript
import { createViewport } from "mtrl-addons/core/viewport";
import { withMomentum } from "mtrl-addons/core/viewport/features";
import { pipe } from "mtrl/core/compose";

// Add momentum to viewport
const ViewportWithMomentum = pipe(
  createViewport({
    estimatedItemSize: 84,
    overscan: 2,
  }),
  withMomentum({
    enabled: true,
    deceleration: 0.85,
    minVelocity: 0.1,
  })
);

// Or conditionally add momentum
const viewport = navigator.platform.includes("Mac")
  ? createViewport(config)(component) // macOS has native momentum
  : pipe(createViewport(config), withMomentum({ enabled: true }))(component);

// Custom momentum for different use cases
const carouselViewport = pipe(
  createViewport({ orientation: "horizontal" }),
  withMomentum({
    deceleration: 0.95, // Slower deceleration for carousel
    minDuration: 500, // Allow longer swipes
    minVelocityThreshold: 0.3, // Lower threshold
  })
);
```

The momentum feature integrates with the scrolling feature's velocity tracking and uses `scrollBy` API to create smooth deceleration animations after quick touch swipes or mouse drags.

### Scrollbar Feature (`withScrollbar`)

Provides custom scrollbar functionality:

- **`enableScrollbar()`** - Enables the custom scrollbar
- **`disableScrollbar()`** - Disables the custom scrollbar
- **`updateScrollbar()`** - Updates scrollbar position and size
- **`setScrollbarAutoHide(autoHide)`** - Configures auto-hide behavior
- **`isScrollbarDragging()`** - Returns true if scrollbar is being dragged

### Collection Feature (`withCollection`)

Integrates with the collection for data management:

- **`setCollection(collection)`** - Connects a collection instance
- **`loadRange(start, end)`** - Loads a specific range of items
- **`refreshRange(start, end)`** - Refreshes loaded items
- **`getLoadedRanges()`** - Returns currently loaded ranges
- **`cancelPendingLoads()`** - Cancels in-flight requests

### Placeholders Feature (`withPlaceholders`)

Manages placeholder generation:

- **`generatePlaceholders(count)`** - Creates placeholder items
- **`analyzePlaceholderPatterns(items)`** - Analyzes item patterns
- **`createPlaceholder(index)`** - Creates a single placeholder
- **`isPlaceholder(item)`** - Checks if an item is a placeholder
- **`replacePlaceholders(items, start)`** - Replaces placeholders with real data

### Rendering Feature (`withRendering`)

Manages DOM updates and recycling:

- **`render()`** - Performs a render cycle
- **`renderRange(start, end)`** - Renders a specific range
- **`recycleElement(element)`** - Adds element to recycle pool
- **`getRecycledElement()`** - Gets element from recycle pool
- **`clearRecyclePool()`** - Empties the recycle pool
- **`scheduleRender()`** - Schedules next render frame
- **`cancelScheduledRender()`** - Cancels pending render

### Events Feature (`withEvents`)

Provides event handling:

- **`on(event, handler)`** - Subscribes to viewport events
- **`off(event, handler)`** - Unsubscribes from events
- **`emit(event, data)`** - Emits a viewport event

Available events:

- `scroll` - Fired on scroll with position data
- `rangechange` - Fired when visible range changes
- `itemsrendered` - Fired after items are rendered
- `loadstart` - Fired when data loading starts
- `loadend` - Fired when data loading completes
- `scrollstart` - Fired when scrolling begins
- `scrollend` - Fired when scrolling stops

### Performance Feature (`withPerformance`)

Monitors and optimizes performance:

- **`startMeasure(name)`** - Starts a performance measurement
- **`endMeasure(name)`** - Ends a measurement and logs result
- **`getMetrics()`** - Returns performance metrics
- **`enableProfiling()`** - Enables detailed profiling
- **`disableProfiling()`** - Disables profiling
- **`logMetrics()`** - Logs current metrics to console

### Item Size Feature (`withItemSize`)

Manages dynamic item sizing:

- **`measureItem(index)`** - Measures actual item size
- **`setItemSize(index, size)`** - Sets size for specific item
- **`getItemSize(index)`** - Gets size for specific item
- **`updateEstimatedSize()`** - Updates estimated item size
- **`clearSizeCache()`** - Clears measured sizes

### Loading Feature (`withLoading`)

Controls progressive data loading:

- **`loadVisibleRange()`** - Loads currently visible items
- **`loadRangeWithBuffer()`** - Loads range with buffer
- **`prefetchNextRange()`** - Prefetches upcoming range
- **`cancelLoading()`** - Cancels active loads
- **`isLoading()`** - Returns loading state
- **`getLoadingProgress()`** - Returns loading progress

## Usage Example

```typescript
import { createViewport } from "mtrl-addons/core/viewport";
import { createCollection } from "mtrl-addons/core/collection";
import { withMomentum } from "mtrl-addons/core/viewport/features";
import { pipe } from "mtrl/core/compose";

// Create a collection for data management
const collection = createCollection({
  adapter: myDataAdapter,
  rangeSize: 50,
});

// Create viewport with momentum
const MyList = pipe(
  createViewport({
    estimatedItemSize: 84,
    overscan: 2,
    orientation: "vertical",
    enableScrollbar: true,
    placeholders: {
      enabled: true,
      count: 20,
    },
  }),
  withMomentum({ enabled: true }) // Add momentum support
)(baseComponent);

// Initialize
const list = MyList({
  container: document.getElementById("list"),
  collection,
  template: (item) => `<div class="item">${item.name}</div>`,
});

// Use viewport API
list.scrollToIndex(100, "center");
list.on("rangechange", ({ start, end }) => {
  console.log(`Showing items ${start} to ${end}`);
});
```

## Performance Tips

1. **Set accurate `estimatedItemSize`** - Better estimates improve scrolling
2. **Use `overscan` wisely** - Too much hurts performance, too little causes flicker
3. **Enable placeholders** - Provides better UX during loading
4. **Batch updates** - Update multiple items at once
5. **Use recycling** - Reuse DOM elements for better performance
6. **Monitor metrics** - Use performance feature to identify bottlenecks

## Global Configuration

You can control viewport behavior globally by modifying the constants:

```typescript
import { VIEWPORT_CONSTANTS } from "mtrl-addons/core/viewport/constants";

// Disable momentum for all viewports
VIEWPORT_CONSTANTS.MOMENTUM.ENABLED = false;

// Change default item size
VIEWPORT_CONSTANTS.VIRTUAL_SCROLL.DEFAULT_ITEM_SIZE = 100;

// Adjust scrolling sensitivity
VIEWPORT_CONSTANTS.VIRTUAL_SCROLL.SCROLL_SENSITIVITY = 1.5;

// Custom momentum defaults
VIEWPORT_CONSTANTS.MOMENTUM.DECELERATION_FACTOR = 0.95;
VIEWPORT_CONSTANTS.MOMENTUM.MIN_DURATION = 500;
```

These changes affect all viewports created after the modification.

## Advanced Configuration

```typescript
// Configure viewport with all options
const viewportConfig = {
  // Virtual scrolling
  estimatedItemSize: 100,
  overscan: 3,

  // Loading
  loading: {
    rangeSize: 100,
    debounce: 200,
    prefetch: true,
  },

  // Scrolling
  scrolling: {
    smooth: true,
    duration: 300,
    easing: "ease-out",
  },

  // Performance
  performance: {
    measureRenders: true,
    logSlowFrames: true,
  },

  // Other options...
};

// Create viewport with optional features
const advancedViewport = pipe(
  createViewport(viewportConfig),
  // Add momentum with custom settings
  withMomentum({
    enabled: true,
    deceleration: 0.92, // Slower deceleration
    minVelocity: 0.05, // More sensitive stopping
    minDuration: 400, // Allow longer gestures
    minVelocityThreshold: 0.3, // Lower trigger threshold
  }),
  // Add other custom features as needed
  withCustomFeature({
    /* options */
  })
)(component);
```
