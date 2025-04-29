# Button Component

The Button component provides a Material Design 3 compliant button control that allows users to perform actions with a single tap or click. It's designed to be lightweight, accessible, and highly customizable to fit various UI contexts.

## Overview

Buttons are commonly used for:

- Submitting forms
- Triggering actions
- Navigation
- Dialog controls
- Toolbars and action menus

The component follows Material Design 3 guidelines with support for various variants (filled, outlined, text, etc.), icons, disabled states, and ripple effects.

## Import

```javascript
import { createButton } from 'mtrl';
```

## Basic Usage

```javascript
// Create a basic button
const submitButton = createButton({
  text: 'Submit',
  variant: 'filled'
});

// Add to your page
document.querySelector('.form-actions').appendChild(submitButton.element);

// Listen for clicks
submitButton.on('click', () => {
  console.log('Button clicked');
});
```

## Configuration

The Button component accepts the following configuration options:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `variant` | `string` | `'filled'` | Visual style of the button (filled, outlined, text, elevated, tonal) |
| `disabled` | `boolean` | `false` | Whether the button is initially disabled |
| `text` | `string` | `undefined` | Text content displayed inside the button |
| `icon` | `string` | `undefined` | HTML content (typically SVG) for the button icon |
| `iconSize` | `string` | `undefined` | Size of the icon (e.g., '18px') |
| `class` | `string` | `undefined` | Additional CSS classes to add to the button |
| `value` | `string` | `undefined` | Button value attribute |
| `type` | `string` | `'button'` | Button type attribute (button, submit, reset) |
| `ripple` | `boolean` | `true` | Whether to enable ripple effect on interaction |
| `prefix` | `string` | `'mtrl'` | Prefix for CSS class names |
| `rippleConfig` | `object` | `undefined` | Configuration options for the ripple effect |
| `ariaLabel` | `string` | `undefined` | ARIA label for accessibility (important for icon-only buttons) |

## Component API

The Button component provides the following methods:

### Value Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `getValue()` | none | `string` | Gets the button's current value attribute |
| `setValue(value)` | `value: string` | `ButtonComponent` | Sets the button's value attribute |

### State Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `enable()` | none | `ButtonComponent` | Enables the button, making it interactive |
| `disable()` | none | `ButtonComponent` | Disables the button, making it non-interactive |
| `setActive(active)` | `active: boolean` | `ButtonComponent` | Sets the active state of the button (e.g., when a related menu is open) |
| `setVariant(variant)` | `variant: string` | `ButtonComponent` | Changes the button's visual style variant |
| `getVariant()` | none | `string` | Gets the button's current variant |

### Content Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `setText(content)` | `content: string` | `ButtonComponent` | Sets the button's text content |
| `getText()` | none | `string` | Gets the button's current text content |
| `setIcon(icon)` | `icon: string` | `ButtonComponent` | Sets the button's icon HTML content |
| `getIcon()` | none | `string` | Gets the button's current icon HTML content |
| `setAriaLabel(label)` | `label: string` | `ButtonComponent` | Sets the button's aria-label attribute for accessibility |

### Event Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `on(event, handler)` | `event: string, handler: Function` | `ButtonComponent` | Adds an event listener |
| `off(event, handler)` | `event: string, handler: Function` | `ButtonComponent` | Removes an event listener |

### Style Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `addClass(...classes)` | `...classes: string[]` | `ButtonComponent` | Adds CSS classes to the button element |

### Lifecycle Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `destroy()` | none | `void` | Destroys the button component and cleans up resources |

## Events

The Button component emits the following events:

| Event | Description | Data |
|-------|-------------|------|
| `click` | Fires when the button is clicked | `{ event: MouseEvent }` |
| `focus` | Fires when the button receives focus | `{ event: FocusEvent }` |
| `blur` | Fires when the button loses focus | `{ event: FocusEvent }` |

## Examples

### Basic Button Variants

```javascript
// Filled button (default)
const filledButton = createButton({
  text: 'Filled Button'
});

// Outlined button
const outlinedButton = createButton({
  text: 'Outlined Button',
  variant: 'outlined'
});

// Text button
const textButton = createButton({
  text: 'Text Button',
  variant: 'text'
});

// Elevated button
const elevatedButton = createButton({
  text: 'Elevated Button',
  variant: 'elevated'
});

// Tonal button
const tonalButton = createButton({
  text: 'Tonal Button',
  variant: 'tonal'
});
```

### Button with Icon

```javascript
const saveButton = createButton({
  text: 'Save',
  icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3.5 7 8 15 8"></polyline></svg>'
});
```

### Icon-Only Button

```javascript
const addButton = createButton({
  icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>',
  ariaLabel: 'Add item'  // Important for accessibility
});
```

### Form Submit Button

```javascript
const submitButton = createButton({
  text: 'Submit',
  type: 'submit'
});

const form = document.querySelector('form');
form.appendChild(submitButton.element);
```

### Disabled Button

```javascript
const disabledButton = createButton({
  text: 'Not Available',
  disabled: true
});
```

### Button with Event Handling

```javascript
const actionButton = createButton({
  text: 'Load More'
});

actionButton.on('click', async () => {
  actionButton.disable();
  actionButton.setText('Loading...');
  
  try {
    await loadMoreItems();
    actionButton.setText('Load More');
  } catch (error) {
    console.error('Failed to load items:', error);
    actionButton.setText('Retry');
  } finally {
    actionButton.enable();
  }
});
```

### Dynamically Changing Button Variants

```javascript
const toggleButton = createButton({
  text: 'Normal State',
  variant: 'text'
});

toggleButton.on('click', () => {
  if (toggleButton.getVariant() === 'text') {
    toggleButton.setVariant('filled');
    toggleButton.setText('Active State');
  } else {
    toggleButton.setVariant('text');
    toggleButton.setText('Normal State');
  }
});
```

## Functional Composition

The Button component is built using functional composition, combining multiple features:

### Core Features

- **Base Component (`createBase`)**: Provides the foundation with component creation utilities.
- **Element Creation (`withElement`)**: Creates the DOM element with proper attributes and classes.
- **Event Handling (`withEvents`)**: Enables event listening and emission.
- **Text Content (`withText`)**: Manages text content within the button.
- **Icon Support (`withIcon`)**: Adds and manages icon elements.
- **Variant Styling (`withVariant`)**: Applies visual styling variants like filled, outlined, etc.
- **Disabled State (`withDisabled`)**: Manages the disabled state of the button.
- **Ripple Effect (`withRipple`)**: Adds Material Design ripple feedback effect.
- **Lifecycle Management (`withLifecycle`)**: Handles component lifecycle including destruction.
- **Public API (`withAPI`)**: Exposes a clean, chainable API for users.

### How Composition Works

The button component is created by "piping" these features together:

```javascript
const button = pipe(
  createBase,               // Start with base component
  withEvents(),             // Add event capability
  withElement(config),      // Create DOM element
  withVariant(config),      // Apply variant styling
  withText(config),         // Add text content
  withIcon(config),         // Add icon support
  withDisabled(config),     // Add disabled state
  withRipple(config),       // Add ripple effect
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

The Button component follows accessibility best practices:

- Proper semantic HTML with `<button>` element
- Support for `aria-label` attribute for icon-only buttons
- Keyboard navigation and focus handling
- Visual focus indicators
- Disabled states properly communicated to screen readers

### Keyboard Navigation

| Key | Action |
|-----|--------|
| `Tab` | Moves focus to the button |
| `Space` or `Enter` | Activates the button |

## CSS Customization

The Button component uses BEM-style CSS classes for easy customization:

```css
/* Base button styles */
.mtrl-button { /* ... */ }

/* Button variants */
.mtrl-button--filled { /* ... */ }
.mtrl-button--outlined { /* ... */ }
.mtrl-button--text { /* ... */ }
.mtrl-button--elevated { /* ... */ }
.mtrl-button--tonal { /* ... */ }

/* Button states */
.mtrl-button--disabled { /* ... */ }
.mtrl-button--active { /* ... */ }

/* Button with icon */
.mtrl-button--icon { /* ... */ }
.mtrl-button-icon { /* ... */ }
.mtrl-button-text { /* ... */ }

/* Circular icon-only button */
.mtrl-button--circular { /* ... */ }

/* Ripple effect */
.mtrl-ripple { /* ... */ }
.mtrl-ripple-wave { /* ... */ }
```

## Best Practices

- Use the appropriate button variant for each context
  - Filled (primary actions)
  - Outlined (secondary actions)
  - Text (low-emphasis actions)
- Provide clear, concise text labels
- Use icons to enhance clarity, not to replace text (except for well-known actions)
- Always include `aria-label` for icon-only buttons
- Place primary actions on the right in dialogs and forms
- Don't use too many prominent buttons in a single view
- Keep button text to 1-3 words when possible

## Browser Compatibility

The Button component is compatible with all modern browsers:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Considerations

The Button component is designed to be lightweight and performant:

- Minimal DOM operations
- Efficient event handling
- Optimized ripple animations
- Clean destruction to prevent memory leaks
- No external dependencies