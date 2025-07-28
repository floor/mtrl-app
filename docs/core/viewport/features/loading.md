# Loading Feature

The Loading feature provides progressive data loading capabilities for the viewport, managing asynchronous data fetching, request coordination, and loading states.

## Overview

The Loading feature handles:

- **Progressive Loading** - Load data as needed while scrolling
- **Request Management** - Coordinate multiple concurrent requests
- **State Tracking** - Monitor loading, loaded, and failed states
- **Error Handling** - Retry logic and error recovery
- **Performance** - Optimize network usage and prevent overloading

## Architecture

### Core Components

1. **Request Queue** - Manages pending load requests
2. **Active Requests** - Tracks in-flight network requests
3. **State Maps** - Track loaded, pending, and failed ranges
4. **Load Strategies** - Different approaches for data fetching

### Integration Flow

```
Scroll Event → Calculate Visible Range → Check Loaded State →
Queue Request → Execute Load → Update State → Emit Events
```

## Configuration

The Loading feature configuration is derived from the viewport's performance and pagination settings:

```typescript
interface ViewportConfig {
  // Performance configuration (affects loading)
  performance?: {
    maxConcurrentRequests?: number; // Default: 1
    enableRequestQueue?: boolean; // Default: true
    cancelLoadThreshold?: number; // Default: 1.0 px/ms
  };

  // Pagination configuration (affects loading)
  pagination?: {
    strategy?: "page" | "offset" | "cursor";
    limit?: number; // Range size, default: 20
  };
}
```

### Example Configuration

```typescript
const viewport = createViewport({
  // Performance settings affect loading
  performance: {
    maxConcurrentRequests: 2, // Allow 2 parallel loads
    enableRequestQueue: true, // Queue overflow requests
    cancelLoadThreshold: 0.5, // Load during slower scrolls
  },

  // Pagination affects range size
  pagination: {
    strategy: "page",
    limit: 50, // Load 50 items per request
  },

  // Collection is required
  collection: {
    adapter: myDataAdapter,
  },
});
```

### Internal Configuration Mapping

The collection feature (which handles loading) receives:

```typescript
{
  maxConcurrentRequests: config.performance?.maxConcurrentRequests || 1,
  enableRequestQueue: config.performance?.enableRequestQueue !== false,
  cancelLoadThreshold: config.performance?.cancelLoadThreshold || 1.0,
  rangeSize: config.pagination?.limit || 20,
  strategy: config.pagination?.strategy || 'offset'
}
```

### Advanced Loading Configuration

For direct loading feature usage:

```typescript
interface LoadingConfig {
  // Maximum concurrent network requests
  maxConcurrentRequests?: number; // Default: 1

  // Enable request queuing
  enableRequestQueue?: boolean; // Default: true

  // Maximum items in request queue
  maxQueueSize?: number; // Default: 10

  // Velocity threshold to cancel loads (px/ms)
  cancelLoadThreshold?: number; // Default: 1.0

  // Default range size for loading
  rangeSize?: number; // Default: 20

  // Loading strategy
  strategy?: "range" | "page"; // Default: "range"

  // Retry configuration
  maxRetries?: number; // Default: 3
  retryDelay?: number; // Default: 1000ms
}
```

## Implementation

### Basic Setup

```typescript
import { withLoading } from "mtrl-addons/core/viewport/features";

const viewport = pipe(
  createViewport(config),
  withLoading({
    maxConcurrentRequests: 2,
    enableRequestQueue: true,
    cancelLoadThreshold: 0.5,
  })
)(component);
```

### Load Strategies

#### Range Strategy

Loads exact ranges as requested:

```typescript
withLoading({
  strategy: "range",
  rangeSize: 20, // Load 20 items at a time
});
```

#### Page Strategy

Loads aligned pages of data:

```typescript
withLoading({
  strategy: "page",
  rangeSize: 50, // Page size
});
```

## API

### Methods

#### loadRange(offset, limit)

Load a specific range of items:

```typescript
await viewport.loading.loadRange(100, 20); // Load items 100-119
```

#### loadVisibleRange()

Load the currently visible range:

```typescript
await viewport.loading.loadVisibleRange();
```

#### retryFailed()

Retry all failed loads:

```typescript
viewport.loading.retryFailed();
```

#### cancelPending()

Cancel all pending requests:

```typescript
viewport.loading.cancelPending();
```

### Properties

```typescript
interface LoadingAPI {
  // Check if currently loading
  isLoading: boolean;

  // Get loading progress
  progress: {
    loaded: number;
    total: number;
    percentage: number;
  };

  // Get failed ranges
  failedRanges: Map<number, FailedRange>;

  // Get pending requests
  pendingRequests: number;
}
```

### Events

#### viewport:load-start

Emitted when loading begins:

```typescript
component.on("viewport:load-start", (data) => {
  console.log(`Loading range: ${data.offset}-${data.offset + data.limit}`);
});
```

#### viewport:load-complete

Emitted when loading completes:

```typescript
component.on("viewport:load-complete", (data) => {
  console.log(`Loaded ${data.items.length} items`);
});
```

#### viewport:load-error

Emitted on load failure:

```typescript
component.on("viewport:load-error", (data) => {
  console.error(`Failed to load: ${data.error.message}`);
});
```

#### viewport:load-progress

Emitted during progressive loading:

```typescript
component.on("viewport:load-progress", (data) => {
  console.log(`Loading progress: ${data.percentage}%`);
});
```

## Request Queue Management

### Queue Priority

Requests are prioritized by:

1. **Distance from viewport** - Closer ranges load first
2. **User direction** - Ranges in scroll direction get priority
3. **Timestamp** - Older requests processed first

### Queue Overflow

When the queue is full:

```typescript
withLoading({
  maxQueueSize: 10,
  onQueueOverflow: "drop-oldest", // or "drop-farthest" or "reject"
});
```

### Cancellation

Requests are cancelled when:

- Velocity exceeds threshold
- User scrolls far away
- Component is destroyed
- Manual cancellation

## Error Handling

### Retry Logic

Failed loads are retried with exponential backoff:

```typescript
withLoading({
  maxRetries: 3,
  retryDelay: 1000, // Initial delay
  retryBackoff: 2, // Multiply delay by 2 each retry
});
```

### Error Recovery

```typescript
// Listen for errors
component.on("viewport:load-error", async (data) => {
  if (data.attempts < 3) {
    // Retry after delay
    setTimeout(() => {
      viewport.loading.retryRange(data.offset, data.limit);
    }, 1000 * data.attempts);
  }
});
```

## Performance Optimization

### Network Optimization

1. **Request Batching** - Combine adjacent ranges
2. **Debouncing** - Delay loads during fast scrolling
3. **Cancellation** - Cancel unnecessary requests
4. **Caching** - Reuse loaded data

### Memory Management

```typescript
withLoading({
  // Unload ranges far from viewport
  unloadDistance: 1000, // items

  // Maximum items in memory
  maxMemoryItems: 10000,

  // Garbage collection interval
  gcInterval: 30000, // 30 seconds
});
```

## Integration with Other Features

### With Collection

The Loading feature works closely with Collection:

```typescript
// Collection uses Loading for data fetching
withCollection({
  adapter: myAdapter,
  // Loading config passed through
  maxConcurrentRequests: 2,
});
```

### With Placeholders

Loading triggers placeholder display:

```typescript
// Placeholders shown during loading
component.on("viewport:load-start", () => {
  // Placeholders automatically displayed
});
```

### With Virtual

Virtual feature provides ranges to load:

```typescript
// Virtual calculates what needs loading
component.on("viewport:range-changed", (range) => {
  viewport.loading.loadVisibleRange();
});
```

## Common Patterns

### Infinite Scrolling

```typescript
const viewport = withLoading({
  strategy: "page",
  rangeSize: 50,
  // Load next page when near bottom
  loadAhead: 100, // pixels
});

// Listen for near-end
component.on("viewport:near-end", () => {
  viewport.loading.loadNext();
});
```

### Pull-to-Refresh

```typescript
// Detect pull gesture
component.on("viewport:pull-refresh", async () => {
  // Clear cache
  viewport.loading.clearCache();

  // Reload from start
  await viewport.loading.loadRange(0, 50);

  // Refresh complete
  component.emit("viewport:refresh-complete");
});
```

### Bidirectional Loading

```typescript
// Load in both directions
const viewport = withLoading({
  bidirectional: true,
  // Load previous items when scrolling up
  loadPrevious: true,
});
```

## Troubleshooting

### Common Issues

1. **Loads Not Triggering**
   - Check velocity threshold
   - Verify event listeners
   - Ensure adapter is connected

2. **Duplicate Requests**
   - Check request deduplication
   - Verify state tracking
   - Look for race conditions

3. **Memory Leaks**
   - Enable garbage collection
   - Set memory limits
   - Monitor unload distance

### Debug Mode

```typescript
withLoading({
  debug: true, // Enable debug logging
  logRequests: true, // Log all requests
  logQueue: true, // Log queue operations
});
```

### Performance Monitoring

```typescript
// Monitor loading performance
const stats = viewport.loading.getStats();
console.log({
  totalRequests: stats.totalRequests,
  failedRequests: stats.failedRequests,
  averageLoadTime: stats.averageLoadTime,
  cacheHitRate: stats.cacheHitRate,
});
```

## Best Practices

1. **Set Appropriate Limits**
   - Balance concurrent requests with server capacity
   - Size queue based on expected usage
   - Configure velocity threshold for UX

2. **Handle Errors Gracefully**
   - Implement retry logic
   - Show error states to users
   - Provide manual retry options

3. **Optimize for Network**
   - Use request batching
   - Implement caching
   - Cancel unnecessary requests

4. **Monitor Performance**
   - Track load times
   - Monitor failure rates
   - Analyze usage patterns

## Configuration Examples

### Fast Network / Desktop

```typescript
withLoading({
  maxConcurrentRequests: 4,
  rangeSize: 100,
  cancelLoadThreshold: 2.0,
  loadAhead: 500,
});
```

### Slow Network / Mobile

```typescript
withLoading({
  maxConcurrentRequests: 1,
  rangeSize: 20,
  cancelLoadThreshold: 0.5,
  enableRequestQueue: true,
  maxQueueSize: 3,
});
```

### Large Dataset

```typescript
withLoading({
  strategy: "page",
  rangeSize: 50,
  unloadDistance: 1000,
  maxMemoryItems: 5000,
  gcInterval: 20000,
});
```
