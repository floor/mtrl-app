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
- **Intelligent Placeholders**: Automatic placeholder generation during fast scrolling for seamless UX
- **Element Reference Caching**: Optimized renderItem performance with cached child element references
- **Dynamic Item Heights**: Support for both fixed and variable height items
- **Efficient Scrolling**: Optimized scroll handling with customizable strategies
- **API Connection**: Built-in support for loading data from APIs
- **Pagination**: Supports cursor-based, page-based, and offset-based pagination
- **Memory Optimization**: Careful memory management to prevent leaks in long-lived applications
- **SCSS-based Styling**: Clean separation of concerns with SCSS variables for theming
- **Highly Configurable**: Extensive options for adapting to various use cases

## Navigation and Scrolling

The List Manager provides advanced navigation capabilities for both static and dynamic lists with intelligent loading and positioning.

### Scroll to Index (Recommended)

The most powerful navigation method that handles loading and positioning automatically:

```javascript
// Navigate to index 50,000 (0-based) with automatic loading
await listManager.scrollToIndex(49999, "start", false);

// Center item 1000 in viewport with smooth animation
await listManager.scrollToIndex(999, "center", true);

// Jump to end of item 25,000
await listManager.scrollToIndex(24999, "end", false);
```

**Key Features:**

- **Automatic Loading**: Loads necessary pages to display the target index
- **Precise Positioning**: Uses exact viewport calculations for perfect alignment
- **Parallel Loading**: Loads all viewport pages simultaneously for no visual glitches
- **Background Preloading**: Preloads adjacent pages for smooth navigation
- **Works with Any Page Size**: Adapts to different page sizes automatically

### Scroll to Item by ID

Navigate to items using their unique identifier with backend lookup:

```javascript
// Find and navigate to user ID "user_12345"
await listManager.scrollToItemById("user_12345", "start", false);

// Center a specific product with smooth animation
await listManager.scrollToItemById("product_789", "center", true);
```

**Requirements:**

- Backend must implement `findUserPosition()` API endpoint
- Endpoint: `/api/{collection}/find-position/{itemId}`
- Returns: `{ exists: boolean, index: number, page: number }`

### Legacy Scroll to Item

For items already loaded in memory:

```javascript
// Only works if item is already loaded
listManager.scrollToItem("item_123", "start", true);
```

**Limitation**: Only works with items currently in the list manager's memory.

### Page Navigation

Direct page navigation with intelligent loading:

```javascript
// Jump to page 1000 with automatic positioning
await listManager.loadPage(1000);

// Get current page
const currentPage = listManager.getCurrentPage();

// Listen for page changes
const cleanup = listManager.onPageChange((page) => {
  console.log(`Now on page ${page}`);
});

// Clean up listener when done
cleanup();
```

## Usage

### Basic Example

This example shows how to create a basic List Manager with static data:

```javascript
import { createListManager } from "../core/collection/list-manager";

// Container element for the list
const container = document.getElementById("my-list-container");

// Create list manager
const listManager = createListManager("items", container, {
  // Function to render each item
  renderItem: (item, index) => {
    const element = document.createElement("div");
    element.className = "list-item";
    element.textContent = item.headline;
    return element;
  },

  // Static data (no API connection)
  staticItems: [
    { id: "1", headline: "Item 1" },
    { id: "2", headline: "Item 2" },
    { id: "3", headline: "Item 3" },
    // ... more items
  ],

  // Default item height (optional, improves performance)
  itemHeight: 48,

  // Callback after items are loaded
  afterLoad: (result) => {
    console.log(`Loaded ${result.items.length} items`);
  },
});

// Later, when done with the list, clean up
// listManager.destroy();
```

### API-Connected Example

This example connects the list to a REST API:

```javascript
import { createListManager } from "../core/collection/list-manager";

const container = document.getElementById("api-list-container");

// Create an API-connected list manager
const listManager = createListManager("users", container, {
  // API base URL
  baseUrl: "https://api.example.com/api",

  // Transform API response items
  transform: (user) => ({
    id: user.id,
    headline: user.name,
    supportingText: user.email,
    meta: user.role,
  }),

  // Render function for items
  renderItem: (item, index) => {
    const element = document.createElement("div");
    element.className = "user-item";

    element.innerHTML = `
      <h3>${item.headline}</h3>
      <p>${item.supportingText}</p>
      <span class="meta">${item.meta}</span>
    `;

    return element;
  },

  // Pagination configuration
  pagination: {
    strategy: "cursor", // 'cursor', 'page', or 'offset'
    perPageParamName: "limit",
  },

  // Number of items per page
  pageSize: 20,
});

// Initial load happens automatically on creation
// You can trigger manual refresh or load more:
listManager.refresh(); // Refresh entire list
listManager.loadMore(); // Load next page
```

### Page Loader

For more control over page loading, use the `createPageLoader` utility:

```javascript
import {
  createListManager,
  createPageLoader,
} from "../core/collection/list-manager";

// First, create a list and list manager
const myList = {
  component: document.getElementById("list-container"),
  items: [],
  setItems: (items) => {
    myList.items = items;
    // Update your UI with the new items
  },
};

const listManager = createListManager("posts", myList.component, {
  baseUrl: "https://api.example.com/api",
  renderItem: (item) => {
    /* render function */
  },
});

// Then create a page loader
const pageLoader = createPageLoader(myList, listManager, {
  onLoad: ({ loading, hasNext, hasPrev, items }) => {
    // Update loading indicators
    document.getElementById("loading-indicator").style.display = loading
      ? "block"
      : "none";

    // Update navigation buttons
    document.getElementById("next-button").disabled = !hasNext;
    document.getElementById("prev-button").disabled = !hasPrev;

    // Log the operation
    console.log(`Loaded ${items.length} items`);
  },
  pageSize: 25,
});

// Use the page loader for navigation
document
  .getElementById("next-button")
  .addEventListener("click", () => pageLoader.loadNext());
document
  .getElementById("prev-button")
  .addEventListener("click", () => pageLoader.loadPrev());

// Initial load
pageLoader.load();
```

## Placeholder System

The List Manager includes an intelligent placeholder system that provides immediate visual feedback during fast scrolling, eliminating empty spaces and creating a seamless user experience.

### How Placeholders Work

When users scroll quickly or jump to distant parts of the list, placeholders are generated instantly to fill the visible area while real data loads in the background. This creates the perception of infinite, immediately-available content.

### Placeholder Modes

The system supports multiple visual styles:

```javascript
// Change placeholder mode globally
setPlaceholderMode("masked"); // ▪▪▪▪▪ ▪▪▪▪ Masked text (recommended)
setPlaceholderMode("skeleton"); // ▁▁▁▁▁ Loading bars
setPlaceholderMode("blank"); // Empty spaces (minimal)
setPlaceholderMode("dots"); // • • • Dotted pattern
setPlaceholderMode("realistic"); // Fake names (avoid for UX)
```

### Styling Placeholders

Placeholder appearance is controlled via SCSS variables for easy theming:

```scss
// Placeholder styling variables
$placeholder-opacity: 0.6 !default;
$placeholder-opacity-skeleton: 0.8 !default;
$placeholder-opacity-masked: 0.7 !default;
$placeholder-opacity-subtle: 0.4 !default;
$placeholder-background-alpha: 0.4 !default;
$placeholder-shimmer-alpha: 0.2 !default;
$placeholder-animation-speed: 1.5s !default;
```

### Placeholder Constants

Configuration for placeholder appearance and behavior:

| Constant                       | Default                   | Description                         |
| ------------------------------ | ------------------------- | ----------------------------------- |
| `PLACEHOLDER.ENABLED`          | `true`                    | Enable placeholder system           |
| `PLACEHOLDER.PLACEHOLDER_FLAG` | `"__isPlaceholder"`       | Property to mark placeholder items  |
| `PLACEHOLDER.PLACEHOLDER_MODE` | `"masked"`                | Default visual style                |
| `PLACEHOLDER.MASK_CHARACTER`   | `"■"`                     | Character for masked mode           |
| `PLACEHOLDER.SKELETON_CHARS`   | `"▁▁▁▁▁"`                 | Loading bar characters              |
| `PLACEHOLDER.BLANK_CHARS`      | `" "`                     | Invisible space characters          |
| `PLACEHOLDER.DOT_CHARS`        | `"• • •"`                 | Dot pattern characters              |
| `PLACEHOLDER.FALLBACK_NAMES`   | `["Alex", "Jordan", ...]` | Fallback data for realistic mode    |
| `PLACEHOLDER.FALLBACK_DOMAINS` | `["example.com", ...]`    | Fallback domains for realistic mode |

### Automatic Integration

Placeholders are completely automatic and require no additional configuration:

```javascript
const listManager = createListManager("users", container, {
  renderItem: (user, index, recycledElement) => {
    // Your normal render function
    // Placeholders are handled automatically
    const element = document.createElement("div");
    element.textContent = user.name;
    return element;
  },
});
```

### Debug Tools

For development and testing:

```javascript
// Available in browser console
setPlaceholderMode("skeleton"); // Change mode dynamically
// Test different modes: 'masked', 'skeleton', 'blank', 'dots', 'realistic'
```

## Speed Threshold Detection

The List Manager features an intelligent speed threshold detection system that optimizes data loading based on scroll velocity. This system provides seamless performance during both normal scrolling and rapid navigation while maintaining fluid user experience.

### How Speed Detection Works

The system monitors scroll velocity in real-time and makes intelligent decisions about when to load data:

```javascript
// Speed threshold: 5 pixels per millisecond
const FAST_SCROLL_THRESHOLD = 5.0; // px/ms

// Example speeds:
// Mouse wheel: 0.1 - 2.0 px/ms (slow - loads immediately)
// Scrollbar drag: 1000 - 20000 px/ms (fast - skips loading)
// Touch scroll: 0.5 - 10 px/ms (varies - adaptive loading)
```

### Two-Phase Loading Strategy

The system uses a hybrid approach combining immediate speed-based decisions with scroll-stop detection:

#### Phase 1: Real-Time Speed Analysis

- **Slow scrolling (≤5px/ms)**: Load data immediately for responsive experience
- **Fast scrolling (>5px/ms)**: Skip loading to maintain smooth scrolling performance

#### Phase 2: Scroll-Stop Detection

- **After fast scrolling**: Monitor for scroll events stopping
- **100ms timeout**: When no scroll events occur for 100ms after fast scrolling
- **Automatic loading**: Trigger data loading for missing viewport content

### Usage Examples

The speed detection is completely automatic and requires no configuration:

```javascript
const listManager = createListManager("users", container, {
  renderItem: (user, index) => {
    // Your normal render function
    // Speed detection handles loading automatically
    const element = document.createElement("div");
    element.textContent = user.name;
    return element;
  },

  // Speed detection works with all pagination strategies
  pagination: {
    strategy: "offset", // Recommended for speed detection
    perPageParamName: "limit",
  },
});

// Speed detection handles these scenarios automatically:
// ✅ Mouse wheel scrolling → immediate loading
// ✅ Scrollbar dragging → loading after scroll stops
// ✅ Touch/gesture scrolling → adaptive loading
// ✅ Programmatic scrolling → context-aware loading
```

### Performance Benefits

The speed threshold system provides several performance advantages:

#### Smooth Scrolling

- **No loading interruptions**: Fast scrolling never blocks for API requests
- **Reduced jank**: Eliminates scroll stuttering during rapid navigation
- **Consistent frame rates**: Maintains 60fps during high-velocity scrolling

#### Intelligent Loading

- **Context-aware**: Loads data only when users pause to read content
- **Bandwidth optimization**: Avoids loading data that users scroll past quickly
- **Battery efficiency**: Reduces CPU/network activity during fast scrolling

#### Adaptive Performance

- **Input method detection**: Automatically adapts to mouse wheel vs. scrollbar vs. touch
- **Velocity-based decisions**: Makes loading decisions based on actual scroll speed
- **Predictive loading**: Loads data when users are likely to stop and read

### Technical Implementation

The speed detection system uses advanced scroll tracking with multiple detection mechanisms:

#### Velocity Tracking

```javascript
// Real-time velocity calculation
const velocity = scrollDistance / timeDelta; // px/ms

// Speed state determination
const speedState = velocity > FAST_SCROLL_THRESHOLD ? "fast" : "slow";

// Immediate loading decision
if (speedState === "slow") {
  loadViewportData(); // Load immediately
} else {
  skipLoading(); // Skip for smooth scrolling
}
```

#### Scroll-Stop Detection

```javascript
// Hybrid timeout mechanism
if (speedState === "fast") {
  // Set timeout for scroll-stop detection
  scrollStopTimeout = setTimeout(() => {
    // Emit synthetic 'slow' event after 100ms of no scroll events
    emitSpeedThresholdEvent({
      speed: 0,
      scrollTop: currentPosition,
      crossedThreshold: "slow",
      timestamp: Date.now(),
    });
  }, 100);
}
```

#### Observer Pattern Integration

```javascript
// Register for speed threshold events
const cleanup = scrollTracker.onSpeedThreshold((event) => {
  // Check for missing viewport data
  if (needsViewportData()) {
    loadMissingData(); // Load data for current viewport
  }
});

// Event types:
// - speed: Current scroll velocity (px/ms)
// - scrollTop: Current scroll position
// - crossedThreshold: 'slow' (when data should load)
// - timestamp: Event timestamp for debugging
```

### Configuration Options

The speed detection system works with configurable thresholds and timing:

| Setting                 | Default | Description                                         |
| ----------------------- | ------- | --------------------------------------------------- |
| `FAST_SCROLL_THRESHOLD` | `5.0`   | Speed threshold in px/ms (5 pixels per millisecond) |
| `SCROLL_STOP_DELAY`     | `100`   | Timeout in ms to detect scroll stop                 |
| `throttleMs`            | `16`    | Scroll event throttling (60fps)                     |
| `pagination.strategy`   | `auto`  | Works best with `"offset"` strategy                 |

### Compatibility

Speed threshold detection is compatible with all List Manager features:

- **✅ All pagination strategies**: Works with cursor, page, and offset-based pagination
- **✅ All scroll methods**: Mouse wheel, scrollbar, touch, programmatic scrolling
- **✅ All navigation**: `scrollToIndex()`, `scrollToItemById()`, `loadPage()`
- **✅ Static and API data**: Works with both static items and API-connected lists
- **✅ All browsers**: Graceful fallback for older browser compatibility

### Debugging Speed Detection

For development and troubleshooting:

```javascript
// Enable debug logging (in development)
// Check browser console for speed detection logs:
// - Speed calculations and thresholds
// - Loading decisions and timing
// - Scroll-stop detection events
// - Performance metrics

// Example debug output:
// 🔍 Speed: 2.3px/ms ≤ 5px/ms → Loading immediately
// ⏸️ Speed: 1200px/ms > 5px/ms → Skipping load
// 🛑 Scroll stopped after fast scrolling → Loading data
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

> **📝 Note:** Many default values come from the [Constants Configuration](#constants-configuration) system. You can override any constant by specifying it in your config.

| Option                       | Type     | Default          | Description                                                                  |
| ---------------------------- | -------- | ---------------- | ---------------------------------------------------------------------------- |
| `transform`                  | Function | `(item) => item` | Transform function applied to items from the API                             |
| `baseUrl`                    | string   | `null`           | Base URL for API requests                                                    |
| `renderItem`                 | Function | (required)       | Function to render an item element                                           |
| `afterLoad`                  | Function | `undefined`      | Callback function after loading items                                        |
| `staticItems`                | Array    | `[]`             | Items for static mode (no API)                                               |
| `renderBufferSize`           | number   | `5`              | Extra items to render outside the viewport                                   |
| `overscanCount`              | number   | `3`              | Extra items to keep in DOM but invisible                                     |
| `itemHeight`                 | number   | `84`             | Default height for items in pixels                                           |
| `dynamicItemSize`            | boolean  | `false`          | Whether items can have different heights                                     |
| `measureItemsInitially`      | boolean  | `true`           | Whether to measure initial items                                             |
| `pageSize`                   | number   | `20`             | Number of items per page                                                     |
| `loadThreshold`              | number   | `0.8`            | Load more when scrolled past this fraction                                   |
| `throttleMs`                 | number   | `16`             | Throttle scroll event (ms)                                                   |
| `dedupeItems`                | boolean  | `true`           | Remove duplicate items based on ID                                           |
| `scrollStrategy`             | string   | `'scroll'`       | Scroll strategy: 'scroll', 'intersection', or 'hybrid'                       |
| `pagination`                 | object   | `undefined`      | Pagination configuration object                                              |
| `adjacentPagesPreloadBefore` | number   | `1`              | Pages to preload before viewport for smooth backward navigation              |
| `adjacentPagesPreloadAfter`  | number   | `1`              | Pages to preload after viewport for smooth forward navigation                |
| `adjacentPagesPreload`       | number   | `2`              | Legacy: total adjacent pages to preload (split between before/after)         |
| `placeholderMode`            | string   | `'masked'`       | Placeholder visual style: 'masked', 'skeleton', 'blank', 'dots', 'realistic' |

> **🔗 Constants Reference:** Values marked with default numbers (like `84`, `20`, `5`, `3`, `16`, `0.8`) are sourced from the constants system and can be customized via `RENDERING.*`, `PAGINATION.*`, `SCROLL.*` constants.

### List Manager Interface

The `ListManager` interface provides these methods:

| Method               | Parameters                                                                    | Returns  | Description                                      |
| -------------------- | ----------------------------------------------------------------------------- | -------- | ------------------------------------------------ |
| `loadItems`          | `params` (object)                                                             | Promise  | Loads items with the given parameters            |
| `loadPage`           | `pageNumber` (number), `options` (object, optional)                           | Promise  | Loads a specific page with precise positioning   |
| `loadNext`           | -                                                                             | Promise  | Loads the next page of items                     |
| `refresh`            | -                                                                             | Promise  | Refreshes the list with the latest data          |
| `updateVisibleItems` | `scrollTop` (number, optional)                                                | void     | Updates visible items based on scroll position   |
| `scrollToItem`       | `itemId` (string), `position` ('start', 'center', 'end'), `animate` (boolean) | void     | Scrolls to a specific item (must be loaded)      |
| `scrollToIndex`      | `index` (number), `position` ('start', 'center', 'end'), `animate` (boolean)  | Promise  | Scrolls to a specific 0-based index with loading |
| `scrollToItemById`   | `itemId` (string), `position` ('start', 'center', 'end'), `animate` (boolean) | Promise  | Scrolls to item by ID using backend lookup       |
| `getCurrentPage`     | -                                                                             | number   | Gets the current page number                     |
| `onPageChange`       | `callback` (Function)                                                         | Function | Registers page change callback, returns cleanup  |
| `getState`           | -                                                                             | object   | Gets current internal state (read-only)          |
| `getVisibleItems`    | -                                                                             | Array    | Gets currently visible items                     |
| `getAllItems`        | -                                                                             | Array    | Gets all items                                   |
| `isLoading`          | -                                                                             | boolean  | Checks if list is currently loading              |
| `hasNextPage`        | -                                                                             | boolean  | Checks if there are more items to load           |
| `destroy`            | -                                                                             | void     | Destroys the list manager and cleans up          |

### Page Loader Interface

The `PageLoader` interface provides these methods:

| Method     | Parameters                                                           | Returns | Description                              |
| ---------- | -------------------------------------------------------------------- | ------- | ---------------------------------------- |
| `load`     | `cursor` (string, optional), `addToHistory` (boolean, default: true) | Promise | Loads items at the given cursor position |
| `loadNext` | -                                                                    | Promise | Loads the next page of items             |
| `loadPrev` | -                                                                    | Promise | Loads the previous page of items         |
| `loading`  | -                                                                    | boolean | Whether the loader is currently loading  |
| `cursor`   | -                                                                    | string  | Current cursor position                  |

## Module API Reference

### Data Loading Manager

Created with `createDataLoadingManager(deps)`:

| Method      | Parameters            | Returns                | Description                                     |
| ----------- | --------------------- | ---------------------- | ----------------------------------------------- |
| `loadItems` | `params` (LoadParams) | Promise<{items, meta}> | Loads items with optional pagination parameters |
| `refresh`   | -                     | Promise<void>          | Clears and reloads all data from scratch        |

**Dependencies Required:**

- `state`, `config`, `elements`, `collection`, `adapter`, `itemsCollection`
- `getPaginationFlags()`, `setPaginationFlags()`, `replaceFakeItemsWithReal()`

### Pagination Manager

Created with `createPaginationManager(deps)`:

| Method                       | Parameters            | Returns                   | Description                            |
| ---------------------------- | --------------------- | ------------------------- | -------------------------------------- |
| `loadPage`                   | `pageNumber` (number) | Promise<{hasNext, items}> | Jump to specific page with positioning |
| `loadNext`                   | -                     | Promise<{hasNext, items}> | Load next page in sequence             |
| `loadPreviousPage`           | -                     | Promise<{hasPrev, items}> | Load previous page in sequence         |
| `checkPageBoundaries`        | `scrollTop` (number)  | void                      | Check if boundary loading is needed    |
| `scheduleScrollStopPageLoad` | `targetPage` (number) | void                      | Load page when scrolling stops         |
| `getPaginationFlags`         | -                     | object                    | Get current pagination state flags     |
| `setPaginationFlags`         | `flags` (object)      | void                      | Update pagination state flags          |
| `cleanup`                    | -                     | void                      | Clean up timers and event listeners    |

**Dependencies Required:**

- `state`, `config`, `elements`, `container`, `itemsCollection`, `adapter`
- `itemMeasurement`, `renderer`, `loadItems()`, `updateVisibleItems()`

### Rendering Manager

Created with `createRenderingManager(deps)`:

| Method                                    | Parameters                               | Returns                      | Description                              |
| ----------------------------------------- | ---------------------------------------- | ---------------------------- | ---------------------------------------- |
| `calculateItemPositionsWithVirtualOffset` | `items`, `visibleRange`, `virtualOffset` | Array<{index, item, offset}> | Calculate positions with virtual offsets |
| `renderItemsWithVirtualPositions`         | `positions`                              | void                         | Render items at calculated positions     |

**Dependencies Required:**

- `config`, `elements`

### Lifecycle Manager

Created with `createLifecycleManager(deps)`:

| Method       | Parameters | Returns            | Description                                           |
| ------------ | ---------- | ------------------ | ----------------------------------------------------- |
| `initialize` | -          | Function (cleanup) | Initialize all components and return cleanup function |

**Dependencies Required:**

- `state`, `config`, `elements`, `container`, `updateVisibleItems()`
- `checkLoadMore()`, `loadNext()`, `loadPage()`, `itemsCollection`
- `initialItems`, `cleanupFunctions`, `createScrollTracker()`, etc.

### Visibility Manager

Handles visibility calculations and placeholder generation:

| Method                  | Parameters                                                | Returns      | Description                                  |
| ----------------------- | --------------------------------------------------------- | ------------ | -------------------------------------------- |
| `calculateVisibleRange` | `scrollTop`, `containerHeight`, `itemCount`, `itemHeight` | {start, end} | Calculate which items should be visible      |
| `updateVisibleItems`    | `scrollTop`, `isPageJump`                                 | void         | Update visible items and handle placeholders |

### Data Generator

Placeholder and fake data generation:

| Method                   | Parameters           | Returns | Description                          |
| ------------------------ | -------------------- | ------- | ------------------------------------ |
| `generateFakeItem`       | `index`, `realItems` | object  | Generate a single placeholder item   |
| `setPlaceholderMode`     | `mode`               | void    | Change placeholder visual style      |
| `analyzePatterns`        | `realItems`          | void    | Learn patterns from real data        |
| `addPlaceholderClass`    | `element`, `item`    | void    | Apply placeholder styling to element |
| `removePlaceholderClass` | `element`            | void    | Remove placeholder styling           |

**Available in Browser Console:**

```javascript
setPlaceholderMode("skeleton"); // Change mode dynamically
// Available modes: 'masked', 'skeleton', 'blank', 'dots', 'realistic'
```

## Constants Configuration

The List Manager uses a centralized constants system (`constants.ts`) that controls behavior across all modules. These constants can be imported and used to customize the list manager's operation.

### Rendering Constants

Virtual rendering and item visibility calculations:

| Constant                               | Default | Description                                   |
| -------------------------------------- | ------- | --------------------------------------------- |
| `RENDERING.DEFAULT_ITEM_HEIGHT`        | `84px`  | Default item height in pixels                 |
| `RENDERING.LEGACY_ITEM_HEIGHT`         | `48px`  | Legacy compatibility height                   |
| `RENDERING.DEFAULT_RENDER_BUFFER_SIZE` | `5`     | Extra items rendered outside viewport         |
| `RENDERING.DEFAULT_OVERSCAN_COUNT`     | `3`     | Items kept in DOM but invisible               |
| `RENDERING.DEFAULT_CONTAINER_HEIGHT`   | `400px` | Fallback container height                     |
| `RENDERING.RECYCLING_POOL_LIMIT`       | `50`    | Max recycled elements to prevent memory leaks |

### Collection and State Constants

Internal collection behavior and state management:

| Constant                              | Default | Description                       |
| ------------------------------------- | ------- | --------------------------------- |
| `COLLECTION.DEFAULT_INITIAL_CAPACITY` | `50`    | Initial collection capacity       |
| `COLLECTION.BINARY_SEARCH_THRESHOLD`  | `500`   | Use binary search above this size |
| `COLLECTION.SMALL_LIST_THRESHOLD`     | `10`    | Simple rendering for small lists  |
| `TIMING.RAF_DELAY`                    | `50ms`  | RequestAnimationFrame delay       |
| `TIMING.MEASUREMENT_TIMEOUT`          | `100ms` | Timeout for measurements          |
| `TIMING.PAGE_CHANGE_INTERVAL`         | `100ms` | Page change detection interval    |

### API Parameter Constants

Default parameter names for API requests:

| Constant                     | Default      | Description              |
| ---------------------------- | ------------ | ------------------------ |
| `API.DEFAULT_PER_PAGE_PARAM` | `"per_page"` | Page size parameter name |
| `API.DEFAULT_LIMIT_PARAM`    | `"limit"`    | Limit parameter name     |
| `API.DEFAULT_OFFSET_PARAM`   | `"offset"`   | Offset parameter name    |
| `API.DEFAULT_CURSOR_PARAM`   | `"cursor"`   | Cursor parameter name    |

### Customizing Constants

Override default values in your list manager configuration:

```javascript
const listManager = createListManager("items", container, {
  itemHeight: 120, // Override DEFAULT_ITEM_HEIGHT
  pageSize: 50, // Override DEFAULT_PAGE_SIZE
  renderBufferSize: 10, // Override DEFAULT_RENDER_BUFFER_SIZE
  throttleMs: 8, // Override DEFAULT_THROTTLE_MS (~120fps)
  placeholderMode: "skeleton", // Override PLACEHOLDER_MODE
});
```

## Architecture

### Core Components

The List Manager is built from several specialized modules that work together to provide high-performance virtualized list rendering:

#### **Data Loading Module** (`data-loading/`)

Handles all API interactions and data management:

- **Smart Caching**: Prevents unnecessary API calls with intelligent deduplication
- **Page Boundary Detection**: Automatically loads adjacent pages during scrolling
- **Corruption Protection**: Guards against concurrent loads that could corrupt state
- **Static/API Mode**: Seamless switching between static data and live API data
- **Response Processing**: Transforms API responses and handles pagination metadata

```javascript
// Automatic data loading with boundary detection
const dataLoader = createDataLoadingManager({
  state,
  config,
  elements,
  collection,
  adapter,
});

// Manual data operations
await dataLoader.loadItems({ page: 5 });
await dataLoader.refresh(); // Clear and reload
```

#### **Pagination Module** (`pagination/`)

Advanced pagination system supporting multiple strategies:

- **Page Jumping**: Instant navigation to any page with proper positioning
- **Boundary Loading**: Preloads adjacent pages for smooth scrolling
- **Strategy Support**: Cursor, page-based, and offset pagination
- **Sequential Loading**: Loads multiple pages in sequence for better UX
- **Bounds Checking**: Validates page requests against available data

```javascript
// Page-based navigation
const paginator = createPaginationManager(deps);

await paginator.loadPage(100000); // Jump to page 100,000
await paginator.loadPreviousPage(); // Load previous page
await paginator.loadNext(); // Load next page
```

#### **Rendering Module** (`rendering/`)

Handles virtual positioning and DOM rendering:

- **Virtual Positioning**: Calculates item positions based on natural coordinates
- **Batch DOM Updates**: Uses DocumentFragment for efficient rendering
- **Placeholder Integration**: Automatically applies placeholder styling
- **Position Caching**: Caches calculated positions for performance
- **Natural Coordinates**: Uses real pixel positions (no scaling/transforms)

```javascript
// Virtual rendering with custom positions
const renderer = createRenderingManager({ config, elements });

const positions = renderer.calculateItemPositionsWithVirtualOffset(
  items,
  visibleRange,
  virtualOffset
);
renderer.renderItemsWithVirtualPositions(positions);
```

#### **Lifecycle Module** (`lifecycle/`)

Manages initialization, cleanup, and component lifecycle:

- **Initialization Sequencing**: Proper startup order for all components
- **Event Management**: Sets up and tears down all event listeners
- **Resize Handling**: Responds to container size changes with ResizeObserver
- **Sequential Loading**: Loads initial data ranges for smooth experience
- **Memory Management**: Prevents memory leaks with proper cleanup

```javascript
// Complete lifecycle management
const lifecycle = createLifecycleManager(deps);

const cleanup = lifecycle.initialize(); // Start everything
// ... list is active ...
cleanup(); // Clean shutdown
```

#### **Visibility Calculation** (`visibility/`)

Determines which items should be rendered:

- **Optimized Calculations**: Uses binary search for large datasets
- **Buffer Management**: Includes configurable overscan for smooth scrolling
- **Placeholder Generation**: Creates placeholders for missing data ranges
- **Range Tracking**: Efficiently tracks visible range changes
- **Position-Based Logic**: Works with natural coordinate positioning

#### **Data Generator** (`data-generator.ts`)

Intelligent placeholder system for seamless UX:

- **Multiple Modes**: Skeleton, masked, dots, realistic placeholder styles
- **Pattern Analysis**: Learns from real data to create believable placeholders
- **Automatic Integration**: Works transparently with existing render functions
- **SCSS Theming**: Fully themeable via SCSS variables
- **Debug Tools**: Runtime debugging and mode switching capabilities

#### **Scrolling Module** (`scrolling/`)

Handles scroll tracking and position management:

- **Multiple Strategies**: Traditional scroll events, IntersectionObserver, or hybrid
- **Throttling**: Configurable throttling to prevent performance issues
- **Position Tracking**: Maintains accurate scroll position state
- **Load Trigger Detection**: Determines when to load more content
- **Smooth Integration**: Works with all pagination strategies

#### **Events Module** (`events/`)

Centralized event management system:

- **Page Events**: Handles page-specific event coordination
- **Event Cleanup**: Proper event listener cleanup to prevent memory leaks
- **Centralized Management**: Single source of truth for all event handling
- **Performance Optimization**: Efficient event delegation and throttling

#### **State Management** (`state.ts`)

Centralized state container for the entire list manager:

- **Immutable Updates**: Safe state updates that prevent race conditions
- **Loading States**: Tracks loading, error, and success states
- **Pagination State**: Manages current page, cursor, and navigation state
- **Configuration State**: Processed and validated configuration options
- **Performance Metrics**: Internal performance tracking and optimization

#### **Utility Modules** (`utils/`)

Specialized utilities for specific operations:

- **Visibility Calculations** (`visibility.ts`): Advanced algorithms for determining visible items
- **DOM Recycling** (`recycling.ts`): Element reuse system for performance
- **Element Caching**: Caches DOM queries for maximum performance
- **Binary Search**: Efficient algorithms for large dataset operations

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

## Advanced Features

### Intelligent Viewport Loading

The List Manager uses sophisticated viewport calculation to load exactly the right data:

**Precise Viewport Calculation:**

- Calculates which pages are needed based on actual scroll position and viewport height
- Accounts for partial items and scroll position variations with buffer zones
- Adapts automatically to any page size (1 item per page to thousands)

**Parallel Loading:**

- Loads ALL viewport pages simultaneously using `Promise.all()`
- Eliminates visual glitches where target page appears first, then fills in
- Provides instant visual feedback with smooth user experience

**Dynamic Buffer-Based Boundary Detection:**

- Automatically adapts buffer size based on viewport and page size
- Calculates: `bufferPages = Math.max(1, Math.ceil(itemsInViewport / pageSize))`
- Triggers loading when within buffer distance of data edges
- Works perfectly with any page size configuration

### Scroll Jump System

Advanced navigation system for jumping to any position instantly:

```javascript
// Jump to index 500,000 with automatic viewport loading
await listManager.scrollToIndex(499999, "start", false);

// Uses precise viewport calculation to load exactly needed pages
// Preloads adjacent pages for smooth navigation
// Handles any page size automatically
```

**Key Improvements:**

- **Mathematical Precision**: Uses exact calculations, not approximations
- **Concurrent-Safe**: Prevents race conditions between scroll systems
- **Page-Size Agnostic**: Works with pageSize=1 to pageSize=1000+
- **Gap Detection**: Detects and fills gaps in loaded data ranges

### Placeholder Replacement System

Fixed the issue where placeholders weren't being replaced during scroll-back operations:

**Root Cause Fixed:**

- Boundary detection now tracks actual loaded item ranges instead of min/max IDs
- Correctly identifies gaps in data (e.g., loaded items [1-1000] and [95000-96000])
- Triggers loading when scrolling into unloaded ranges

**Seamless Experience:**

- Placeholders appear instantly during fast scrolling
- Real data loads in background and replaces placeholders smoothly
- No empty spaces or visual glitches during navigation

## Performance Optimizations

The List Manager includes numerous performance optimizations:

1. **Element Reference Caching**: Caches child element references to eliminate querySelector calls
2. **Intelligent Placeholders**: Instant placeholder generation decoupled from data loading
3. **Throttled Scroll Handling**: Limits scroll event processing frequency
4. **RequestAnimationFrame**: Batches DOM updates to animation frames
5. **Binary Search**: Efficiently finds visible items in large datasets
6. **Partial Updates**: Only updates DOM elements that changed
7. **DOM Recycling**: Reuses DOM elements instead of creating new ones
8. **Position Caching**: Precomputes item positions for fast lookup
9. **Change Detection**: Only updates DOM when content actually changes
10. **Optimized Measurements**: Measures only when necessary and caches results
11. **Deduplication**: Avoids duplicate items when loading more data
12. **Lazy Loading**: Only loads data when needed
13. **Element Pool Limiting**: Prevents memory leaks from excessive recycling
14. **SCSS-based Styling**: Eliminates JavaScript CSS property manipulation

## Utility Transforms

The List Manager provides transform functions for common collections:

### `transforms.track`

```javascript
transforms.track = (track) => ({
  id: track._id,
  headline: track.title || "Untitled",
  supportingText: track.artist || "Unknown Artist",
  meta: track.year?.toString() || "",
});
```

### `transforms.playlist`

```javascript
transforms.playlist = (playlist) => ({
  id: playlist._id,
  headline: playlist.name || "Untitled Playlist",
  supportingText: `${playlist.tracks?.length || 0} tracks`,
  meta: playlist.creator || "",
});
```

### `transforms.country`

```javascript
transforms.country = (country) => ({
  id: country._id,
  headline: country.name || country.code,
  supportingText: country.continent || "",
  meta: country.code || "",
});
```

## Pagination Strategies

The List Manager supports three sophisticated pagination strategies, each optimized for different use cases and API architectures.

### Cursor-Based Pagination

Ideal for real-time feeds and large datasets where new items are frequently added.

**How it works:**

- Uses opaque cursor tokens to maintain position in the dataset
- Server maintains cursor state for efficient traversal
- Most efficient for append-only datasets like social feeds

**Configuration:**

```javascript
const listManager = createListManager("feed", container, {
  pagination: {
    strategy: "cursor",
    cursorParamName: "cursor", // API parameter name for cursor
  },
  pageSize: 20,
  renderItem: (item) => {
    /* render function */
  },
});
```

**API Request Example:**

```
GET /api/feed?cursor=eyJpZCI6MTIzNDU&limit=20
```

**Expected Response:**

```json
{
  "items": [...],
  "meta": {
    "hasNext": true,
    "nextCursor": "eyJpZCI6MTIzNjU"
  }
}
```

### Page-Based Pagination

Perfect for traditional paginated interfaces with numbered pages and precise navigation.

**How it works:**

- Uses sequential page numbers for navigation
- Enables jumping to any page directly
- Supports precise positioning and preloading

**Configuration:**

```javascript
const listManager = createListManager("users", container, {
  pagination: {
    strategy: "page",
    pageParamName: "page",
    perPageParamName: "per_page",
  },
  pageSize: 50,

  // Enhanced page navigation
  adjacentPagesPreloadBefore: 2, // Preload 2 pages before viewport
  adjacentPagesPreloadAfter: 2, // Preload 2 pages after viewport

  renderItem: (user) => {
    /* render function */
  },
});

// Jump to any page with automatic positioning
await listManager.loadPage(1000);
await listManager.scrollToIndex(50000, "center", true);
```

**API Request Example:**

```
GET /api/users?page=15&per_page=50
```

**Expected Response:**

```json
{
  "items": [...],
  "meta": {
    "page": 15,
    "per_page": 50,
    "total_pages": 2000,
    "total_count": 100000,
    "hasNext": true,
    "hasPrev": true
  }
}
```

### Offset-Based Pagination

Optimized for precise positioning and random access in large, stable datasets.

**How it works:**

- Uses mathematical offsets for exact item positioning
- Enables instant jumping to any position without page calculations
- Perfect for datasets where precise index access is required

**Configuration:**

```javascript
const listManager = createListManager("products", container, {
  pagination: {
    strategy: "offset",
    offsetParamName: "offset",
    limitParamName: "limit",
  },
  pageSize: 30,

  // Speed-based loading optimization
  itemHeight: 120, // Enables precise positioning calculations

  renderItem: (product) => {
    /* render function */
  },
});

// Direct index navigation with automatic offset calculation
await listManager.scrollToIndex(75000, "start", false);
```

**API Request Example:**

```
GET /api/products?offset=750&limit=30
```

**Expected Response:**

```json
{
  "items": [...],
  "meta": {
    "offset": 750,
    "limit": 30,
    "total_count": 500000,
    "hasNext": true
  }
}
```

### Pagination Constants

| Constant                                   | Default     | Description                            |
| ------------------------------------------ | ----------- | -------------------------------------- |
| `PAGINATION.DEFAULT_PAGE_SIZE`             | `20`        | Items per page for all strategies      |
| `PAGINATION.INITIAL_PAGE`                  | `1`         | Starting page number                   |
| `PAGINATION.ADJACENT_PAGES_PRELOAD_BEFORE` | `1`         | Pages to preload before viewport       |
| `PAGINATION.ADJACENT_PAGES_PRELOAD_AFTER`  | `1`         | Pages to preload after viewport        |
| `PAGINATION.LOAD_PREVIOUS_THRESHOLD`       | `200px`     | Distance from top to load previous     |
| `PAGINATION.LOAD_NEXT_THRESHOLD`           | `100px`     | Distance from bottom to load next      |
| `PAGINATION.FALLBACK_TOTAL_COUNT`          | `1,000,000` | Default total when API doesn't provide |

### Strategy Selection Guide

| Use Case             | Recommended Strategy | Benefits                               |
| -------------------- | -------------------- | -------------------------------------- |
| **Social Feeds**     | Cursor               | Real-time updates, efficient traversal |
| **User Lists**       | Page                 | Direct navigation, familiar UX         |
| **Product Catalogs** | Offset               | Precise positioning, instant access    |
| **Search Results**   | Page                 | Numbered results, pagination UI        |
| **Large Archives**   | Offset               | Mathematical precision, performance    |

## Speed-Based Loading

The List Manager uses intelligent speed-based loading to optimize data fetching during different scroll behaviors, providing smooth performance across all interaction types.

### How Speed-Based Loading Works

The system continuously monitors scroll speed and makes loading decisions based on **current velocity**, not artificial delays or stop detection:

```javascript
const listManager = createListManager("items", container, {
  // Speed-based loading is automatic - no configuration needed
  renderItem: (item) => {
    /* render function */
  },

  // These settings optimize the speed detection
  itemHeight: 84, // Enables precise speed calculations
  pageSize: 20, // Balances load frequency with performance
  throttleMs: 16, // Scroll event throttling (~60fps)
});
```

### Loading Decision Logic

The system uses **speed thresholds** to determine when to load data:

**Fast Scrolling (>5px/ms):**

- **Mouse wheel**: Rarely triggers (typical: 0.1-2px/ms)
- **Scrollbar dragging**: Commonly triggers (typical: 1000-20000px/ms)
- **Behavior**: Skip loading to prevent API spam

**Slow Scrolling (≤5px/ms):**

- **Mouse wheel**: Normal scrolling behavior
- **Scrollbar released**: After dragging ends
- **Behavior**: Load immediately when data is needed

### Speed Detection Examples

```javascript
// During mouse wheel scrolling (0.5px/ms)
// System: "🚀 [SPEED-LOAD] Loading immediately: offset 100 (speed: 0.5px/ms ≤ 5px/ms)"

// During scrollbar dragging (15000px/ms)
// System: "⏸️ [SPEED-SKIP] Skipping load due to high scroll speed: 15000.2px/ms > 5px/ms"

// When scrollbar drag ends (0.1px/ms)
// System: "🚀 [SPEED-LOAD] Loading immediately: offset 500 (speed: 0.1px/ms ≤ 5px/ms)"
```

### Key Benefits

1. **No Artificial Delays**: Loads immediately when speed is appropriate
2. **Prevents API Spam**: Automatically skips loading during rapid scrolling
3. **Smooth Experience**: Seamless transition between fast and slow scrolling
4. **Universal Compatibility**: Works with mouse wheel, scrollbar, touch, and keyboard

### Performance Characteristics

| Scroll Method           | Typical Speed   | Loading Behavior  |
| ----------------------- | --------------- | ----------------- |
| **Mouse Wheel**         | 0.1-2px/ms      | Immediate loading |
| **Scrollbar Drag**      | 1000-20000px/ms | Skip during drag  |
| **Scrollbar Release**   | 0-1px/ms        | Immediate loading |
| **Touch Scrolling**     | 50-500px/ms     | Immediate loading |
| **Keyboard Navigation** | 10-100px/ms     | Immediate loading |

### Speed-Based Constants

| Constant                       | Default    | Description                               |
| ------------------------------ | ---------- | ----------------------------------------- |
| `SCROLL.FAST_SCROLL_THRESHOLD` | `5.0px/ms` | Speed threshold for fast scroll detection |
| `SCROLL.DEFAULT_THROTTLE_MS`   | `16ms`     | Scroll event throttling (~60fps)          |
| `SCROLL.LOAD_THROTTLE_MS`      | `100ms`    | Minimum time between load operations      |
| `SCROLL.SCROLL_THRESHOLD`      | `5px`      | Minimum scroll change to process          |

### Advanced Speed Optimization

For high-performance scenarios, you can tune the speed detection:

```javascript
const listManager = createListManager("items", container, {
  // High-performance configuration
  throttleMs: 8, // ~120fps for smoother detection
  renderBufferSize: 10, // Larger buffer for speed changes

  // Or battery-saving configuration
  throttleMs: 32, // ~30fps for battery efficiency
  renderBufferSize: 3, // Smaller buffer for lower memory usage
});
```

## Best Practices

For optimal performance:

1. **Specify Item Height**: Always provide `itemHeight` when item heights are consistent
2. **Use Element Reference Caching**: Cache child element queries in renderItem for recycled elements
3. **Implement Change Detection**: Only update DOM when content actually changes
4. **Use DOM Recycling**: Let the List Manager handle element reuse via the recycledElement parameter
5. **Keep Items Simple**: Complex item rendering slows down scrolling
6. **Virtualize Large Lists**: Always use virtualization for lists over 100 items
7. **Leverage Placeholders**: Trust the automatic placeholder system for smooth fast scrolling
8. **Debounce External Updates**: Avoid frequent external updates to the list
9. **Use Image Loading Callbacks**: Update heights after images load if sizes vary
10. **Limit Item Props**: Keep item objects small with only necessary properties
11. **Use Appropriate Strategy**: Choose scroll strategy based on device performance
12. **Style with SCSS**: Use SCSS variables for placeholder theming instead of JavaScript

## Debugging and Troubleshooting

The List Manager includes comprehensive debugging tools and error reporting:

### Browser Console Debugging

Essential errors and warnings are automatically logged to the browser console:

```javascript
// Check if navigation functions are working
await listManager.scrollToIndex(1000); // Logs errors if fails
await listManager.scrollToItemById("user_123"); // Warns if not found

// Monitor state for debugging
console.log("Current state:", listManager.getState());
```

### Module-Specific Debugging

#### **Data Loading Issues**

- Check network tab for API calls
- Verify adapter configuration and response parsing
- Look for corruption protection warnings in console

```javascript
// Check current data loading state
console.log("Data loading state:", {
  isLoading: listManager.isLoading(),
  hasNext: listManager.hasNextPage(),
  currentItems: listManager.getAllItems().length,
});
```

#### **Pagination Problems**

- Check for page boundary logs in console
- Verify pagination strategy matches API
- Look for page jump coordination issues

```javascript
// Debug pagination state
console.log("Pagination state:", {
  currentPage: listManager.state.page,
  strategy: listManager.state.paginationStrategy,
  hasNext: listManager.state.hasNext,
});
```

#### **Rendering Issues**

- Check if items are being positioned correctly
- Verify placeholder integration is working
- Look for virtual positioning calculations

```javascript
// Debug rendering state
console.log("Rendering state:", {
  visibleItems: listManager.getVisibleItems(),
  visibleRange: listManager.state.visibleRange,
  totalHeight: listManager.state.totalHeight,
});
```

#### **Placeholder Problems**

- Check SCSS variables are properly loaded
- Verify placeholder classes are being applied
- Test different placeholder modes

```javascript
// Placeholder debugging
setPlaceholderMode("skeleton"); // Change mode at runtime
// Check if placeholders appear during fast scrolling
// Verify smooth replacement when real data loads
```

### Common Issues and Solutions

| Issue                          | Cause                           | Solution                                                     |
| ------------------------------ | ------------------------------- | ------------------------------------------------------------ |
| **Empty list on fast scroll**  | Placeholder generation disabled | Ensure placeholders are enabled and SCSS is loaded           |
| **Items overlapping**          | Incorrect height calculations   | Verify `itemHeight` configuration matches actual item height |
| **Slow scrolling**             | Too many DOM queries            | Use element reference caching in renderItem                  |
| **Memory leaks**               | Missing cleanup                 | Ensure `destroy()` is called when unmounting                 |
| **Incorrect pagination**       | Strategy mismatch               | Verify pagination strategy matches API implementation        |
| **Positioning errors**         | Stale cached positions          | Clear item measurement cache with `itemMeasurement.clear()`  |
| **scrollToIndex doesn't work** | API mode without pagination     | Ensure page-based pagination is configured                   |
| **scrollToItemById fails**     | Missing backend endpoint        | Implement `findUserPosition()` API endpoint                  |
| **Jump navigation is slow**    | Insufficient preloading         | Increase `adjacentPagesPreloadBefore/After` values           |
| **Placeholders not replaced**  | Data gaps in loaded ranges      | Check boundary detection is working correctly                |

### Performance Monitoring

Monitor performance with built-in metrics:

```javascript
// Check performance metrics
console.log("Performance metrics:", {
  renderCount: listManager.state.renderCount,
  loadCount: listManager.state.loadCount,
  cacheHitRate: listManager.state.cacheHitRate,
});
```

### Browser DevTools Integration

Use browser DevTools for advanced debugging:

1. **Elements Panel**: Inspect virtual positioning and placeholder classes
2. **Network Panel**: Monitor API calls and response times
3. **Performance Panel**: Profile scrolling and rendering performance
4. **Console**: Use built-in debugging functions

## Advanced Examples

### Navigation Examples

#### Scroll to Index with Loading

Perfect for implementing "Go to page X" or "Jump to item Y" functionality:

```javascript
const listManager = createListManager("users", container, {
  baseUrl: "https://api.example.com/api",
  pageSize: 50,
  renderItem: (user) => {
    /* render function */
  },
});

// Jump to user at index 50,000 (page 1000 with pageSize=50)
await listManager.scrollToIndex(49999, "start", false);

// Navigate with smooth animation to center item in viewport
await listManager.scrollToIndex(25000, "center", true);

// Jump to specific page and position at first item
const targetPage = 500;
const firstIndexInPage = (targetPage - 1) * 50; // 0-based index
await listManager.scrollToIndex(firstIndexInPage, "start", false);
```

#### Find and Navigate by ID

Ideal for deep-linking and search result navigation:

```javascript
// Navigate to a specific user from search results
async function jumpToUser(userId) {
  try {
    await listManager.scrollToItemById(userId, "center", true);
    console.log(`Navigated to user ${userId}`);
  } catch (error) {
    console.error(`User ${userId} not found:`, error);
  }
}

// Navigate to specific item from URL parameter
const urlParams = new URLSearchParams(window.location.search);
const itemId = urlParams.get("item");
if (itemId) {
  await jumpToUser(itemId);
}
```

#### Advanced Page Navigation

```javascript
// Listen for page changes and update URL
const cleanup = listManager.onPageChange((page) => {
  // Update URL without page reload
  const url = new URL(window.location);
  url.searchParams.set("page", page);
  window.history.pushState({}, "", url);

  // Update UI elements
  document.getElementById("current-page").textContent = page;
});

// Navigate based on URL parameter
const urlPage = new URLSearchParams(window.location.search).get("page");
if (urlPage) {
  await listManager.loadPage(parseInt(urlPage));
}

// Clean up when component unmounts
// cleanup();
```

#### Optimized Preloading Configuration

```javascript
const listManager = createListManager("products", container, {
  // Aggressive preloading for smooth navigation
  adjacentPagesPreloadBefore: 2, // Preload 2 pages before viewport
  adjacentPagesPreloadAfter: 3, // Preload 3 pages after viewport

  // Or use legacy single setting (splits evenly)
  // adjacentPagesPreload: 4,     // Total 4 pages (2 before + 2 after)

  renderItem: (product) => {
    /* render function */
  },
});
```

### Variable Height Items

```javascript
const listManager = createListManager("products", container, {
  dynamicItemSize: true, // Enable variable height measurement

  renderItem: (item, index) => {
    const element = document.createElement("div");
    element.className = "product-item";
    element.innerHTML = `
      <h3>${item.name}</h3>
      <p>${item.description}</p>
      <img src="${item.image}" class="product-image">
    `;

    // If images can change height, update measurement after load
    const img = element.querySelector("img");
    if (img) {
      img.onload = () => {
        // Update height for this specific item
        listManager.setItemHeights({
          [item.id]: element.offsetHeight,
        });
      };
    }

    return element;
  },
});
```

### IntersectionObserver-Based Loading

```javascript
const listManager = createListManager("feed", container, {
  scrollStrategy: "intersection", // Use IntersectionObserver
  loadThreshold: 0.9, // Load when user is 90% through content

  // Other configuration...
  renderItem: (item) => {
    /* ... */
  },
});
```

### Optimized RenderItem with Element Caching

The most performant approach for complex items uses element reference caching:

```javascript
const listManager = createListManager("users", container, {
  renderItem: (user, index, recycledElement) => {
    if (recycledElement) {
      // Use cached references (super fast)
      let cachedRefs = recycledElement._cachedRefs;

      if (!cachedRefs) {
        // Cache child element references on first recycle
        cachedRefs = {
          avatar: recycledElement.querySelector(".user-avatar"),
          name: recycledElement.querySelector(".user-name"),
          email: recycledElement.querySelector(".user-email"),
          role: recycledElement.querySelector(".user-role"),
        };
        recycledElement._cachedRefs = cachedRefs;
      }

      // Update content using cached references (fastest possible)
      const avatarText = user.avatar || user.name?.charAt(0) || "?";
      const nameText = user.name || "Unknown";
      const emailText = user.email || "";
      const roleText = user.role || "";

      // Only update if content actually changed (micro-optimization)
      if (cachedRefs.avatar.textContent !== avatarText) {
        cachedRefs.avatar.textContent = avatarText;
      }
      if (cachedRefs.name.textContent !== nameText) {
        cachedRefs.name.textContent = nameText;
      }
      if (cachedRefs.email.textContent !== emailText) {
        cachedRefs.email.textContent = emailText;
      }
      if (cachedRefs.role.textContent !== roleText) {
        cachedRefs.role.textContent = roleText;
      }

      // Only update data-id if it changed
      if (recycledElement.dataset.id !== user.id) {
        recycledElement.dataset.id = user.id;
      }

      return recycledElement;
    }

    // Create new element - optimized template
    const element = document.createElement("div");
    element.className = "mtrl-list-item user-item";
    element.dataset.id = user.id;

    // Pre-calculate text content
    const avatarText = user.avatar || user.name?.charAt(0) || "?";
    const nameText = user.name || "Unknown";
    const emailText = user.email || "";
    const roleText = user.role || "";

    element.innerHTML = `<div class="user-avatar">${avatarText}</div><div class="user-details"><div class="user-name">${nameText}</div><div class="user-email">${emailText}</div><div class="user-role">${roleText}</div></div>`;

    // Pre-cache child references for future recycling
    element._cachedRefs = {
      avatar: element.querySelector(".user-avatar"),
      name: element.querySelector(".user-name"),
      email: element.querySelector(".user-email"),
      role: element.querySelector(".user-role"),
    };

    return element;
  },
});

// Performance gains:
// - New elements: +20% faster (template optimization)
// - Recycled elements: ~20-25x faster (no querySelector + change detection)
```

### Custom Render Hook

```javascript
const listManager = createListManager("messages", container, {
  renderItem: (message) => {
    const element = document.createElement("div");
    element.className = "message";
    element.textContent = message.text;
    return element;
  },
});

// Add custom behavior to each rendered element
listManager.setRenderHook((item, element) => {
  // Add interaction handlers
  element.addEventListener("click", () => {
    console.log("Clicked message:", item.id);
  });

  // Add custom styling based on message state
  if (item.isRead) {
    element.classList.add("message--read");
  } else {
    element.classList.add("message--unread");
  }
});
```

### Modular Architecture Benefits

The modular design provides several key advantages:

1. **🔧 Maintainability**: Each module has a single responsibility
2. **🧪 Testability**: Modules can be tested in isolation
3. **📈 Performance**: Optimized for specific tasks without bloat
4. **🔄 Reusability**: Modules can be composed for different use cases
5. **🐛 Debugging**: Issues can be isolated to specific modules

### Module Dependencies

The modules work together through a dependency injection system:

```javascript
// Example of how modules are connected
const deps = {
  state,
  config,
  elements,
  container,
  itemsCollection,
  adapter,
};

const dataLoader = createDataLoadingManager(deps);
const paginator = createPaginationManager({
  ...deps,
  loadItems: dataLoader.loadItems,
});
const renderer = createRenderingManager(deps);
const lifecycle = createLifecycleManager({
  ...deps,
  loadPage: paginator.loadPage,
});

// All modules work together seamlessly
const cleanup = lifecycle.initialize();
```

## Key Capabilities

The List Manager provides enterprise-grade virtualized list functionality with advanced features for modern applications:

### 🚀 **Advanced Navigation**

- **`scrollToIndex()`** - Navigate to any index with automatic loading and positioning
- **`scrollToItemById()`** - Find and navigate to items by ID using backend lookup
- **`loadPage()`** - Jump to specific pages with precise viewport calculation
- **Smooth Transitions** - Seamless navigation with preloading and positioning

### 🎯 **Intelligent Loading**

- **Precise Viewport Calculation** - Loads exactly the pages needed for the current viewport
- **Parallel Loading** - Uses `Promise.all()` to load all viewport pages simultaneously
- **Dynamic Buffer Detection** - Adapts buffer size based on viewport and page size
- **Gap Detection** - Identifies and fills gaps in loaded data ranges

### ⚡ **Speed-Based Optimization**

- **Velocity-Based Loading** - Makes loading decisions based on current scroll speed
- **No Artificial Delays** - Immediate response when appropriate, skip when too fast
- **Universal Compatibility** - Works with mouse wheel, scrollbar, touch, and keyboard
- **API Spam Prevention** - Automatically skips loading during rapid scrolling

### 🔧 **Production Ready**

- **Concurrent-Safe Operations** - Prevents race conditions between scroll systems
- **Mathematical Precision** - Uses exact calculations for reliable positioning
- **Memory Management** - Efficient DOM recycling and cleanup
- **Error Handling** - Comprehensive error reporting and recovery

### 🌟 **Enterprise Features**

- **Scales to Any Size** - Handles millions of items with consistent performance
- **Multiple Strategies** - Supports cursor, page, and offset-based pagination
- **Backend Integration** - Simple API endpoints for ID-based navigation
- **Developer Experience** - Clear APIs, comprehensive documentation, and debugging tools

The List Manager delivers the performance and reliability needed for production applications handling large datasets while maintaining a smooth user experience.
