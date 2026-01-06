# Momentum Feature

> **Created:** January 6, 2026
> **Updated:** January 6, 2026

The momentum feature adds inertial scrolling to the viewport, providing smooth deceleration after touch or mouse drag gestures. This creates a natural, native-like scrolling experience.

## Overview

The momentum feature provides:

- **Touch gesture support** - Swipe and flick gestures on touch devices
- **Mouse drag scrolling** - Click-and-drag scrolling on desktop
- **Inertial deceleration** - Smooth velocity decay after release
- **Click-to-stop** - Stop momentum animation when clicking (configurable)
- **Integration with scrolling** - Works with the scrolling feature's velocity tracking

## Configuration

```typescript
interface MomentumConfig {
  enabled?: boolean;              // Default: true
  deceleration?: number;          // Default: 0.95 (velocity multiplier per frame)
  minVelocity?: number;           // Default: 0.1 (px/ms to stop animation)
  minDuration?: number;           // Default: 300 (ms - max gesture duration for momentum)
  minVelocityThreshold?: number;  // Default: 0.5 (px/ms to trigger momentum)
  stopOnClick?: boolean;          // Default: true - Stop momentum on click
}
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | `boolean` | `true` | Enable momentum scrolling |
| `deceleration` | `number` | `0.95` | Velocity decay factor per animation frame |
| `minVelocity` | `number` | `0.1` | Minimum velocity (px/ms) before stopping |
| `minDuration` | `number` | `300` | Maximum gesture duration (ms) to trigger momentum |
| `minVelocityThreshold` | `number` | `0.5` | Minimum velocity (px/ms) required to start momentum |
| `stopOnClick` | `boolean` | `true` | Stop momentum animation when clicking on viewport |

## How It Works

### Touch Gestures

1. **Touch Start** - Records initial position and cancels any existing momentum
2. **Touch Move** - Updates scroll position as finger moves
3. **Touch End** - If gesture was quick enough and has sufficient velocity, starts momentum animation

```typescript
// Touch end triggers momentum for quick flicks
if (touchDuration < minDuration && Math.abs(velocity) > minVelocityThreshold) {
  startMomentum(velocity);
}
```

### Mouse Drag

1. **Mouse Down** - Begins drag mode, records position, prevents text selection
2. **Mouse Move** - Updates scroll position while dragging
3. **Mouse Up** - Triggers momentum if drag was fast enough

### Momentum Animation

The momentum animation uses `requestAnimationFrame` for smooth 60fps updates:

```typescript
const animate = () => {
  // Apply deceleration
  velocity *= deceleration;

  // Stop if velocity is too small
  if (Math.abs(velocity) < minVelocity) {
    momentumAnimationId = null;
    return;
  }

  // Apply scroll delta
  const frameDelta = velocity * FRAME_TIME;
  component.viewport.scrollBy(frameDelta);

  // Continue animation
  momentumAnimationId = requestAnimationFrame(animate);
};
```

### Click-to-Stop

When `stopOnClick` is enabled (default), clicking on the viewport stops any active momentum animation:

```typescript
const handleClick = () => {
  stopMomentum();
};
```

This is useful when:
- User wants to stop scrolling to interact with content
- User accidentally flicked too hard
- User wants precise control over final position

## API

### Exposed State

The momentum feature exposes its state for other features to interact with:

```typescript
component.viewport.momentumState = {
  stopMomentum: () => void  // Stop momentum animation
};
```

### Integration with Scrolling Feature

The scrolling feature can call `stopMomentum()` when handling click-to-stop with anchor-based stopping:

```typescript
// In scrolling feature's handleMouseDown:
const momentumState = component.viewport.momentumState;
if (momentumState?.stopMomentum) {
  momentumState.stopMomentum();
}
```

## Usage Examples

### Basic Usage

Momentum is automatically applied when using `createViewport`:

```typescript
const viewport = createViewport({
  virtual: {
    itemSize: 50,
    overscan: 2
  },
  // Momentum is enabled by default
});
```

### Customizing Deceleration

For a slower, more gradual deceleration:

```typescript
// Note: Momentum config is typically set via constants
// For custom values, modify VIEWPORT_CONSTANTS.MOMENTUM
```

### Disabling Click-to-Stop

If you want momentum to continue even when clicking:

```typescript
// This is handled via the scrolling feature's stopOnClick option
const viewport = createViewport({
  scrolling: {
    stopOnClick: false  // Momentum won't stop on click
  }
});
```

## Constants

The momentum feature uses these default constants:

```typescript
MOMENTUM: {
  ENABLED: true,
  DECELERATION_FACTOR: 0.95,    // Velocity multiplier per frame
  MIN_VELOCITY: 0.1,            // px/ms threshold to stop
  MIN_DURATION: 300,            // ms - max gesture duration
  MIN_VELOCITY_THRESHOLD: 0.5,  // px/ms to trigger momentum
  FRAME_TIME: 16.67             // ~60fps frame duration
}
```

### Deceleration Examples

| Deceleration | Feel | Use Case |
|--------------|------|----------|
| `0.90` | Quick stop | Precise lists, forms |
| `0.95` | Natural (default) | General purpose |
| `0.98` | Smooth, long | Content browsing, feeds |

## Event Listeners

The momentum feature attaches these event listeners to the viewport element:

### Touch Events
- `touchstart` (passive) - Begin touch tracking
- `touchmove` (non-passive) - Update position, prevent native scroll
- `touchend` (passive) - Trigger momentum if applicable

### Mouse Events
- `mousedown` - Begin drag mode
- `mousemove` - Update position during drag
- `mouseup` - End drag, trigger momentum
- `mouseleave` - End drag if mouse leaves viewport

### Click Events (when stopOnClick enabled)
- `click` - Stop momentum animation

## Performance Considerations

1. **Frame Budget** - Animation runs at 60fps using `requestAnimationFrame`
2. **Velocity Decay** - Exponential decay ensures smooth deceleration
3. **Early Termination** - Animation stops when velocity drops below threshold
4. **Event Cleanup** - All listeners are removed on destroy

## Troubleshooting

### Momentum Not Triggering

- Check if `enabled` is set to `false` in constants
- Verify gesture duration is under `minDuration` (300ms default)
- Ensure velocity exceeds `minVelocityThreshold` (0.5 px/ms default)
- Try a quicker, more forceful flick gesture

### Momentum Too Fast/Slow

- Adjust `deceleration` factor (lower = faster stop)
- Check `minVelocity` threshold
- Verify scroll sensitivity in scrolling feature

### Momentum Stops Unexpectedly

- Check if `stopOnClick` is enabled and you're clicking
- Verify no other code is calling `stopMomentum()`
- Check for scroll bounds being reached

### Touch Not Working

- Verify touch events are not being captured elsewhere
- Check for `pointer-events: none` on viewport or children
- Ensure viewport element has sufficient size

## Related Documentation

- [Scrolling Feature](./scrolling.md) - Velocity tracking and click-to-stop
- [Viewport](../viewport.md) - Main viewport documentation
- [Constants](../constants.md) - Configuration constants