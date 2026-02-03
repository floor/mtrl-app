# Menu Component

The Menu component provides a Material Design 3 compliant dropdown menu that displays a list of choices on a temporary surface. It's designed for contextual actions, navigation, and selection interfaces.

## Overview

Menus are commonly used for:

- Contextual actions (right-click menus)
- Dropdown selections
- Navigation menus
- Overflow menus
- Nested submenus

The component follows Material Design 3 guidelines with support for icons, dividers, keyboard navigation, submenus, and proper positioning relative to opener elements.

## Import

```javascript
import { createMenu } from 'mtrl';
```

## Basic Usage

```javascript
// Create a menu with items
const menu = createMenu({
  opener: document.querySelector('#menu-button'),
  items: [
    { id: 'edit', text: 'Edit' },
    { id: 'duplicate', text: 'Duplicate' },
    { id: 'delete', text: 'Delete' }
  ]
});

// Listen for item selection
menu.on('select', (event) => {
  console.log('Selected:', event.itemId);
});
```

## Configuration

The Menu component accepts the following configuration options:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `opener` | `HTMLElement \| string \| object` | required | Element to which the menu is anchored |
| `items` | `MenuContent[]` | `[]` | Array of menu items and dividers |
| `position` | `string` | `'bottom-start'` | Position relative to opener |
| `closeOnSelect` | `boolean` | `true` | Whether to close menu when an item is clicked |
| `closeOnClickOutside` | `boolean` | `true` | Whether to close when clicking outside the menu |
| `closeOnEscape` | `boolean` | `true` | Whether to close when pressing Escape |
| `closeOnResize` | `boolean` | `false` | Whether to close when window is resized |
| `openSubmenuOnHover` | `boolean` | `true` | Whether submenus open on hover |
| `width` | `string` | `undefined` | Optional width (e.g., '200px', '100%') |
| `maxHeight` | `string` | `undefined` | Optional maximum height with scroll |
| `offset` | `number` | `8` | Offset from opener in pixels |
| `autoFlip` | `boolean` | `true` | Whether to flip position to stay in viewport |
| `visible` | `boolean` | `false` | Whether menu is initially visible |
| `container` | `HTMLElement` | `document.body` | Container element to append menu to |
| `class` | `string` | `undefined` | Additional CSS classes |
| `prefix` | `string` | `'mtrl'` | Prefix for CSS class names |

## Menu Item Configuration

Each menu item can have the following properties:

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Unique identifier for the item (required) |
| `text` | `string` | Display text for the item |
| `icon` | `string` | HTML content (typically SVG) for an icon |
| `shortcut` | `string` | Keyboard shortcut hint (e.g., '⌘C') |
| `disabled` | `boolean` | Whether the item is disabled |
| `hasSubmenu` | `boolean` | Whether the item has a submenu |
| `submenu` | `MenuItem[]` | Array of submenu items |
| `data` | `any` | Additional data associated with the item |

## Menu Positions

The menu supports 12 different positions:

- **`bottom-start`** (default): Below opener, aligned to left edge
- **`bottom`**: Below opener, centered
- **`bottom-end`**: Below opener, aligned to right edge
- **`top-start`**: Above opener, aligned to left edge
- **`top`**: Above opener, centered
- **`top-end`**: Above opener, aligned to right edge
- **`right-start`**: Right of opener, aligned to top edge
- **`right`**: Right of opener, centered
- **`right-end`**: Right of opener, aligned to bottom edge
- **`left-start`**: Left of opener, aligned to top edge
- **`left`**: Left of opener, centered
- **`left-end`**: Left of opener, aligned to bottom edge

## Component API

The Menu component provides the following methods:

### Visibility Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `open(event?, interactionType?)` | `event?: Event, interactionType?: 'mouse' \| 'keyboard'` | `MenuComponent` | Opens the menu |
| `close(event?)` | `event?: Event` | `MenuComponent` | Closes the menu |
| `toggle(event?)` | `event?: Event` | `MenuComponent` | Toggles the menu's open state |
| `isOpen()` | none | `boolean` | Returns whether the menu is open |

### Item Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `setItems(items)` | `items: MenuContent[]` | `MenuComponent` | Updates the menu items |
| `getItems()` | none | `MenuContent[]` | Gets the current menu items |
| `setSelected(itemId)` | `itemId: string` | `MenuComponent` | Marks an item as selected |
| `getSelected()` | none | `string \| null` | Gets the selected item's ID |

### Opener Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `setOpener(opener)` | `opener: HTMLElement \| string` | `MenuComponent` | Updates the opener element |
| `getOpener()` | none | `HTMLElement` | Gets the current opener element |

### Position Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `setPosition(position)` | `position: MenuPosition` | `MenuComponent` | Updates the menu position |
| `getPosition()` | none | `MenuPosition` | Gets the current position |

### Event Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `on(event, handler)` | `event: string, handler: Function` | `MenuComponent` | Adds an event listener |
| `off(event, handler)` | `event: string, handler: Function` | `MenuComponent` | Removes an event listener |

### Lifecycle Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `destroy()` | none | `void` | Destroys the menu and cleans up resources |

## Events

The Menu component emits the following events:

| Event | Description | Data |
|-------|-------------|------|
| `open` | Fires when the menu opens | `{ menu, originalEvent?, preventDefault, defaultPrevented }` |
| `close` | Fires when the menu closes | `{ menu, originalEvent?, preventDefault, defaultPrevented }` |
| `select` | Fires when an item is selected | `{ menu, item, itemId, itemData?, originalEvent?, preventDefault, defaultPrevented }` |

## Examples

### Basic Menu

```javascript
const menu = createMenu({
  opener: '#actions-button',
  items: [
    { id: 'new', text: 'New File' },
    { id: 'open', text: 'Open...' },
    { id: 'save', text: 'Save' }
  ]
});

menu.on('select', (event) => {
  console.log('Action:', event.itemId);
});
```

### Menu with Icons

```javascript
const editIcon = '<svg>...</svg>';
const copyIcon = '<svg>...</svg>';
const deleteIcon = '<svg>...</svg>';

const menu = createMenu({
  opener: contextButton,
  items: [
    { id: 'edit', text: 'Edit', icon: editIcon },
    { id: 'copy', text: 'Copy', icon: copyIcon },
    { type: 'divider' },
    { id: 'delete', text: 'Delete', icon: deleteIcon }
  ]
});
```

### Menu with Keyboard Shortcuts

```javascript
const menu = createMenu({
  opener: editButton,
  items: [
    { id: 'cut', text: 'Cut', shortcut: '⌘X' },
    { id: 'copy', text: 'Copy', shortcut: '⌘C' },
    { id: 'paste', text: 'Paste', shortcut: '⌘V' },
    { type: 'divider' },
    { id: 'selectAll', text: 'Select All', shortcut: '⌘A' }
  ]
});
```

### Menu with Dividers

```javascript
const menu = createMenu({
  opener: moreButton,
  items: [
    { id: 'profile', text: 'View Profile' },
    { id: 'settings', text: 'Settings' },
    { type: 'divider' },
    { id: 'help', text: 'Help' },
    { id: 'about', text: 'About' },
    { type: 'divider' },
    { id: 'logout', text: 'Log Out' }
  ]
});
```

### Menu with Submenus

```javascript
const menu = createMenu({
  opener: fileButton,
  items: [
    { id: 'new', text: 'New' },
    { 
      id: 'export', 
      text: 'Export As',
      hasSubmenu: true,
      submenu: [
        { id: 'pdf', text: 'PDF' },
        { id: 'png', text: 'PNG' },
        { id: 'svg', text: 'SVG' }
      ]
    },
    { type: 'divider' },
    { id: 'close', text: 'Close' }
  ]
});
```

### Menu with Disabled Items

```javascript
const menu = createMenu({
  opener: editButton,
  items: [
    { id: 'undo', text: 'Undo', disabled: true },
    { id: 'redo', text: 'Redo', disabled: true },
    { type: 'divider' },
    { id: 'cut', text: 'Cut' },
    { id: 'copy', text: 'Copy' },
    { id: 'paste', text: 'Paste' }
  ]
});
```

### Menu Inside a Dialog

When using a menu inside a dialog or modal, use the `container` option to ensure proper z-index stacking:

```javascript
const dialog = createDialog({
  title: 'Settings',
  content: '<div id="settings-content"></div>'
});

const menu = createMenu({
  opener: settingsButton,
  container: dialog.element, // Menu stays within dialog's stacking context
  items: [
    { id: 'option1', text: 'Option 1' },
    { id: 'option2', text: 'Option 2' }
  ]
});
```

### Programmatic Control

```javascript
const menu = createMenu({
  opener: menuButton,
  items: [
    { id: 'item1', text: 'Item 1' },
    { id: 'item2', text: 'Item 2' }
  ]
});

// Open the menu programmatically
menu.open();

// Close after 3 seconds
setTimeout(() => {
  menu.close();
}, 3000);

// Check if open
if (menu.isOpen()) {
  console.log('Menu is currently open');
}
```

### Dynamic Items

```javascript
const menu = createMenu({
  opener: dynamicButton,
  items: []
});

// Update items based on context
function updateMenuItems(context) {
  const items = [
    { id: 'action1', text: 'Action 1' }
  ];
  
  if (context.canEdit) {
    items.push({ id: 'edit', text: 'Edit' });
  }
  
  if (context.canDelete) {
    items.push({ type: 'divider' });
    items.push({ id: 'delete', text: 'Delete' });
  }
  
  menu.setItems(items);
}
```

### Context Menu (Right-Click)

```javascript
const contextMenu = createMenu({
  opener: document.body,
  items: [
    { id: 'inspect', text: 'Inspect Element' },
    { id: 'viewSource', text: 'View Page Source' }
  ],
  closeOnClickOutside: true
});

document.addEventListener('contextmenu', (event) => {
  event.preventDefault();
  
  // Position at mouse cursor
  contextMenu.element.style.left = `${event.clientX}px`;
  contextMenu.element.style.top = `${event.clientY}px`;
  
  contextMenu.open();
});
```

## Accessibility

The Menu component follows accessibility best practices:

- Proper ARIA attributes (`role="menu"`, `role="menuitem"`)
- Keyboard navigation support
- Focus management
- Screen reader announcements
- Proper labeling of menu items

### Keyboard Navigation

| Key | Action |
|-----|--------|
| `Enter` / `Space` | Select focused item or open submenu |
| `Escape` | Close menu |
| `ArrowDown` | Move focus to next item |
| `ArrowUp` | Move focus to previous item |
| `ArrowRight` | Open submenu (if available) |
| `ArrowLeft` | Close submenu and return to parent |
| `Home` | Move focus to first item |
| `End` | Move focus to last item |

## CSS Customization

The Menu component uses BEM-style CSS classes for easy customization:

```css
/* Base menu styles */
.mtrl-menu { /* ... */ }

/* Visible state */
.mtrl-menu--visible { /* ... */ }

/* Position variants */
.mtrl-menu--position-top { /* ... */ }
.mtrl-menu--position-bottom { /* ... */ }
.mtrl-menu--position-left { /* ... */ }
.mtrl-menu--position-right { /* ... */ }

/* Menu list */
.mtrl-menu-list { /* ... */ }

/* Menu items */
.mtrl-menu-item { /* ... */ }
.mtrl-menu-item--disabled { /* ... */ }
.mtrl-menu-item--selected { /* ... */ }
.mtrl-menu-item--submenu { /* ... */ }

/* Item content */
.mtrl-menu-item-content { /* ... */ }
.mtrl-menu-item-icon { /* ... */ }
.mtrl-menu-item-text { /* ... */ }
.mtrl-menu-item-shortcut { /* ... */ }

/* Divider */
.mtrl-menu-divider { /* ... */ }
```

## Container Option

The `container` option is important for proper z-index stacking when the menu is used inside overlays like dialogs:

```javascript
// Default: menu appended to document.body
const menu1 = createMenu({
  opener: button1,
  items: [...]
});

// Custom container: menu appended to specified element
const menu2 = createMenu({
  opener: button2,
  container: dialogElement, // Inherits dialog's stacking context
  items: [...]
});
```

When a `container` is specified:
- The menu is appended as a child of that container
- Positioning is calculated relative to the container
- Z-index stacking follows the container's context
- Useful for menus inside dialogs, modals, or other overlays

## Best Practices

- Keep menu items concise and action-oriented
- Use icons consistently - either all items have icons or none
- Group related items with dividers
- Limit submenu nesting to 2-3 levels maximum
- Provide keyboard shortcuts for common actions
- Disable items rather than hiding them when actions are temporarily unavailable
- Use the `container` option when placing menus inside dialogs or overlays
- Close menus after selection for better UX

## Performance Considerations

The Menu component is designed to be lightweight and performant:

- Menu elements are created lazily on first open
- Efficient event delegation for item clicks
- Proper cleanup on destroy to prevent memory leaks
- Submenus are rendered on demand
- Uses CSS transforms for animations (GPU accelerated)