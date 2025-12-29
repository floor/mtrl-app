# Scrollbar Feature

> **Created:** June 2025
> **Updated:** December 29, 2025

The Scrollbar feature provides a custom, performant scrollbar for the viewport with support for dragging, clicking, and visual feedback.

## Overview

The Scrollbar feature replaces the native browser scrollbar with a custom implementation that:

- **Matches Design System** - Follows Material Design principles
- **Provides Visual Feedback** - Shows scroll position and viewport size
- **Supports Interaction** - Click to jump, drag to scroll
- **Auto-hides** - Fades out when not in use
- **Performance Optimized** - Uses CSS transforms for smooth movement

## Architecture

### Components

1. **Scrollbar Track** - The full scrollable area
2. **Scrollbar Thumb** - The draggable indicator
3. **Interaction Layer** - Handles mouse/touch events
4. **State Manager** - Tracks position and visibility

### DOM Structure

```html
<div class="mtrl-viewport">
  <div class="mtrl-viewport-items">...</div>
  <div class="mtrl-viewport__scrollbar">
    <div class="mtrl-viewport__scrollbar-thumb"></div>
  </div>
</div>
```

## Configuration

The scrollbar feature configuration is part of the viewport's feature-oriented structure:

```typescript
interface ViewportConfig {
  // Scrollbar configuration
  scrollbar?: {
    enabled?: boolean; // Default: true
    autoHide?: boolean; // Default: true
    minThumbSize?: number; // Default: 30
  };
}
```

### Example Configuration

```typescript
const viewport = createViewport({
  // Custom scrollbar
  scrollbar: {
    enabled: true,
    autoHide: false, // Always visible
    minThumbSize: 50, // Larger minimum thumb
  },

  // Other features...
  virtual: {
    itemSize: 100,
    overscan: 2,
  },
});
```

### Internal Mapping

The scrollbar feature receives:

```typescript
withScrollbar({
  enabled: config.scrollbar?.enabled !== false, // Default true
  autoHide: config.scrollbar?.autoHide,
  minThumbSize: config.scrollbar?.minThumbSize,
});
```

### Advanced Configuration

For more advanced scrollbar options, you can still use the full configuration:

```typescript
interface ScrollbarConfig {
  // Enable custom scrollbar
  enabled?: boolean; // Default: true

  // Auto-hide after inactivity (ms)
  hideDelay?: number; // Default: 1000

  // Minimum thumb size (px)
  minThumbSize?: number; // Default: 30

  // Scrollbar width (px)
  width?: number; // Default: 8

  // Show on hover
  showOnHover?: boolean; // Default: true

  // Always visible
  alwaysVisible?: boolean; // Default: false

  // Enable dragging
  draggable?: boolean; // Default: true

  // Click track to jump
  clickToJump?: boolean; // Default: true
}
```

## Implementation

### Basic Setup

```typescript
import { withScrollbar } from "mtrl-addons/core/viewport/features";

const viewport = pipe(
  createViewport(config),
  withScrollbar({
    enabled: true,
    hideDelay: 1000,
    minThumbSize: 30,
  })
)(component);
```

### Always Visible Scrollbar

```typescript
withScrollbar({
  alwaysVisible: true,
  width: 12, // Wider for easier interaction
});
```

### Mobile-Optimized

```typescript
withScrollbar({
  enabled: !isTouchDevice(), // Disable on touch devices
  showOnHover: false, // Don't show on hover for touch
});
```

## Features

### Auto-Hide Behavior

The scrollbar automatically hides after user stops interacting:

```typescript
withScrollbar({
  hideDelay: 1000, // Hide after 1 second
  showOnHover: true, // Show when hovering viewport
});
```

### Thumb Sizing

Thumb size reflects the viewport size relative to content:

```typescript
// Thumb size calculation
thumbHeight = (viewportHeight / contentHeight) * trackHeight;
thumbHeight = Math.max(thumbHeight, minThumbSize);
```

### Smooth Scrolling

Clicking the track smoothly scrolls to position:

```typescript
withScrollbar({
  clickToJump: true,
  smoothScroll: true, // Animate to position
  scrollDuration: 300, // Animation duration
});
```

## Interaction

### Mouse Events

1. **Hover** - Shows scrollbar
2. **Click Track** - Jumps to position
3. **Drag Thumb** - Scrolls viewport
4. **Wheel** - Normal scroll (scrollbar updates)

### Touch Events

1. **Touch Drag** - Direct manipulation
2. **Tap Track** - Jump to position
3. **Momentum** - Continues after release

### Keyboard Support

```typescript
// Enable keyboard navigation
withScrollbar({
  keyboardSupport: true,
  // Arrow keys scroll by this amount
  keyScrollAmount: 50,
});
```

## API

### Methods

#### show()

Programmatically show the scrollbar:

```typescript
viewport.scrollbar.show();
```

#### hide()

Hide the scrollbar:

```typescript
viewport.scrollbar.hide();
```

#### update()

Update scrollbar position and size:

```typescript
viewport.scrollbar.update();
```

#### scrollTo(position)

Scroll to specific position:

```typescript
viewport.scrollbar.scrollTo(500); // Scroll to 500px
```

### Properties

```typescript
interface ScrollbarAPI {
  // Current visibility state
  isVisible: boolean;

  // Dragging state
  isDragging: boolean;

  // Thumb position (0-1)
  thumbPosition: number;

  // Thumb size (0-1)
  thumbSize: number;
}
```

### Events

#### scrollbar:show

Emitted when scrollbar becomes visible:

```typescript
component.on("scrollbar:show", () => {
  console.log("Scrollbar visible");
});
```

#### scrollbar:hide

Emitted when scrollbar hides:

```typescript
component.on("scrollbar:hide", () => {
  console.log("Scrollbar hidden");
});
```

#### scrollbar:drag-start

Emitted when drag begins:

```typescript
component.on("scrollbar:drag-start", (data) => {
  console.log("Dragging started at:", data.position);
});
```

#### scrollbar:drag-end

Emitted when drag ends:

```typescript
component.on("scrollbar:drag-end", (data) => {
  console.log("Dragging ended at:", data.position);
});
```

## Styling

### CSS Classes

```scss
// Main scrollbar container
.mtrl-viewport__scrollbar {
  position: absolute;
  right: 0;
  top: 0;
  width: 8px;
  height: 100%;
  opacity: 0;
  transition: opacity 0.3s;

  &--visible {
    opacity: 1;
  }

  &--dragging {
    opacity: 1;
  }
}

// Scrollbar thumb
.mtrl-viewport__scrollbar-thumb {
  position: absolute;
  width: 100%;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  cursor: grab;

  &--dragging {
    cursor: grabbing;
    background: rgba(0, 0, 0, 0.5);
  }
}
```

### Theming

```typescript
// Custom theme
withScrollbar({
  theme: {
    trackColor: "rgba(0, 0, 0, 0.1)",
    thumbColor: "rgba(0, 0, 0, 0.3)",
    thumbHoverColor: "rgba(0, 0, 0, 0.5)",
    thumbActiveColor: "rgba(0, 0, 0, 0.7)",
  },
});
```

### Dark Mode

```scss
@media (prefers-color-scheme: dark) {
  .mtrl-viewport__scrollbar {
    background: rgba(255, 255, 255, 0.1);

    &-thumb {
      background: rgba(255, 255, 255, 0.3);
    }
  }
}
```

## Performance

### Optimization Techniques

1. **CSS Transforms** - Use `translateY` for positioning
2. **Will-Change** - Hint browser about animations
3. **RAF Throttling** - Limit update frequency
4. **Passive Events** - Better scroll performance

### GPU Acceleration

```scss
.mtrl-viewport__scrollbar-thumb {
  will-change: transform;
  transform: translateY(0);
  transform: translate3d(0, 0, 0); // Force GPU
}
```

### Update Throttling

```typescript
withScrollbar({
  // Throttle position updates
  updateThrottle: 16, // ~60fps

  // Debounce hide timer
  hideDebounce: 100,
});
```

## Accessibility

### ARIA Attributes

```html
<div
  class="mtrl-viewport__scrollbar"
  role="scrollbar"
  aria-orientation="vertical"
  aria-valuemin="0"
  aria-valuemax="100"
  aria-valuenow="50"
  aria-label="Scroll position"
></div>
```

### Keyboard Navigation

```typescript
// Keyboard shortcuts
withScrollbar({
  keyboardShortcuts: {
    home: "Home", // Scroll to top
    end: "End", // Scroll to bottom
    pageUp: "PageUp", // Scroll up by page
    pageDown: "PageDown", // Scroll down by page
  },
});
```

### Screen Reader Support

```typescript
withScrollbar({
  // Announce position changes
  announcePosition: true,
  announceDebounce: 500, // Debounce announcements
});
```

## Integration with Other Features

### With Virtual

Virtual scrolling updates trigger scrollbar updates:

```typescript
// Scrollbar automatically updates when virtual range changes
component.on("viewport:range-changed", () => {
  // Scrollbar position and size updated automatically
});
```

### With Momentum

Momentum scrolling shows scrollbar during motion:

```typescript
// Scrollbar remains visible during momentum
component.on("viewport:momentum-start", () => {
  viewport.scrollbar.show();
});
```

### With Touch/Mouse Dragging

Dragging content shows scrollbar:

```typescript
// Show during drag
component.on("viewport:drag-start", () => {
  viewport.scrollbar.show();
});
```

## Common Patterns

### Custom Scrollbar Buttons

```typescript
// Add scroll buttons
const addScrollButtons = () => {
  const up = document.createElement("button");
  up.onclick = () => viewport.scrollbar.scrollBy(-50);

  const down = document.createElement("button");
  down.onclick = () => viewport.scrollbar.scrollBy(50);
};
```

### Minimap Scrollbar

```typescript
// Show content preview in scrollbar
withScrollbar({
  minimap: true,
  minimapWidth: 50,
  minimapRenderer: (items) => {
    // Return minimap HTML
  },
});
```

### Multi-Column Scrollbar

```typescript
// Horizontal scrollbar for columns
withScrollbar({
  orientation: "horizontal",
  trackColumns: true,
});
```

## Troubleshooting

### Common Issues

1. **Scrollbar Not Showing**
   - Check if enabled in config
   - Verify content exceeds viewport
   - Check CSS z-index

2. **Jumpy Movement**
   - Ensure proper position calculation
   - Check for CSS transitions on wrong properties
   - Verify RAF throttling

3. **Click Not Working**
   - Check event listeners attached
   - Verify z-index and pointer-events
   - Ensure track is clickable

### Debug Mode

```typescript
withScrollbar({
  debug: true, // Show debug info
  logEvents: true, // Log all events
  showMetrics: true, // Display size/position
});
```

### Performance Monitoring

```typescript
// Get scrollbar metrics
const metrics = viewport.scrollbar.getMetrics();
console.log({
  updateCount: metrics.updates,
  avgUpdateTime: metrics.avgUpdateMs,
  dragSessions: metrics.drags,
});
```

## Best Practices

1. **Mobile Consideration**
   - Disable on touch devices if not needed
   - Increase touch target size
   - Consider native scrolling

2. **Performance**
   - Use CSS transforms only
   - Throttle updates appropriately
   - Avoid forced reflows

3. **Accessibility**
   - Provide keyboard alternatives
   - Include ARIA labels
   - Test with screen readers

4. **Visual Design**
   - Follow platform conventions
   - Ensure sufficient contrast
   - Provide hover states

## Configuration Examples

### Desktop Application

```typescript
withScrollbar({
  enabled: true,
  alwaysVisible: false,
  width: 12,
  minThumbSize: 50,
  hideDelay: 1000,
  showOnHover: true,
});
```

### Mobile Application

```typescript
withScrollbar({
  enabled: false, // Use native scrolling
  // Or minimal custom scrollbar
  width: 4,
  hideDelay: 500,
  showOnHover: false,
});
```

### Data Table

```typescript
withScrollbar({
  alwaysVisible: true, // Always show for clarity
  width: 16, // Wider for easier use
  orientation: "both", // Horizontal and vertical
  clickToJump: true,
  smoothScroll: false, // Instant for data
});
```
