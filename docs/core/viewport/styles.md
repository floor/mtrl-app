# Viewport Styling Guide

This document provides comprehensive documentation for styling the viewport and its various implementations (lists, maps, sheets, etc.), including CSS architecture, theming, customization, and performance considerations.

## Overview

The viewport styling system is built on Material Design principles and uses a modular SCSS architecture. While the current implementation focuses on virtual lists (`_vlist.scss`), the architecture is designed to support various viewport-based components:

- **Material Design 3 Compliance** - Following MD3 design tokens
- **Dark Theme Support** - Automatic dark mode adaptation
- **Performance Optimizations** - GPU acceleration and containment
- **Accessibility** - High contrast and motion preferences
- **Customization** - CSS custom properties and mixins

## Architecture

### File Structure

```scss
// Main style file
mtrl-addons/src/styles/components/_vlist.scss

// Dependencies
@use "mtrl/src/styles/abstract/base";      // Base configuration
@use "mtrl/src/styles/abstract/variables"; // Design tokens
@use "mtrl/src/styles/abstract/functions"; // Helper functions
@use "mtrl/src/styles/abstract/mixins";    // Reusable mixins
@use "mtrl/src/styles/abstract/theme";     // Theme system
```

### CSS Class Naming Convention

The styling follows BEM (Block Element Modifier) methodology:

```
// Core viewport classes (shared across all implementations)
.mtrl-viewport                 // Block: Viewport container
.mtrl-viewport-items           // Element: Items container
.mtrl-viewport-item            // Block: Individual item
.mtrl-viewport-item__placeholder // Element: Placeholder variant
.mtrl-viewport__scrollbar      // Element: Custom scrollbar
.mtrl-viewport__scrollbar-thumb // Sub-element: Scrollbar thumb

// Component-specific classes
.mtrl-vlist                    // Block: Virtual list component
.mtrl-vlist--selection         // Modifier: Selection mode
.mtrl-vmap                     // Block: Virtual map component
.mtrl-vsheet                   // Block: Virtual sheet component
.mtrl-vgallery                 // Block: Virtual gallery component
```

## Core Components

### VList Container

The main virtual list container with Material Design styling:

```scss
.mtrl-vlist {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 100px;
  background-color: var(--mtrl-sys-color-surface);
  border: 2px solid var(--mtrl-sys-color-outline-variant);
  border-radius: 3px;
  transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1);

  // Performance optimizations
  contain: layout style paint;
  transform: translateZ(0);
  backface-visibility: hidden;
}
```

#### Container States

**Selection Mode**

```scss
.mtrl-vlist--selection {
  cursor: pointer;

  .mtrl-viewport-item:hover {
    background-color: rgba(var(--mtrl-sys-color-on-surface-variant), 0.04);
  }
}
```

**Disabled State**

```scss
.mtrl-vlist--disabled {
  pointer-events: none;
  opacity: 0.38;
  transition: opacity 250ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Viewport Structure

The viewport provides the scrollable area:

```scss
.mtrl-viewport {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.mtrl-viewport-items {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 8px 0;
  will-change: transform;
}
```

### Viewport Items

Individual items with performance optimizations:

```scss
.mtrl-viewport-item {
  opacity: 1;
  transition: opacity 250ms cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;

  // Fade-in animation for replaced placeholders
  &--replaced {
    animation: fade-in 0.3s ease-out;
  }
}
```

## Placeholder Styling

### Placeholder Animation

Placeholders use a subtle pulse animation:

```scss
@keyframes placeholder-pulse {
  0%,
  100% {
    opacity: 0.6;
  }
  50% {
    opacity: 0.5;
  }
}

.mtrl-viewport-item__placeholder {
  opacity: 0.6;
  animation: placeholder-pulse 2s ease-in-out infinite;
}
```

### Placeholder Content Blocks

Different content types have specific styling:

```scss
.mtrl-viewport-item__placeholder {
  // Text blocks
  .user-name,
  .user-email,
  .user-role {
    position: relative;
    display: inline-block;
    font-size: 0.8em;
    color: transparent;
    background-color: var(--mtrl-sys-color-on-surface);
    border-radius: 0.1em;
    opacity: 0.9;
    text-decoration: none;
    line-height: 1;
    padding: 0 0 0.05em;
    vertical-align: middle;
  }

  // Layout spacing
  .user-email,
  .user-role {
    margin-top: 0.2em;
  }

  // Text transformations
  .user-name,
  .user-role {
    text-transform: capitalize;
  }

  // Avatar placeholder
  .user-avatar {
    background-color: var(--mtrl-sys-color-primary-container);
    color: var(--mtrl-sys-color-primary-container);
    opacity: 1;
  }
}
```

## Custom Scrollbar

### Scrollbar Structure

The custom scrollbar provides visual feedback:

```scss
.mtrl-viewport__scrollbar {
  position: absolute;
  top: 0;
  right: 0;
  width: 8px;
  height: 100%;
  background: rgba(0, 0, 0, 0.05);
  opacity: 0;
  transition: opacity 0.3s ease;
  cursor: pointer;
  z-index: 10;
}
```

### Scrollbar States

**Visibility States**

```scss
.mtrl-viewport__scrollbar {
  &--visible,
  &--dragging,
  &:hover {
    opacity: 1;
  }
}
```

**Thumb Styling**

```scss
.mtrl-viewport__scrollbar-thumb {
  position: absolute;
  top: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  min-height: 15px;
  will-change: transform;
  cursor: grab;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.5);
  }

  &:active,
  &--dragging {
    cursor: grabbing;
    background: rgba(0, 0, 0, 0.6);
  }
}
```

## Animations

### Fade-In Animation

Used when placeholders are replaced with real content:

```scss
@keyframes fade-in {
  from {
    opacity: 0.6;
  }
  to {
    opacity: 1;
  }
}

.mtrl-viewport-item--replaced {
  animation: fade-in 0.3s ease-out;
}
```

### Placeholder Pulse

Creates a loading effect:

```scss
@keyframes placeholder-pulse {
  0%,
  100% {
    opacity: 0.6;
  }
  50% {
    opacity: 0.5;
  }
}
```

## Theme Support

### Dark Theme

Automatic dark theme adaptation:

```scss
@media (prefers-color-scheme: dark) {
  .mtrl-viewport__scrollbar {
    background: rgba(255, 255, 255, 0.1);

    &-thumb {
      background: rgba(255, 255, 255, 0.3);

      &:hover {
        background: rgba(255, 255, 255, 0.5);
      }

      &:active,
      &--dragging {
        background: rgba(255, 255, 255, 0.6);
      }
    }
  }
}
```

### Custom Theme Variables

The component uses Material Design 3 tokens:

```scss
// Surface colors
--mtrl-sys-color-surface
--mtrl-sys-color-on-surface
--mtrl-sys-color-on-surface-variant

// Container colors
--mtrl-sys-color-primary-container
--mtrl-sys-color-on-primary-container

// Border colors
--mtrl-sys-color-outline-variant
```

## Performance Optimizations

### CSS Containment

Improves rendering performance:

```scss
.mtrl-vlist {
  contain: layout style paint;
}
```

This tells the browser:

- **layout** - Layout changes don't affect outside elements
- **style** - Style changes are contained
- **paint** - Paint operations are contained

### GPU Acceleration

Forces GPU acceleration for smooth scrolling:

```scss
.mtrl-vlist {
  transform: translateZ(0);
  backface-visibility: hidden;
}

.mtrl-viewport-items,
.mtrl-viewport-item {
  will-change: transform;
}
```

### High-DPI Displays

Optimizations for retina displays:

```scss
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .mtrl-viewport-item {
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}
```

## Customization

### CSS Custom Properties

Override default values:

```css
.my-custom-vlist {
  /* Custom colors */
  --mtrl-sys-color-surface: #f5f5f5;
  --mtrl-sys-color-outline-variant: #e0e0e0;

  /* Custom dimensions */
  --vlist-item-height: 72px;
  --vlist-scrollbar-width: 12px;

  /* Custom animations */
  --vlist-transition-duration: 200ms;
}
```

### Component Variants

Create custom variants:

```scss
// Compact variant
.mtrl-vlist--compact {
  .mtrl-viewport-items {
    padding: 4px 0;
  }

  .mtrl-viewport-item {
    min-height: 48px;
  }
}

// Dense variant
.mtrl-vlist--dense {
  .mtrl-viewport-item {
    padding: 8px 16px;
    font-size: 0.875rem;
  }
}

// Card variant
.mtrl-vlist--card {
  border: none;
  border-radius: 12px;
  box-shadow: var(--mtrl-sys-elevation-1);
}
```

### Item Templates

Style different item types:

```scss
// User item template
.user-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  gap: 16px;

  &__avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }

  &__content {
    flex: 1;
  }

  &__name {
    font-weight: 500;
    color: var(--mtrl-sys-color-on-surface);
  }

  &__email {
    font-size: 0.875rem;
    color: var(--mtrl-sys-color-on-surface-variant);
  }
}
```

## Accessibility

### Motion Preferences

Respect user motion preferences:

```scss
@media (prefers-reduced-motion: reduce) {
  .mtrl-viewport-item {
    transition: none;
  }

  .mtrl-viewport-item__placeholder {
    animation: none;
    opacity: 0.6;
  }

  .mtrl-viewport-item--replaced {
    animation: none;
  }
}
```

### High Contrast

Support high contrast mode:

```scss
@media (prefers-contrast: high) {
  .mtrl-vlist {
    border-width: 3px;
  }

  .mtrl-viewport__scrollbar {
    background: rgba(0, 0, 0, 0.2);

    &-thumb {
      background: rgba(0, 0, 0, 0.8);
    }
  }
}
```

### Focus Indicators

Ensure keyboard navigation is visible:

```scss
.mtrl-viewport-item:focus {
  outline: 2px solid var(--mtrl-sys-color-primary);
  outline-offset: -2px;
}

.mtrl-viewport-item:focus:not(:focus-visible) {
  outline: none;
}
```

## Integration Examples

### With Material Components

```scss
// With Material Button
.mtrl-viewport-item {
  .mtrl-button {
    margin-left: auto;
  }
}

// With Material Checkbox
.mtrl-vlist--selection {
  .mtrl-checkbox {
    margin-right: 16px;
  }
}
```

### Custom Layouts

```scss
// Grid layout items
.mtrl-viewport-item--grid {
  display: inline-block;
  width: calc(33.333% - 16px);
  margin: 8px;
  vertical-align: top;
}

// Card layout
.mtrl-viewport-item--card {
  margin: 8px 16px;
  padding: 16px;
  background: var(--mtrl-sys-color-surface-variant);
  border-radius: 8px;
  box-shadow: var(--mtrl-sys-elevation-1);
}
```

## Component-Specific Styling

### Virtual Map Styling

```scss
.mtrl-vmap {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: var(--mtrl-sys-color-surface-dim);
  cursor: grab;

  &--dragging {
    cursor: grabbing;
  }

  // Map tiles
  .mtrl-viewport-item {
    position: absolute;
    padding: 0;
    border: 1px solid rgba(0, 0, 0, 0.1);

    img {
      width: 100%;
      height: 100%;
      display: block;
    }
  }

  // Map controls overlay
  &__controls {
    position: absolute;
    top: 16px;
    right: 16px;
    z-index: 100;
  }
}
```

### Virtual Sheet Styling

```scss
.mtrl-vsheet {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: var(--mtrl-sys-color-surface);
  font-family: monospace;

  // Sheet cells
  .mtrl-viewport-item {
    position: absolute;
    border: 1px solid var(--mtrl-sys-color-outline-variant);
    padding: 4px 8px;
    background: var(--mtrl-sys-color-surface);

    &--header {
      background: var(--mtrl-sys-color-surface-variant);
      font-weight: 600;
      position: sticky;
      z-index: 10;
    }

    &--selected {
      outline: 2px solid var(--mtrl-sys-color-primary);
      outline-offset: -2px;
      z-index: 5;
    }

    &--editing {
      padding: 0;

      input {
        width: 100%;
        height: 100%;
        border: none;
        padding: 4px 8px;
        font: inherit;
      }
    }
  }

  // Grid lines
  &__grid {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image:
      linear-gradient(
        var(--mtrl-sys-color-outline-variant) 1px,
        transparent 1px
      ),
      linear-gradient(
        90deg,
        var(--mtrl-sys-color-outline-variant) 1px,
        transparent 1px
      );
    background-size: var(--sheet-row-height) var(--sheet-column-width);
    pointer-events: none;
  }
}
```

### Virtual Gallery Styling

````scss
.mtrl-vgallery {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: var(--mtrl-sys-color-surface);

  // Gallery items
  .mtrl-viewport-item {
    position: absolute;
    overflow: hidden;
    border-radius: 8px;
    cursor: pointer;
    transition: transform 0.2s ease;

    &:hover {
      transform: scale(1.02);
      box-shadow: var(--mtrl-sys-elevation-2);
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    // Loading state
    &__placeholder {
      background: linear-gradient(
        135deg,
        var(--mtrl-sys-color-surface-variant) 0%,
        var(--mtrl-sys-color-surface) 50%,
        var(--mtrl-sys-color-surface-variant) 100%
      );
      background-size: 200% 100%;
      animation: shimmer 1.5s ease-in-out infinite;
    }
  }

  // Masonry layout
  &--masonry {
    .mtrl-viewport-items {
      column-count: auto;
      column-width: 300px;
      column-gap: 16px;
    }

    .mtrl-viewport-item {
      position: relative;
      break-inside: avoid;
      margin-bottom: 16px;
    }
  }
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

## Best Practices

### 1. Performance

- Use CSS containment for large lists
- Minimize paint operations
- Use transform instead of top/left
- Batch DOM updates

### 2. Theming

- Use CSS custom properties for customization
- Follow Material Design guidelines
- Support dark theme
- Test with system preferences

### 3. Accessibility

- Ensure sufficient color contrast
- Provide focus indicators
- Support reduced motion
- Test with screen readers

### 4. Responsive Design

```scss
// Mobile optimizations
@media (max-width: 600px) {
  .mtrl-vlist {
    border-radius: 0;
    border-left: none;
    border-right: none;
  }

  .mtrl-viewport__scrollbar {
    width: 4px;
  }
}
````

## Troubleshooting

### Common Issues

**Scrollbar Not Visible**

```scss
// Ensure z-index is high enough
.mtrl-viewport__scrollbar {
  z-index: 10; // Increase if needed
}
```

**Placeholder Animation Stuttering**

```scss
// Reduce animation complexity
.mtrl-viewport-item__placeholder {
  animation-timing-function: linear;
  animation-duration: 3s; // Slower animation
}
```

**Performance Issues**

```scss
// Disable animations on low-end devices
@media (max-width: 768px) and (hover: none) {
  .mtrl-viewport-item {
    transition: none;
  }
}
```

## Migration Guide

### From Previous Versions

```scss
// Old class names
.viewport-item → .mtrl-viewport-item
.viewport-placeholder → .mtrl-viewport-item__placeholder

// Old variables
$item-height → --vlist-item-height
$scrollbar-width → --vlist-scrollbar-width
```

## Resources

- [Material Design 3 Guidelines](https://m3.material.io/)
- [CSS Containment Spec](https://www.w3.org/TR/css-contain-1/)
- [SCSS Documentation](https://sass-lang.com/documentation)
- [BEM Methodology](http://getbem.com/)
