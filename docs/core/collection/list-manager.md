# List Manager

The List Manager is a high-performance, virtualized list component for efficiently rendering large datasets with minimal DOM operations. It provides optimized scrolling, recycling of DOM elements, and support for both static data and API-connected data sources.

<!--
## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Usage](#usage)
  - [Basic Example](#basic-example)
  - [API-Connected Example](#api-connected-example)
  - [Page Loader](#page-loader)
- [API Reference](#api-reference)
  - [Core Functions](#core-functions)
  - [Configuration Options](#configuration-options)
  - [List Manager Interface](#list-manager-interface)
  - [Page Loader Interface](#page-loader-interface)
- [Architecture](#architecture)
  - [Core Components](#core-components)
  - [Rendering Strategies](#rendering-strategies)
  - [DOM Recycling](#dom-recycling)
  - [Scroll Handling](#scroll-handling)
  - [Item Measurement](#item-measurement)
- [Performance Optimizations](#performance-optimizations)
- [Utility Transforms](#utility-transforms)
- [Pagination Strategies](#pagination-strategies)
- [Best Practices](#best-practices)
- [Advanced Examples](#advanced-examples) -->

## Overview

The List Manager provides efficient virtualized list rendering, essential for displaying large datasets without performance degradation. It maintains a minimal DOM footprint by rendering only the visible items and those just outside the viewport, making it ideal for mobile applications and performance-critical scenarios.

## Features

- **Virtualized Rendering**: Only renders items visible in the viewport plus a configurable buffer
- **DOM Recycling**: Reuses DOM elements to minimize creation/destruction operations
- **Dynamic Item Heights**: Support for both fixed and variable height items
- **Efficient Scrolling**: Optimized scroll handling with customizable strategies
- **API Connection**: Built-in support for loading data from APIs
- **Pagination**: Supports cursor-based, page-based, and offset-based pagination
- **Memory Optimization**: Careful memory management to prevent leaks in long-lived applications
- **Highly Configurable**: Extensive options for adapting to various use cases

## Usage

### Basic Example

This example shows how to create a basic List Manager with static data:

```javascript
import { createListManager } from '../core/collection/list-manager';

// Container element for the list
const container = document.getElementById('my-list-container');

// Create list manager
const listManager = createListManager('items', container, {
  // Function to render each item
  renderItem: (item, index) => {
    const element = document.createElement('div');
    element.className = 'list-item';
    element.textContent = item.headline;
    return element;
  },
  
  // Static data (no API connection)
  staticItems: [
    { id: '1', headline: 'Item 1' },
    { id: '2', headline: 'Item 2' },
    { id: '3', headline: 'Item 3' },
    // ... more items
  ],
  
  // Default item height (optional, improves performance)
  itemHeight: 48,
  
  // Callback after items are loaded
  afterLoad: (result) => {
    console.log(`Loaded ${result.items.length} items`);
  }
});

// Later, when done with the list, clean up
// listManager.destroy();
```

### API-Connected Example

This example connects the list to a REST API:

```javascript
import { createListManager } from '../core/collection/list-manager';

const container = document.getElementById('api-list-container');

// Create an API-connected list manager
const listManager = createListManager('users', container, {
  // API base URL
  baseUrl: 'https://api.example.com/api',
  
  // Transform API response items
  transform: (user) => ({
    id: user.id,
    headline: user.name,
    supportingText: user.email,
    meta: user.role
  }),
  
  // Render function for items
  renderItem: (item, index) => {
    const element = document.createElement('div');
    element.className = 'user-item';
    
    element.innerHTML = `
      <h3>${item.headline}</h3>
      <p>${item.supportingText}</p>
      <span class="meta">${item.meta}</span>
    `;
    
    return element;
  },
  
  // Pagination configuration
  pagination: {
    strategy: 'cursor',  // 'cursor', 'page', or 'offset'
    perPageParamName: 'limit'
  },
  
  // Number of items per page
  pageSize: 20
});

// Initial load happens automatically on creation
// You can trigger manual refresh or load more:
listManager.refresh(); // Refresh entire list
listManager.loadMore(); // Load next page
```

### Page Loader

For more control over page loading, use the `createPageLoader` utility:

```javascript
import { createListManager, createPageLoader } from '../core/collection/list-manager';

// First, create a list and list manager
const myList = {
  component: document.getElementById('list-container'),
  items: [],
  setItems: (items) => {
    myList.items = items;
    // Update your UI with the new items
  }
};

const listManager = createListManager('posts', myList.component, {
  baseUrl: 'https://api.example.com/api',
  renderItem: (item) => { /* render function */ }
});

// Then create a page loader
const pageLoader = createPageLoader(myList, listManager, {
  onLoad: ({ loading, hasNext, hasPrev, items }) => {
    // Update loading indicators
    document.getElementById('loading-indicator').style.display = loading ? 'block' : 'none';
    
    // Update navigation buttons
    document.getElementById('next-button').disabled = !hasNext;
    document.getElementById('prev-button').disabled = !hasPrev;
    
    // Log the operation
    console.log(`Loaded ${items.length} items`);
  },
  pageSize: 25
});

// Use the page loader for navigation
document.getElementById('next-button').addEventListener('click', () => pageLoader.loadNext());
document.getElementById('prev-button').addEventListener('click', () => pageLoader.loadPrev());

// Initial load
pageLoader.load();
```

## API Reference

### Core Functions

#### `createListManager(collection, container, config)`

Creates a new list manager instance.

- **Parameters**:
  - `collection` (string): Collection name used for API endpoints
  - `container` (HTMLElement): Container element to render the list in
  - `config` (ListManagerConfig): Configuration object
- **Returns**: ListManager instance

#### `createPageLoader(list, listManager, config)`

Creates a page loader for handling pagination.

- **Parameters**:
  - `list` (object): List interface with `setItems` method
  - `listManager` (ListManager): List manager instance
  - `config` (object): Page loader configuration
- **Returns**: PageLoader instance

### Configuration Options

The `ListManagerConfig` interface provides extensive configuration options:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `transform` | Function | `(item) => item` | Transform function applied to items from the API |
| `baseUrl` | string | `null` | Base URL for API requests |
| `renderItem` | Function | (required) | Function to render an item element |
| `afterLoad` | Function | `undefined` | Callback function after loading items |
| `staticItems` | Array | `[]` | Items for static mode (no API) |
| `renderBufferSize` | number | `5` | Extra items to render outside the viewport |
| `overscanCount` | number | `3` | Extra items to keep in DOM but invisible |
| `itemHeight` | number | `48` | Default height for items in pixels |
| `dynamicItemSize` | boolean | `false` | Whether items can have different heights |
| `measureItemsInitially` | boolean | `true` | Whether to measure initial items |
| `pageSize` | number | `20` | Number of items per page |
| `loadThreshold` | number | `0.8` | Load more when scrolled past this fraction |
| `throttleMs` | number | `16` | Throttle scroll event (ms) |
| `dedupeItems` | boolean | `true` | Remove duplicate items based on ID |
| `scrollStrategy` | string | `'scroll'` | Scroll strategy: 'scroll', 'intersection', or 'hybrid' |
| `pagination` | object | `undefined` | Pagination configuration object |

### List Manager Interface

The `ListManager` interface provides these methods:

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `loadItems` | `params` (object) | Promise | Loads items with the given parameters |
| `loadMore` | - | Promise | Loads the next page of items |
| `refresh` | - | Promise | Refreshes the list with the latest data |
| `updateVisibleItems` | `scrollTop` (number, optional) | void | Updates visible items based on scroll position |
| `scrollToItem` | `itemId` (string), `position` ('start', 'center', 'end') | void | Scrolls to a specific item |
| `setItemHeights` | `heightsMap` (object) | boolean | Sets custom heights for specific items |
| `getCollection` | - | Collection | Gets the underlying collection |
| `getVisibleItems` | - | Array | Gets currently visible items |
| `getAllItems` | - | Array | Gets all items |
| `isLoading` | - | boolean | Checks if list is currently loading |
| `hasNextPage` | - | boolean | Checks if there are more items to load |
| `isApiMode` | - | boolean | Checks if list is in API mode |
| `setRenderHook` | `hookFn` (Function) | void | Sets a hook function for rendering |
| `destroy` | - | void | Destroys the list manager and cleans up |

### Page Loader Interface

The `PageLoader` interface provides these methods:

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `load` | `cursor` (string, optional), `addToHistory` (boolean, default: true) | Promise | Loads items at the given cursor position |
| `loadNext` | - | Promise | Loads the next page of items |
| `loadPrev` | - | Promise | Loads the previous page of items |
| `loading` | - | boolean | Whether the loader is currently loading |
| `cursor` | - | string | Current cursor position |

## Architecture

### Core Components

The List Manager is built from several specialized modules:

1. **List Manager** (`index.ts`): Main entry point and API surface
2. **Configuration** (`config.ts`): Configuration validation and processing
3. **DOM Elements** (`dom-elements.ts`): DOM element creation and manipulation
4. **Item Measurement** (`item-measurement.ts`): Item height calculation and caching
5. **Renderer** (`renderer.ts`): Efficient DOM updates and element recycling
6. **Scroll Tracker** (`scroll-tracker.ts`): Scroll position tracking strategies
7. **State Management** (`state.ts`): Internal state tracking and updates
8. **Recycling Pool** (`utils/recycling.ts`): DOM element reuse
9. **Visibility Calculation** (`utils/visibility.ts`): Determining visible items

### Rendering Strategies

The List Manager employs virtualized rendering with three key optimizations:

1. **Windowed Rendering**: Only renders items visible in the viewport plus a buffer
2. **Partial DOM Updates**: Only adds, removes, or repositions necessary elements
3. **Position Caching**: Precomputes and caches item positions for fast access

For large lists, it uses binary search to quickly locate visible items, dramatically improving performance.

### DOM Recycling

To minimize expensive DOM operations, the recycling system:

1. Pools removed elements by type
2. Reuses elements when scrolling or refreshing
3. Clears element state before reuse
4. Limits pool size to prevent memory leaks

### Scroll Handling

Three scroll tracking strategies are available:

1. **Traditional** (`scroll`): Uses optimized scroll events with throttling
2. **Intersection Observer** (`intersection`): Uses IntersectionObserver for more efficient tracking
3. **Hybrid** (`hybrid`): Combines approaches for optimal performance

The hybrid strategy uses IntersectionObserver for loading more content and minimal scroll events for position tracking.

### Item Measurement

For handling item heights, two approaches are available:

1. **Uniform Height**: All items have the same height (most efficient)
2. **Dynamic Height**: Each item's height is measured individually (more flexible)

For dynamic heights, measurements are cached and offsets are precomputed for efficient lookup.

## Performance Optimizations

The List Manager includes numerous performance optimizations:

1. **Throttled Scroll Handling**: Limits scroll event processing frequency
2. **RequestAnimationFrame**: Batches DOM updates to animation frames
3. **Binary Search**: Efficiently finds visible items in large datasets
4. **Partial Updates**: Only updates DOM elements that changed
5. **DOM Recycling**: Reuses DOM elements instead of creating new ones
6. **Position Caching**: Precomputes item positions for fast lookup
7. **Optimized Measurements**: Measures only when necessary and caches results
8. **Deduplication**: Avoids duplicate items when loading more data
9. **Lazy Loading**: Only loads data when needed
10. **Element Pool Limiting**: Prevents memory leaks from excessive recycling

## Utility Transforms

The List Manager provides transform functions for common collections:

### `transforms.track`

```javascript
transforms.track = (track) => ({
  id: track._id,
  headline: track.title || 'Untitled',
  supportingText: track.artist || 'Unknown Artist',
  meta: track.year?.toString() || ''
});
```

### `transforms.playlist`

```javascript
transforms.playlist = (playlist) => ({
  id: playlist._id,
  headline: playlist.name || 'Untitled Playlist',
  supportingText: `${playlist.tracks?.length || 0} tracks`,
  meta: playlist.creator || ''
});
```

### `transforms.country`

```javascript
transforms.country = (country) => ({
  id: country._id,
  headline: country.name || country.code,
  supportingText: country.continent || '',
  meta: country.code || ''
});
```

## Pagination Strategies

The List Manager supports three pagination strategies:

### Cursor-Based Pagination

- Uses a cursor token to retrieve the next set of items
- Most efficient for large datasets
- Configuration:
  ```javascript
  pagination: {
    strategy: 'cursor',
    cursorParamName: 'cursor' // Optional, defaults to 'cursor'
  }
  ```

### Page-Based Pagination

- Uses page numbers for navigation
- Common in many API implementations
- Configuration:
  ```javascript
  pagination: {
    strategy: 'page',
    pageParamName: 'page', // Optional, defaults to 'page'
    perPageParamName: 'per_page' // Optional, defaults to 'per_page'
  }
  ```

### Offset-Based Pagination

- Uses item offsets for precise positioning
- Good for random access in large lists
- Configuration:
  ```javascript
  pagination: {
    strategy: 'offset',
    offsetParamName: 'offset', // Optional, defaults to 'offset'
    limitParamName: 'limit' // Optional, defaults to 'limit'
  }
  ```

## Best Practices

For optimal performance:

1. **Specify Item Height**: Always provide `itemHeight` when item heights are consistent
2. **Use DOM Recycling**: Let the List Manager handle element reuse
3. **Keep Items Simple**: Complex item rendering slows down scrolling
4. **Virtualize Large Lists**: Always use virtualization for lists over 100 items
5. **Debounce External Updates**: Avoid frequent external updates to the list
6. **Use Image Loading Callbacks**: Update heights after images load if sizes vary
7. **Limit Item Props**: Keep item objects small with only necessary properties
8. **Use Appropriate Strategy**: Choose scroll strategy based on device performance

## Advanced Examples

### Variable Height Items

```javascript
const listManager = createListManager('products', container, {
  dynamicItemSize: true, // Enable variable height measurement
  
  renderItem: (item, index) => {
    const element = document.createElement('div');
    element.className = 'product-item';
    element.innerHTML = `
      <h3>${item.name}</h3>
      <p>${item.description}</p>
      <img src="${item.image}" class="product-image">
    `;
    
    // If images can change height, update measurement after load
    const img = element.querySelector('img');
    if (img) {
      img.onload = () => {
        // Update height for this specific item
        listManager.setItemHeights({
          [item.id]: element.offsetHeight
        });
      };
    }
    
    return element;
  }
});
```

### IntersectionObserver-Based Loading

```javascript
const listManager = createListManager('feed', container, {
  scrollStrategy: 'intersection', // Use IntersectionObserver
  loadThreshold: 0.9, // Load when user is 90% through content
  
  // Other configuration...
  renderItem: (item) => { /* ... */ }
});
```

### Custom Render Hook

```javascript
const listManager = createListManager('messages', container, {
  renderItem: (message) => {
    const element = document.createElement('div');
    element.className = 'message';
    element.textContent = message.text;
    return element;
  }
});

// Add custom behavior to each rendered element
listManager.setRenderHook((item, element) => {
  // Add interaction handlers
  element.addEventListener('click', () => {
    console.log('Clicked message:', item.id);
  });
  
  // Add custom styling based on message state
  if (item.isRead) {
    element.classList.add('message--read');
  } else {
    element.classList.add('message--unread');
  }
});
```