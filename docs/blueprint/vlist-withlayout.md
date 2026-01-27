# VList Layout Enhancement

## Overview

This document describes the proposed enhancement to VList that integrates layout management directly into the component. The goal is to **simplify VList integration** by providing a complete, batteries-included list component that handles layout, virtual scrolling, and state management in one cohesive API.

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
  
  layout: [
    ['head', { class: 'head' },
      ['title', { text: 'Users' }]
    ],
    ['viewport'],
    ['foot', { class: 'foot' }]
  ],
  
  template: userTemplate,
  itemSize: 100,
  
  collection: {
    adapter: { read: fetchUsers }
  }
})

// Access layout elements
userList.layout.head.title.textContent = 'Users (1,245)'
```

## Design

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
  ['viewport'],  // ← Virtual scrolling area goes here
  ['foot', { class: 'foot' },
    ['position', { text: '0' }],
    ['count', { text: '0' }]
  ]
]
```

### The `viewport` Placeholder

The `'viewport'` entry in the layout schema is a reserved keyword that tells VList where to create the virtual scrolling container. It can be:

```javascript
// Minimal - just the keyword
['viewport']

// With options
['viewport', { class: 'custom-body', ariaLabel: 'User list' }]
```

VList will:
1. Process the layout schema
2. Find the `viewport` placeholder
3. Create the virtual scrolling container at that position
4. Build the rest of the layout around it

### Accessing Layout Elements

After creation, all named layout elements are accessible via `vlist.layout` as a **flat map**. The mtrl-addons layout system returns all components in a flattened structure, regardless of nesting in the schema:

```javascript
const vlist = createVList({
  layout: [
    ['head', { class: 'head' },
      ['title', { text: 'Users' }],
      [IconButton, 'search', { icon: iconSearch }]
    ],
    ['viewport'],
    ['foot', { class: 'foot' },
      ['count', { text: '0' }]
    ]
  ],
  // ...
})

// Access elements directly by their key (flat map)
vlist.layout.head              // The head container element
vlist.layout.title             // The title element (not head.title)
vlist.layout.search            // The search IconButton instance (not head.search)
vlist.layout.foot              // The foot container element
vlist.layout.count             // The count element (not foot.count)
vlist.layout.viewport          // The virtual scrolling container

// Update dynamically
vlist.layout.title.textContent = 'Users (1,245)'
vlist.layout.count.textContent = '1,245'

// Toggle visibility
vlist.layout.head.classList.add('hidden')
```

> **Note:** The layout system flattens all named elements into a single map. This means element keys must be unique across the entire layout schema.

### Default Behavior

| Configuration | Result |
|---------------|--------|
| No `layout` option | Backward compatible - just virtual scrolling, no wrapper layout |
| `layout: true` | Default minimal layout: `[['viewport']]` |
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

## API Reference

### VList Options (Extended)

```typescript
interface VListOptions {
  // Existing options
  container: HTMLElement
  template: TemplateFunction
  collection: CollectionConfig
  virtual?: VirtualConfig
  selection?: SelectionConfig
  keyboard?: KeyboardConfig
  // ...
  
  // New layout option
  layout?: LayoutSchema | boolean
}

type LayoutSchema = Array<LayoutItem>

type LayoutItem = 
  | string                           // Element tag or 'viewport'
  | [string, object?, ...LayoutItem[]] // [tag, options?, children...]
  | [ComponentClass, string?, object?] // [Component, key?, props?]
```

### VList Instance (Extended)

```typescript
interface VList {
  // Existing properties and methods
  element: HTMLElement
  getItems(): Item[]
  getSelectedItems(): Item[]
  scrollToIndex(index: number): void
  // ...
  
  // New layout property (when layout option is used)
  layout: LayoutElements
}

interface LayoutElements {
  [key: string]: HTMLElement | ComponentInstance | LayoutElements
}
```

## Examples

### Minimal List

```javascript
const list = createVList({
  container: document.getElementById('app'),
  layout: [['viewport']],
  template: (item) => `<div class="item">${item.name}</div>`,
  collection: {
    adapter: { read: fetchItems }
  }
})
```

### List with Header and Footer

```javascript
const list = createVList({
  container: document.getElementById('app'),
  
  layout: [
    ['header', { class: 'list-header' },
      ['h2', 'title', { text: 'My Items' }]
    ],
    ['viewport'],
    ['footer', { class: 'list-footer' },
      ['span', 'count', { text: '0 items' }]
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

### Full-Featured List (Search, Filter, Footer)

```javascript
import { createIconButton, createSelect, createSearch } from 'mtrl'
import { createVList } from 'mtrl-addons'

const userList = createVList({
  container: document.getElementById('users'),
  
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
        options: [
          { id: '', text: 'All' },
          ...countries
        ]
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
    ['viewport', { class: 'body' }],
    
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
    adapter: {
      read: fetchUsers
    }
  }
})

// Wire up events
userList.layout.head.search.on('click', () => {
  userList.layout['search-bar'].element.classList.toggle('show')
})

userList.layout.head.filter.on('click', () => {
  userList.layout['filter-input'].classList.toggle('show')
})

userList.layout['filter-input'].country.on('change', (e) => {
  // Reload with filter
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

## Implementation Notes

### Layout Processing

1. VList receives the `layout` option
2. If `layout` is falsy, skip layout processing (backward compatible)
3. Parse the layout schema to find the `viewport` entry
4. Create the container element for VList
5. Use `createLayout` from mtrl-addons to build the layout
6. Replace the `viewport` placeholder with the virtual scrolling container
7. Store references to all named elements in `vlist.layout`

### Element Reference Collection

When processing the layout, VList uses mtrl-addons `createLayout` which collects references to all elements that have:
- A string key (second position in array): `[Component, 'key', { props }]`
- A name in the first position: `['head', { class: 'head' }]`

These are stored in a **flat map** (not nested):
```javascript
vlist.layout = {
  head: HTMLElement,           // The head container
  title: HTMLElement,          // Title element
  search: IconButton,          // Component instance
  filter: IconButton,          // Component instance
  'filter-input': HTMLElement, // Filter panel container
  country: Select,             // Select component
  clear: Button,               // Clear button
  'search-bar': Search,        // Search component instance
  viewport: HTMLElement,       // The virtual scrolling container
  foot: HTMLElement,           // Footer container
  progress: HTMLElement,       // Progress element
  position: HTMLElement,       // Position element
  count: HTMLElement,          // Count element
  // etc.
}
```

> **Important:** Since the layout is flat, all element keys must be unique across the entire schema. Choose descriptive, non-conflicting names.

### CSS Considerations

The layout container element receives:
- The `class` from VList options (e.g., `'users'`)
- A base `'vlist'` class for common styling

```css
.vlist {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.vlist > .head {
  flex: none;
}

.vlist > .viewport {
  flex: 1;
  overflow: auto;
}

.vlist > .foot {
  flex: none;
}
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

The wrapper pattern can still be used for advanced cases. The `layout` option is purely additive - existing code continues to work.

## Future Considerations

### Built-in Event Handling

Consider adding common event handling directly to VList:

```javascript
const list = createVList({
  layout: [...],
  
  // Built-in search handling
  search: {
    key: 'search-bar',        // Layout element key
    minChars: 3,
    debounce: 300,
    onSearch: (query) => list.reload({ search: query })
  },
  
  // Built-in filter handling  
  filter: {
    key: 'filter-input',
    fields: ['country'],
    onFilter: (filters) => list.reload(filters)
  }
})
```

### Layout Presets

Common layout patterns as presets:

```javascript
import { layouts } from 'mtrl-addons'

const list = createVList({
  layout: layouts.standard({
    title: 'Users',
    search: true,
    filter: true,
    footer: true
  }),
  // ...
})
```

## Summary

The VList layout enhancement provides:

1. **Simplicity** - One component, one config, complete list UI
2. **Flexibility** - Custom layouts via schema, or no layout at all
3. **Accessibility** - Layout elements accessible via `vlist.layout`
4. **Backward Compatibility** - Existing code continues to work
5. **Progressive Enhancement** - Start simple, add complexity as needed

This makes VList a **production-ready, batteries-included** virtual list component while maintaining its core strength in handling massive datasets efficiently.