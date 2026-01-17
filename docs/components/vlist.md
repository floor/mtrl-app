# VList Component

> **Created:** December 29, 2025
> **Updated:** January 17, 2026 (v0.2.4 - MD3 keyboard navigation and accessibility)

The VList component is a high-performance virtual scrolling list built on top of the viewport core engine. It's designed specifically for rendering large datasets efficiently while providing a seamless user experience through intelligent placeholders, velocity-based loading strategies, and flexible configuration options.

## Overview

VList is part of the `mtrl-addons` package and provides:

- **Virtual Scrolling**: Only renders items visible in the viewport plus configurable overscan
- **Velocity-Based Loading**: Intelligently defers data loading during fast scrolling to preserve bandwidth
- **Placeholder System**: Shows realistic placeholders while data loads, analyzed from actual content
- **Flexible Templates**: Supports multiple template formats (HTML strings, DOM elements, layout schema)
- **Selection Support**: Built-in single and multiple selection modes
- **Keyboard Navigation**: MD3-compliant keyboard navigation with arrow keys, Home/End, PageUp/Down
- **Accessibility**: Full ARIA support with proper roles, states, and focus management
- **Pagination Strategies**: Page, offset, and cursor-based pagination
- **Custom Scrollbar**: Cross-browser consistent scrollbar with auto-hide support

## Import

```javascript
import { createVList } from 'mtrl-addons';
```

## Basic Usage

### Static Data

```javascript
const fruits = createVList({
  container: '#fruit-list',
  items: [
    { id: 1, name: 'Apple', color: 'red' },
    { id: 2, name: 'Banana', color: 'yellow' },
    { id: 3, name: 'Orange', color: 'orange' }
  ],
  template: (item) => `
    <div class="fruit-item">
      <span class="name">${item.name}</span>
      <span class="color">${item.color}</span>
    </div>
  `
});
```

### API-Connected List

```javascript
const userList = createVList({
  container: '#users',
  
  // Collection adapter for API calls
  collection: {
    adapter: {
      read: async (params) => {
        const response = await fetch(`/api/users?page=${params.page}&limit=${params.limit}`);
        const data = await response.json();
        return {
          items: data.users,
          meta: {
            total: data.total,
            page: data.page,
            hasNext: data.hasNext
          }
        };
      }
    }
  },
  
  // Pagination configuration
  pagination: {
    strategy: 'page',
    limit: 20
  },
  
  // Item template
  template: (user) => [
    { class: 'user-item', attributes: { 'data-id': user.id } },
    [{ class: 'user-name', text: user.name }],
    [{ class: 'user-email', text: user.email }]
  ]
});
```

## Configuration

The VList component accepts the following configuration options:

### Container Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `container` | `HTMLElement \| string` | - | Container element or CSS selector |
| `parent` | `HTMLElement \| string` | - | Alias for container |
| `className` | `string` | `'mtrl-vlist'` | CSS class for the list element |
| `prefix` | `string` | `'mtrl'` | Prefix for CSS class names |
| `ariaLabel` | `string` | `'Virtual List'` | Accessibility label |
| `debug` | `boolean` | `false` | Enable debug logging |

### Data Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `items` | `array` | `[]` | Static items array (for non-API lists) |
| `template` | `function` | - | Item rendering function |
| `initialScrollIndex` | `number` | `0` | Initial scroll position (item index) |
| `selectId` | `string \| number` | - | ID of item to select after initial load |
| `autoLoad` | `boolean` | `true` | Automatically load data on init |

### Virtual Scrolling Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `virtual.itemSize` | `number` | `50` | Height of each item in pixels |
| `virtual.overscan` | `number` | `2` | Extra items to render outside viewport |

### Scrolling Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `scrolling.orientation` | `string` | `'vertical'` | Scroll direction (`vertical` or `horizontal`) |
| `scrolling.animation` | `boolean` | `true` | Enable smooth scrolling |
| `scrolling.measureItems` | `boolean` | `false` | Measure actual item sizes |
| `scrolling.stopOnClick` | `boolean` | `true` | Stop scrolling momentum when clicking on the viewport |

### Performance Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `performance.cancelLoadThreshold` | `number` | `20` | Velocity (px/ms) above which data loading is cancelled |
| `performance.maxConcurrentRequests` | `number` | `1` | Maximum parallel API requests |
| `performance.recycleElements` | `boolean` | `true` | Enable DOM element recycling |
| `performance.bufferSize` | `number` | - | Element pool size |
| `performance.renderDebounce` | `number` | - | Render debounce delay (ms) |

### Collection Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `collection.adapter` | `object` | - | Data adapter with `read` method |
| `collection.transform` | `function` | - | Transform items before rendering |

### Pagination Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `pagination.strategy` | `string` | `'offset'` | Pagination strategy (`page`, `offset`, `cursor`) |
| `pagination.limit` | `number` | `20` | Items per page/request |

### Selection Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `selection.enabled` | `boolean` | `false` | Enable item selection |
| `selection.mode` | `string` | `'single'` | Selection mode (`single` or `multiple`) |
| `selection.autoSelectFirst` | `boolean` | `false` | Automatically select first item after load |

### Keyboard Options

When selection is enabled, keyboard navigation is automatically enabled. You can configure it with these options:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `keyboard.enabled` | `boolean` | `true` (when selection enabled) | Enable keyboard navigation |
| `keyboard.homeEnd` | `boolean` | `true` | Enable Home/End keys to jump to first/last item |
| `keyboard.pageUpDown` | `boolean` | `true` | Enable PageUp/PageDown keys |
| `keyboard.pageSize` | `number` | `10` | Number of items to skip with PageUp/PageDown |
| `keyboard.wrap` | `boolean` | `true` | Wrap around when reaching start/end (MD3 default) |
| `keyboard.typeAhead` | `boolean` | `false` | Enable type-ahead search |
| `keyboard.typeAheadTimeout` | `number` | `500` | Type-ahead buffer clear timeout in ms |

```javascript
const vlist = createVList({
  container: '#my-list',
  selection: {
    enabled: true,
    mode: 'single'
  },
  keyboard: {
    enabled: true,
    homeEnd: true,
    pageUpDown: true,
    pageSize: 10,
    wrap: false  // Disable wrapping at list boundaries
  },
  // ... other options
});
```

## Template Function

The template function receives an item and its index, and can return:

### HTML String

```javascript
template: (item, index) => `
  <div class="item">
    <h3>${item.title}</h3>
    <p>${item.description}</p>
  </div>
`
```

### DOM Element

```javascript
template: (item, index) => {
  const div = document.createElement('div');
  div.className = 'item';
  div.innerHTML = `<h3>${item.title}</h3>`;
  return div;
}
```

### Layout Schema (Array Format)

```javascript
template: (item, index) => [
  { class: 'item', attributes: { 'data-id': item.id } },
  [{ tag: 'h3', class: 'title', text: item.title }],
  [{ tag: 'p', class: 'description', text: item.description }]
]
```

## Collection Adapter

The collection adapter defines how VList fetches data from your API.

### Adapter Interface

```javascript
collection: {
  adapter: {
    /**
     * Fetch data for a range
     * @param {Object} params - Request parameters
     * @param {number} params.page - Page number (1-indexed)
     * @param {number} params.limit - Items per page
     * @param {AbortSignal} params.signal - Abort signal for cancellation
     * @returns {Promise<{items: array, meta?: object}>}
     */
    read: async (params) => {
      // Fetch implementation
      return {
        items: [...],
        meta: {
          total: 1000,
          page: params.page,
          limit: params.limit,
          hasNext: true,
          hasPrev: params.page > 1
        }
      };
    }
  },
  
  // Optional: transform items before rendering
  transform: (item) => ({
    ...item,
    displayName: `${item.firstName} ${item.lastName}`
  })
}
```

### Pagination Strategies

#### Page-Based

```javascript
pagination: {
  strategy: 'page',
  limit: 20
}

// Adapter receives: { page: 1, limit: 20 }
```

#### Offset-Based

```javascript
pagination: {
  strategy: 'offset',
  limit: 20
}

// Adapter receives: { offset: 0, limit: 20 }
```

#### Cursor-Based

```javascript
pagination: {
  strategy: 'cursor',
  limit: 20
}

// Adapter receives: { cursor: 'abc123', limit: 20 }
// Return meta.nextCursor for next page
```

## API Reference

### Data Methods

| Method | Description |
|--------|-------------|
| `getItems()` | Get all loaded items |
| `getItem(index)` | Get item at index |
| `getItemCount()` | Get total item count |
| `getVisibleItems()` | Get currently visible items |
| `isLoading()` | Check if data is loading |
| `hasNext()` | Check if more items available |

### Item Update Methods

| Method | Description |
|--------|-------------|
| `updateItem(index, item)` | Replace item at index (full replacement) |
| `updateItemById(id, data, options?)` | Update item by ID with partial data merge |
| `removeItem(index)` | Remove item at index |
| `removeItemById(id)` | Remove item by ID |

#### `updateItemById` Options

```javascript
vlist.updateItemById('user-123', { name: 'New Name' }); // Merge with existing

vlist.updateItemById('user-123', newUserData, { replace: true }); // Full replacement
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `replace` | `boolean` | `false` | Replace entire item instead of merging |
| `forceRender` | `boolean` | `false` | Re-render even if not visible |

### Scroll Methods

| Method | Description |
|--------|-------------|
| `scrollToIndex(index, alignment?)` | Scroll to item by index |
| `scrollToPosition(position)` | Scroll to pixel position |
| `getScrollPosition()` | Get current scroll position |
| `getVisibleRange()` | Get `{ start, end }` of visible items |

### Selection Methods

| Method | Description |
|--------|-------------|
| `selectItems(indices)` | Select items by indices array |
| `deselectItems(indices)` | Deselect items by indices array |
| `clearSelection()` | Clear all selections |
| `getSelectedItems()` | Get selected items |
| `getSelectedIndices()` | Get selected indices |
| `isSelected(index)` | Check if item at index is selected |
| `selectById(id)` | Select item by ID |
| `selectAtIndex(index)` | Select item at index (async, handles virtual scrolling) |
| `selectNext()` | Select next item relative to current selection (async) |
| `selectPrevious()` | Select previous item relative to current selection (async) |
| `selectFirst()` | Select first item (async) |
| `selectLast()` | Select last item (async) |
| `isItemFullyVisible(index)` | Check if item at index is fully visible in viewport |
| `focus()` | Focus the list for keyboard navigation |
| `blur()` | Remove focus from the list |
| `hasFocus()` | Check if list has focus |

#### Async Selection Methods

The `selectAtIndex`, `selectNext`, and `selectPrevious` methods are async because they handle virtual scrolling - if the target item isn't loaded yet, they scroll to it, wait for data to load, then select.

```javascript
// Select item at index 500 (may need to load data first)
await vlist.selectAtIndex(500);

// Navigate with keyboard-like selection
await vlist.selectNext();     // Move selection down
await vlist.selectPrevious(); // Move selection up
```

### Lifecycle Methods

| Method | Description |
|--------|-------------|
| `destroy()` | Clean up and remove the list |

## Keyboard Navigation

VList implements Material Design 3 accessibility guidelines for list keyboard navigation.

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `ArrowDown` / `ArrowRight` | Move to next item (wraps to top if at end) |
| `ArrowUp` / `ArrowLeft` | Move to previous item (wraps to bottom if at start) |
| `Home` | Jump to first item |
| `End` | Jump to last item |
| `PageDown` | Skip forward by `pageSize` items (default: 10) |
| `PageUp` | Skip backward by `pageSize` items |
| `Space` / `Enter` | Select/activate the focused item |
| `Escape` | Clear selection |
| `Ctrl+A` / `Cmd+A` | Select all items (multiple selection mode only) |

### Focus Behavior

- Click on the list to focus it for keyboard navigation
- Tab key moves focus to/from the list
- When focused via Tab (keyboard), a focus outline is shown
- When focused via mouse click, no outline is shown (cleaner UX)
- If the list has a selected item, focus goes to that item
- If no item is selected, focus goes to the first item

> **Note:** Focus styling uses a class-based approach (`mtrl-vlist--keyboard-focus`) for reliable cross-browser behavior, rather than relying on `:focus-visible` which can be inconsistent.

### Smart Scrolling

When navigating with keyboard:
- If the target item is already fully visible, no scrolling occurs
- When navigating down and item is below viewport, it scrolls to show item at bottom
- When navigating up and item is above viewport, it scrolls to show item at top
- This provides smooth, natural navigation without jarring jumps

### Accessibility (ARIA)

VList automatically applies proper ARIA attributes:

| Attribute | Element | Value |
|-----------|---------|-------|
| `role` | Container | `listbox` |
| `role` | Items | `option` |
| `aria-selected` | Items | `true` / `false` |
| `aria-activedescendant` | Container | ID of focused item |
| `aria-multiselectable` | Container | `true` (multiple mode only) |
| `tabindex` | Container | `0` (focusable) |

## Events

VList emits various events that you can listen to:

### Selection Events

```javascript
vlist.on('selection:change', (data) => {
  console.log('Selected items:', data.selectedItems);
  console.log('Selected indices:', data.selectedIndices);
});
```

### Keyboard Events

| Event | Data | Description |
|-------|------|-------------|
| `keyboard:navigate` | `{ key, index, shiftKey, ctrlKey, metaKey }` | Keyboard navigation occurred |
| `keyboard:focus` | - | List received focus |
| `keyboard:blur` | - | List lost focus |
| `item:activate` | `{ index, item }` | Item activated via Enter/Space |

### Data Events

```javascript
// Data loaded for a range
vlist.on('viewport:range-loaded', (data) => {
  console.log('Loaded range:', data.range);
});

// Visible range changed (scroll)
vlist.on('viewport:range-changed', (data) => {
  console.log('Visible range:', data.visibleRange);
  console.log('Scroll position:', data.scrollPosition);
});
```

### Scroll Events

```javascript
// Velocity changed during scrolling
vlist.on('viewport:velocity-changed', (data) => {
  console.log('Velocity:', data.velocity, 'px/ms');
  console.log('Direction:', data.direction);
});

// Scrolling stopped
vlist.on('viewport:idle', () => {
  console.log('Scrolling stopped');
});
```

### Error Events

```javascript
vlist.on('error', (data) => {
  console.error('VList error:', data.error);
});
```

## Velocity-Based Loading

VList implements intelligent loading based on scroll velocity to optimize bandwidth and user experience.

### How It Works

1. **Normal Scrolling** (< threshold): Data is fetched immediately
2. **Fast Scrolling** (> threshold): Placeholders are shown, data loading is deferred
3. **Scroll Stops**: Queued data requests are processed

### Configuring the Threshold

```javascript
const vlist = createVList({
  // ...
  performance: {
    // Default: 20 px/ms
    // Higher = more permissive (load data even when scrolling faster)
    // Lower = more conservative (show placeholders earlier)
    cancelLoadThreshold: 50
  }
});
```

### Typical Velocity Values

| Action | Velocity (px/ms) |
|--------|------------------|
| Slow scroll | 0.5 - 2 |
| Normal scroll | 2 - 10 |
| Fast scroll | 10 - 30 |
| Scrollbar drag | 100 - 1000+ |

## Placeholder System

VList automatically generates realistic placeholders while data is loading.

### How Placeholders Work

1. On first load, VList analyzes the actual content structure
2. Generates placeholder templates matching the content dimensions
3. Uses masked characters or skeleton styles for loading state

### Placeholder Configuration

```javascript
const vlist = createVList({
  // ...
  placeholders: {
    enabled: true,
    analyzeFirstLoad: true,  // Analyze content for realistic placeholders
    maskCharacter: 'X'       // Character used for masked placeholders
  }
});
```

### Placeholder Styling

```scss
// Placeholder item
.mtrl-viewport-item--placeholder {
  opacity: 0.6;
  animation: placeholder-pulse 2s ease-in-out infinite;
  pointer-events: none;
  
  // Text elements as placeholder blocks
  .title, .subtitle {
    color: transparent;
    background-color: rgba(0, 0, 0, 0.12);
    border-radius: 3px;
  }
}

@keyframes placeholder-pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 0.3; }
}
```

## Examples

### Track List with Actions

```javascript
const trackList = createVList({
  container: '#tracks',
  className: 'track-list',
  
  virtual: {
    itemSize: 115,
    overscan: 2
  },
  
  pagination: {
    strategy: 'page',
    limit: 50
  },
  
  performance: {
    cancelLoadThreshold: 50  // Allow faster scrolling
  },
  
  collection: {
    adapter: {
      read: async (params) => {
        const response = await fetch(
          `/api/tracks?page=${params.page}&limit=${params.limit}`
        );
        return response.json();
      }
    }
  },
  
  selection: {
    enabled: true,
    mode: 'single'
  },
  
  template: (track) => [
    { class: 'track-item', attributes: { 'data-id': track.id } },
    [{ class: 'track-image', style: `background-image: url(${track.cover})` }],
    [{ class: 'track-info' },
      [{ class: 'track-title', text: track.title }],
      [{ class: 'track-artist', text: track.artist }]
    ],
    [{ class: 'track-actions' },
      [{ tag: 'button', class: 'play-btn', text: '▶' }],
      [{ tag: 'button', class: 'more-btn', text: '⋮' }]
    ]
  ]
});

// Handle selection
trackList.on('selection:change', ({ selectedItems }) => {
  if (selectedItems.length > 0) {
    showTrackDetails(selectedItems[0]);
  }
});

// Handle action buttons
trackList.element.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  
  const item = e.target.closest('[data-id]');
  const trackId = item?.dataset.id;
  
  if (btn.classList.contains('play-btn')) {
    playTrack(trackId);
  }
});
```

### User List with Search

```javascript
let searchQuery = '';

const userList = createVList({
  container: '#users',
  
  collection: {
    adapter: {
      read: async (params) => {
        let url = `/api/users?page=${params.page}&limit=${params.limit}`;
        if (searchQuery) {
          url += `&search=${encodeURIComponent(searchQuery)}`;
        }
        const response = await fetch(url);
        return response.json();
      }
    }
  },
  
  template: (user) => [
    { class: 'user-item', attributes: { 'data-id': user.id } },
    [{ class: 'user-avatar', style: `background-image: url(${user.avatar})` }],
    [{ class: 'user-info' },
      [{ class: 'user-name', text: user.name }],
      [{ class: 'user-email', text: user.email }]
    ]
  ]
});

// Search functionality
searchInput.addEventListener('input', debounce((e) => {
  searchQuery = e.target.value;
  userList.refresh();
}, 300));
```

### Infinite Scroll with Cursor Pagination

```javascript
const feedList = createVList({
  container: '#feed',
  
  pagination: {
    strategy: 'cursor',
    limit: 20
  },
  
  collection: {
    adapter: {
      read: async (params) => {
        const url = params.cursor 
          ? `/api/feed?cursor=${params.cursor}&limit=${params.limit}`
          : `/api/feed?limit=${params.limit}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        return {
          items: data.posts,
          meta: {
            nextCursor: data.nextCursor,
            hasNext: !!data.nextCursor
          }
        };
      }
    }
  },
  
  template: (post) => [
    { class: 'feed-item' },
    [{ class: 'post-header' },
      [{ class: 'author-name', text: post.author }],
      [{ class: 'post-time', text: formatTime(post.createdAt) }]
    ],
    [{ class: 'post-content', text: post.content }]
  ]
});
```

### Item Updates and Removal

```javascript
const taskList = createVList({
  container: '#tasks',
  collection: { adapter: taskAdapter },
  selection: { enabled: true, mode: 'single' },
  template: (task) => [
    { class: 'task-item', attributes: { 'data-id': task.id } },
    [{ class: 'task-status', text: task.completed ? '✓' : '○' }],
    [{ class: 'task-title', text: task.title }]
  ]
});

// Update a task by ID (partial merge - only updates specified fields)
taskList.updateItemById('task-123', { 
  completed: true,
  completedAt: new Date().toISOString()
});

// Update with full replacement
taskList.updateItemById('task-123', newTaskData, { replace: true });

// Remove a task by ID
taskList.removeItemById('task-123');

// Remove by index
taskList.removeItem(5);

// Keyboard navigation with async selection
document.addEventListener('keydown', async (e) => {
  if (e.key === 'ArrowDown') {
    await taskList.selectNext();
  } else if (e.key === 'ArrowUp') {
    await taskList.selectPrevious();
  } else if (e.key === 'Delete') {
    const selected = taskList.getSelectedItems();
    if (selected.length > 0) {
      taskList.removeItemById(selected[0].id);
    }
  }
});
```

## Performance Tips

### 1. Set Appropriate Item Size

```javascript
// Measure your actual item height for best performance
virtual: {
  itemSize: 115  // Match your CSS
}
```

### 2. Tune the Velocity Threshold

```javascript
// Desktop admin apps: higher threshold (more data loading)
performance: { cancelLoadThreshold: 50 }

// Mobile apps: lower threshold (preserve bandwidth)
performance: { cancelLoadThreshold: 10 }
```

### 3. Optimize Templates

```javascript
// Prefer layout schema over string concatenation
template: (item) => [
  { class: 'item', attributes: { 'data-id': item.id } },
  [{ class: 'title', text: item.title }]
]
```

### 4. Use Transform for Computed Values

```javascript
collection: {
  transform: (item) => ({
    ...item,
    // Compute once, not on every render
    fullName: `${item.firstName} ${item.lastName}`,
    formattedDate: formatDate(item.createdAt)
  })
}
```

### 5. Monitor Loading Stats

```javascript
// Access loading statistics
const stats = vlist.viewport.collection.getLoadingStats();
console.log({
  pendingRequests: stats.pendingRequests,
  completedRequests: stats.completedRequests,
  cancelledRequests: stats.cancelledRequests,
  currentVelocity: stats.currentVelocity
});
```

## CSS Customization

### Basic Styling

```scss
.mtrl-vlist {
  height: 100%;
  width: 100%;
}

.mtrl-viewport {
  height: 100%;
}

.mtrl-viewport-item {
  padding: 12px 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  cursor: pointer;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }
  
  &--selected {
    background-color: rgba(0, 0, 0, 0.08);
  }
  
  &--placeholder {
    opacity: 0.6;
    pointer-events: none;
  }
}
```

### Scroll Indicator

When the list is scrolled away from the top, a subtle shadow appears at the top edge to indicate that there is content above. This is handled automatically via the `--scrolled` modifier class.

```scss
// The --scrolled class is added automatically when the list is not at the top
.mtrl-vlist--scrolled::before {
  // A subtle top shadow gradient is shown
  opacity: 1;
}

// Customize the scroll indicator shadow
.mtrl-vlist::before {
  height: 6px; // Increase shadow height (default: 3px)
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.15) 0%,
    transparent 100%
  );
}
```

### Custom Scrollbar

```scss
.mtrl-viewport__scrollbar {
  width: 8px;
  background: transparent;
  
  &-thumb {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 4px;
    
    &:hover {
      background: rgba(0, 0, 0, 0.5);
    }
  }
}
```

## Troubleshooting

### List Not Rendering

1. Ensure container has a defined height
2. Check that `items` or `collection.adapter` is provided
3. Verify template function returns valid content

### Data Not Loading

1. Check browser console for API errors
2. Verify adapter `read` function returns correct format
3. Check `autoLoad` is not set to `false`

### Scroll Performance Issues

1. Reduce `overscan` value
2. Simplify template (fewer DOM nodes)
3. Increase `cancelLoadThreshold` to defer loading during fast scrolls

### Placeholders Not Showing

1. Ensure `placeholders.enabled` is not `false`
2. Check CSS for placeholder styles
3. Verify `cancelLoadThreshold` isn't too high

## Related Documentation

- [Viewport Core](../core/viewport/viewport.md) - The underlying virtual scrolling engine
- [Viewport Features](../core/viewport/features/) - Individual feature documentation
- [Viewport Constants](../core/viewport/constants.md) - Configuration constants