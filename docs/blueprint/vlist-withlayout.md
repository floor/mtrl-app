# VList Layout Enhancement

## Overview

This document describes the `withLayout` feature for VList that integrates layout management directly into the component. The goal is to **simplify VList integration** by providing a complete, batteries-included list component that handles layout and virtual scrolling in one cohesive API.

## Motivation

### Current Complexity

Today, integrating VList in a real application requires understanding and composing multiple concepts:

```javascript
// Current approach - many moving parts
import { pipe } from 'mtrl'
import { createVList } from 'mtrl-addons'

const createUserList = (options) => {
  const config = createConfig(options)
  
  return pipe(
    createBase,
    withRefs(),           // Shared mutable references
    withStore(config),    // State management
    withEmitter(),        // Event emission
    withElement(config),  // DOM element creation
    withVisibility(),     // Show/hide methods
    withVelocityTracker(),// Scroll tracking
    withSearch(config),   // Search functionality
    withFilter(config),   // Filter functionality
    withData(config),     // CRUD operations
    withVList(config),    // Virtual list (finally!)
    withLifecycle(config),
    withEventWiring(config),
    withStateAccessors()
  )(config)
}
```

This approach is **powerful but complex**. It requires developers to understand:
- Functional composition with `pipe`
- The closure capture problem and refs
- Feature ordering dependencies
- Multiple configuration files
- State management patterns

### The Goal

Make VList integration **simple** for common use cases:

```javascript
// Proposed approach - one component, one config
const userList = createVList({
  container: document.getElementById('app'),
  class: 'users',
  
  layout: [
    ['head', { class: 'head' },
      ['title', { class: 'title', text: 'Users' }]
    ],
    ['viewport'],
    ['foot', { class: 'foot' },
      ['count', { class: 'count', text: '0' }]
    ]
  ],
  
  template: userTemplate,
  virtual: { itemSize: 100 },
  collection: { adapter: { read: fetchUsers } }
})

// Access layout elements (flat map)
userList.layout.title.textContent = 'Users (1,245)'
userList.layout.count.textContent = '1,245'
```

## Design

### The `withLayout` Feature

`withLayout` is a feature that enhances VList, consistent with the existing composition pattern in mtrl-addons. It processes a `layout` configuration to build the complete UI structure around the virtual scrolling viewport.

### The `layout` Option

VList accepts an optional `layout` configuration that defines the complete UI structure. The layout is an array schema (compatible with mtrl-addons `createLayout`) with a special `'viewport'` placeholder that marks where the virtual scrolling area will be created.

```javascript
layout: [
  ['head', { class: 'head' },
    ['title', { class: 'title', text: 'List' }],
    ['divider', { class: 'divider' }],
    [IconButton, 'search', { icon: iconSearch }],
    [IconButton, 'filter', { icon: iconFilter }]
  ],
  ['filter-input', { class: 'filter-input' },
    [Select, 'country', { options: countries }],
    [Button, 'clear', { icon: iconCancel }]
  ],
  [SearchBar, 'search-bar', { placeholder: 'Search...' }],
  ['viewport'],  // ← Virtual scrolling area
  ['foot', { class: 'foot' },
    ['progress', { class: 'progress', text: '0%' }],
    ['count', { class: 'count', text: '0' }]
  ]
]
```

### The `viewport` Placeholder

The `'viewport'` entry in the layout schema is a reserved keyword. The first element in each array item is the component key/name. So `['viewport']` creates an element accessible as `layout.viewport`.

```javascript
// Minimal
['viewport']

// With options
['viewport', { class: 'body', ariaLabel: 'User list' }]
```

VList will:
1. Process the layout schema using `createLayout`
2. Find the `viewport` element
3. Render the virtual scrolling content inside it

### DOM Structure

**Current structure (with wrapper):**
```html
<div class="users list premium">           <!-- Wrapper creates -->
  <div class="mtrl-head">...</div>         <!-- Layout -->
  <div class="mtrl-filter-input">...</div> <!-- Layout -->
  <div class="mtrl-search">...</div>       <!-- Layout -->
  <div class="mtrl-body">                  <!-- Layout -->
    <div class="mtrl-vlist">               <!-- VList creates -->
      <div class="mtrl-viewport">...</div> <!-- VList internal -->
    </div>
  </div>
  <div class="mtrl-foot">...</div>         <!-- Layout -->
</div>
```

**Proposed structure (VList with layout):**
```html
<div class="mtrl-vlist mtrl-vlist-users">       <!-- VList creates root -->
  <div class="mtrl-head">...</div>              <!-- withLayout builds -->
  <div class="mtrl-filter-input">...</div>      <!-- withLayout builds -->
  <div class="mtrl-search">...</div>            <!-- withLayout builds -->
  <div class="mtrl-viewport-container">         <!-- withLayout builds from 'viewport' -->
    <div class="mtrl-viewport">...</div>        <!-- VList renders here -->
  </div>
  <div class="mtrl-foot">...</div>              <!-- withLayout builds -->
</div>
```

Key differences:
- VList creates its own root element (`mtrl-vlist`)
- No separate wrapper needed
- Layout is built inside VList's element
- `viewport` in schema becomes the container for virtual scrolling

### Accessing Layout Elements

The mtrl-addons layout system returns a **flat map** of all named elements. After creation, all layout elements are accessible via `vlist.layout`:

```javascript
const vlist = createVList({
  layout: [
    ['head', { class: 'head' },
      ['title', { text: 'Users' }],
      [IconButton, 'search', { icon: iconSearch }]
    ],
    ['viewport'],
    ['foot', { class: 'foot' },
      ['progress', { text: '0%' }],
      ['count', { text: '0' }]
    ]
  ],
  // ...
})

// Access elements directly by their key (flat map)
vlist.layout.head       // The head container element
vlist.layout.title      // The title element
vlist.layout.search     // The search IconButton instance
vlist.layout.viewport   // The virtual scrolling container
vlist.layout.foot       // The footer container element
vlist.layout.progress   // The progress element
vlist.layout.count      // The count element

// Update dynamically
vlist.layout.title.textContent = 'Users (1,245)'
vlist.layout.count.textContent = '1,245'
vlist.layout.progress.textContent = '100%'

// Toggle visibility
vlist.layout.head.classList.add('hidden')
```

> **Note:** The layout system flattens all named elements into a single map. Element keys must be unique across the entire layout schema.

### Default Behavior

| Configuration | Result |
|---------------|--------|
| No `layout` option | Backward compatible - just virtual scrolling, no wrapper layout |
| `layout: [...]` | Custom layout schema with viewport placeholder |

### Backward Compatibility

Existing code without the `layout` option continues to work exactly as before:

```javascript
// This still works - no layout, just virtual scrolling
const vlist = createVList({
  container: element,
  template: itemTemplate,
  collection: { adapter: { read: fetchData } }
})
```

## Implementation

### The `withLayout` Feature

```javascript
// In mtrl-addons/src/components/vlist/features/layout.ts

import { createLayout } from '../../../core/layout'

export const withLayout = (config) => (vlist) => {
  // Skip if no layout provided
  if (!config.layout) return vlist
  
  // Build layout inside vlist.element
  const { component } = createLayout(config.layout, vlist.element)
  
  // The viewport element is where VList renders
  const viewport = component.viewport
  if (!viewport) {
    console.warn('[VList] Layout schema must include a viewport element')
    return vlist
  }
  
  // Configure VList to use viewport as its rendering container
  vlist.setViewportContainer(viewport)
  
  return {
    ...vlist,
    layout: component  // Flat map of all layout elements
  }
}
```

### Integration with VList

```javascript
// In mtrl-addons/src/components/vlist/vlist.ts

import { withLayout } from './features/layout'

export function createVList(options) {
  // Create root element
  const element = document.createElement('div')
  element.classList.add('mtrl-vlist')
  if (options.class) {
    element.classList.add(`mtrl-vlist-${options.class}`)
  }
  
  // Append to container
  if (options.container) {
    options.container.appendChild(element)
  }
  
  // Create base VList instance
  let vlist = createBaseVList({ ...options, element })
  
  // Apply layout feature if layout provided
  if (options.layout) {
    vlist = withLayout(options)(vlist)
  }
  
  return vlist
}
```

## Examples

### Minimal List

```javascript
const list = createVList({
  container: document.getElementById('app'),
  layout: [['viewport']],
  template: (item) => `<div class="item">${item.name}</div>`,
  collection: { adapter: { read: fetchItems } }
})
```

### List with Header and Footer

```javascript
const list = createVList({
  container: document.getElementById('app'),
  class: 'items',
  
  layout: [
    ['header', { class: 'header' },
      ['title', { tag: 'h2', text: 'My Items' }]
    ],
    ['viewport'],
    ['footer', { class: 'footer' },
      ['count', { text: '0 items' }]
    ]
  ],
  
  template: itemTemplate,
  virtual: { itemSize: 50 },
  collection: {
    adapter: {
      read: async ({ page, limit }) => {
        const data = await fetchItems(page, limit)
        list.layout.count.textContent = `${data.total} items`
        return data
      }
    }
  }
})
```

### Full-Featured List

```javascript
import { createIconButton, createSelect, createSearch } from 'mtrl'
import { createVList } from 'mtrl-addons'

const userList = createVList({
  container: document.getElementById('users'),
  class: 'users',
  
  layout: [
    // Header with title and action buttons
    ['head', { class: 'head' },
      ['title', { class: 'title', text: 'Users' }],
      ['divider', { class: 'divider' }],
      [createIconButton, 'search', { 
        variant: 'standard', 
        icon: iconSearch, 
        toggle: true 
      }],
      [createIconButton, 'filter', { 
        variant: 'standard', 
        icon: iconFilter, 
        toggle: true 
      }]
    ],
    
    // Filter panel (initially hidden)
    ['filter-input', { class: 'filter-input' },
      [Icon, { src: iconFilter }],
      [{ class: 'label', text: 'Country' }],
      [createSelect, 'country', {
        variant: 'outlined',
        density: 'compact',
        options: [{ id: '', text: 'All' }, ...countries]
      }],
      [{ class: 'divider' }],
      [Button, 'clear', { class: 'clear', icon: iconCancel }]
    ],
    
    // Search bar (initially hidden)
    [createSearch, 'search-bar', {
      class: 'search-bar',
      placeholder: 'Search users...',
      leadingIcon: iconSearch,
      showClearButton: true
    }],
    
    // Virtual scrolling viewport
    ['viewport'],
    
    // Footer with progress and count
    ['foot', { class: 'foot' },
      ['progress', { class: 'progress', text: '0%' }],
      ['divider', { class: 'divider' }],
      ['info', { class: 'info' },
        ['position', { class: 'position', text: '0' }],
        ['slash', { text: '/' }],
        ['count', { class: 'count', text: '0' }],
        ['label', { text: 'items' }]
      ]
    ]
  ],
  
  template: userTemplate,
  virtual: { itemSize: 100, overscan: 2 },
  selection: { enabled: true, mode: 'single' },
  
  collection: {
    adapter: { read: fetchUsers }
  }
})

// Wire up events
userList.layout.search.on('click', () => {
  userList.layout['search-bar'].element.classList.toggle('show')
})

userList.layout.filter.on('click', () => {
  userList.layout['filter-input'].classList.toggle('show')
})

userList.layout.country.on('change', (e) => {
  userList.reload({ country: e.value })
})

// Update footer on data load
userList.on('viewport:range-changed', ({ visibleRange }) => {
  const count = userList.getItemCount()
  const position = Math.min(visibleRange.end + 1, count)
  const percent = Math.round((position / count) * 100)
  
  userList.layout.progress.textContent = `${percent}%`
  userList.layout.position.textContent = position
  userList.layout.count.textContent = count
})
```

## Migration Guide

### From Wrapper Pattern to Layout Option

**Before (wrapper with composition):**
```javascript
// config.js
export function createMainLayout() {
  return [
    ['head', { class: 'head' }, ...],
    ['body', { class: 'body' }],
    ['foot', { class: 'foot' }, ...]
  ]
}

// list.js
const createUserList = (options) => {
  const config = createConfig(options)
  return pipe(
    createBase,
    withRefs(),
    withStore(config),
    withEmitter(),
    withElement(config),
    withVList(config),
    // ... many more features
  )(config)
}
```

**After (layout option):**
```javascript
// Just use VList directly
const userList = createVList({
  container: parentElement,
  class: 'users',
  layout: [
    ['head', { class: 'head' }, ...],
    ['viewport'],
    ['foot', { class: 'foot' }, ...]
  ],
  template: userTemplate,
  collection: { adapter: { read: fetchUsers } }
})
```

### Gradual Migration

The wrapper pattern can still be used for advanced cases requiring custom state management or complex event wiring. The `layout` option is purely additive - existing code continues to work.

## Summary

The `withLayout` feature provides:

1. **Simplicity** - One component, one config, complete list UI
2. **Flexibility** - Custom layouts via schema, or no layout at all
3. **Consistency** - Uses existing `createLayout` system, follows `withFeature` pattern
4. **Accessibility** - Layout elements accessible via flat `vlist.layout` map
5. **Backward Compatibility** - Existing code continues to work

This makes VList a **production-ready, batteries-included** virtual list component while maintaining its core strength in handling massive datasets efficiently.