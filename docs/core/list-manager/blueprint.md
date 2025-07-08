# List Manager Technical Blueprint

## Overview

The List Manager is the **performance and UI management layer** in the 3-layer mtrl-addons architecture. It handles pure virtual scrolling, element recycling, viewport management, and collection coordination - with **zero native scrolling**.

## 3-Layer Architecture

```
Collection (Data Layer)           ← Separate Blueprint
    ↓
List Manager (Performance Layer)  ← THIS BLUEPRINT
    ↓
List Component (Presentation Layer) ← mtrl Integration
```

## 🎯 **CRITICAL: mtrl Composition Pattern**

The List Manager **MUST** follow mtrl's established functional composition pattern using `pipe` and enhancers, **NOT** classes.

### ✅ Correct Pattern (mtrl Style)

```typescript
// List Manager creation using functional composition
const listManager = pipe(
  createListManagerBase,
  withViewport({
    orientation: "vertical",
    estimatedItemSize: 50,
    overscan: 5,
  }),
  withCollection({
    adapter: apiAdapter,
    rangeSize: 20,
    strategy: "page",
  }),
  withSpeedTracking({
    fastThreshold: 1000,
    slowThreshold: 100,
  }),
  withPlaceholders({
    enabled: true,
    maskCharacter: "░",
  }),
  withElementRecycling({
    // Phase 2
    enabled: true,
    poolSize: 50,
  }),
  withPerformance({
    // Phase 2
    frameScheduling: true,
    memoryCleanup: true,
  })
)(config);
```

### ❌ Incorrect Pattern (Classes - Don't Use)

```typescript
// DON'T DO THIS - No classes in mtrl
class ListManager {
  constructor(config) { ... }
  initialize() { ... }
}

class ViewportFeature {
  constructor() { ... }
}
```

### Feature Enhancers Structure

```typescript
// Each feature is a functional enhancer
export const withViewport =
  (config: ViewportConfig) =>
  <T extends ListManagerComponent>(component: T): T & ViewportComponent => {
    // Functional enhancement logic
    return {
      ...component,
      viewport: {
        scrollToIndex: (index: number) => {
          /* implementation */
        },
        calculateVisibleRange: () => {
          /* implementation */
        },
        updateScrollbar: () => {
          /* implementation */
        },
        // ... other viewport methods
      },
    };
  };

export const withCollection =
  (config: CollectionConfig) =>
  <T extends ListManagerComponent>(component: T): T & CollectionComponent => {
    // Functional enhancement logic
    return {
      ...component,
      collection: {
        loadRange: (range: ItemRange) => {
          /* implementation */
        },
        trackSpeed: (speed: number) => {
          /* implementation */
        },
        showPlaceholders: (range: ItemRange) => {
          /* implementation */
        },
        // ... other collection methods
      },
    };
  };
```

## List Manager Responsibilities (Performance/UI Only)

### ✅ What List Manager DOES Handle:

- **Pure Virtual Scrolling** - custom scrollbar with container positioning
- **Viewport Management** - orientation, item sizing, visible range calculations
- **Element Recycling** - DOM element pool management (Phase 2)
- **Collection Coordination** - speed-based loading triggers
- **Range-based Pagination** - intelligent data preloading
- **Placeholder System** - structure analysis and masked placeholder generation
- **Performance Optimization** - frame scheduling, memory management

### ❌ What List Manager DOES NOT Handle:

- Data operations (Collection responsibility)
- API integration (Collection responsibility)
- CSS styling (List Component responsibility)
- Template rendering (List Component responsibility)

## Core Architecture - Simplified Features

### System Structure

```
src/core/list-manager/
├── index.ts                    # Main exports
├── list-manager.ts            # Core factory function
├── constants.ts               # Configurable performance constants
├── types.ts                   # Core type definitions
├── features/                  # Direct features (NO plugin system)
│   ├── viewport.ts            # Complete viewport management
│   │   ├── orientation       # vertical/horizontal handling
│   │   ├── virtual-scrolling # pure virtual scroll calculations
│   │   ├── custom-scrollbar  # scrollbar UI and interactions
│   │   ├── item-sizing       # dynamic size measurement
│   │   └── element-recycling # DOM element pool (Phase 2)
│   ├── collection.ts          # Collection integration
│   │   ├── speed-tracking    # scroll speed calculation
│   │   ├── range-loading     # intelligent data loading
│   │   ├── placeholder       # empty item handling
│   │   └── pagination-trigger # when to load more data
│   └── api.ts                 # Event bridge to components
└── utils/                     # Performance utilities
    ├── calculations.ts        # Viewport math
    ├── speed-tracker.ts       # Scroll speed measurement
    └── range-calculator.ts    # Range and pagination logic
```

## Pure Virtual Scrolling Mechanism

### Container Positioning Strategy

**Orientation-Aware Layout:**

```
Vertical List:
Viewport Container (overflow: hidden, height: 500px)
├── Items Container (transform: translateY(-2000px))
│   ├── Item 40 (position: relative, natural flow)
│   ├── Item 41 (position: relative, natural flow)
│   └── ... (only visible + buffer items)
└── Custom Scrollbar (vertical)
    ├── Track (visual representation)
    └── Thumb (position based on virtual scroll)

Horizontal List:
Viewport Container (overflow: hidden, width: 500px)
├── Items Container (transform: translateX(-2000px))
│   ├── Item 40 (position: relative, natural flow)
│   ├── Item 41 (position: relative, natural flow)
│   └── ... (only visible + buffer items)
└── Custom Scrollbar (horizontal)
    ├── Track (visual representation)
    └── Thumb (position based on virtual scroll)
```

**Key Benefits:**

- **Single transform per scroll** - Only move the container, not individual items
- **Orientation-agnostic** - Same logic works for vertical/horizontal lists
- **Natural item sizing** - Items can have different sizes, container adapts
- **Efficient DOM updates** - One CSS transform vs N transforms

### Scrolling Flow

```
Mouse Wheel Event (deltaY for vertical, deltaX for horizontal)
    ↓
Update Virtual Position (virtualScrollPosition += delta)
    ↓
Calculate Visible Range (items 40-49)
    ↓
Calculate Speed (px/ms ratio)
    ↓
Speed Check
    ├── Fast → Show placeholders, defer loading
    └── Slow → Load missing ranges immediately
    ↓
Update Container Position (translateY/translateX)
    ↓
Update Scrollbar Thumb Position
    ↓
Render Visible Items
```

## Speed-Based Loading System

### Speed Calculation

```typescript
interface SpeedTracker {
  // Track scroll velocity (orientation-agnostic)
  velocity: number; // px/ms
  direction: "forward" | "backward"; // scroll direction (vertical: down/up, horizontal: right/left)
  isAccelerating: boolean; // velocity increasing

  // Configurable thresholds
  FAST_SCROLL_THRESHOLD: number; // defer loading above this speed
  SLOW_SCROLL_THRESHOLD: number; // load immediately below this speed
  DECELERATION_FACTOR: number; // how quickly speed decreases
}
```

### Loading Strategy

```typescript
// Speed-based loading decision
const handleScrollSpeed = (speed: number, visibleRange: ItemRange) => {
  if (speed > FAST_SCROLL_THRESHOLD) {
    // User is seeking rapidly - don't spam requests
    showPlaceholders(visibleRange);
    deferLoading();
  } else if (speed < SLOW_SCROLL_THRESHOLD) {
    // User is reading - load proactively
    loadMissingRanges(visibleRange);
    maintainBuffer();
  }
  // Medium speed - continue with current strategy
};
```

## Range-Based Pagination Strategy

### Intelligent Range Loading

```typescript
interface RangeStrategy {
  // Initial load calculation
  viewportCapacity: number; // items visible in viewport
  rangeSize: number; // items per range (old pageSize)
  bufferSize: number; // extra items to maintain

  // Loading logic
  initialRanges: number; // ranges to load at start
  prefetchRanges: number; // ranges to load ahead
}

// Examples:
// Viewport: 10 items, Range: 20 items → Load 1 range (10 buffer)
// Viewport: 30 items, Range: 20 items → Load 2 ranges (10 buffer)
```

### Pagination Strategies Supported

The List Manager supports three pagination strategies via Collection integration:

#### 1. Page Strategy (Traditional)

```typescript
// Request format
{
  page: 1,        // page number (1-based)
  limit: 20,      // items per page
  // Optional filters, sorting, etc.
}

// Response format
{
  items: [...],
  meta: {
    page: 1,
    limit: 20,
    total: 1000,
    totalPages: 50,
    hasNext: true,
    hasPrev: false
  }
}

// Use case: Traditional pagination, known total count
// Examples: admin panels, search results with page numbers
```

#### 2. Offset Strategy (Database-style)

```typescript
// Request format
{
  offset: 0,      // starting position (0-based)
  limit: 20,      // items to fetch
  // Optional filters, sorting, etc.
}

// Response format
{
  items: [...],
  meta: {
    offset: 0,
    limit: 20,
    total: 1000,    // total available items
    hasNext: true,
    hasPrev: false
  }
}

// Use case: Large datasets, precise positioning
// Examples: virtual scrolling with jump-to-position, database queries
```

#### 3. Cursor Strategy (Infinite Scroll)

```typescript
// Initial request
{
  limit: 20,
  // No cursor for first request
}

// Subsequent requests
{
  cursor: "eyJpZCI6MTIzfQ==",  // opaque cursor token
  limit: 20,
}

// Response format
{
  items: [...],
  meta: {
    limit: 20,
    hasNext: true,
    nextCursor: "eyJpZCI6MTQzfQ==",  // cursor for next batch
    // No total count (unknown/expensive to calculate)
  }
}

// Use case: Real-time feeds, infinite scroll without total count
// Examples: social media feeds, activity logs, live data streams
```

### Range Calculation Logic

```typescript
const calculateInitialLoad = (viewportCapacity: number, rangeSize: number) => {
  const requiredItems = viewportCapacity + BUFFER_SIZE;
  const requiredRanges = Math.ceil(requiredItems / rangeSize);

  return {
    offset: 0,
    limit: requiredRanges * rangeSize,
    ranges: requiredRanges,
  };
};

const calculateMissingRanges = (visibleRange: ItemRange, loadedData: any[]) => {
  const missingRanges = [];
  const startRange = Math.floor(visibleRange.start / RANGE_SIZE);
  const endRange = Math.floor(visibleRange.end / RANGE_SIZE);

  for (let range = startRange; range <= endRange; range++) {
    const rangeStart = range * RANGE_SIZE;
    const rangeEnd = rangeStart + RANGE_SIZE;

    if (!hasDataInRange(rangeStart, rangeEnd, loadedData)) {
      missingRanges.push({ offset: rangeStart, limit: RANGE_SIZE });
    }
  }

  return missingRanges;
};
```

## Core Features Implementation

### 1. Viewport Feature (Complete Virtual Scrolling)

```typescript
// Functional enhancer - NOT a class
export const withViewport =
  (config: ViewportConfig) =>
  <T extends ListManagerComponent>(component: T): T & ViewportComponent => {
    // Orientation handling
    let orientation: "vertical" | "horizontal" =
      config.orientation || "vertical";

    // Virtual scrolling state (orientation-agnostic)
    let virtualScrollPosition = 0;
    let totalVirtualSize = 0;
    let containerSize = 0;

    // Item sizing (orientation-agnostic)
    let estimatedItemSize = config.estimatedItemSize || 50;
    const measuredSizes = new Map<number, number>();

    // Custom scrollbar elements
    let scrollbarThumb: HTMLElement | null = null;
    let scrollbarTrack: HTMLElement | null = null;
    let thumbPosition = 0;

    // Viewport methods
    const viewport = {
      handleWheel: (event: WheelEvent) => {
        // Virtual scrolling logic
        event.preventDefault();
        const delta = orientation === "vertical" ? event.deltaY : event.deltaX;
        virtualScrollPosition += delta;
        updateContainerPosition();
        updateScrollbar();

        // Emit events
        component.emit?.("scroll:position:changed", {
          position: virtualScrollPosition,
          direction: delta > 0 ? "forward" : "backward",
        });
      },

      updateContainerPosition: () => {
        // Container positioning logic
        const visibleRange = calculateVisibleRange();
        const offset = calculateContainerOffset(visibleRange);
        const transformProperty =
          orientation === "vertical" ? "translateY" : "translateX";
        component.element.style.transform = `${transformProperty}(-${offset}px)`;
      },

      updateScrollbar: () => {
        // Scrollbar positioning logic
        if (!scrollbarThumb || !scrollbarTrack) return;

        const { thumbPosition: newThumbPosition, thumbSize } =
          calculateScrollbarMetrics({
            containerSize,
            totalVirtualSize,
            scrollPosition: virtualScrollPosition,
            orientation,
          });

        thumbPosition = newThumbPosition;

        if (orientation === "vertical") {
          scrollbarThumb.style.top = `${thumbPosition}px`;
          scrollbarThumb.style.height = `${thumbSize}px`;
        } else {
          scrollbarThumb.style.left = `${thumbPosition}px`;
          scrollbarThumb.style.width = `${thumbSize}px`;
        }
      },

      calculateVisibleRange: (): ItemRange => {
        return calculateVisibleRange({
          scrollPosition: virtualScrollPosition,
          containerSize,
          totalItems: component.totalItems || 0,
          estimatedItemSize,
          orientation,
          overscan: config.overscan || 5,
        });
      },

      measureItemSize: (element: HTMLElement, index: number) => {
        const size =
          orientation === "vertical"
            ? element.offsetHeight
            : element.offsetWidth;
        if (size > 0) {
          measuredSizes.set(index, size);
          updateEstimatedSize();
        }
      },

      scrollToIndex: (
        index: number,
        alignment: "start" | "center" | "end" = "start"
      ) => {
        const targetPosition = calculateScrollPositionForIndex(
          index,
          estimatedItemSize,
          measuredSizes,
          alignment,
          containerSize
        );
        virtualScrollPosition = Math.max(
          0,
          Math.min(targetPosition, totalVirtualSize - containerSize)
        );
        updateContainerPosition();
        updateScrollbar();
      },

      // Getters
      getScrollPosition: () => virtualScrollPosition,
      getContainerSize: () => containerSize,
      getOrientation: () => orientation,
      getEstimatedItemSize: () => estimatedItemSize,
      getMeasuredSizes: () => new Map(measuredSizes),
    };

    // Private helper functions
    const calculateContainerOffset = (visibleRange: ItemRange): number => {
      let offset = 0;
      for (let i = 0; i < visibleRange.start; i++) {
        offset += measuredSizes.get(i) || estimatedItemSize;
      }
      return offset;
    };

    const updateEstimatedSize = () => {
      if (measuredSizes.size > 0) {
        const sizes = Array.from(measuredSizes.values());
        const average =
          sizes.reduce((sum, size) => sum + size, 0) / sizes.length;
        estimatedItemSize = Math.max(1, Math.round(average));
      }
    };

    // Setup scrollbar on initialization
    const initialize = () => {
      setupScrollbar();
      setupEventListeners();
      measureContainer();
    };

    const setupScrollbar = () => {
      // Create scrollbar elements
      scrollbarTrack = document.createElement("div");
      scrollbarThumb = document.createElement("div");

      // Add styles and append to container
      component.element.appendChild(scrollbarTrack);
      scrollbarTrack.appendChild(scrollbarThumb);
    };

    const setupEventListeners = () => {
      component.element.addEventListener("wheel", viewport.handleWheel, {
        passive: false,
      });
    };

    const measureContainer = () => {
      containerSize =
        orientation === "vertical"
          ? component.element.offsetHeight
          : component.element.offsetWidth;
    };

    // Initialize immediately
    initialize();

    return {
      ...component,
      viewport,
    };
  };
```

### 2. Collection Feature (Data Management Integration)

```typescript
// Functional enhancer - NOT a class
export const withCollection =
  (config: CollectionConfig) =>
  <T extends ListManagerComponent>(component: T): T & CollectionComponent => {
    // Speed tracking state
    let speedTracker: SpeedTracker = {
      velocity: 0,
      direction: "forward",
      isAccelerating: false,
      lastMeasurement: Date.now(),
    };

    // Range management
    const loadedRanges = new Set<number>();
    const pendingRanges = new Set<number>();

    // Collection reference
    const collection = config.collection;

    // Pagination strategy
    let paginationStrategy: "page" | "offset" | "cursor" =
      config.strategy || "page";

    // Placeholder system
    let placeholderStructure: Map<string, { min: number; max: number }> | null =
      null;
    let placeholderTemplate:
      | ((item: any, index: number) => string | HTMLElement)
      | null = null;

    // Collection methods
    const collectionManager = {
      handleSpeedChange: (speed: number) => {
        speedTracker.velocity = speed;
        speedTracker.direction = speed > 0 ? "forward" : "backward";
        speedTracker.isAccelerating = speed > speedTracker.velocity;
        speedTracker.lastMeasurement = Date.now();

        // Speed-based loading decisions
        if (speed > config.fastThreshold) {
          // Fast scrolling - show placeholders, defer loading
          const visibleRange = component.viewport?.calculateVisibleRange();
          if (visibleRange) {
            showPlaceholders(visibleRange);
          }
        } else if (speed < config.slowThreshold) {
          // Slow scrolling - load immediately
          const visibleRange = component.viewport?.calculateVisibleRange();
          if (visibleRange) {
            loadMissingRanges(visibleRange);
          }
        }
      },

      loadMissingRanges: async (visibleRange: ItemRange) => {
        const rangeSize = config.rangeSize || 20;
        const startRange = Math.floor(visibleRange.start / rangeSize);
        const endRange = Math.floor(visibleRange.end / rangeSize);

        for (let range = startRange; range <= endRange; range++) {
          if (!loadedRanges.has(range) && !pendingRanges.has(range)) {
            pendingRanges.add(range);

            try {
              const items = await collection.loadRange(
                range * rangeSize,
                rangeSize
              );
              updateLoadedData(items, range * rangeSize);
              loadedRanges.add(range);
            } catch (error) {
              console.error("Failed to load range:", range, error);
            } finally {
              pendingRanges.delete(range);
            }
          }
        }
      },

      showPlaceholders: (range: ItemRange) => {
        if (!placeholderStructure || !placeholderTemplate) return;

        const placeholderItems = [];
        for (let i = range.start; i <= range.end; i++) {
          const placeholderItem = generatePlaceholderItem(i);
          placeholderItems.push(placeholderItem);
        }

        // Render placeholders
        component.emit?.("placeholders:shown", {
          range,
          items: placeholderItems,
        });
      },

      updateLoadedData: (items: any[], offset: number) => {
        // Update component's data
        component.items = component.items || [];
        items.forEach((item, index) => {
          component.items[offset + index] = item;
        });

        // Emit data update event
        component.emit?.("range:loaded", {
          range: { start: offset, end: offset + items.length - 1 },
          items,
        });
      },

      adaptPaginationStrategy: (strategy: "page" | "offset" | "cursor") => {
        paginationStrategy = strategy;
        // Reset loaded ranges when strategy changes
        loadedRanges.clear();
        pendingRanges.clear();
      },

      analyzeDataStructure: (items: any[]) => {
        if (!items.length) return;

        const structure = new Map<string, { min: number; max: number }>();

        items.forEach((item) => {
          Object.keys(item).forEach((key) => {
            const value = String(item[key] || "");
            const length = value.length;

            if (!structure.has(key)) {
              structure.set(key, { min: length, max: length });
            } else {
              const current = structure.get(key)!;
              structure.set(key, {
                min: Math.min(current.min, length),
                max: Math.max(current.max, length),
              });
            }
          });
        });

        placeholderStructure = structure;
        component.emit?.("structure:analyzed", { structure });
      },

      generatePlaceholderItem: (index: number): any => {
        if (!placeholderStructure) return {};

        const placeholder: Record<string, any> = {};
        placeholderStructure.forEach((range, key) => {
          const length =
            Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
          placeholder[key] =
            config.maskCharacter?.repeat(length) || "░".repeat(length);
        });

        return placeholder;
      },

      // Getters
      getSpeedTracker: () => ({ ...speedTracker }),
      getLoadedRanges: () => new Set(loadedRanges),
      getPendingRanges: () => new Set(pendingRanges),
      getPaginationStrategy: () => paginationStrategy,
      getPlaceholderStructure: () =>
        placeholderStructure ? new Map(placeholderStructure) : null,
    };

    // Helper functions
    const generatePlaceholderItem = collectionManager.generatePlaceholderItem;
    const showPlaceholders = collectionManager.showPlaceholders;
    const loadMissingRanges = collectionManager.loadMissingRanges;
    const updateLoadedData = collectionManager.updateLoadedData;

    return {
      ...component,
      collection: collectionManager,
    };
  };
```

## Simplified Placeholder System

### Structure Analysis Approach

The List Manager implements a simplified but effective placeholder system:

1. **Single "Masked" Mode Only** - Use only `░` characters for masking
2. **Post-Initial-Load Analysis** - Analyze structure after first successful data load
3. **Length Pattern Detection** - Extract min/max length ranges for each property
4. **Template-Based Generation** - Use same template system with masked data
5. **Index-Based Replacement** - Replace by array position when real data arrives

### When Structure Analysis Occurs

```typescript
// After initial load (few ms delay acceptable)
const handleInitialDataLoad = (items: any[]) => {
  if (items.length > 0 && !this.placeholderStructure) {
    this.analyzeDataStructure(items);
  }
  // Continue with normal rendering
};

// No re-analysis for structure changes (future enhancement)
// No optional field handling (future enhancement)
```

**Important Notes:**

- **Initial Load Behavior**: The initial load will NOT show placeholders since structure analysis happens after the first successful data load
- **Analysis Timing**: Structure analysis only takes a few milliseconds and happens once
- **Future Enhancements**: Re-analysis for structure changes and optional field handling are not implemented (future scope)

### Structure Analysis Implementation

```typescript
const analyzeDataStructure = (
  items: any[]
): Map<string, { min: number; max: number }> => {
  const structure = new Map();

  // Analyze all items to find length patterns
  items.forEach((item) => {
    Object.keys(item).forEach((key) => {
      const value = String(item[key] || ""); // Convert to string for length
      const length = value.length;

      if (!structure.has(key)) {
        structure.set(key, { min: length, max: length });
      } else {
        const current = structure.get(key);
        structure.set(key, {
          min: Math.min(current.min, length),
          max: Math.max(current.max, length),
        });
      }
    });
  });

  return structure;
};
```

### Placeholder Generation

```typescript
const generatePlaceholderItem = (index: number): any => {
  if (!this.placeholderStructure) return null;

  const placeholder = {};

  // Generate masked values with random lengths within detected ranges
  this.placeholderStructure.forEach((range, key) => {
    const length =
      Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
    placeholder[key] = "░".repeat(length);
  });

  return placeholder;
};
```

### Template Integration

```typescript
const showPlaceholders = (range: ItemRange): void => {
  const placeholderItems = [];

  for (let i = range.start; i <= range.end; i++) {
    const placeholderItem = this.generatePlaceholderItem(i);
    if (placeholderItem && this.placeholderTemplate) {
      // Use same template system with masked data
      const element = this.placeholderTemplate(placeholderItem, i);

      // Add CSS class for styling if defined
      if (
        typeof element === "object" &&
        element.classList &&
        PLACEHOLDER_CLASS
      ) {
        element.classList.add(PLACEHOLDER_CLASS);
      }

      placeholderItems.push(element);
    }
  }

  // Render placeholder items in viewport
  this.renderPlaceholders(placeholderItems, range);
};
```

### CSS Class Integration

```typescript
// Optional placeholder styling class
const PLACEHOLDER_CLASS =
  LIST_MANAGER_CONSTANTS.PLACEHOLDER?.CLASS_NAME || null;

const removePlaceholderStyling = (element: HTMLElement): void => {
  // Only remove class if defined (more efficient)
  if (PLACEHOLDER_CLASS && element.classList) {
    element.classList.remove(PLACEHOLDER_CLASS);
  }
};
```

### Example Flow

```typescript
// 1. Initial load completes
const items = [
  {
    name: "Michael Hunter",
    email: "michael.hunter1@example.com",
    role: "Director of Product",
  },
  {
    name: "Sarah Chen",
    email: "sarah.chen@company.co",
    role: "Senior Engineer",
  },
];

// 2. Analyze structure (happens once)
const structure = analyzeDataStructure(items);
// Result: {
//   name: {min: 9, max: 14},
//   email: {min: 22, max: 29},
//   role: {min: 15, max: 20}
// }

// 3. Generate placeholder when needed
const placeholder = generatePlaceholderItem(10);
// Result: {
//   name: "░░░░░░░░░░░░",
//   email: "░░░░░░░░░░░░░░░░░░░░░░░░░░",
//   role: "░░░░░░░░░░░░░░░░░"
// }

// 4. Use same template system
const element = template(placeholder, 10);
// Template renders: <div class="user-item mtrl-placeholder">...</div>

// 5. Replace by index when real data arrives
const realData = await collection.loadRange(10, 20);
this.updateLoadedData(realData, 10); // Replace by array position
```

## Configurable Constants

```typescript
// constants.ts - All values configurable
export const LIST_MANAGER_CONSTANTS = {
  VIRTUAL_SCROLL: {
    DEFAULT_ITEM_SIZE: 50, // works for both width/height depending on orientation
    OVERSCAN_BUFFER: 5,
    SCROLL_SENSITIVITY: 1.0,
  },

  SPEED_TRACKING: {
    FAST_SCROLL_THRESHOLD: 1000, // px/ms - defer loading above this
    SLOW_SCROLL_THRESHOLD: 100, // px/ms - load immediately below this
    DECELERATION_FACTOR: 0.95, // velocity decay per frame
    MEASUREMENT_WINDOW: 100, // ms - window for speed calculation
  },

  RANGE_LOADING: {
    DEFAULT_RANGE_SIZE: 20, // items per range (old pageSize)
    BUFFER_SIZE: 10, // extra items to maintain
    PREFETCH_RANGES: 1, // ranges to load ahead
    MAX_CONCURRENT_REQUESTS: 3, // prevent request spam
  },

  SCROLLBAR: {
    TRACK_WIDTH: 12, // for vertical scrollbar, becomes height for horizontal
    THUMB_MIN_SIZE: 20, // minimum thumb size
    FADE_TIMEOUT: 1500,
    BORDER_RADIUS: 6,
  },

  RECYCLING: {
    ENABLED: false, // Phase 2 feature
    POOL_SIZE: 50,
    CLEANUP_INTERVAL: 30000,
  },

  PLACEHOLDER: {
    CLASS_NAME: "mtrl-placeholder", // CSS class for placeholder styling (optional)
    MASK_CHARACTER: "░", // Character used for masking
    ANALYZE_AFTER_INITIAL_LOAD: true, // Analyze structure after first data load
    RANDOM_LENGTH_VARIANCE: true, // Use random lengths within detected ranges
  },

  PERFORMANCE: {
    FRAME_BUDGET: 16.67, // 60fps target
    THROTTLE_SCROLL: 16, // ms - scroll event throttling
    DEBOUNCE_LOADING: 50, // ms - loading request debouncing
  },
};
```

## Core List Manager API

```typescript
// List Manager created with functional composition
const listManager = pipe(
  createListManagerBase,
  withViewport(...),
  withCollection(...),
  // ... other enhancers
)(config);

// Viewport methods (via withViewport enhancer)
listManager.viewport.scrollToIndex(index: number, alignment?: "start" | "center" | "end"): void;
listManager.viewport.scrollToPage(page: number, alignment?: "start" | "center" | "end"): void;
listManager.viewport.getScrollPosition(): number;
listManager.viewport.getVisibleRange(): ItemRange;
listManager.viewport.getViewportInfo(): ViewportInfo;
listManager.viewport.updateViewport(): void;

// Collection methods (via withCollection enhancer)
listManager.collection.setItems(items: any[]): void;
listManager.collection.setTotalItems(total: number): void;
listManager.collection.getItems(): any[];
listManager.collection.getTotalItems(): number;
listManager.collection.setPaginationStrategy(strategy: "page" | "offset" | "cursor"): void;
listManager.collection.getPaginationStrategy(): "page" | "offset" | "cursor";

// Configuration methods (via base)
listManager.updateConfig(config: Partial<ListManagerConfig>): void;
listManager.getConfig(): ListManagerConfig;

// Event methods (via mtrl event system)
listManager.on(event: string, handler: Function): () => void;  // returns unsubscribe
listManager.emit(event: string, data: any): void;

// Lifecycle methods (via base)
listManager.initialize(): void;
listManager.destroy(): void;

// Speed tracking methods (via withSpeedTracking enhancer - Phase 2)
listManager.speedTracker?.getCurrentSpeed(): number;
listManager.speedTracker?.getDirection(): "forward" | "backward";

// Element recycling methods (via withElementRecycling enhancer - Phase 2)
listManager.recycling?.getPoolMetrics(): RecyclingMetrics;
listManager.recycling?.cleanup(): void;

// Performance methods (via withPerformance enhancer - Phase 2)
listManager.performance?.getMetrics(): PerformanceMetrics;
listManager.performance?.optimizeFrameScheduling(): void;
```

## Configuration Types

```typescript
export interface ListManagerConfig {
  // Container
  container: HTMLElement;

  // Collection integration
  collection?: CollectionConfig;
  items?: any[];

  // Template
  template?: {
    template: (item: any, index: number) => string | HTMLElement;
  };

  // Virtual scrolling
  virtual: {
    enabled: boolean;
    itemSize: number | "auto";
    estimatedItemSize: number;
    overscan: number;
  };

  // Orientation
  orientation: {
    orientation: "vertical" | "horizontal";
    reverse: boolean;
    crossAxisAlignment: "start" | "center" | "end" | "stretch";
  };

  // Initial loading (viewport-based calculation)
  initialLoad: {
    strategy: "placeholders" | "direct";
    viewportMultiplier: number; // 1.5x viewport capacity
    minItems: number;
    maxItems: number;
  };

  // Error handling
  errorHandling: {
    timeout: number; // 3 seconds
    showErrorItems: boolean; // debug feature
    retryAttempts: number;
    preserveScrollOnError: boolean;
  };

  // Precise positioning (scrollbar behavior)
  positioning: {
    precisePositioning: boolean; // scrollbar is source of truth
    allowPartialItems: boolean; // allow partial items at edges
    snapToItems: boolean; // false for precise positioning
  };

  // Boundaries
  boundaries: {
    preventOverscroll: boolean;
    maintainEdgeRanges: boolean;
    boundaryResistance: number;
  };

  // Element recycling (Phase 2)
  recycling: {
    enabled: boolean;
    maxPoolSize: number;
    minPoolSize: number;
  };

  // Performance
  performance: {
    frameScheduling: boolean;
    memoryCleanup: boolean;
  };

  // Intersection observers
  intersection: {
    pagination: {
      enabled: boolean;
      rootMargin: string;
      threshold: number;
    };
    loading: {
      enabled: boolean;
    };
  };

  // Debug
  debug: boolean;
  prefix: string;
  componentName: string;
}
```

## Implementation Flow

### Phase 1: Core Virtual Scrolling (Current)

1. **Viewport Feature**

   - Pure virtual scrolling with container positioning
   - Custom scrollbar implementation
   - Mouse wheel handling
   - Orientation support

2. **Collection Feature**
   - Speed-based loading
   - Range calculation
   - Collection integration
   - Placeholder handling

### Phase 2: Optimization (Later)

1. **Element Recycling**

   - DOM element pool
   - Reuse strategy
   - Memory optimization

2. **Advanced Features**
   - Smooth scrolling
   - Performance monitoring
   - Position restoration

## Event System

```typescript
export enum ListManagerEvents {
  // Virtual scrolling
  VIEWPORT_CHANGED = "viewport:changed",
  SCROLL_POSITION_CHANGED = "scroll:position:changed",
  VIRTUAL_RANGE_CHANGED = "virtual:range:changed",

  // Collection coordination
  LOADING_TRIGGERED = "loading:triggered",
  SPEED_CHANGED = "speed:changed",
  RANGE_LOADED = "range:loaded",

  // Orientation
  ORIENTATION_CHANGED = "orientation:changed",
  DIMENSIONS_CHANGED = "orientation:dimensions:changed",
}
```

## Integration Pattern

```typescript
// mtrl-style functional composition
import { pipe } from "mtrl/core/compose";
import {
  createListManagerBase,
  withViewport,
  withCollection,
  withSpeedTracking,
  withPlaceholders,
  withElementRecycling, // Phase 2
  withPerformance, // Phase 2
} from "mtrl-addons/core/list-manager";

// Create List Manager using pipe composition
const listManager = pipe(
  createListManagerBase,
  withViewport({
    orientation: "vertical",
    estimatedItemSize: 50,
    overscan: 5,
  }),
  withCollection({
    collection: apiAdapter,
    rangeSize: 20, // old pageSize
    strategy: "page",
    fastThreshold: 1000,
    slowThreshold: 100,
  }),
  withSpeedTracking({
    measurementWindow: 100,
    decelerationFactor: 0.95,
  }),
  withPlaceholders({
    enabled: true,
    maskCharacter: "░",
    analyzeAfterInitialLoad: true,
  }),

  // Phase 2 features
  withElementRecycling({
    enabled: true,
    poolSize: 50,
    cleanupInterval: 30000,
  }),
  withPerformance({
    frameScheduling: true,
    memoryCleanup: true,
    targetFPS: 60,
  })
)({
  // Base configuration
  container: document.getElementById("list"),
  items: [], // optional initial items
  template: {
    template: (item, index) => `<div class="user-item">${item.name}</div>`,
  },

  // New Phase 1 configurations
  initialLoad: {
    strategy: "placeholders", // or "direct"
    viewportMultiplier: 1.5, // load 1.5x viewport capacity
    minItems: 10,
    maxItems: 100,
  },

  errorHandling: {
    timeout: 3000, // 3 seconds
    showErrorItems: true, // debug feature
    retryAttempts: 2,
    preserveScrollOnError: true,
  },

  positioning: {
    precisePositioning: true, // scrollbar is source of truth
    allowPartialItems: true, // show partial items at edges
    snapToItems: false, // no snapping for precise positioning
  },

  boundaries: {
    preventOverscroll: true,
    maintainEdgeRanges: true,
    boundaryResistance: 0.3,
  },

  debug: true,
});

// Usage with functional methods
listManager.viewport.scrollToIndex(1000, "center");
listManager.viewport.scrollToPage(50);
listManager.collection.adaptPaginationStrategy("offset");

// Event subscription using mtrl patterns
listManager.on?.("scroll:position:changed", (data) => {
  console.log("Scrolled to:", data.position);
});

listManager.on?.("range:loaded", (data) => {
  console.log("Loaded range:", data.range);
});
```

### Factory Function Pattern

```typescript
// createListManagerBase - follows mtrl createBase pattern
export const createListManagerBase = (config: ListManagerConfig) => {
  const base = createBase(config); // mtrl's base component

  return {
    ...base,
    element: config.container,
    items: config.items || [],
    totalItems: 0,
    template: config.template?.template || null,

    // Core List Manager methods
    initialize: () => {
      // Base initialization
    },

    destroy: () => {
      // Cleanup
    },

    // Event system integration
    emit: base.emit || (() => {}),
    on: base.on || (() => {}),
    off: base.off || (() => {}),
  };
};
```
