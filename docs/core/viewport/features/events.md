# Events Feature

> **Created:** June 2025
> **Updated:** December 29, 2025

The events feature provides a robust event system that enables communication between viewport features without creating tight coupling. It implements a publish-subscribe pattern that allows features to coordinate their actions.

## Overview

The events feature provides:

- **Event Emitter Pattern** - Subscribe and emit events
- **Feature Coordination** - Enables loose coupling between features
- **Debug Support** - Event logging and tracing
- **Type Safety** - TypeScript event definitions
- **Memory Management** - Automatic cleanup of listeners

## Architecture

### Event Flow

The event system creates a communication backbone for the viewport:

```
Feature A ─────emit────→ Event Bus ─────notify────→ Feature B
                              ↓                          ↓
                         Event Logger              Feature C
```

### Event Categories

Events are organized into logical categories:

1. **Lifecycle Events** - Initialization, destruction
2. **Scroll Events** - Position, velocity, idle
3. **Data Events** - Loading, range changes
4. **Render Events** - DOM updates, completions
5. **User Events** - Interactions, gestures

## Implementation

### Feature Structure

```typescript
export const withEvents = (config: EventsConfig = {}) => {
  return <T extends ViewportContext>(component: T): T & EventsComponent => {
    const { debug = false, logEvents = [] } = config;

    // Event storage
    const listeners = new Map<string, Set<EventHandler>>();
    const eventHistory: EventRecord[] = [];

    // Event methods
    const on = (event: string, handler: EventHandler): void => {
      if (!listeners.has(event)) {
        listeners.set(event, new Set());
      }
      listeners.get(event)!.add(handler);

      if (debug) {
        console.log(`[Events] Listener added for: ${event}`);
      }
    };

    const off = (event: string, handler: EventHandler): void => {
      const handlers = listeners.get(event);
      if (handlers) {
        handlers.delete(handler);
        if (handlers.size === 0) {
          listeners.delete(event);
        }
      }
    };

    const emit = (event: string, data?: any): void => {
      const handlers = listeners.get(event);
      if (!handlers || handlers.size === 0) return;

      // Log event if debugging
      if (debug && (logEvents.length === 0 || logEvents.includes(event))) {
        console.log(`[Events] Emitting: ${event}`, data);
      }

      // Record event
      if (eventHistory.length < 100) {
        eventHistory.push({
          event,
          data,
          timestamp: Date.now(),
          listenerCount: handlers.size,
        });
      }

      // Notify listeners
      handlers.forEach((handler) => {
        try {
          handler(data);
        } catch (error) {
          console.error(`[Events] Error in handler for ${event}:`, error);
        }
      });
    };

    // Add to component
    return {
      ...component,
      on,
      off,
      emit,
      events: {
        getListeners: () => listeners,
        getHistory: () => eventHistory,
        clear: () => listeners.clear(),
      },
    };
  };
};
```

### Event Types

```typescript
// Event handler type
type EventHandler = (data?: any) => void;

// Event record for history
interface EventRecord {
  event: string;
  data: any;
  timestamp: number;
  listenerCount: number;
}

// Common event data types
interface ScrollEventData {
  position: number;
  velocity: number;
  direction: "forward" | "backward";
}

interface RangeEventData {
  start: number;
  end: number;
  total?: number;
}

interface LoadEventData {
  items: any[];
  offset: number;
  limit: number;
  total?: number;
}
```

## Core Events

### Lifecycle Events

#### `viewport:initialized`

Fired when viewport is fully initialized.

```typescript
viewport.on("viewport:initialized", () => {
  console.log("Viewport ready");
});
```

#### `viewport:destroyed`

Fired when viewport is being destroyed.

```typescript
viewport.on("viewport:destroyed", () => {
  // Cleanup resources
});
```

### Scroll Events

#### `viewport:scroll`

Fired on every scroll position change.

```typescript
viewport.on("viewport:scroll", (data: ScrollEventData) => {
  console.log(`Scrolled to ${data.position} at ${data.velocity} px/ms`);
});
```

#### `viewport:velocity-changed`

Fired when scroll velocity changes significantly.

```typescript
viewport.on("viewport:velocity-changed", ({ velocity, direction }) => {
  if (velocity > 2) {
    console.log("Fast scrolling detected");
  }
});
```

#### `viewport:idle`

Fired when scrolling stops.

```typescript
viewport.on("viewport:idle", ({ position, lastVelocity }) => {
  console.log("Scrolling stopped at", position);
});
```

### Data Events

#### `viewport:range-changed`

Fired when visible item range changes.

```typescript
viewport.on("viewport:range-changed", ({ start, end }) => {
  console.log(`Now showing items ${start} to ${end}`);
});
```

#### `collection:range-loaded`

Fired when data is loaded from the collection.

```typescript
viewport.on("collection:range-loaded", (data: LoadEventData) => {
  console.log(`Loaded ${data.items.length} items at offset ${data.offset}`);
});
```

#### `viewport:items-changed`

Fired when total item count changes.

```typescript
viewport.on("viewport:items-changed", ({ totalItems, loadedCount }) => {
  console.log(`Total: ${totalItems}, Loaded: ${loadedCount}`);
});
```

### Render Events

#### `viewport:items-rendered`

Fired after items are rendered to DOM.

```typescript
viewport.on("viewport:items-rendered", ({ range, renderedCount }) => {
  console.log(`Rendered ${renderedCount} items`);
});
```

#### `viewport:placeholders-replaced`

Fired when placeholders are replaced with real data.

```typescript
viewport.on("viewport:placeholders-replaced", ({ offset, count }) => {
  console.log(`Replaced ${count} placeholders at offset ${offset}`);
});
```

## Event Patterns

### Request-Response Pattern

Some features use events for request-response communication:

```typescript
// Feature A requests data
component.emit("viewport:request-data", { range: { start: 0, end: 50 } });

// Feature B responds
component.on("viewport:request-data", async ({ range }) => {
  const data = await loadData(range);
  component.emit("viewport:data-ready", { range, data });
});

// Feature A receives response
component.on("viewport:data-ready", ({ data }) => {
  processData(data);
});
```

### State Change Pattern

Features notify others of state changes:

```typescript
// Velocity tracking in scrolling feature
const updateVelocity = (newVelocity: number) => {
  const oldVelocity = velocity;
  velocity = newVelocity;

  if (Math.abs(oldVelocity - newVelocity) > 0.1) {
    component.emit("viewport:velocity-changed", {
      velocity: newVelocity,
      oldVelocity,
      direction: scrollDirection,
    });
  }
};
```

### Coordination Pattern

Multiple features coordinate through events:

```typescript
// Scroll → Virtual → Collection → Rendering chain
component.on("viewport:scroll", () => {
  const range = calculateVisibleRange();
  component.emit("viewport:range-changed", range);
});

component.on("viewport:range-changed", (range) => {
  loadMissingData(range);
});

component.on("collection:range-loaded", () => {
  renderItems();
});
```

## Memory Management

### Listener Cleanup

Always remove listeners when no longer needed:

```typescript
const handleScroll = (data) => {
  // Handle scroll
};

// Add listener
viewport.on("viewport:scroll", handleScroll);

// Remove when done
viewport.off("viewport:scroll", handleScroll);
```

### Automatic Cleanup

The events feature provides automatic cleanup:

```typescript
// In destroy method
component.destroy = () => {
  // Clear all listeners
  component.events?.clear();

  // Call original destroy
  originalDestroy?.();
};
```

### Weak References

For temporary listeners, use weak references:

```typescript
const weakListeners = new WeakMap();

const addWeakListener = (event: string, context: object, handler: Function) => {
  const boundHandler = handler.bind(context);
  weakListeners.set(context, boundHandler);
  component.on(event, boundHandler);
};
```

## Debugging

### Event Logging

Enable event logging for debugging:

```typescript
const viewport = pipe(
  withEvents({
    debug: true,
    logEvents: ["viewport:scroll", "viewport:range-changed"],
  })
  // Other features...
)(component);
```

### Event History

Access event history for debugging:

```typescript
const history = viewport.events.getHistory();
console.table(history);
// Shows last 100 events with timestamps
```

### Event Tracing

Trace event flow through features:

```typescript
const traceEvent = (event: string) => {
  const listeners = viewport.events.getListeners().get(event);
  console.log(`Event: ${event}`);
  console.log(`Listeners: ${listeners?.size || 0}`);

  // Log stack trace for each listener
  listeners?.forEach((handler, index) => {
    console.log(`Listener ${index}:`, handler.toString());
  });
};
```

## Performance Considerations

### Event Throttling

Throttle high-frequency events:

```typescript
const throttledEmit = throttle((event: string, data: any) => {
  component.emit(event, data);
}, 16); // 60fps

// Use for scroll events
const handleScroll = () => {
  throttledEmit("viewport:scroll", { position });
};
```

### Batch Events

Batch multiple related events:

```typescript
const batchedUpdates: any[] = [];

const batchEmit = (event: string, data: any) => {
  batchedUpdates.push({ event, data });

  if (batchedUpdates.length === 1) {
    requestAnimationFrame(() => {
      const updates = [...batchedUpdates];
      batchedUpdates.length = 0;

      updates.forEach(({ event, data }) => {
        component.emit(event, data);
      });
    });
  }
};
```

### Avoid Deep Objects

Keep event data shallow for performance:

```typescript
// Good - shallow data
component.emit("viewport:scroll", {
  position: 1000,
  velocity: 1.5,
});

// Avoid - deep nested data
component.emit("viewport:scroll", {
  state: {
    scroll: {
      current: {
        position: 1000,
      },
    },
  },
});
```

## Best Practices

### 1. Namespace Events

Use clear namespaces to avoid conflicts:

```typescript
// Good
"viewport:scroll";
"collection:range-loaded";
"rendering:items-updated";

// Avoid
"scroll";
"loaded";
"update";
```

### 2. Document Events

Document all events a feature emits:

```typescript
/**
 * @fires viewport:range-changed - When visible range changes
 * @fires viewport:items-rendered - After rendering completes
 */
export const withRendering = () => {
  // Feature implementation
};
```

### 3. Type Event Data

Use TypeScript interfaces for event data:

```typescript
interface RangeChangedEvent {
  start: number;
  end: number;
  reason: "scroll" | "resize" | "items-changed";
}

component.emit<RangeChangedEvent>("viewport:range-changed", {
  start: 0,
  end: 50,
  reason: "scroll",
});
```

### 4. Handle Errors

Always wrap handlers in try-catch:

```typescript
handlers.forEach((handler) => {
  try {
    handler(data);
  } catch (error) {
    console.error(`Error in ${event} handler:`, error);
    // Don't let one handler break others
  }
});
```

## Example Usage

```typescript
// Create viewport with events
const viewport = pipe(
  withEvents({ debug: true }),
  withBase(),
  withVirtual(),
  withScrolling()
)(component);

// Listen to multiple events
viewport.on("viewport:initialized", () => {
  console.log("Ready to use");
});

viewport.on("viewport:scroll", ({ position, velocity }) => {
  updateScrollIndicator(position);

  if (velocity > 3) {
    hideDetailsPanel();
  }
});

viewport.on("viewport:range-changed", ({ start, end }) => {
  updateVisibleCountDisplay(end - start + 1);
});

// Emit custom events
viewport.emit("custom:user-action", {
  action: "item-clicked",
  index: 42,
});

// Clean up when done
viewport.destroy(); // Automatically cleans up all listeners
```
