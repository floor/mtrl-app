Here's the complete `badge.md` file with all the updates:

# Badge Component

The Badge component provides a Material Design 3 compliant indicator that can display counts, status information, or simply draw attention to UI elements. It's designed to be lightweight, accessible, and flexible for various notification scenarios.

## Overview

Badges are commonly used for:

- Displaying notification counts
- Indicating unread items or messages
- Highlighting new features or content
- Showing status information
- Drawing attention to elements requiring user action

The component follows Material Design 3 guidelines with support for various sizes (small dot or larger numbered), colors, and positioning options.

## Import

```javascript
import { createBadge } from 'mtrl';
```

## Basic Usage

```javascript
// Create a notification badge attached to an icon
const notificationBadge = createBadge({
  variant: 'large',
  label: 5,
  color: 'error',
  target: document.querySelector('.notification-icon')
});

// Update the badge programmatically
function updateNotifications(count) {
  notificationBadge.setLabel(count);
  
  // Hide badge when count is zero
  if (count === 0) {
    notificationBadge.hide();
  } else {
    notificationBadge.show();
  }
}
```

## Configuration

The Badge component accepts the following configuration options:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `variant` | `string` | `BADGE_VARIANTS.LARGE` | Badge size variant (use `BADGE_VARIANTS.SMALL` or `BADGE_VARIANTS.LARGE`) |
| `color` | `string` | `BADGE_COLORS.ERROR` | Badge color (use constants from `BADGE_COLORS`) |
| `position` | `string` | `BADGE_POSITIONS.TOP_RIGHT` | Badge position (use constants from `BADGE_POSITIONS`) |
| `label` | `string\|number` | `''` | Text or number displayed in the badge |
| `max` | `number` | `undefined` | Maximum value to display before showing "{max}+" |
| `visible` | `boolean` | `true` | Whether the badge is initially visible |
| `target` | `HTMLElement` | `undefined` | Element to which the badge should be attached |
| `class` | `string` | `undefined` | Additional CSS classes to add to the badge |
| `prefix` | `string` | `'mtrl'` | Prefix for CSS class names |

## Component API

The Badge component provides the following methods:

### Content Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `setLabel(label)` | `label: string\|number` | `BadgeComponent` | Sets the badge's text label |
| `getLabel()` | none | `string` | Gets the badge's current text label |
| `setMax(max)` | `max: number` | `BadgeComponent` | Sets maximum value (after which badge shows max+) |

### Visibility Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `show()` | none | `BadgeComponent` | Shows the badge |
| `hide()` | none | `BadgeComponent` | Hides the badge |
| `toggle(visible?)` | `visible?: boolean` | `BadgeComponent` | Toggles badge visibility |
| `isVisible()` | none | `boolean` | Checks if the badge is visible |

### Appearance Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `setColor(color)` | `color: string` | `BadgeComponent` | Sets badge color (recommend using `BADGE_COLORS`) |
| `setVariant(variant)` | `variant: string` | `BadgeComponent` | Sets badge variant (recommend using `BADGE_VARIANTS`) |
| `setPosition(position)` | `position: string` | `BadgeComponent` | Sets badge position (recommend using `BADGE_POSITIONS`) |

### Attachment Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `attachTo(target)` | `target: HTMLElement` | `BadgeComponent` | Attaches badge to a target element |
| `detach()` | none | `BadgeComponent` | Makes badge standalone (removes from wrapper) |

### Style Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `addClass(...classes)` | `...classes: string[]` | `BadgeComponent` | Adds CSS classes to the badge element |
| `removeClass(...classes)` | `...classes: string[]` | `BadgeComponent` | Removes CSS classes from the badge element |

### Event Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `on(event, handler)` | `event: string, handler: Function` | `BadgeComponent` | Adds an event listener |
| `off(event, handler)` | `event: string, handler: Function` | `BadgeComponent` | Removes an event listener |

### Lifecycle Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `destroy()` | none | `void` | Destroys the badge component and cleans up resources |

## Constants

The Badge component provides several constants for better type safety and code completion:

```javascript
import { createBadge, BADGE_VARIANTS, BADGE_COLORS, BADGE_POSITIONS } from 'mtrl';

// Use constants instead of string literals
const badge = createBadge({
  variant: BADGE_VARIANTS.SMALL,
  color: BADGE_COLORS.ERROR,
  position: BADGE_POSITIONS.TOP_RIGHT
});
```

This provides intellisense benefits and prevents typos in your IDE.

## Examples

### Small Indicator Badge

```javascript
// Using constants for better type safety
const dotBadge = createBadge({
  variant: BADGE_VARIANTS.SMALL,
  color: BADGE_COLORS.ERROR,
  target: document.querySelector('#notification-icon')
});
```

### Numeric Badge with Max Value

```javascript
// Create a badge with count that maxes out at 99+
const messagesBadge = createBadge({
  variant: BADGE_VARIANTS.LARGE,
  label: 125,
  max: 99,
  color: BADGE_COLORS.PRIMARY,
  target: document.querySelector('#messages-icon')
});
```

### Different Badge Colors

```javascript
// Success badge using constants
const successBadge = createBadge({
  variant: BADGE_VARIANTS.LARGE,
  label: 'OK',
  color: BADGE_COLORS.SUCCESS,
  target: document.querySelector('#status-indicator')
});

// Warning badge
const warningBadge = createBadge({
  variant: BADGE_VARIANTS.LARGE,
  label: '!',
  color: BADGE_COLORS.WARNING,
  target: document.querySelector('#warning-icon')
});

// Info badge
const infoBadge = createBadge({
  variant: BADGE_VARIANTS.LARGE,
  label: 'i',
  color: BADGE_COLORS.INFO,
  target: document.querySelector('#info-button')
});
```

### Different Badge Positions

```javascript
// Top-right position (default)
const topRightBadge = createBadge({
  variant: BADGE_VARIANTS.SMALL,
  position: BADGE_POSITIONS.TOP_RIGHT,
  target: document.getElementById('element1')
});

// Bottom-left position
const bottomLeftBadge = createBadge({
  variant: BADGE_VARIANTS.SMALL,
  position: BADGE_POSITIONS.BOTTOM_LEFT,
  target: document.getElementById('element2')
});
```

### Programmatically Updating Badge

```javascript
const cartBadge = createBadge({
  variant: BADGE_VARIANTS.LARGE,
  label: 0,
  color: BADGE_COLORS.PRIMARY,
  target: document.querySelector('#cart-icon')
});

// Initially hide the badge since count is zero
cartBadge.hide();

// Update badge when item is added to cart
function addToCart(item) {
  // Add item to cart...
  
  // Get new cart count
  const count = getCartItemCount();
  
  // Update badge
  cartBadge.setLabel(count);
  cartBadge.show();
}

// Reset badge when cart is emptied
function emptyCart() {
  // Empty cart logic...
  
  cartBadge.setLabel(0);
  cartBadge.hide();
}
```

### Standalone Badge (Not Attached to Target)

```javascript
const statusBadge = createBadge({
  variant: BADGE_VARIANTS.LARGE,
  label: 'New',
  color: BADGE_COLORS.SECONDARY
});

// Add to a container
document.querySelector('.status-container').appendChild(statusBadge.element);
```

### Dynamically Attaching and Detaching

```javascript
const movableBadge = createBadge({
  variant: BADGE_VARIANTS.SMALL,
  color: BADGE_COLORS.PRIMARY
});

// Initially attach to first element
movableBadge.attachTo(document.getElementById('element1'));

// Later, move to another element
function moveBadge() {
  movableBadge.detach();
  movableBadge.attachTo(document.getElementById('element2'));
}
```

## Functional Composition

The Badge component is built using functional composition, combining multiple features:

### Core Features

- **Base Component (`createBase`)**: Provides the foundation with component creation utilities.
- **Element Creation (`withElement`)**: Creates the DOM element with proper attributes and classes.
- **Event Handling (`withEvents`)**: Enables event listening and emission.
- **Variant Feature (`withVariant`)**: Controls the badge size and appearance (small dot or larger).
- **Color Feature (`withColor`)**: Applies Material Design color system to the badge.
- **Position Feature (`withPosition`)**: Manages badge position relative to its target.
- **Max Value Feature (`withMax`)**: Handles numerical truncation with "+" indicator.
- **Visibility Feature (`withVisibility`)**: Controls badge showing/hiding.
- **Attachment Feature (`withAttachment`)**: Handles target attachment and positioning.
- **Lifecycle Management (`withLifecycle`)**: Handles component lifecycle including destruction.
- **Public API (`withAPI`)**: Exposes a clean, chainable API for users.

### How Composition Works

The badge component is created by "piping" these features together:

```javascript
const badge = pipe(
  createBase,               // Start with base component
  withEvents(),             // Add event capability
  withElement(config),      // Create DOM element
  withVariant(config),      // Apply size variant (small/large)
  withColor(config),        // Apply color
  withPosition(config),     // Apply positioning
  withMax(config),          // Add max value handling
  withVisibility(),         // Add show/hide capability
  withAttachment(config),   // Add target attachment
  withLifecycle(),          // Add lifecycle management
  comp => withAPI(config)(comp)  // Apply public API
)(baseConfig);
```

This composition pattern allows for:
- Modular, testable code
- Clean separation of concerns
- Lightweight bundles (only include what you need)
- Easy extension and customization

## Accessibility

The Badge component follows accessibility best practices:

- Proper ARIA attributes for screen readers (`role="status"` for large badges)
- Small dot badges use `aria-hidden="true"` when they're purely decorative
- Color combinations maintain proper contrast ratios
- Badge positioning doesn't obscure important content

## CSS Customization

The Badge component uses BEM-style CSS classes for easy customization:

```css
/* Base badge styles */
.mtrl-badge { /* ... */ }

/* Badge variants */
.mtrl-badge--small { /* ... */ }
.mtrl-badge--large { /* ... */ }

/* Badge colors */
.mtrl-badge--error { /* ... */ }
.mtrl-badge--primary { /* ... */ }
.mtrl-badge--secondary { /* ... */ }
.mtrl-badge--success { /* ... */ }
/* etc. */

/* Badge positions */
.mtrl-badge--top-right { /* ... */ }
.mtrl-badge--bottom-left { /* ... */ }
/* etc. */

/* Badge states */
.mtrl-badge--invisible { /* ... */ }
.mtrl-badge--overflow { /* ... */ }
.mtrl-badge--positioned { /* ... */ }

/* Badge wrapper */
.mtrl-badge-wrapper { /* ... */ }
```

## Best Practices

- Use small dot badges for simple notification indicators
- Use large badges for counts or short labels
- Keep badge text to a maximum of 4 characters
- For numeric values, use the `max` property to prevent excessive width
- Position badges where they won't obscure important content
- Hide badges when count is zero or there's nothing to notify
- Use appropriate colors to convey meaning (e.g., error, success)
- Consider mobile devices when positioning badges (ensure they're visible at small screen sizes)
