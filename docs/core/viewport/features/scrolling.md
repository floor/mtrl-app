# Scrolling Feature

> **Created:** June 2025
> **Updated:** January 6, 2026 (v1.4.0 - stopOnClick option with anchor-based stopping)

The scrolling feature handles all scroll interactions, velocity tracking, and idle detection for the viewport. It's a core feature that other features depend on for scroll state and velocity information.

## Overview

The scrolling feature provides:

- **Wheel scroll handling** with configurable sensitivity
- **Velocity tracking** using a sliding window approach
- **Scroll direction detection** (forward/backward)
- **Idle detection** for triggering data loads
- **Programmatic scrolling** with smooth animations
- **Scroll position management** with bounds checking
- **Click-to-stop** with intelligent inertia detection for mouse wheels with physical momentum

## Configuration

The scrolling feature configuration is part of the viewport's feature-oriented structure:

```typescript
interface ViewportConfig {
  // Scrolling configuration
  scrolling?: {
    orientation?: "vertical" | "horizontal"; // Default: 'vertical'
    sensitivity?: number; // Default: 1.0
    animation?: boolean; // Default: false
    stopOnClick?: boolean; // Default: true - Stop scrolling when clicking
  };
}
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `orientation` | `"vertical" \| "horizontal"` | `"vertical"` | Scroll direction |
| `sensitivity` | `number` | `1.0` | Mouse wheel sensitivity multiplier |
| `animation` | `boolean` | `false` | Enable smooth scroll animations |
| `stopOnClick` | `boolean` | `true` | Stop scrolling momentum when clicking on the viewport |

### Example Configuration

```typescript
const viewport = createViewport({
  // Smooth vertical scrolling
  scrolling: {
    orientation: "vertical",
    sensitivity: 1.2, // Slightly faster scrolling
    animation: true, // Enable smooth animations
    stopOnClick: true, // Stop momentum on click (default)
  },

  // Other features...
  virtual: {
    overscan: 2,
  },
});
```

### Disabling Click-to-Stop

For lists where you don't want clicking to interrupt scrolling:

```typescript
const viewport = createViewport({
  scrolling: {
    orientation: "vertical",
    stopOnClick: false, // Allow scrolling to continue after clicks
  },
});
```

### Internal Mapping

The scrolling feature receives its configuration from the viewport:

```typescript
withScrolling({
  orientation: config.scrolling?.orientation,
  sensitivity: config.scrolling?.sensitivity,
  smoothing: config.scrolling?.animation,
  stopOnClick: config.scrolling?.stopOnClick,
});
```

## Architecture

### Speed Tracker

The feature maintains a `SpeedTracker` object that continuously monitors scroll velocity:

```typescript
interface SpeedTracker {
  velocity: number; // Current velocity in px/ms
  lastPosition: number; // Last recorded position
  lastTime: number; // Last measurement timestamp
  direction: "forward" | "backward";
  samples: Array<{
    // Recent position samples
    position: number;
    time: number;
  }>;
}
```

### Velocity Calculation

Velocity is calculated using a sliding window approach:

1. **Sample Collection** - Position samples are collected with timestamps
2. **Window Filtering** - Only samples within the last 100ms are kept
3. **Average Calculation** - Velocity is averaged over the window
4. **Smoothing** - Instant velocity is blended with average for stability

```typescript
const updateSpeedTracker = (tracker, newPosition, previousPosition) => {
  const now = Date.now();
  const timeDelta = now - tracker.lastTime;

  if (timeDelta === 0) return tracker;

  const positionDelta = newPosition - previousPosition;
  const instantVelocity = Math.abs(positionDelta) / timeDelta;

  // Keep only recent samples (last 100ms)
  const recentSamples = samples.filter(s => now - s.time < 100);

  // Calculate average velocity
  if (recentSamples.length > 1) {
    const oldestSample = recentSamples[0];
    const totalDistance = Math.abs(newPosition - oldestSample.position);
    const totalTime = now - oldestSample.time;
    avgVelocity = totalTime > 0 ? totalDistance / totalTime : instantVelocity;
  }

  return { velocity: avgVelocity, direction, samples: recentSamples, ... };
};
```

## API

### Methods

#### `scrollToPosition(position: number, source?: string)`

Scrolls to an absolute position with bounds checking.

- **position** - Target scroll position in pixels
- **source** - Optional source identifier for debugging

#### `scrollToIndex(index: number, alignment?: ScrollAlignment)`

Scrolls to bring a specific item into view.

- **index** - Item index to scroll to
- **alignment** - How to align the item:
  - `"start"` - Align to top/left edge
  - `"center"` - Center in viewport
  - `"end"` - Align to bottom/right edge
  - `"auto"` - Minimal scroll to bring into view

#### `scrollBy(delta: number)`

Scrolls by a relative amount. Used by momentum feature.

- **delta** - Amount to scroll by (positive = forward)

#### `getScrollPosition(): number`

Returns the current scroll position.

#### `getVelocity(): number`

Returns the current scroll velocity in px/ms.

#### `getDirection(): "forward" | "backward"`

Returns the current scroll direction.

#### `isScrolling(): boolean`

Returns true if currently scrolling.

### Events Emitted

#### `viewport:scroll`

Fired on every scroll position change.

```typescript
{
  position: number;        // New scroll position
  direction: "forward" | "backward";
  previousPosition: number;
  source?: string;        // What triggered the scroll
}
```

#### `viewport:velocity-changed`

Fired when velocity changes significantly.

```typescript
{
  velocity: number; // Current velocity (px/ms)
  direction: "forward" | "backward";
}
```

#### `viewport:idle`

Fired when scrolling stops (no activity for idle threshold).

```typescript
{
  position: number; // Final scroll position
  lastVelocity: number; // Velocity before stopping
}
```

## Click-to-Stop (Anchor-Based Stopping)

When `stopOnClick` is enabled (default), clicking on the viewport will stop any ongoing scroll momentum. This is particularly important for mouse wheels with physical inertia (like Logitech free-spin wheels) that continue sending wheel events after the user stops scrolling.

### How It Works

The feature uses an **anchor-based approach** to distinguish between:
1. **Residual wheel inertia** - Physical momentum from the mouse wheel
2. **Intentional new scrolling** - User deliberately starting to scroll again

When the user clicks:
1. The current scroll position is **anchored**
2. Subsequent wheel events are analyzed for intent
3. If detected as inertia, the viewport stays at the anchor position
4. If detected as new scrolling, the anchor is released

### Inertia Detection Criteria

The anchor is released (scrolling resumes) when any of these are detected:

| Criterion | Threshold | Description |
|-----------|-----------|-------------|
| **Wheel gap** | > 200ms | Time gap between wheel events |
| **Delta increasing** | 3+ consecutive | User started scrolling again |
| **Sustained high delta** | 5+ events at 5%+ above minimum | Continuous intentional scroll |
| **Significant increase** | 15% above minimum | Sharp acceleration |
| **Low delta** | < 30 | Gentle intentional scroll |
| **Delta decayed** | < 30% of initial | Inertia has wound down |

### Integration with Momentum

The `stopOnClick` feature also stops any momentum animation from the momentum feature:

```typescript
// When mousedown is detected with stopOnClick enabled:
const momentumState = component.viewport.momentumState;
if (momentumState?.stopMomentum) {
  momentumState.stopMomentum();
}
```

## Idle Detection

The feature implements sophisticated idle detection:

1. **Activity Tracking** - Monitors last scroll time
2. **Idle Threshold** - Default 150ms of no activity
3. **Debouncing** - Resets timer on new scroll activity
4. **Velocity Check** - Ensures velocity is near zero

```typescript
const startIdleDetection = () => {
  clearInterval(idleCheckInterval);

  idleCheckInterval = setInterval(() => {
    const timeSinceLastScroll = Date.now() - lastScrollTime;

    if (timeSinceLastScroll >= idleThreshold && speedTracker.velocity < 0.1) {
      isScrolling = false;
      component.emit?.("viewport:idle", {
        position: scrollPosition,
        lastVelocity: speedTracker.velocity,
      });
      clearInterval(idleCheckInterval);
    }
  }, 50);
};
```

## Integration with Other Features

### Collection Feature

- Listens to `viewport:velocity-changed` to decide when to load data
- Uses velocity threshold (default 1 px/ms) to skip loads during fast scrolling
- Processes queued requests when velocity drops below threshold

### Momentum Feature

- Uses `scrollBy()` method to apply momentum scrolling
- Reads velocity via `getVelocity()` to calculate initial momentum
- Integrates with velocity tracking for smooth deceleration

### Rendering Feature

- Triggered by scroll events to update visible items
- Can skip renders during very fast scrolling to maintain performance

## Configuration

### Constants

```typescript
SCROLLING: {
  OVERSCAN: 1,                    // Items to render outside viewport
  WHEEL_MULTIPLIER: 1,            // Mouse wheel sensitivity
  TOUCH_MULTIPLIER: 1,            // Touch scroll sensitivity
  THROTTLE_SCROLL: 8,             // Scroll event throttle (ms)
  DEFAULT_BEHAVIOR: "smooth",     // Scroll animation behavior
  DEFAULT_EASING: "ease-in-out",  // Easing function
  DEFAULT_EASING_DURATION: 300    // Animation duration (ms)
}

SPEED_TRACKING: {
  DECELERATION_FACTOR: 0.85,      // Velocity decay per frame
  MEASUREMENT_WINDOW: 100,        // Time window for samples (ms)
  MIN_MEASUREMENT_INTERVAL: 16,   // Min time between measurements
  VELOCITY_SMOOTHING: true,       // Enable velocity smoothing
  SMOOTHING_FACTOR: 0.3,          // Smoothing weight
  ACCELERATION_THRESHOLD: 0.5,    // Acceleration detection (px/ms²)
  DIRECTION_CHANGE_THRESHOLD: 0.1 // Min velocity for direction
}
```

### Velocity Thresholds

Different features use velocity for different purposes:

- **Data Loading**: 1 px/ms - Skip loads above this velocity
- **Idle Detection**: 0.1 px/ms - Consider idle below this
- **Momentum Trigger**: 0.5 px/ms - Minimum to trigger momentum
- **Direction Change**: 0.1 px/ms - Minimum to detect direction

## Performance Considerations

1. **Sample Window** - 100ms window balances accuracy vs memory
2. **Measurement Frequency** - Throttled to 16ms (60fps) minimum
3. **Event Throttling** - Scroll events throttled to 8ms intervals
4. **Velocity Smoothing** - Prevents jittery velocity readings

## Troubleshooting

### Click-to-Stop Not Working

- Verify `stopOnClick` is not explicitly set to `false`
- Check that the mousedown event listener is attached to the viewport element
- Ensure the viewport element exists when `initialize()` is called

### Scroll Continues After Click (with stopOnClick: true)

- The inertia detection may be releasing the anchor too early
- Check if your mouse wheel has physical inertia (free-spin)
- The delta thresholds may need adjustment for your hardware

### Velocity Always Zero

- Check if scroll events are being captured
- Verify container has proper overflow settings
- Ensure viewport is initialized correctly

### Erratic Velocity Readings

- Increase smoothing factor in constants
- Check for conflicting scroll handlers
- Verify time measurements are accurate

### Idle Not Detected

- Check idle threshold setting
- Verify velocity is dropping to near zero
- Look for continuous micro-scrolls

### Fast Scrolling Issues

- Adjust wheel multiplier for sensitivity
- Check velocity threshold for data loading
- Monitor performance during fast scrolls
