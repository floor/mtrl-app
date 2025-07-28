# Viewport

The viewport is the core virtual scrolling engine in mtrl-addons. It serves as a flexible foundation for virtualized components including lists, maps, sheets, and other scrollable containers. It provides high-performance rendering of large datasets by only rendering visible items, with support for dynamic item sizes, smooth scrolling, placeholders, and progressive data loading.

## Table of Contents

1. [Overview](#overview)
2. [Configuration](#configuration)
3. [How It Works](#how-it-works)
4. [Architecture](#architecture)
5. [Feature Composition](#feature-composition)
6. [Data Flow](#data-flow)
7. [Event System](#event-system)
8. [State Management](#state-management)
9. [Feature Documentation](#feature-documentation)
10. [Usage Examples](#usage-examples)
11. [Performance](#performance)
12. [Troubleshooting](#troubleshooting)

## Overview

The viewport implements a virtual scrolling technique that creates the illusion of rendering thousands or millions of items while only keeping a small subset of DOM elements in memory. This generic engine can power various UI components:

- **Virtual Lists** - High-performance lists with thousands of items
- **Virtual Maps** - Pannable maps with virtualized markers/tiles
- **Virtual Sheets** - Spreadsheet-like grids with virtualized cells
- **Virtual Galleries** - Image galleries with lazy loading
- **Virtual Timelines** - Scrollable timelines with virtualized events

This flexibility is achieved through:

1. **Virtual Space Management** - Maintains a virtual container height/width that represents the total scrollable area
2. **Visible Range Calculation** - Determines which items should be visible based on scroll position
3. **DOM Recycling** - Reuses DOM elements as items scroll in and out of view
4. **Progressive Loading** - Loads data in ranges as needed, supporting infinite scrolling
5. **Virtual Space Compression** - Automatically compresses the virtual scrollable area when it would exceed browser limits
6. **Momentum Scrolling** - Provides native-like scrolling with inertia and smooth deceleration on touch and mouse drag
7. **Velocity Tracking** - Monitors scroll speed to optimize loading and rendering decisions
8. **Automatic Item Size Detection** - Intelligently measures and adapts to actual item sizes

## Configuration

The viewport uses a clean, feature-oriented configuration structure where each feature has its own configuration namespace:

```typescript
interface ViewportConfig {
  // Component identification
  className?: string;
  debug?: boolean;

  // Data source
  collection?: {
    adapter: CollectionAdapter<any>; // Data adapter
    transform?: (item: any) => any; // Transform items before rendering
  };

  // Virtual scrolling
  virtual?: {
    itemSize?: number; // Fixed item size (auto-detected if not provided)
    overscan?: number; // Items to render outside viewport
    autoDetectItemSize?: boolean; // Enable auto-detection (default: true if no itemSize)
  };

  // Scrolling behavior
  scrolling?: {
    orientation?: "vertical" | "horizontal";
    sensitivity?: number; // Scroll speed multiplier
    animation?: boolean; // Enable smooth scrolling
  };

  // Pagination
  pagination?: {
    strategy?: "page" | "offset" | "cursor";
    limit?: number; // Items per page/range
  };

  // Performance tuning
  performance?: {
    maxConcurrentRequests?: number; // Parallel data requests
    enableRequestQueue?: boolean; // Queue overflow requests
    cancelLoadThreshold?: number; // Velocity to cancel loads (px/ms)
  };

  // Placeholder configuration
  placeholders?: {
    enabled?: boolean; // Show placeholders while loading
    analyzeFirstLoad?: boolean; // Learn from data structure
    maskCharacter?: string; // Character for masks
  };

  // Custom scrollbar
  scrollbar?: {
    enabled?: boolean;
    autoHide?: boolean;
    minThumbSize?: number;
  };

  // Item rendering template
  template?: (item: any, index: number) => string | HTMLElement | any[];
}
```

### Automatic Item Size Detection

The viewport now includes intelligent item size detection that automatically measures rendered items:

```typescript
// Auto-detection is enabled by default when no itemSize is provided
const viewport = createViewport({
  virtual: {
    // No itemSize specified - will auto-detect
    overscan: 2,
  },
});

// Explicitly control auto-detection
const viewport = createViewport({
  virtual: {
    itemSize: 100, // Initial estimate
    autoDetectItemSize: true, // Force auto-detection even with itemSize
  },
});

// Disable auto-detection for fixed-size items
const viewport = createViewport({
  virtual: {
    itemSize: 84, // Fixed size
    autoDetectItemSize: false, // Disable auto-detection
  },
});
```

## How It Works

### Virtual Scrolling Concept

Traditional scrolling renders all items in the DOM, which becomes slow with large datasets. Virtual scrolling solves this by:

1. **Creating a Virtual Space**: A container with the total height/width of all items
2. **Calculating Visible Items**: Based on scroll position and viewport size
3. **Rendering Only Visible Items**: Typically 10-50 items instead of thousands
4. **Positioning Items Absolutely**: Each item is positioned at its virtual location
5. **Recycling DOM Elements**: Reuses elements as they scroll out of view
6. **Auto-Detecting Item Size**: Measures actual rendered items and adapts calculations

### The Viewport Pipeline

```
User Scrolls → Scroll Event → Calculate Position → Update Velocity →
Calculate Visible Range → Check Loaded Data → Load Missing Data →
Render Items → Auto-Detect Size (if enabled) → Update Virtual Space →
Position Items → Update Scrollbar → Emit Events
```

The pipeline includes an intelligent auto-detection step that:

1. Measures rendered items on first render
2. Calculates average item size from actual DOM elements
3. Updates virtual space calculations with accurate measurements
4. Re-renders with corrected positions if size changed significantly

### Key Components

1. **Container**: The scrollable viewport element
2. **Virtual Container**: Sets the total scrollable size
3. **Items Container**: Holds the rendered items
4. **Scrollbar**: Custom scrollbar for large datasets
5. **Item Elements**: The actual rendered DOM elements

## Architecture

The viewport uses a composable architecture where features are mixed in using functional composition. This provides:

- **Modularity**: Each feature is independent and focused
- **Flexibility**: Features can be added/removed as needed
- **Testability**: Features can be tested in isolation
- **Extensibility**: New features can be added easily

### Feature Composition Pipeline

```typescript
// Core features are applied in a specific order
const viewport = pipe(
  withEvents, // 1. Events - Communication system (always first)
  withBase, // 2. Base - DOM structure and lifecycle
  withVirtual, // 3. Virtual - Scrolling calculations & auto-size
  withScrolling, // 4. Scrolling - Scroll handling and velocity
  withScrollbar, // 5. Scrollbar - Custom scrollbar UI
  withCollection, // 6. Collection - Data loading
  withPlaceholders, // 7. Placeholders - Temporary items
  withRendering // 8. Rendering - DOM updates (always last)
)(baseComponent);
```

### Why This Order Matters

1. **Events** must be first - other features depend on it
2. **Base** creates the DOM structure
3. **Virtual** before **Scrolling** - scrolling needs virtual calculations
4. **Collection** before **Rendering** - rendering needs data
5. **Rendering** must be last - depends on all other features

## Feature Composition

### Core Features (Always Applied)

These features are essential for basic viewport functionality:

1. **Events** - Enables feature communication
2. **Base** - Creates DOM structure, manages lifecycle
3. **Virtual** - Calculates virtual space, visible ranges, and auto-detects item sizes
4. **Scrolling** - Handles scroll events and velocity tracking
5. **Scrollbar** - Provides custom scrollbar for large datasets
6. **Collection** - Manages data loading and caching
7. **Placeholders** - Shows temporary items while loading
8. **Rendering** - Updates DOM with visible items

### Optional Features

These can be added for enhanced functionality:

1. **Momentum** - Touch/mouse drag momentum scrolling
2. **Performance** - Performance monitoring and optimization
3. **Loading** - Advanced loading strategies

### Feature Dependencies

```
Events (foundation)
├── Base
├── Virtual (calculations + auto-size)
│   └── Scrolling (position)
│       ├── Momentum (optional)
│       └── Scrollbar
├── Collection (data)
│   ├── Loading (strategies)
│   └── Placeholders
└── Rendering (DOM)
```

## Data Flow

### 1. Initialization Flow

```
Component Creation → Apply Features → Initialize Base →
Create DOM Structure → Setup Event Listeners →
Initialize Collection → Load Initial Data →
Show Placeholders → Render First Items
```

### 2. Scroll Flow

```
User Scrolls → Wheel/Touch Event → Update Position →
Calculate Velocity → Emit Scroll Event →
Calculate Visible Range → Check if Range Changed →
Load Missing Data → Update DOM
```

### 3. Data Loading Flow

```
Range Changed → Check Velocity → Queue Load Request →
Check if Can Load → Execute Load → Show Placeholders →
Fetch from Adapter → Receive Data → Replace Placeholders →
Update DOM → Emit Events
```

### 4. Rendering Flow

```
Data Available → Calculate Positions → Get/Create Elements →
Update Content → Position Elements → Recycle Hidden →
Update Scrollbar → Emit Rendered Event
```

## Event System

The event system is the nervous system of the viewport, enabling features to communicate without tight coupling.

### Event Flow Diagram

```
Scrolling ──────┐
                ├─→ viewport:scroll ─────→ Virtual (update range)
                │                        └→ Rendering (update DOM)
                │
                ├─→ viewport:velocity-changed → Collection (queue decisions)
                │
                └─→ viewport:idle ──────────→ Collection (process queue)

Collection ─────┐
                ├─→ collection:range-loaded → Rendering (replace placeholders)
                │                           └→ Placeholders (analyze structure)
                │
                └─→ viewport:items-changed ─→ Virtual (update size)

Virtual ────────┐
                └─→ viewport:range-changed ─→ Collection (load data)
                                           └→ Rendering (update visible)
```

### Key Events

#### Scroll Events

- `viewport:scroll` - Position changed
- `viewport:velocity-changed` - Speed changed
- `viewport:idle` - Scrolling stopped
- `viewport:scrollstart` - Scrolling began
- `viewport:scrollend` - Scrolling ended

#### Data Events

- `viewport:range-changed` - Visible range changed
- `collection:range-loaded` - Data loaded
- `viewport:items-changed` - Total items changed
- `viewport:placeholders-shown` - Placeholders displayed
- `viewport:placeholders-replaced` - Real data replaced placeholders

#### Lifecycle Events

- `viewport:initialized` - Viewport ready
- `viewport:destroyed` - Viewport cleaned up
- `viewport:error` - Error occurred

## State Management

### Viewport State

The central state object shared by all features:

```typescript
interface ViewportState {
  // Scroll state
  scrollPosition: number;
  velocity: number;
  scrollDirection: "forward" | "backward";

  // Size state
  containerSize: number;
  itemSize: number;
  virtualTotalSize: number;

  // Range state
  visibleRange: { start: number; end: number };
  totalItems: number;

  // DOM references
  viewportElement: HTMLElement;
  itemsContainer: HTMLElement;
  virtualContainer: HTMLElement;
}
```

### Feature State Access

Features access and modify state through:

1. **Direct Access**: `(component.viewport as any).state`
2. **Events**: Emit events to trigger state changes
3. **API Methods**: Call methods that update state
4. **Internal Properties**: Store feature-specific state

### State Synchronization

State is kept synchronized through:

1. **Event Notifications**: Features emit events when state changes
2. **Shared References**: State object is shared, not copied
3. **Update Cycles**: Coordinated update cycles prevent conflicts
4. **Immutable Updates**: Some state uses immutable patterns

## Feature Documentation

Each feature is documented in detail in its own file:

### Core Features

1. **[Base Feature](./features/base.md)** - Foundation and lifecycle
   - DOM structure creation
   - Initialization coordination
   - Cleanup management
   - Container references

2. **[Virtual Feature](./features/virtual.md)** - Virtual scrolling calculations
   - Visible range calculation
   - Virtual space management
   - Space compression for large datasets
   - Position mapping

3. **[Scrolling Feature](./features/scrolling.md)** - Scroll handling and velocity
   - Wheel event handling
   - Velocity tracking
   - Idle detection
   - Programmatic scrolling

4. **[Collection Feature](./features/collection.md)** - Data management
   - Progressive loading
   - Request queuing
   - Velocity-based decisions
   - Placeholder replacement

5. **[Placeholders Feature](./features/placeholders.md)** - Temporary items
   - Pattern analysis
   - Intelligent generation
   - Seamless replacement
   - Visual feedback

6. **[Rendering Feature](./features/rendering.md)** - DOM updates
   - Efficient rendering
   - Element recycling
   - Position updates
   - Content updates

7. **[Events Feature](./features/events.md)** - Communication system
   - Event emitter pattern
   - Feature coordination
   - Debugging support
   - Event flow

8. **[Scrollbar Feature](./features/scrollbar.md)** - Custom scrollbar
   - Visual feedback
   - Drag interaction
   - Auto-hide behavior
   - Large dataset support

9. **[Template Feature](./features/template.md)** - Item templates
   - Template management
   - Efficient rendering
   - Type safety
   - Customization

### Optional Features

10. **[Momentum Feature](./features/momentum.md)** - Inertial scrolling
    - Touch gestures
    - Mouse drag
    - Velocity decay
    - Natural feel

11. **[Performance Feature](./features/performance.md)** - Monitoring
    - Frame rate tracking
    - Render timing
    - Memory usage
    - Optimization hints

12. **[Item Size Feature](./features/item-size.md)** - Dynamic sizing
    - Size measurement
    - Cache management
    - Variable heights
    - Performance impact

13. **[Loading Feature](./features/loading.md)** - Loading strategies
    - Prefetching
    - Cancellation
    - Priority queues
    - Network awareness

## Usage Examples

### Virtual List with Auto-Detection

```typescript
import { createViewport } from "mtrl-addons/core/viewport";
import { createCollection } from "mtrl-addons/core/collection";

// Create viewport with automatic item size detection
const viewport = createViewport({
  // Virtual configuration
  virtual: {
    // No itemSize specified - will auto-detect from rendered items
    overscan: 2,
  },

  // Collection configuration
  collection: {
    adapter: myDataAdapter,
    transform: (item) => ({
      ...item,
      displayName: item.name.toUpperCase(),
    }),
  },

  // Pagination configuration
  pagination: {
    strategy: "page",
    limit: 50,
  },

  // Performance configuration
  performance: {
    maxConcurrentRequests: 2,
    enableRequestQueue: true,
    cancelLoadThreshold: 1.0,
  },

  // Template using layout system
  template: (item) => [
    { class: "list-item", attributes: { "data-id": item.id } },
    [{ class: "list-item__title", text: item.displayName }],
    [{ class: "list-item__subtitle", text: item.description }],
  ],
});

// Initialize
const list = viewport({
  container: document.getElementById("list"),
  totalItems: 10000,
});

// Listen for auto-detection
list.on("viewport:item-size-detected", (data) => {
  console.log(`Item size auto-detected: ${data.detectedSize}px`);
});
```

### Virtual Map with Fixed Item Size

```typescript
// Create viewport for a pannable map with fixed tile size
const mapViewport = createViewport({
  virtual: {
    itemSize: 256, // Fixed tile size
    overscan: 1,
    autoDetectItemSize: false, // Disable auto-detection for tiles
  },

  scrolling: {
    orientation: "horizontal", // Horizontal scrolling
    sensitivity: 1.5,
    animation: true,
  },

  collection: {
    adapter: tileAdapter,
  },

  performance: {
    maxConcurrentRequests: 4, // Load multiple tiles in parallel
    cancelLoadThreshold: 2.0, // Higher threshold for maps
  },

  template: (tile) => `<img class="map-tile" src="${tile.url}" />`,
});

// Initialize map
const map = mapViewport({
  container: document.getElementById("map"),
  totalItems: tileCount,
});
```

### Virtual Sheet with Custom Configuration

```typescript
// Create viewport for a spreadsheet
const sheetViewport = createViewport({
  virtual: {
    itemSize: 30, // Row height
    overscan: 5,
    autoDetectItemSize: true, // Allow auto-adjustment
  },

  scrolling: {
    orientation: "vertical",
    animation: false, // Instant scrolling for data
  },

  collection: {
    adapter: cellAdapter,
    transform: (cell) => ({
      ...cell,
      formattedValue: formatCell(cell.value, cell.type),
    }),
  },

  pagination: {
    strategy: "offset",
    limit: 100, // Load 100 rows at a time
  },

  placeholders: {
    enabled: true,
    analyzeFirstLoad: true,
    maskCharacter: "█",
  },

  scrollbar: {
    enabled: true,
    autoHide: false, // Always visible for data tables
  },
});

// Initialize sheet
const sheet = sheetViewport({
  container: document.getElementById("sheet"),
  totalItems: rowCount,
});
```

### Advanced Usage with All Features

```typescript
// Create a fully-featured viewport
const viewport = createViewport({
  className: "my-custom-viewport",
  debug: true,

  // Virtual scrolling with auto-detection
  virtual: {
    // itemSize omitted - will auto-detect
    overscan: 3,
  },

  // Smooth vertical scrolling
  scrolling: {
    orientation: "vertical",
    sensitivity: 1.0,
    animation: true,
  },

  // Data source with transformation
  collection: {
    adapter: myAdapter,
    transform: (item) => enrichItem(item),
  },

  // Cursor-based pagination
  pagination: {
    strategy: "cursor",
    limit: 25,
  },

  // Performance tuning for slow networks
  performance: {
    maxConcurrentRequests: 1,
    enableRequestQueue: true,
    cancelLoadThreshold: 0.5,
  },

  // Smart placeholders
  placeholders: {
    enabled: true,
    analyzeFirstLoad: true,
    maskCharacter: "░",
  },

  // Custom scrollbar
  scrollbar: {
    enabled: true,
    autoHide: true,
    minThumbSize: 50,
  },

  // Complex template with layout system
  template: (item, index) => [
    {
      class: "item-card",
      attributes: { "data-index": index },
    },
    [
      {
        tag: "img",
        class: "item-card__image",
        attributes: { src: item.thumbnail },
      },
    ],
    [
      "content",
      { class: "item-card__content" },
      [{ tag: "h3", class: "item-card__title", text: item.title }],
      [{ tag: "p", class: "item-card__description", text: item.description }],
      [
        "meta",
        { class: "item-card__meta" },
        [{ tag: "span", class: "item-card__date", text: item.date }],
        [{ tag: "span", class: "item-card__author", text: item.author }],
      ],
    ],
  ],
});

// Initialize with event handlers
const list = viewport({
  container: document.getElementById("list"),
  totalItems: 50000,
});

// Monitor all events
list.on("viewport:initialized", () => console.log("Viewport ready"));
list.on("viewport:item-size-detected", (e) => console.log("Size detected:", e));
list.on("viewport:range-changed", (e) =>
  console.log("Range:", e.start, "-", e.end)
);
list.on("viewport:items-rendered", (e) =>
  console.log("Rendered:", e.renderedCount)
);
```

## Performance

### Optimization Strategies

1. **Accurate Item Size**: Better estimates = smoother scrolling
2. **Appropriate Overscan**: Balance between performance and UX
3. **Request Batching**: Reduce network overhead
4. **DOM Recycling**: Reuse elements efficiently
5. **Event Throttling**: Prevent excessive updates

### Performance Monitoring

```typescript
// Enable performance monitoring
const viewport = pipe(
  createViewport(config),
  withPerformance({
    measureRenders: true,
    logSlowFrames: true,
    slowFrameThreshold: 32, // ms
  })
);

// Get metrics
const metrics = viewport.performance.getMetrics();
console.log(metrics);
// {
//   averageRenderTime: 12.5,
//   slowFrames: 3,
//   totalFrames: 1000,
//   recyclePoolSize: 50
// }
```

## Troubleshooting

### Common Issues

1. **Placeholders Not Replaced**
   - Check network speed and timeouts
   - Verify event chain is working
   - Look for velocity threshold issues
   - See [Collection Feature](./features/collection.md#troubleshooting)

2. **Jumpy Scrolling**
   - Enable auto-detection or set accurate `itemSize`
   - Check for synchronous operations
   - Enable item size caching
   - Review render performance

3. **Memory Leaks**
   - Call `destroy()` when done
   - Check event listener cleanup
   - Monitor recycle pool size
   - Review custom features

4. **Slow Performance**
   - Reduce overscan buffer
   - Optimize item templates
   - Enable request batching
   - Profile with Performance feature

### Debug Mode

```typescript
// Enable debug logging
VIEWPORT_CONSTANTS.DEBUG = true;

// Or per-feature debugging
const viewport = createViewport({
  debug: {
    scrolling: true,
    collection: true,
    rendering: true,
  },
});
```

## Configuration

See [Constants Reference](./constants.md) for all configuration options.

## Fixed Issues

### v1.2.0 - Critical: Stale Request Queue Blocking

**Problem**: Placeholders would not be replaced on slow networks when users scrolled quickly through the viewport. Old requests in the queue would block new requests for the current visible range.

**Solution**: Implemented intelligent queue management that:

- Removes stale requests when idle is detected
- Prioritizes the current visible range
- Maintains a buffer zone for smooth scrolling
- Properly resolves removed requests to prevent memory leaks

**Testing**: Verified with Chrome DevTools network throttling (Fast 4G, Slow 4G, 3G) and Firefox Developer Edition (GPRS).

See [Collection Feature Documentation](./features/collection.md#critical-bug-fix-stale-request-queue-blocking-v120) for detailed analysis and implementation details.

### v1.1.0 - Placeholder Replacement Issues

Previous fixes for slow network scenarios:

- Added automatic queue processing after successful loads
- Implemented periodic safety checks for stuck queues
- Enhanced drag-end handling to check visible ranges
