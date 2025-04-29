# Core Gestures Module

The `core/gestures` module provides the fundamental gesture detection system that powers all gesture recognition in the library. It's designed as a modular system with individual detection mechanisms for different gesture types.

## Architecture

```
src/core/gestures/
├── index.ts       # Main exports
├── types.ts       # Type definitions
├── manager.ts     # Unified gesture manager
├── utils.ts       # Shared utilities
├── tap.ts         # Tap gesture detection
├── swipe.ts       # Swipe gesture detection
├── longpress.ts   # Long press gesture detection
├── pan.ts         # Pan gesture detection
├── pinch.ts       # Pinch gesture detection
└── rotate.ts      # Rotate gesture detection
```

## Core Components

### GestureManager

The gesture manager is the central controller that coordinates event handling and gesture detection. It can be used directly, but is typically accessed through the feature enhancers.

```typescript
import { createGestureManager } from './core/gestures';

// Create a gesture manager for an element
const manager = createGestureManager(element, {
  swipeThreshold: 30,
  longPressTime: 500
});

// Add gesture handlers
manager.on('tap', handleTap);
manager.on('swipeleft', handleSwipeLeft);

// Enable/disable gesture recognition
manager.disable();
manager.enable();

// Clean up when done
manager.destroy();
```

### Gesture Events

All gesture events extend the base `GestureEvent` interface and add properties specific to each gesture type.

```typescript
interface GestureEvent {
  type: string;             // Event type identifier
  originalEvent: Event;     // Original DOM event
  target: EventTarget;      // Element the gesture was triggered on
  startTime: number;        // Timestamp when gesture started
  endTime: number;          // Timestamp when gesture ended
  duration: number;         // Duration in milliseconds
  defaultPrevented: boolean;// Whether default was prevented
  preventDefault: () => void;
  stopPropagation: () => void;
}
```

### Individual Gesture Detectors

Each gesture has its own detection module that implements the specific logic for recognizing that gesture.

#### Tap Detector

```typescript
import { detectTap } from './core/gestures';

// Context contains state, options, and originalEvent
const tapEvent = detectTap(context);
if (tapEvent) {
  // Handle tap event
}
```

#### Swipe Detector

```typescript
import { detectSwipe, SWIPE_DIRECTIONS } from './core/gestures';

const swipeEvent = detectSwipe(context);
if (swipeEvent) {
  if (swipeEvent.direction === SWIPE_DIRECTIONS.LEFT) {
    // Handle left swipe
  }
}
```

#### Long Press Detector

```typescript
import { detectLongPress } from './core/gestures';

// Long press is time-based, so it returns a cleanup function
const cleanup = detectLongPress(context, (longPressEvent) => {
  // Handle long press
});

// Later, to cancel
cleanup();
```

#### Pan Detector

```typescript
import { detectPan } from './core/gestures';

const panEvent = detectPan(context);
if (panEvent) {
  // Handle pan
}
```

#### Pinch Detector

```typescript
import { detectPinch } from './core/gestures';

// Needs multi-touch points
const pinchEvent = detectPinch(context, touch1, touch2);
if (pinchEvent) {
  // Handle pinch with pinchEvent.scale
}
```

#### Rotate Detector

```typescript
import { detectRotate } from './core/gestures';

// Needs multi-touch points
const rotateEvent = detectRotate(context, touch1, touch2);
if (rotateEvent) {
  // Handle rotation with rotateEvent.rotation
}
```

## Utility Functions

### Gesture Detection Context

All detectors use a common context object that contains the current gesture state, options, and original event.

```typescript
interface GestureDetectionContext {
  state: GestureState;        // Current tracking state
  options: Required<GestureConfig>; // Gesture configuration
  originalEvent: Event;       // Original DOM event
}
```

### Geometric Utilities

```typescript
// Calculate distance between two points
const distance = getDistance(x1, y1, x2, y2);

// Calculate angle between two points in degrees (0-360)
const angle = getAngle(x1, y1, x2, y2);

// Create a base gesture event
const event = createGestureEvent(type, originalEvent, state);

// Check if touch is supported
const supported = hasTouchSupport();

// Get normalized touch coordinates from any event type
const { clientX, clientY } = getTouchCoordinates(event);
```

## Configuration Options

The gesture system can be configured with several options:

```typescript
interface GestureConfig {
  // Minimum distance (px) to recognize a swipe
  swipeThreshold?: number;      // default: 30
  
  // Maximum time (ms) for a swipe
  swipeTimeThreshold?: number;  // default: 300
  
  // Time (ms) to recognize a long press
  longPressTime?: number;       // default: 500
  
  // Distance threshold (px) for tap recognition
  tapDistanceThreshold?: number; // default: 10
  
  // Whether to prevent default behaviors
  preventDefault?: boolean;     // default: true
  
  // Whether to stop event propagation
  stopPropagation?: boolean;    // default: false
}
```

## Gesture State Tracking

The gesture system maintains an internal state to track ongoing gestures:

```typescript
interface GestureState {
  active: boolean;        // Whether gesture recognition is active
  startTime: number;      // When the gesture started
  startX: number;         // Initial X position
  startY: number;         // Initial Y position
  lastX: number;          // Last X position
  lastY: number;          // Last Y position
  currentX: number;       // Current X position
  currentY: number;       // Current Y position
  touchCount: number;     // Number of touch points
  longPressTimer: number | null; // Timer for long press detection
  startDistance: number;  // Initial distance between touches
  startAngle: number;     // Initial angle between touches
  lastTapTime: number;    // Time of last tap (for double tap)
  tapCount: number;       // Number of consecutive taps
  target: EventTarget | null; // Element that received the initial event
}
```

## Event Handling System

The gesture manager uses an event-based system for communication:

```typescript
// Add a gesture event listener
manager.on('tap', (event: TapEvent) => {
  console.log(`Tapped at ${event.x}, ${event.y}`);
});

// Remove a gesture event listener
manager.off('swipe', handleSwipe);

// Check if a gesture is supported
if (manager.isSupported('pinch')) {
  // Enable pinch handling
}
```

## Browser and Device Support

The system automatically adapts to the capabilities of the device:

- Uses Pointer Events if available
- Falls back to Touch Events for touch devices
- Uses Mouse Events for non-touch devices
- Multi-touch gestures (pinch, rotate) require touch support

## Internal Event Flow

1. DOM events (pointer/touch/mouse) are captured by the gesture manager
2. Events are normalized and used to update the gesture state
3. Individual gesture detectors analyze the state to detect gestures
4. When a gesture is detected, the corresponding event is dispatched
5. Event handlers registered via `on()` are called with the gesture event

## Thread Safety and Performance

- Event listeners use `{ passive: true }` when possible for better scrolling performance
- Touch state is normalized to handle both touch and mouse events consistently
- Cleanup is automatically handled to prevent memory leaks

## Integration Points

The core gesture system integrates with the rest of the library through:

1. The gesture manager interface (`GestureManager`)
2. The gesture event types (`TapEvent`, `SwipeEvent`, etc.)
3. The feature enhancers that wrap the core functionality

## Constants

### GESTURE_TYPES

```typescript
enum GESTURE_TYPES {
  TAP = 'tap',
  SWIPE = 'swipe',
  SWIPE_LEFT = 'swipeleft',
  SWIPE_RIGHT = 'swiperight',
  SWIPE_UP = 'swipeup',
  SWIPE_DOWN = 'swipedown',
  PINCH = 'pinch',
  ROTATE = 'rotate',
  LONG_PRESS = 'longpress',
  PAN = 'pan'
}
```

### SWIPE_DIRECTIONS

```typescript
enum SWIPE_DIRECTIONS {
  UP = 'up',
  DOWN = 'down',
  LEFT = 'left',
  RIGHT = 'right'
}
```

## API Reference

### createGestureManager

```typescript
function createGestureManager(
  element: HTMLElement,
  config?: GestureConfig
): GestureManager
```

Creates a gesture manager for the specified element with optional configuration.

### detectTap

```typescript
function detectTap(
  context: GestureDetectionContext
): TapEvent | null
```

Detects if a tap gesture has occurred based on the current context.

### detectSwipe

```typescript
function detectSwipe(
  context: GestureDetectionContext
): SwipeEvent | null
```

Detects if a swipe gesture has occurred based on the current context.

### detectLongPress

```typescript
function detectLongPress(
  context: GestureDetectionContext,
  callback: (event: LongPressEvent) => void
): () => void
```

Sets up long press detection and returns a cleanup function.

### detectPan

```typescript
function detectPan(
  context: GestureDetectionContext
): PanEvent | null
```

Detects if a pan gesture has occurred based on the current context.

### detectPinch

```typescript
function detectPinch(
  context: GestureDetectionContext,
  touch1: Touch,
  touch2: Touch
): PinchEvent | null
```

Detects if a pinch gesture has occurred based on the current context and touch points.

### detectRotate

```typescript
function detectRotate(
  context: GestureDetectionContext,
  touch1: Touch,
  touch2: Touch
): RotateEvent | null
```

Detects if a rotate gesture has occurred based on the current context and touch points.

## Usage Examples

### Direct Usage

```typescript
import { createGestureManager, GESTURE_TYPES } from './core/gestures';

// Create a manager for an element
const gestureManager = createGestureManager(myElement, {
  swipeThreshold: 40,  // Require more movement for swipes
  longPressTime: 700   // Longer press time
});

// Add gesture handlers
gestureManager.on(GESTURE_TYPES.TAP, (e) => {
  console.log(`Tapped with ${e.count} taps`);
});

gestureManager.on(GESTURE_TYPES.SWIPE_LEFT, (e) => {
  console.log(`Swiped left with velocity ${e.velocity}`);
});

// Clean up when done
gestureManager.destroy();
```

### Usage with Feature Enhancers

The core system is typically accessed through the feature enhancers:

```typescript
import { withGestures, withTapGesture } from './core/compose/features';

// Using the unified gesture manager
const component1 = withGestures({
  gestureHandlers: {
    'tap': handleTap,
    'swipeleft': handleSwipeLeft
  }
})(baseComponent);

// Using a specific gesture enhancer
const component2 = withTapGesture({
  onTap: handleTap
})(baseComponent);
```