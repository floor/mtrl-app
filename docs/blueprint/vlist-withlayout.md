# VList Layout Enhancement

## Overview

This document describes the `withLayout` feature for VList that integrates layout management directly into the component. The goal is to **simplify VList integration** by providing a complete, batteries-included list component that handles layout, search, filter, and virtual scrolling in one cohesive API.

## Status

### ✅ Completed

- **`withLayout` feature** - Processes layout schema, finds viewport, exposes `vlist.layout` flat map
- **`withViewport` integration** - Uses layout's viewport container when available
- **VList types updated** - `layout` option in config, `layout` property on component
- **Tests** - 13 tests covering layout functionality
- **Styles** - Support for both wrapper pattern and withLayout pattern in desk styles
- **Proof of concept** - `list-with-layout.js` demonstrates the approach works
- **`withSearch` feature** - Generic, layout-agnostic search integration with debounce, events, and API
- **`withFilter` feature** - Generic, layout-agnostic filter integration with controls mapping, events, and API
- **Search tests** - 24 tests covering search functionality
- **Filter tests** - 33 tests covering filter functionality
- **Types updated** - `SearchConfig` and `FilterConfig` added to `VListConfig`, API methods added to `VListComponent`
- **VList styles** - Search bar and filter panel styles added to `_vlist.scss` in mtrl-addons
- **Keyboard fix** - Fixed click handler to not steal focus from search/filter inputs
- **list-with-layout.js integration** - Updated to use `withSearch` and `withFilter` features
- **Collection adapter enhancement** - Search/filters automatically passed to adapter read function (11 tests)

### 📋 Planned

- Remove `list-with-layout.js` wrapper after full migration complete
- Use VList directly in `accounts/layout.js`

---

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
// Target approach - one component, one config
const userList = createVList({
  container: document.getElementById('app'),
  class: 'users',
  
  layout: [
    ['head', { class: 'head' },
      ['title', { text: 'Users' }],
      [createIconButton, 'search', { icon: iconSearch, toggle: true }],
      [createIconButton, 'filter', { icon: iconFilter, toggle: true }]
    ],
    ['filter-input', { class: 'filter-input' },
      [createSelect, 'country', { options: countries }],
      [Button, 'clear', { icon: iconCancel }]
    ],
    [createSearch, 'search-bar', { placeholder: 'Search...' }],
    ['viewport'],
    ['foot', { class: 'foot' },
      ['count', { text: '0' }]
    ]
  ],
  
  // Generic search feature
  search: {
    toggleButton: 'search',
    searchBar: 'search-bar',
  },
  
  // Generic filter feature
  filter: {
    toggleButton: 'filter',
    panel: 'filter-input',
    clearButton: 'clear',
    controls: {
      country: 'country',
    },
  },
  
  template: userTemplate,
  virtual: { itemSize: 100 },
  collection: { adapter: { read: fetchUsers } }
})
```

---

## Design

### The `withLayout` Feature ✅ Implemented

`withLayout` is a feature that enhances VList, consistent with the existing composition pattern in mtrl-addons. It processes a `layout` configuration to build the complete UI structure around the virtual scrolling viewport.

### The `layout` Option ✅ Implemented

VList accepts an optional `layout` configuration that defines the complete UI structure. The layout is an array schema (compatible with mtrl-addons `createLayout`) with a special `'viewport'` placeholder that marks where the virtual scrolling area will be created.

```javascript
layout: [
  ['head', { class: 'head' },
    ['title', { class: 'title', text: 'List' }],
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

### The `viewport` Placeholder ✅ Implemented

The `'viewport'` entry in the layout schema is a reserved keyword. VList will:
1. Process the layout schema using `createLayout`
2. Find the `viewport` element
3. Render the virtual scrolling content inside it

```javascript
// Minimal
['viewport']

// With options
['viewport', { class: 'body', ariaLabel: 'User list' }]
```

### DOM Structure ✅ Implemented

**New structure (VList with layout):**
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

### Accessing Layout Elements ✅ Implemented

All layout elements are accessible via `vlist.layout`:

```javascript
// Access elements directly by their key (flat map)
vlist.layout.head       // The head container element
vlist.layout.title      // The title element
vlist.layout.search     // The search IconButton instance
vlist.layout.viewport   // The virtual scrolling container
vlist.layout.foot       // The footer container element

// Update dynamically
vlist.layout.title.textContent = 'Users (1,245)'
vlist.layout.count.textContent = '1,245'
```

---

## Features

### The `withSearch` Feature ✅ Implemented

A generic, layout-agnostic search feature that works with any layout structure.

#### Configuration

```typescript
interface SearchConfig {
  // Layout element names (references to elements in layout)
  toggleButton?: string      // IconButton that toggles search visibility
  searchBar?: string         // Search input component name
  
  // Behavior
  autoReload?: boolean       // Reload on search change (default: true)
  debounce?: number          // Debounce input in ms (default: 300)
  minLength?: number         // Minimum query length to trigger search (default: 1)
}
```

#### Search Component Options

When using `createSearch` from mtrl, use these options to keep it as a simple inline bar:

```javascript
[createSearch, 'search-bar', {
  placeholder: 'Search users...',
  expandOnFocus: false,    // Don't expand to view mode with suggestions
  collapseOnBlur: false,   // Don't collapse when losing focus
  fullWidth: true          // Fill available width
}]
```

#### Example Usage

```javascript
const vlist = createVList({
  layout: [
    ['head', { class: 'head' },
      [createIconButton, 'search-toggle', { icon: iconSearch, toggle: true }]
    ],
    [createSearch, 'search-input', { 
      placeholder: 'Search...', 
      expandOnFocus: false,
      collapseOnBlur: false,
      fullWidth: true
    }],
    ['viewport'],
  ],
  
  search: {
    toggleButton: 'search-toggle',  // References layout element
    searchBar: 'search-input',      // References layout element
    debounce: 300,
    autoReload: false,              // Handle reload manually via events
  },
  
  collection: {
    adapter: {
      read: async ({ page, limit }) => {
        // Access search via vlist.getSearchQuery()
      }
    }
  }
})

// Listen to search events
vlist.on('search:change', ({ query }) => {
  // Handle search change
})
```

#### Events Emitted

| Event | Data | Description |
|-------|------|-------------|
| `search:open` | `{}` | Search bar shown |
| `search:close` | `{}` | Search bar hidden |
| `search:change` | `{ query: string, previousQuery: string }` | Search query changed |
| `search:clear` | `{}` | Search cleared |

#### API Added

```typescript
vlist.search(query: string): void      // Set search query programmatically
vlist.clearSearch(): void              // Clear search
vlist.getSearchQuery(): string         // Get current query
vlist.isSearching(): boolean           // Check if in search mode (has query)
vlist.isSearchOpen(): boolean          // Check if search bar is visible
vlist.openSearch(): void               // Show search bar
vlist.closeSearch(): void              // Hide search bar
vlist.toggleSearch(): void             // Toggle search bar visibility
```

---

### The `withFilter` Feature ✅ Implemented

A generic, layout-agnostic filter feature that works with any layout structure and any filter controls.

#### Configuration

```typescript
interface FilterConfig {
  // Layout element names (references to elements in layout)
  toggleButton?: string       // IconButton that toggles filter panel
  panel?: string              // Filter panel container name
  clearButton?: string        // Clear all filters button (optional)
  
  // Filter controls - map of filter name → layout element name
  controls?: Record<string, string>
  
  // Behavior
  autoReload?: boolean        // Reload on filter change (default: true)
}
```

#### Example Usage

```javascript
const vlist = createVList({
  layout: [
    ['head', { class: 'head' },
      [createIconButton, 'filter-toggle', { icon: iconFilter, toggle: true }]
    ],
    ['filters', { class: 'filter-panel' },
      [createSelect, 'country-select', { options: countries }],
      [createSelect, 'decade-select', { options: decades }],
      [Button, 'clear-btn', { icon: iconCancel }]
    ],
    ['viewport'],
  ],
  
  filter: {
    toggleButton: 'filter-toggle',  // References layout element
    panel: 'filters',               // References layout element
    clearButton: 'clear-btn',       // References layout element
    controls: {
      country: 'country-select',    // Filter name → layout element
      decade: 'decade-select',
    },
    autoReload: false,              // Handle reload manually via events
  },
})

// Listen to filter events
vlist.on('filter:change', ({ name, value, filters }) => {
  // Handle filter change
})
```

#### Events Emitted

| Event | Data | Description |
|-------|------|-------------|
| `filter:open` | `{}` | Filter panel shown |
| `filter:close` | `{}` | Filter panel hidden |
| `filter:change` | `{ name: string, value: any, previousValue: any, filters: Record<string, any> }` | Single filter changed |
| `filter:clear` | `{}` | All filters cleared |

#### API Added

```typescript
vlist.setFilter(name: string, value: any): void   // Set single filter
vlist.setFilters(filters: Record<string, any>): void  // Set multiple filters
vlist.clearFilters(): void                         // Clear all filters
vlist.getFilters(): Record<string, any>            // Get current filters
vlist.getFilter(name: string): any                 // Get single filter value
vlist.isFiltered(): boolean                        // Check if any filter active
vlist.isFilterOpen(): boolean                      // Check if filter panel is visible
vlist.openFilter(): void                           // Show filter panel
vlist.closeFilter(): void                          // Hide filter panel
vlist.toggleFilter(): void                         // Toggle filter panel visibility
```

---

## Styles ✅ Implemented

### VList Styles (`mtrl-addons/src/styles/components/_vlist.scss`)

The search bar and filter panel styles are now included in the VList component styles:

#### Search Bar

```scss
.#{$component} {
  > .#{$prefix}-search {
    display: none;           // Hidden by default
    // ... styling for inline search bar
    
    &.show {
      display: flex;         // Shown when withSearch opens it
    }
    
    &.hide {
      display: none;
    }
  }
}
```

#### Filter Panel

```scss
.#{$component} {
  > [class*="filter"] {
    display: none;           // Hidden by default
    // ... styling for filter panel
    
    &.show {
      display: flex;         // Shown when withFilter opens it
    }
    
    &.hide {
      display: none;
    }
  }
}
```

---

## Bug Fixes

### Keyboard Focus Stealing ✅ Fixed

**Issue:** Clicking on search input or filter controls would immediately lose focus because the VList's keyboard navigation click handler was calling `component.element.focus()` on every click.

**Fix:** Updated `mtrl-addons/src/components/vlist/features/keyboard.ts` to skip focus stealing when clicking on interactive elements:

```javascript
component.element.addEventListener("click", (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  
  // Don't focus the list if clicking on interactive elements
  if (target.closest(
    'input, button, select, textarea, [contenteditable], ' +
    '.mtrl-search, .mtrl-textfield, .mtrl-select, [class*="filter"]'
  )) {
    return;
  }
  
  component.element?.focus();
});
```

---

## Implementation Files

### Completed Files

| File | Description |
|------|-------------|
| `mtrl-addons/src/components/vlist/features/layout.ts` | `withLayout` feature |
| `mtrl-addons/src/components/vlist/features/viewport.ts` | Updated for layout support |
| `mtrl-addons/src/components/vlist/features/search.ts` | `withSearch` feature - debounced search with events and API |
| `mtrl-addons/src/components/vlist/features/filter.ts` | `withFilter` feature - filter controls mapping with events and API |
| `mtrl-addons/src/components/vlist/features/keyboard.ts` | Fixed focus stealing bug |
| `mtrl-addons/src/components/vlist/features/index.ts` | Exports all features |
| `mtrl-addons/src/components/vlist/vlist.ts` | Applies withLayout, withSearch, withFilter when configured |
| `mtrl-addons/src/components/vlist/types.ts` | Added layout, search, filter types and API methods |
| `mtrl-addons/src/components/vlist/index.ts` | Exports all types and features |
| `mtrl-addons/src/styles/components/_vlist.scss` | Search bar and filter panel styles |
| `mtrl-addons/test/components/vlist-layout.test.ts` | 13 layout feature tests |
| `mtrl-addons/test/components/vlist-search.test.ts` | 24 search feature tests |
| `mtrl-addons/test/components/vlist-filter.test.ts` | 33 filter feature tests |
| `mtrl-addons/test/components/vlist-collection-integration.test.ts` | 11 collection adapter integration tests |
| `mtrl-addons/src/core/viewport/features/collection.ts` | Updated to pass search/filters to adapter automatically |
| `monorepo/.../users/list-with-layout.js` | Updated to use withSearch and withFilter |

---

## Migration Path

### Phase 1: withLayout ✅ Complete

VList can now manage its own layout. Applications can use:
```javascript
const vlist = createVList({
  layout: [...],
  // ...
})
```

### Phase 2: withSearch + withFilter ✅ Complete

Generic search and filter features added. Applications can use:
```javascript
const vlist = createVList({
  layout: [...],
  search: { toggleButton: 'search', searchBar: 'search-bar' },
  filter: { toggleButton: 'filter', panel: 'filter-input', controls: {...} },
  // ...
})
```

### Phase 3: list-with-layout.js Integration ✅ Complete

The `list-with-layout.js` wrapper has been updated to use `withSearch` and `withFilter` features:

```javascript
const vlist = createVList({
  // ...
  
  search: {
    toggleButton: 'search',
    searchBar: 'search-bar',
    debounce: 300,
    autoReload: false
  },
  
  filter: {
    toggleButton: 'filter',
    panel: 'filter-input',
    clearButton: 'filter-clear',
    controls: {
      country: 'filter-country'
    },
    autoReload: false
  },
})

// Event-driven handling
vlist.on('search:change', ({ query }) => {
  searchQuery = query
  mode = query ? 'search' : 'list'
  doReload()
})

vlist.on('filter:change', ({ filters: newFilters }) => {
  filter = newFilters
  doReload()
})
```

### Phase 4: Direct Usage 📋 Next

Replace wrapper pattern entirely. In `accounts/layout.js`:
```javascript
// Before: wrapper with complex composition
[createUserList, 'users', {}]

// After: direct VList with config
[createVList, 'users', {
  class: 'users',
  layout: createUserListLayout(),
  search: {...},
  filter: {...},
  template: userTemplate,
  collection: { adapter: { read: fetchUsers } }
}]
```

Application-specific logic (role switching, pending scroll, etc.) moves to event handlers in the app.

---

## Design Principles

1. **Layout-agnostic** - Features work with any layout structure
2. **Configurable** - Specify which layout elements to use by name
3. **Event-driven** - Emit events for app-specific handling
4. **Optional** - Features only active when configured
5. **Backward compatible** - Existing code continues to work

---

## Summary

The VList enhancement provides:

1. **`withLayout`** ✅ - Complete UI in a single component
2. **`withSearch`** ✅ - Generic search with any layout (24 tests)
3. **`withFilter`** ✅ - Generic filter with any layout (33 tests)
4. **VList Styles** ✅ - Search bar and filter panel CSS in `_vlist.scss`
5. **Keyboard Fix** ✅ - Focus not stolen from search/filter inputs
6. **list-with-layout.js** ✅ - Updated to use new features
7. **Adapter enhancement** ✅ - Search/filter passed to read function automatically (11 tests)
8. **Backward Compatibility** ✅ - Existing code continues to work

This makes VList a **production-ready, batteries-included** virtual list component while maintaining flexibility and the core strength in handling massive datasets efficiently.