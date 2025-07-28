# Collection Feature

The collection feature manages data loading, request queuing, and placeholder replacement for the viewport. It integrates with the data adapter to fetch items on demand and coordinates with other features to optimize loading behavior.

## Overview

The collection feature provides:

- **Progressive data loading** with configurable range sizes
- **Request queue management** to prevent overwhelming the server
- **Velocity-based load decisions** to skip loads during fast scrolling
- **Placeholder replacement** when real data arrives
- **Duplicate request prevention** through range tracking
- **Failed request retry** with exponential backoff
- **Idle-triggered loading** for better user experience

## Architecture

### State Management

The feature maintains several state structures:

```typescript
// Loaded ranges tracking
const loadedRanges = new Set<string>(); // "offset-limit" format
const pendingRanges = new Set<string>(); // Currently loading
const failedRanges = new Set<string>(); // Failed to load

// Request management
const activeRequests = new Map<string, Promise<any>>();
const requestQueue: QueuedRequest[] = [];

// Velocity tracking
let currentVelocity = 0;
let isDragging = false;
```

### Request Queue

The request queue prevents server overload and manages priorities:

```typescript
interface QueuedRequest {
  range: { start: number; end: number };
  priority: number;
  timestamp: number;
}

// Queue processing logic
const processQueue = () => {
  if (
    !enableRequestQueue ||
    isDragging ||
    currentVelocity > cancelLoadThreshold
  ) {
    return;
  }

  while (
    requestQueue.length > 0 &&
    activeRequests.size < maxConcurrentRequests
  ) {
    const request = requestQueue.shift();
    if (request && !isRangeLoaded(request.range)) {
      executeLoad(request.range);
    }
  }
};
```

## Data Loading Flow

### 1. Range Change Detection

When the visible range changes, the collection feature:

1. Checks if scrolling velocity is below threshold
2. Identifies missing data in the new range
3. Queues or executes load requests

```typescript
component.on?.("viewport:range-changed", async (data) => {
  // Skip during fast scrolling
  if (currentVelocity > cancelLoadThreshold) {
    console.log("[Collection] Skipping load - velocity too high");
    return;
  }

  const { start, end } = data;
  await loadMissingRanges({ start, end });
});
```

### 2. Velocity Monitoring

The feature tracks scroll velocity to make intelligent loading decisions:

```typescript
component.on?.("viewport:velocity-changed", (data) => {
  const previousVelocity = currentVelocity;
  currentVelocity = Math.abs(data.velocity || 0);

  // Process queue when velocity drops below threshold
  if (
    previousVelocity > cancelLoadThreshold &&
    currentVelocity <= cancelLoadThreshold
  ) {
    processQueue();
  }
});
```

### 3. Idle Detection

When scrolling stops, queued requests are processed:

```typescript
component.on?.("viewport:idle", () => {
  console.log("[Collection] Viewport idle - processing queue");
  processQueue();
});
```

### 4. Data Loading

The actual data loading process:

```typescript
const loadRange = async (offset: number, limit: number) => {
  const rangeId = getRangeId(offset, limit);

  // Check if already loaded or pending
  if (loadedRanges.has(rangeId) || pendingRanges.has(rangeId)) {
    return items.slice(offset, offset + limit);
  }

  // Mark as pending
  pendingRanges.add(rangeId);

  try {
    // Call adapter
    const response = await collection.read({ offset, limit });
    const newItems = response.data || response.items || response;

    // Update items array
    for (let i = 0; i < newItems.length; i++) {
      items[offset + i] = newItems[i];
    }

    // Mark as loaded
    loadedRanges.add(rangeId);

    // Emit event for other features
    component.emit?.("collection:range-loaded", {
      items: newItems,
      offset,
      limit,
    });

    return newItems;
  } catch (error) {
    failedRanges.add(rangeId);
    throw error;
  } finally {
    pendingRanges.delete(rangeId);
  }
};
```

## Placeholder Replacement

### How It Works

1. **Placeholder Detection**: The rendering feature checks if items are placeholders
2. **Data Arrival**: When `collection:range-loaded` is emitted
3. **Replacement**: Placeholders in the DOM are replaced with real content

### The Critical Path

```typescript
// In rendering feature
component.on?.("collection:range-loaded", (data) => {
  if (!data.items?.length) return;

  // Replace placeholders with real data
  data.items.forEach((item, i) => {
    const index = data.offset + i;
    const oldItem = collectionItems[index];
    collectionItems[index] = item;

    // Replace in DOM if currently rendered
    if (oldItem && isPlaceholder(oldItem) && renderedElements.has(index)) {
      const element = renderedElements.get(index);
      updateElementContent(element, item, index);
    }
  });
});
```

### Potential Issues

1. **Event Not Fired**: If `collection:range-loaded` isn't emitted, placeholders won't be replaced
2. **Queue Stuck**: If the queue isn't processed, loads never happen
3. **Velocity Threshold**: If velocity never drops below threshold, loads are skipped
4. **Failed Loads**: Network errors can leave placeholders indefinitely

## Configuration

The collection feature configuration is now part of the viewport's feature-oriented structure:

```typescript
interface ViewportConfig {
  // Collection configuration
  collection?: {
    adapter: CollectionAdapter<any>; // Required: Data adapter
    transform?: (item: any) => any; // Optional: Transform items
  };

  // Performance configuration (affects collection)
  performance?: {
    maxConcurrentRequests?: number; // Default: 1
    enableRequestQueue?: boolean; // Default: true
    cancelLoadThreshold?: number; // Default: 1.0 px/ms
  };

  // Pagination configuration
  pagination?: {
    strategy?: "page" | "offset" | "cursor"; // Default: 'offset'
    limit?: number; // Default: 20
  };
}
```

### Example Configuration

```typescript
const viewport = createViewport({
  // Collection setup
  collection: {
    adapter: myDataAdapter,
    transform: (item) => ({
      ...item,
      displayName: item.name.toUpperCase(),
    }),
  },

  // Performance tuning
  performance: {
    maxConcurrentRequests: 2,
    enableRequestQueue: true,
    cancelLoadThreshold: 0.5, // Load during slower scrolls
  },

  // Pagination
  pagination: {
    strategy: "page",
    limit: 50,
  },
});
```

### Legacy Configuration Note

The collection feature internally maps the new structure to its requirements:

```typescript
// The feature receives:
{
  collection: config.collection?.adapter,
  transform: config.collection?.transform,
  maxConcurrentRequests: config.performance?.maxConcurrentRequests,
  enableRequestQueue: config.performance?.enableRequestQueue,
  cancelLoadThreshold: config.performance?.cancelLoadThreshold,
  rangeSize: config.pagination?.limit,
  strategy: config.pagination?.strategy
}
```

### Constants

```typescript
LOADING: {
  CANCEL_THRESHOLD: 1,              // px/ms - velocity above which loads cancel
  MAX_CONCURRENT_REQUESTS: 1,       // Parallel requests allowed
  DEFAULT_RANGE_SIZE: 20,           // Items per request
  DEBOUNCE_LOADING: 150,           // Debounce delay (ms)
  MIN_RANGE_SIZE: 10,              // Minimum items per load
  MAX_RANGE_SIZE: 100,             // Maximum items per load
  REQUEST_TIMEOUT: 5000,           // Request timeout (ms)
  RETRY_ATTEMPTS: 2,               // Failed request retries
  RETRY_DELAY: 1000                // Delay between retries (ms)
}

REQUEST_QUEUE: {
  ENABLED: true,                    // Enable request queuing
  MAX_QUEUE_SIZE: 1,               // Max queued requests
  MAX_ACTIVE_REQUESTS: 2           // Max concurrent active requests
}
```

## API

### Methods

#### `setCollection(collection: CollectionAdapter)`

Sets the data adapter for loading items.

#### `loadRange(start: number, end: number): Promise<any[]>`

Loads a specific range of items.

#### `refreshRange(start: number, end: number)`

Forces a reload of a specific range.

#### `getLoadedRanges(): string[]`

Returns array of loaded range identifiers.

#### `cancelPendingLoads()`

Cancels all pending load requests.

#### `getTotalItems(): number`

Returns the total number of items in the collection.

### Events

#### Listens To

- `viewport:range-changed` - Triggers loading for new visible range
- `viewport:velocity-changed` - Updates velocity for load decisions
- `viewport:idle` - Processes queued requests
- `viewport:drag-start/end` - Tracks drag state

#### Emits

- `collection:range-loaded` - When data is successfully loaded
- `collection:load-error` - When a load fails
- `viewport:items-changed` - When total item count changes

## Troubleshooting

### Critical Bug Fix: Stale Request Queue Blocking (v1.2.0+)

#### The Problem

A critical bug was discovered where placeholders would not be replaced on slow networks, particularly when users scrolled quickly through the viewport. The issue manifested as:

- Placeholders remaining visible even after data loaded
- New visible ranges not loading despite being idle
- Queue getting "stuck" with old requests
- Users waiting at a position but seeing only placeholders

#### Root Cause Analysis

The bug was caused by a queue blocking issue in the request management system:

1. **Sequential Loading**: With `maxConcurrentRequests: 1`, only one request could be active at a time
2. **Queue Accumulation**: When users scrolled quickly, multiple range requests would queue up
3. **Stale Requests**: By the time old requests completed, the user had scrolled far away
4. **Queue Blocking**: Old, irrelevant requests in the queue would block new, relevant requests for the current visible range

Example scenario:

```
1. User at position 0-20 (loads immediately)
2. User scrolls quickly to 200-220 (queued - request 1)
3. User scrolls to 400-420 (queued - request 2)
4. User stops at 600-620 (queued - request 3)
5. Request 1 completes, loads 200-220 (user no longer there)
6. Request 2 starts loading 400-420 (user no longer there)
7. User waits at 600-620 but sees placeholders because request 3 is stuck in queue
```

#### The Solution

The fix implements intelligent queue management that prioritizes the current visible range:

```typescript
// When idle is detected, clear stale requests from the queue
const buffer = rangeSize * 2; // Allow some buffer
loadRequestQueue = loadRequestQueue.filter((request) => {
  const requestEnd = request.range.end;
  const requestStart = request.range.start;
  const isRelevant =
    requestEnd >= visibleRange.start - buffer &&
    requestStart <= visibleRange.end + buffer;

  if (!isRelevant) {
    console.log(
      `[Collection] Removing stale queued request: ${requestStart}-${requestEnd}`
    );
    request.resolve(); // Resolve to avoid hanging promises
  }
  return isRelevant;
});
```

#### How It Works

1. **Idle Detection**: When scrolling stops and idle is detected
2. **Queue Cleanup**: Remove any queued requests that are far from the current visible range
3. **Buffer Zone**: Keep requests within 2x range size of the visible area (for smooth scrolling)
4. **Clean Resolution**: Resolve removed requests to prevent hanging promises
5. **Priority Loading**: Current visible range can now load immediately

#### Benefits

- **Immediate Response**: Current visible range loads as soon as user stops scrolling
- **Memory Efficiency**: Old requests don't accumulate in the queue
- **Better UX**: Users see data for their current position, not old positions
- **Network Efficiency**: Prevents loading data for areas the user has scrolled past

#### Configuration for Slow Networks

For extremely slow networks (GPRS, 2G), consider:

```typescript
const viewport = withCollection({
  maxConcurrentRequests: 2, // Allow 2 concurrent requests
  enableRequestQueue: true,
  maxQueueSize: 5, // Limit queue size
  cancelLoadThreshold: 0.5, // Lower threshold for slow scrolling
  rangeSize: 10, // Smaller ranges for faster loads
});
```

### Placeholders Not Replaced (Other Causes)

This is the critical issue on slow networks. Other possible causes:

1. **Queue Not Processing**

   ```typescript
   // Check if queue is stuck
   console.log("Queue length:", requestQueue.length);
   console.log("Active requests:", activeRequests.size);
   console.log("Current velocity:", currentVelocity);
   ```

2. **Idle Detection Failing**
   - Verify `viewport:idle` event is firing
   - Check idle threshold settings
   - Look for continuous micro-movements

3. **Velocity Threshold Too Low**
   - On slow networks, loading takes longer
   - User might scroll again before load completes
   - Consider adjusting `CANCEL_THRESHOLD`

4. **Event Chain Broken**
   - Ensure `collection:range-loaded` is emitted
   - Verify rendering feature is listening
   - Check for errors in event handlers

### Recommended Fixes

1. **Force Queue Processing on Network Complete**

   ```typescript
   // Add to loadRange success handler
   if (requestQueue.length > 0 && currentVelocity <= cancelLoadThreshold) {
     setTimeout(() => processQueue(), 0);
   }
   ```

2. **Add Fallback Timer**

   ```typescript
   // Process queue periodically as safety net
   setInterval(() => {
     if (!isDragging && currentVelocity <= cancelLoadThreshold) {
       processQueue();
     }
   }, 1000);
   ```

3. **Improve Idle Detection**
   ```typescript
   // Also process queue on drag end
   component.on?.("viewport:drag-end", () => {
     isDragging = false;
     setTimeout(() => processQueue(), 100);
   });
   ```

### Fixed Issues (v1.1.0+)

The following fixes have been implemented to resolve the placeholder replacement issue on slow networks:

1. **Automatic Queue Processing** - The queue is now processed automatically after each successful data load
2. **Periodic Safety Check** - A fallback timer checks the queue every second
3. **Enhanced Drag End Handling** - The visible range is checked and loaded after drag gestures
4. **Improved Idle Detection** - Multiple mechanisms ensure data loads when scrolling stops

These fixes ensure that placeholders are always replaced with real data, even on very slow network connections.

## Performance Considerations

1. **Range Size** - Larger ranges reduce requests but increase latency
2. **Queue Size** - Smaller queues prevent memory buildup
3. **Concurrent Requests** - More parallel requests vs server load
4. **Velocity Threshold** - Higher threshold loads during scrolling
5. **Retry Strategy** - Balance between reliability and performance
