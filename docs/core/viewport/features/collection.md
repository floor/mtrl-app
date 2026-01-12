# Collection Feature

> **Created:** June 2025
> **Updated:** January 12, 2026 (v0.3.3 - priority request handling fix for slow networks)

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
- **Cursor pagination support** with sequential loading and dynamic sizing

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

// Cursor pagination state
const cursorMap = new Map<number, string>(); // Page → Cursor
const pageToOffsetMap = new Map<number, number>(); // Page → Offset
let currentCursor: string | null = null;
let highestLoadedPage = 0;
let hasReachedEnd = false;
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
  // Initial position and selection
  initialScrollIndex?: number; // Start at specific item index (0-based)
  selectId?: string | number; // ID of item to select after initial load

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

### Critical Bug Fix: Priority Request Handling (v1.3.0+)

#### The Problem

A critical bug was discovered where placeholders would not be replaced on slow networks (3G and slower), particularly when users scrolled quickly through the viewport. The issue manifested as:

- Placeholders remaining visible even after scrolling stopped
- New visible ranges not loading despite velocity being zero
- Queue getting "full" and dropping critical requests
- Users waiting at a position but seeing only placeholders indefinitely

#### Root Cause Analysis

The bug had multiple contributing factors:

1. **Queue Size Limitation**: With `MAX_QUEUE_SIZE: 1`, only one request could be queued
2. **Request Dropping**: When queue was full, new requests were silently dropped - including critical `viewport:idle` and `viewport:range-changed` requests
3. **Stale Pending State**: When items were evicted during slow network loads, `pendingRanges` wasn't cleared, blocking future loads
4. **Race Conditions**: Async loads could complete after eviction, re-adding ranges to `loadedRanges` even though data was gone

Example scenario on 3G (2+ second latency):

```
1. User at position 0-20 (loads immediately)
2. User scrolls quickly - velocity > threshold, loads skipped
3. User scrolls to 600-620, request queued
4. User stops at 700-720 (velocity=0)
5. viewport:idle fires, tries to load 700-720
6. Queue is full (has request for 600-620)
7. Request for 700-720 is DROPPED!
8. User sees placeholders indefinitely
```

#### The Solution (v1.3.0)

The fix implements multiple defensive mechanisms:

##### 1. Priority Request Handling

Critical requests from `viewport:idle` and `viewport:range-changed` are never dropped. Instead, they clear stale requests and take priority:

```typescript
if (caller === "viewport:idle" || caller === "viewport:range-changed") {
  // Clear old queued requests - they're for ranges user scrolled past
  loadRequestQueue.forEach((r) => {
    r.resolve(); // Clean resolution
  });
  loadRequestQueue.length = 0;
  
  // Queue this priority request
  loadRequestQueue.push({
    range,
    priority: "high",
    timestamp: Date.now(),
    resolve,
    reject,
    caller,
  });
}
```

##### 2. Eviction Cleanup

When items are evicted, all related state is properly cleaned up:

```typescript
rangesToRemove.forEach((rangeId) => {
  loadedRanges.delete(rangeId);
  pendingRanges.delete(rangeId);      // Clear pending state
  activeRequests.delete(rangeId);     // Clear tracking
  
  // Abort in-flight requests to free network resources
  const controller = abortControllers.get(rangeId);
  if (controller) {
    controller.abort();
    abortControllers.delete(rangeId);
  }
});
```

##### 3. Load Completion Verification

Before marking a range as "loaded", verify items actually exist (handles race with eviction):

```typescript
const itemsActuallyStored = transformedItems.every(
  (_, idx) => items[offset + idx] !== undefined
);

if (itemsActuallyStored) {
  loadedRanges.add(rangeId);
}
// If items were evicted during load, don't mark as loaded
```

##### 4. Defensive Data Verification

When checking if ranges need loading, verify data actually exists:

```typescript
if (loadedRanges.has(rangeId)) {
  const rangeStart = rangeId * rangeSize;
  const hasData = items
    .slice(rangeStart, rangeStart + rangeSize)
    .some((item) => item !== undefined);
  if (!hasData) {
    // Range marked loaded but no data - force reload
    loadedRanges.delete(rangeId);
    rangesToLoad.push(rangeId);
  }
}
```

##### 5. Render Trigger for Skipped Items

When data arrives but DOM elements don't exist, trigger a re-render:

```typescript
// In rendering.ts collection:range-loaded handler
if (skippedCount > 0 && viewportState?.visibleRange) {
  const { start, end } = viewportState.visibleRange;
  const loadedStart = data.offset;
  const loadedEnd = data.offset + data.items.length - 1;
  
  if (loadedStart <= end && loadedEnd >= start) {
    renderItems(); // Re-render to show the data
  }
}
```

#### How It Works

1. **User Scrolls Fast**: Requests skipped due to velocity threshold
2. **User Stops**: `viewport:idle` fires with velocity=0
3. **Priority Handling**: Idle request clears stale queue and takes priority
4. **Data Loads**: Request proceeds immediately
5. **Verification**: Items verified before marking loaded
6. **Render Update**: DOM updated with real data

#### Benefits

- **Guaranteed Loading**: Current visible range always loads when user stops
- **No Silent Drops**: Critical requests never silently dropped
- **Clean State**: Eviction properly cleans all tracking state
- **Race Condition Safe**: Verification prevents stale loaded state
- **Network Efficient**: Aborts unnecessary in-flight requests

#### Configuration for Slow Networks

For extremely slow networks (GPRS, 2G, 3G), consider:

```typescript
const viewport = withCollection({
  maxConcurrentRequests: 2, // Allow 2 concurrent requests
  enableRequestQueue: true,
  maxQueueSize: 3, // Small queue - priority handling will manage it
  cancelLoadThreshold: 50, // Lower threshold for slow scrolling
  rangeSize: 20, // Smaller ranges for faster loads
});
```

### Legacy Fix: Stale Request Queue Cleanup (v1.2.0)

The v1.2.0 fix added queue cleanup on idle, which is still active:

```typescript
// When idle is detected, clear stale requests from the queue
const buffer = rangeSize * 2;
loadRequestQueue = loadRequestQueue.filter((request) => {
  const isRelevant =
    request.range.end >= visibleRange.start - buffer &&
    request.range.start <= visibleRange.end + buffer;
  
  if (!isRelevant) {
    request.resolve();
  }
  return isRelevant;
});
```

This works alongside v1.3.0's priority handling for defense in depth.

### Placeholders Not Replaced (Debugging)

If placeholders are still not being replaced after v1.3.0, check:

1. **Verify Priority Handling**

   The fix should prevent request dropping. If you see issues, enable debug logging:

   ```typescript
   // In loadMissingRanges wrapper, temporarily add:
   console.log(`Request: range=${range.start}-${range.end}, caller=${caller}`);
   console.log(`Queue: length=${loadRequestQueue.length}, active=${activeLoadCount}`);
   ```

2. **Check Eviction State**

   Verify eviction is cleaning up properly:

   ```typescript
   // Check state after scrolling
   console.log("loadedRanges:", Array.from(loadedRanges));
   console.log("pendingRanges:", Array.from(pendingRanges));
   console.log("items with data:", items.filter(Boolean).length);
   ```

3. **Verify Idle Detection**
   - Ensure `viewport:idle` event is firing when scrolling stops
   - Check that `currentVelocity` reaches 0
   - Look for continuous micro-movements preventing idle

4. **Check Render Trigger**
   - Verify `collection:range-loaded` event is emitted
   - Ensure rendering feature's handler is called
   - Check `skippedCount` in the handler

### Fixed Issues Summary

#### v1.3.0 (Current)
- **Priority Request Handling** - Critical requests (`viewport:idle`, `viewport:range-changed`) never dropped
- **Complete Eviction Cleanup** - Clears `pendingRanges`, `activeRequests`, aborts in-flight requests
- **Load Verification** - Checks items exist before marking range as loaded
- **Defensive Data Check** - Verifies data exists when ranges marked as loaded
- **Render Trigger** - Re-renders when data arrives for visible range without DOM elements

#### v1.2.0
- **Queue Cleanup on Idle** - Removes stale requests far from visible range
- **Buffer Zone** - Keeps requests within 2x range size of visible area

#### v1.1.0
- **Automatic Queue Processing** - Queue processed after each successful load
- **Enhanced Drag End Handling** - Visible range loaded after drag gestures
- **Improved Idle Detection** - Multiple mechanisms ensure data loads when scrolling stops

## Performance Considerations

1. **Range Size** - Larger ranges reduce requests but increase latency
2. **Queue Size** - Smaller queues prevent memory buildup
3. **Concurrent Requests** - More parallel requests vs server load
4. **Velocity Threshold** - Higher threshold loads during scrolling
5. **Retry Strategy** - Balance between reliability and performance

## Cursor Pagination Support

The collection feature includes sophisticated cursor pagination support:

### Sequential Loading

Unlike offset/page strategies, cursor pagination requires sequential loading:

```typescript
// Must load pages in order
if (strategy === "cursor" && targetPage > highestLoadedPage + 1) {
  // Load intermediate pages first
  for (let page = highestLoadedPage + 1; page <= targetPage; page++) {
    await loadPage(page);
  }
}
```

### Dynamic Virtual Sizing

For cursor pagination, the virtual size grows dynamically as data loads:

```typescript
// Calculate dynamic virtual size
const loadedItemsCount = items.filter((item) => item !== undefined).length;
const marginItems = hasReachedEnd ? 0 : rangeSize * 5; // 5x buffer
const virtualSize = Math.max(loadedItemsCount + marginItems, minVirtualSize);

// Update viewport when size changes
component.emit("viewport:total-items-changed", { total: virtualSize });
```

### Cursor State Management

```typescript
// Store cursor after successful load
if (meta.cursor || meta.nextCursor) {
  currentCursor = meta.cursor || meta.nextCursor;
  cursorMap.set(page, currentCursor);
  console.log(`Stored cursor for page ${page}: ${currentCursor}`);
}

// Check for end of data
if (meta.hasNext === false) {
  hasReachedEnd = true;
  // Adjust virtual size to actual loaded items
}
```

### API Methods

```typescript
// Get current cursor
collection.getCurrentCursor = () => currentCursor;

// Get cursor for specific page
collection.getCursorForPage = (page: number) => cursorMap.get(page);

// Check if can jump to page
collection.canJumpToPage = (page: number) => {
  if (strategy !== "cursor") return true;
  return page <= highestLoadedPage + 1;
};
```

## Initial Scroll Position and Selection

The collection feature supports starting the viewport at a specific position and optionally selecting an item after the initial data loads.

### initialScrollIndex

Start the viewport at a specific item index instead of the beginning:

```typescript
const viewport = createViewport({
  initialScrollIndex: 500, // Start at item 500
  collection: {
    adapter: myAdapter,
  },
  pagination: {
    strategy: 'page',
    limit: 30,
  },
});
```

#### How It Works

1. The viewport calculates the visible range around `initialScrollIndex`
2. Data is loaded for that range (not page 1)
3. Items render at the correct position
4. For large lists with compression, scroll position is automatically recalculated

#### Use Cases

- Restoring user's last scroll position
- Deep linking to specific items
- Navigating to search results
- Resuming from a saved state

### selectId

Automatically select a specific item after the initial load completes:

```typescript
const viewport = createViewport({
  initialScrollIndex: 500, // Position in list
  selectId: 'item-12345', // ID of item to select
  collection: {
    adapter: myAdapter,
  },
});

// Listen for selection
viewport.on('selection:change', ({ selectedItems }) => {
  console.log('Selected:', selectedItems[0]);
});
```

#### How It Works

1. Data loads for the initial visible range
2. `collection:initial-load-complete` event is emitted with `selectId`
3. The selection feature finds and selects the item
4. `selection:change` event fires with the selected item

### Combining initialScrollIndex and selectId

For the best user experience when navigating to a specific item:

```typescript
// Example: Navigate to a user in a large list
async function navigateToUser(userId) {
  // 1. Get the user's position in the list
  const response = await fetch(`/api/users/position?id=${userId}`);
  const { position } = await response.json();
  
  // 2. Create viewport starting at that position with selection
  const viewport = createViewport({
    initialScrollIndex: position,
    selectId: userId,
    virtual: {
      itemSize: 100,
    },
    collection: {
      adapter: userAdapter,
    },
  });
  
  return viewport;
}
```

### Edge Case: First Item (Index 0)

When selecting the first item in the list, `initialScrollIndex` will be 0. The collection feature handles this correctly by checking for `selectId` presence:

```typescript
// This works correctly - selects first item
const viewport = createViewport({
  initialScrollIndex: 0, // First item
  selectId: 'first-item-id',
  collection: {
    adapter: myAdapter,
  },
});
```

### Events

#### `collection:initial-load-complete`

Emitted when the initial data load completes (only when `initialScrollIndex` or `selectId` is used):

```typescript
viewport.on('collection:initial-load-complete', ({ selectId, initialScrollIndex }) => {
  console.log(`Initial load complete at index ${initialScrollIndex}`);
  if (selectId) {
    console.log(`Selecting item: ${selectId}`);
  }
});
```
