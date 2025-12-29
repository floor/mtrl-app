# Viewport Constants Reference

> **Created:** June 2025
> **Updated:** December 29, 2025

This document provides a complete reference of all constants used in the viewport system. These constants control various aspects of viewport behavior and can be modified globally.

## Overview

Constants are organized into logical groups and can be accessed via:

```typescript
import { VIEWPORT_CONSTANTS } from "mtrl-addons/core/viewport/constants";
```

To override constants globally:

```typescript
// Override specific constants
VIEWPORT_CONSTANTS.MOMENTUM.ENABLED = false;
VIEWPORT_CONSTANTS.LOADING.CANCEL_THRESHOLD = 50; // Very permissive for admin apps
```

## Virtual Scrolling Constants

Controls core virtual scrolling behavior.

```typescript
VIRTUAL_SCROLL: {
  DEFAULT_ITEM_SIZE: 84,        // Default height/width of items in pixels
  OVERSCAN_BUFFER: 2,           // Number of items to render outside visible area
  SCROLL_SENSITIVITY: 0.2,      // Scroll speed multiplier
  MAX_VIRTUAL_SIZE: 10000000,   // Maximum virtual container size (10M pixels)
  AUTO_DETECT_ITEM_SIZE: true   // Enable automatic item size detection by default
}
```

### Usage Notes

- `DEFAULT_ITEM_SIZE`: Set this close to your actual item size for better initial rendering
- `OVERSCAN_BUFFER`: Higher values prevent flicker but use more memory
- `SCROLL_SENSITIVITY`: Lower values make scrolling feel heavier
- `MAX_VIRTUAL_SIZE`: Prevents browser limitations with huge datasets
- `AUTO_DETECT_ITEM_SIZE`: When enabled and no itemSize is provided, the viewport will automatically measure and use the actual size of rendered items

## Scrolling Settings

Controls scroll behavior and performance.

```typescript
SCROLLING: {
  OVERSCAN: 1; // Items to render outside viewport
}
```

## Rendering Settings

Controls DOM rendering and element recycling.

```typescript
RENDERING: {
  DEFAULT_MAX_POOL_SIZE: 100; // Max recycled elements to keep in memory
}
```

### Usage Notes

- `DEFAULT_MAX_POOL_SIZE`: Balance between memory usage and allocation performance

## Loading Settings

Controls progressive data loading behavior.

```typescript
LOADING: {
  CANCEL_THRESHOLD: 20,         // px/ms - velocity above which loads are cancelled (default: 20)
  MAX_CONCURRENT_REQUESTS: 1,   // Parallel data requests allowed
  DEFAULT_RANGE_SIZE: 20,       // Items to load per request
  DEBOUNCE_LOADING: 150,        // Debounce delay for load requests (ms)
  MIN_RANGE_SIZE: 10,           // Minimum items per load
  MAX_RANGE_SIZE: 100,          // Maximum items per load
  REQUEST_TIMEOUT: 5000,        // Request timeout (ms)
  RETRY_ATTEMPTS: 2,            // Failed request retry count
  RETRY_DELAY: 1000             // Delay between retries (ms)
}
```

### Critical Settings

- `CANCEL_THRESHOLD`: Default is 20 px/ms. Lower values show placeholders earlier (preserve bandwidth). Higher values load data even during faster scrolling.
- `MAX_CONCURRENT_REQUESTS`: Higher values can overwhelm slow servers
- `DEFAULT_RANGE_SIZE`: Balance between request count and response size

## Request Queue Configuration

Controls request queuing behavior.

```typescript
REQUEST_QUEUE: {
  ENABLED: true,                // Enable request queuing
  MAX_QUEUE_SIZE: 1,            // Max queued requests
  MAX_ACTIVE_REQUESTS: 2        // Max concurrent active requests
}
```

### Usage Notes

- `MAX_QUEUE_SIZE`: Prevents memory buildup from too many queued requests
- `MAX_ACTIVE_REQUESTS`: Should match server capacity

## Selection Settings

Controls selection state management.

```typescript
SELECTION: {
  SELECTED_CLASS: "viewport-item--selected"  // CSS class for selected items
}
```

### Usage Notes

- `SELECTED_CLASS`: Applied to items that are currently selected

## Placeholder Settings

Controls placeholder generation and display.

```typescript
PLACEHOLDER: {
  MASK_CHARACTER: "X",          // Character for masked content
  CLASS: "viewport-item__placeholder",  // CSS class name
  MAX_SAMPLE_SIZE: 20,          // Max items to analyze for patterns
  PLACEHOLDER_FLAG: "_placeholder",     // Property marking placeholders
  RANDOM_LENGTH_VARIANCE: true  // Vary placeholder lengths for realism
}
```

## Speed Tracking

Controls velocity and momentum calculations.

```typescript
SPEED_TRACKING: {
  DECELERATION_FACTOR: 0.85; // Velocity decay per frame (0-1)
}
```

## Momentum Settings

Controls momentum scrolling behavior.

```typescript
MOMENTUM: {
  ENABLED: true,                // Enable momentum by default
  DECELERATION_FACTOR: 0.85,    // How quickly velocity decreases per frame
  MIN_VELOCITY: 0.1,            // Minimum velocity before stopping (px/ms)
  MIN_DURATION: 300,            // Maximum gesture duration to trigger momentum (ms)
  MIN_VELOCITY_THRESHOLD: 0.5,  // Minimum velocity to trigger momentum (px/ms)
  FRAME_TIME: 16                // Assumed frame time for calculations (ms)
}
```

### Tuning Momentum

- `DECELERATION_FACTOR`: Higher = longer coast, lower = quicker stop
- `MIN_VELOCITY`: Lower = longer scrolls, higher = snappier feel
- `MIN_DURATION`: Filters out slow drags from triggering momentum

## Initial Load Configuration

Controls initial viewport population.

```typescript
INITIAL_LOAD: {
  STRATEGY: "placeholders",     // "placeholders" | "direct" | "progressive"
  VIEWPORT_MULTIPLIER: 1.5,     // Load 1.5x viewport capacity
  MIN_ITEMS: 10,                // Minimum initial items
  MAX_ITEMS: 100,               // Maximum initial items
  PLACEHOLDER_COUNT: 20,        // Default placeholder count
  SHOW_LOADING_STATE: true,     // Show loading indicator
  LOADING_DELAY: 100            // Delay before showing loading state (ms)
}
```

## Scrollbar Settings

Controls custom scrollbar appearance.

```typescript
SCROLLBAR: {
  CLASSES: {
    SCROLLBAR: "viewport__scrollbar",
    SCROLLBAR_TRACK: "viewport__scrollbar-track",
    SCROLLBAR_THUMB: "viewport__scrollbar-thumb",
    SCROLLBAR_VISIBLE: "viewport__scrollbar--visible",
    SCROLLBAR_DRAGGING: "viewport__scrollbar--dragging",
    SCROLLBAR_THUMB_DRAGGING: "viewport__scrollbar-thumb--dragging"
  }
}
```

## Orientation Settings

Controls viewport orientation defaults.

```typescript
ORIENTATION: {
  DEFAULT_ORIENTATION: "vertical",      // "vertical" | "horizontal"
  DEFAULT_CROSS_AXIS_ALIGNMENT: "stretch",
  REVERSE_DIRECTION: false              // Reverse scroll direction
}
```

## Common Configuration Patterns

### High Performance Configuration

```typescript
// Optimize for performance
VIEWPORT_CONSTANTS.VIRTUAL_SCROLL.OVERSCAN_BUFFER = 1;
VIEWPORT_CONSTANTS.RENDERING.DEFAULT_MAX_POOL_SIZE = 50;
VIEWPORT_CONSTANTS.LOADING.DEFAULT_RANGE_SIZE = 50;
VIEWPORT_CONSTANTS.LOADING.MAX_CONCURRENT_REQUESTS = 3;
```

### Slow Network Configuration

```typescript
// Optimize for slow networks
VIEWPORT_CONSTANTS.LOADING.CANCEL_THRESHOLD = 10; // Lower threshold - show placeholders earlier
VIEWPORT_CONSTANTS.LOADING.DEFAULT_RANGE_SIZE = 10; // Smaller chunks
VIEWPORT_CONSTANTS.LOADING.REQUEST_TIMEOUT = 10000; // Longer timeout
VIEWPORT_CONSTANTS.REQUEST_QUEUE.MAX_QUEUE_SIZE = 3; // More queued requests
```

### Mobile Configuration

```typescript
// Optimize for mobile devices
VIEWPORT_CONSTANTS.MOMENTUM.ENABLED = true;
VIEWPORT_CONSTANTS.MOMENTUM.DECELERATION_FACTOR = 0.92; // Smoother momentum
VIEWPORT_CONSTANTS.VIRTUAL_SCROLL.OVERSCAN_BUFFER = 3; // Prevent flicker
VIEWPORT_CONSTANTS.RENDERING.DEFAULT_MAX_POOL_SIZE = 30; // Less memory
```

## Debugging Configuration

```typescript
// Enable verbose logging
VIEWPORT_CONSTANTS.DEBUG = true;

// Monitor performance
VIEWPORT_CONSTANTS.PERFORMANCE = {
  LOG_SLOW_FRAMES: true,
  SLOW_FRAME_THRESHOLD: 32, // ms
  LOG_METRICS_INTERVAL: 5000, // ms
};
```

## Best Practices

1. **Test Changes** - Always test constant changes with your specific use case
2. **Document Overrides** - Comment why you're overriding defaults
3. **Environment-Specific** - Use different constants for dev/staging/production
4. **Monitor Impact** - Use performance features to measure changes
5. **Start Conservative** - Make small adjustments and measure results
