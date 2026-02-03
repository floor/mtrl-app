# Icon Button Component

The Icon Button component provides a Material Design 3 compliant button that displays actions in a compact form using icons. It supports both default (single action) and toggle (binary state) modes, making it ideal for toolbars, action bars, and compact UI elements.

## Overview

Icon buttons are commonly used for:

- Toolbar actions (save, edit, delete)
- Toggle states (favorite, bookmark, like)
- Navigation controls (menu, back, close)
- Media controls (play, pause, skip)
- Compact action triggers

The component follows Material Design 3 guidelines with support for various variants (filled, tonal, outlined, standard), sizes, shapes, toggle functionality, and shape morphing effects.

## Import

```javascript
import { createIconButton } from 'mtrl';
```

## Basic Usage

```javascript
// Create a basic icon button
const menuButton = createIconButton({
  icon: '<svg viewBox="0 0 24 24"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>',
  ariaLabel: 'Open menu'
});

// Add to your page
document.querySelector('.toolbar').appendChild(menuButton.element);

// Listen for clicks
menuButton.on('click', () => {
  console.log('Menu button clicked');
});
```

## Configuration

The Icon Button component accepts the following configuration options:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `variant` | `string` | `'standard'` | Visual style (filled, tonal, outlined, standard) |
| `size` | `string` | `'s'` | Size of the button (xs, s, m, l, xl) |
| `shape` | `string` | `'round'` | Shape of the button (round, square) |
| `width` | `string` | `'default'` | Width variant (narrow, default, wide) |
| `disabled` | `boolean` | `false` | Whether the button is initially disabled |
| `icon` | `string` | `undefined` | HTML content (typically SVG) for the icon |
| `selectedIcon` | `string` | `undefined` | Icon for selected state (enables toggle mode) |
| `toggle` | `boolean` | `false` | Whether the button supports toggle behavior |
| `selected` | `boolean` | `false` | Initial selected state (when toggle is true) |
| `class` | `string` | `undefined` | Additional CSS classes |
| `value` | `string` | `undefined` | Button value attribute |
| `type` | `string` | `'button'` | Button type (button, submit, reset) |
| `ripple` | `boolean` | `true` | Whether to enable ripple effect |
| `ariaLabel` | `string` | `undefined` | Accessible label (required for icon buttons) |
| `tooltip` | `boolean` | `true` | Whether to show tooltip on hover |

## Icon Button Variants

The icon button supports 4 Material Design 3 variants, in order of emphasis:

- **`filled`**: Highest emphasis - solid background, for key actions
- **`tonal`**: High emphasis - tonal background, secondary actions paired with high emphasis
- **`outlined`**: Medium emphasis - border outline, when button isn't the main focus
- **`standard`** (default): Lowest emphasis - no background, for low-emphasis or colorful surfaces

## Icon Button Sizes

The icon button supports 5 different sizes following Material Design 3 specifications:

| Size | Container | Icon Size | Use Case |
|------|-----------|-----------|----------|
| `xs` | 32px | 18px | Dense layouts, secondary actions |
| `s` | 40px | 24px | Default size, most common |
| `m` | 56px | 24px | Medium emphasis |
| `l` | 96px | 36px | Large touch targets |
| `xl` | 136px | 48px | Maximum emphasis |

**Note:** Extra small and small icon buttons maintain a 48x48px touch target for accessibility.

## Icon Button Shapes

The icon button supports 2 shapes:

- **`round`** (default): Full corner radius (circular)
- **`square`**: Fixed corner radius that scales with size

### Shape Morphing

Icon buttons support shape morphing:
- **On press**: Both round and square buttons morph to a pressed radius
- **On selection** (toggle mode): Round becomes square, square becomes round

## Icon Button Widths

The icon button supports 3 width variants:

| Width | Description |
|-------|-------------|
| `narrow` | Narrower than default |
| `default` | Standard width matching container size |
| `wide` | Wider than default |

Width values scale with button size.

## Component API

The Icon Button component provides the following methods:

### Value Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `getValue()` | none | `string` | Gets the button's value attribute |
| `setValue(value)` | `value: string` | `IconButtonComponent` | Sets the button's value attribute |

### State Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `enable()` | none | `IconButtonComponent` | Enables the button |
| `disable()` | none | `IconButtonComponent` | Disables the button |

### Variant Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `getVariant()` | none | `string` | Gets current variant |
| `setVariant(variant)` | `variant: string` | `IconButtonComponent` | Sets the variant |

### Size Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `getSize()` | none | `string` | Gets current size |
| `setSize(size)` | `size: string` | `IconButtonComponent` | Sets the size |

### Shape Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `getShape()` | none | `string` | Gets current shape |
| `setShape(shape)` | `shape: string` | `IconButtonComponent` | Sets the shape |

### Width Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `getWidth()` | none | `string` | Gets current width |
| `setWidth(width)` | `width: string` | `IconButtonComponent` | Sets the width |

### Icon Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `getIcon()` | none | `string` | Gets current icon HTML |
| `setIcon(icon)` | `icon: string` | `IconButtonComponent` | Sets the icon |
| `getSelectedIcon()` | none | `string` | Gets selected state icon |
| `setSelectedIcon(icon)` | `icon: string` | `IconButtonComponent` | Sets selected icon |

### Toggle Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `isToggle()` | none | `boolean` | Checks if toggle mode is enabled |
| `isSelected()` | none | `boolean` | Checks if button is selected |
| `select()` | none | `IconButtonComponent` | Selects the button |
| `deselect()` | none | `IconButtonComponent` | Deselects the button |
| `toggleSelected()` | none | `IconButtonComponent` | Toggles selection state |

### Accessibility Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `setAriaLabel(label)` | `label: string` | `IconButtonComponent` | Sets aria-label |

### Event Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `on(event, handler)` | `event: string`, `handler: Function` | `IconButtonComponent` | Adds event listener |
| `off(event, handler)` | `event: string`, `handler: Function` | `IconButtonComponent` | Removes event listener |

### Style Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `addClass(...classes)` | `classes: string[]` | `IconButtonComponent` | Adds CSS classes |
| `removeClass(...classes)` | `classes: string[]` | `IconButtonComponent` | Removes CSS classes |

### Lifecycle Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `destroy()` | none | `void` | Destroys the component |

## Events

The Icon Button component emits the following events:

| Event | Detail | Description |
|-------|--------|-------------|
| `click` | none | Fired when the button is clicked |
| `toggle` | `{ selected: boolean }` | Fired when toggle state changes (toggle mode only) |
| `focus` | none | Fired when the button receives focus |
| `blur` | none | Fired when the button loses focus |

## Examples

### Basic Icon Button Variants

```javascript
// Standard (default, lowest emphasis)
const standardButton = createIconButton({
  icon: '<svg viewBox="0 0 24 24">...</svg>',
  ariaLabel: 'Settings'
});

// Filled (highest emphasis)
const filledButton = createIconButton({
  icon: '<svg viewBox="0 0 24 24">...</svg>',
  variant: 'filled',
  ariaLabel: 'Add item'
});

// Tonal (high emphasis)
const tonalButton = createIconButton({
  icon: '<svg viewBox="0 0 24 24">...</svg>',
  variant: 'tonal',
  ariaLabel: 'Edit'
});

// Outlined (medium emphasis)
const outlinedButton = createIconButton({
  icon: '<svg viewBox="0 0 24 24">...</svg>',
  variant: 'outlined',
  ariaLabel: 'Share'
});
```

### Icon Button Sizes

```javascript
const xsButton = createIconButton({
  icon: '<svg>...</svg>',
  size: 'xs',
  ariaLabel: 'Small action'
});

const mediumButton = createIconButton({
  icon: '<svg>...</svg>',
  size: 'm',
  ariaLabel: 'Medium action'
});

const largeButton = createIconButton({
  icon: '<svg>...</svg>',
  size: 'l',
  ariaLabel: 'Large action'
});

const xlButton = createIconButton({
  icon: '<svg>...</svg>',
  size: 'xl',
  variant: 'filled',
  ariaLabel: 'Extra large action'
});
```

### Icon Button Shapes

```javascript
// Round (default)
const roundButton = createIconButton({
  icon: '<svg>...</svg>',
  shape: 'round',
  ariaLabel: 'Round button'
});

// Square
const squareButton = createIconButton({
  icon: '<svg>...</svg>',
  shape: 'square',
  ariaLabel: 'Square button'
});

// Square with different sizes
const squareLarge = createIconButton({
  icon: '<svg>...</svg>',
  shape: 'square',
  size: 'l',
  variant: 'tonal',
  ariaLabel: 'Large square button'
});
```

### Width Variants

```javascript
const narrowButton = createIconButton({
  icon: '<svg>...</svg>',
  width: 'narrow',
  ariaLabel: 'Narrow button'
});

const wideButton = createIconButton({
  icon: '<svg>...</svg>',
  width: 'wide',
  ariaLabel: 'Wide button'
});
```

### Toggle Icon Button (Favorite)

```javascript
// Heart icon that toggles between outline and filled
const favoriteButton = createIconButton({
  icon: '<svg class="outline">...</svg>',        // Outlined heart
  selectedIcon: '<svg class="filled">...</svg>', // Filled heart
  toggle: true,
  ariaLabel: 'Add to favorites'
});

// Listen for toggle changes
favoriteButton.on('toggle', (e) => {
  console.log('Favorite:', e.detail.selected);
  
  if (e.detail.selected) {
    addToFavorites(itemId);
  } else {
    removeFromFavorites(itemId);
  }
});
```

### Toggle Icon Button (Bookmark)

```javascript
const bookmarkButton = createIconButton({
  icon: '<svg><!-- outline bookmark --></svg>',
  selectedIcon: '<svg><!-- filled bookmark --></svg>',
  toggle: true,
  variant: 'standard',
  ariaLabel: 'Bookmark this page'
});

// Set initial state based on data
if (isBookmarked) {
  bookmarkButton.select();
}
```

### Programmatic Toggle Control

```javascript
const likeButton = createIconButton({
  icon: '<svg>...</svg>',
  selectedIcon: '<svg>...</svg>',
  toggle: true,
  ariaLabel: 'Like'
});

// Programmatic control
document.querySelector('#selectAll').addEventListener('click', () => {
  likeButton.select();
});

document.querySelector('#deselectAll').addEventListener('click', () => {
  likeButton.deselect();
});

document.querySelector('#toggle').addEventListener('click', () => {
  likeButton.toggleSelected();
});

// Check state
console.log('Is selected:', likeButton.isSelected());
```

### Toolbar Example

```javascript
const toolbar = document.querySelector('.toolbar');

// Create toolbar buttons
const menuBtn = createIconButton({
  icon: menuIcon,
  ariaLabel: 'Menu'
});

const searchBtn = createIconButton({
  icon: searchIcon,
  ariaLabel: 'Search'
});

const moreBtn = createIconButton({
  icon: moreIcon,
  ariaLabel: 'More options'
});

// Add to toolbar
[menuBtn, searchBtn, moreBtn].forEach(btn => {
  toolbar.appendChild(btn.element);
});
```

### Disabled State

```javascript
const disabledButton = createIconButton({
  icon: '<svg>...</svg>',
  disabled: true,
  ariaLabel: 'Disabled action'
});

// Enable later
submitButton.on('click', () => {
  disabledButton.enable();
});
```

### Dynamic Property Changes

```javascript
const dynamicButton = createIconButton({
  icon: '<svg>...</svg>',
  variant: 'standard',
  size: 's',
  ariaLabel: 'Dynamic button'
});

// Change properties dynamically
dynamicButton
  .setVariant('filled')
  .setSize('m')
  .setShape('square')
  .setIcon('<svg><!-- new icon --></svg>')
  .setAriaLabel('Updated action');
```

## Accessibility

Icon buttons require special attention to accessibility since they have no visible text:

### Requirements

1. **Always provide `ariaLabel`**: Describes the action, not the icon name
   - ✅ "Add to favorites" (describes action)
   - ❌ "Heart" (describes icon)

2. **Toggle buttons use `aria-pressed`**: Automatically managed by the component

3. **Minimum touch target**: 48x48px maintained for xs and s sizes

4. **Color contrast**: Ensure icons have at least 3:1 contrast ratio

### Keyboard Navigation

| Key | Action |
|-----|--------|
| `Tab` | Focus lands on the icon button |
| `Space` | Activates the icon button |
| `Enter` | Activates the icon button |

### Example with Proper Accessibility

```javascript
const accessibleButton = createIconButton({
  icon: '<svg role="img" aria-hidden="true">...</svg>',
  ariaLabel: 'Delete item',
  variant: 'standard'
});
```

## CSS Customization

The Icon Button component uses the following CSS classes:

```css
/* Base class */
.mtrl-icon-button { }

/* Variants */
.mtrl-icon-button--filled { }
.mtrl-icon-button--tonal { }
.mtrl-icon-button--outlined { }
.mtrl-icon-button--standard { }

/* Sizes */
.mtrl-icon-button--xs { }
.mtrl-icon-button--s { }  /* Default, may not be present */
.mtrl-icon-button--m { }
.mtrl-icon-button--l { }
.mtrl-icon-button--xl { }

/* Shapes */
.mtrl-icon-button--round { }  /* Default, may not be present */
.mtrl-icon-button--square { }

/* Widths */
.mtrl-icon-button--narrow { }
.mtrl-icon-button--wide { }

/* States */
.mtrl-icon-button--disabled { }
.mtrl-icon-button--toggle { }
.mtrl-icon-button--selected { }

/* Icon element */
.mtrl-icon-button-icon { }

/* Ripple */
.mtrl-ripple { }
.mtrl-ripple-wave { }
```

### Custom Styling Example

```css
/* Custom filled variant color */
.mtrl-icon-button--filled.my-custom-button {
  background-color: var(--my-brand-color);
  color: white;
}

/* Custom hover effect */
.mtrl-icon-button.my-custom-button:hover {
  transform: scale(1.1);
}
```

## Best Practices

1. **Use appropriate variants**: Match emphasis to action importance
   - Primary actions: `filled`
   - Secondary actions: `tonal` or `outlined`
   - Low-emphasis actions: `standard`

2. **Always provide aria-label**: Icon buttons have no visible text

3. **Use toggle mode for binary states**: Favorite, bookmark, like, etc.

4. **Follow icon guidelines**:
   - Use outlined icons for unselected toggle state
   - Use filled icons for selected toggle state
   - If filled version doesn't exist, use semibold weight

5. **Don't overuse filled variant**: Reserve for key actions

6. **Group related buttons**: Use consistent sizing and spacing

7. **Consider touch targets**: Ensure adequate touch area on mobile

## Differences from Regular Button

| Aspect | Button | Icon Button |
|--------|--------|-------------|
| Content | Text + optional icon | Icon only |
| Variants | filled, tonal, outlined, elevated, text | filled, tonal, outlined, standard |
| Toggle | No | Yes (selected/unselected) |
| Shape Morph | No | Yes (on press and selection) |
| Width Variants | No | Yes (narrow, default, wide) |
| Aria-label | Optional | Required |

## Performance Considerations

1. **Lightweight**: Icon buttons are minimal components with low memory footprint

2. **Event cleanup**: Always call `destroy()` when removing buttons to prevent memory leaks

3. **Icon optimization**: Use optimized SVG icons for best performance

4. **Toggle state**: Toggle clicks are handled internally with minimal overhead

```javascript
// Proper cleanup
const button = createIconButton({ ... });
// ... use button ...
button.destroy(); // Clean up when done
```
