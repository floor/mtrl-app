# Pagination Feature

> **Created:** June 2025
> **Updated:** December 29, 2025

The pagination feature provides flexible data loading strategies for the viewport, supporting three distinct approaches: offset-based, page-based, and cursor-based pagination. Each strategy is optimized for different use cases and backend architectures.

## Table of Contents

1. [Overview](#overview)
2. [Configuration](#configuration)
3. [Pagination Strategies](#pagination-strategies)
   - [Offset Pagination](#offset-pagination)
   - [Page Pagination](#page-pagination)
   - [Cursor Pagination](#cursor-pagination)
4. [Implementation Details](#implementation-details)
5. [API Reference](#api-reference)
6. [Examples](#examples)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

## Overview

The pagination feature manages how data is loaded from your backend as users scroll through large datasets. It integrates tightly with the collection feature to provide:

- **Progressive Loading**: Load data in chunks as needed
- **Memory Efficiency**: Only keep necessary data in memory
- **Network Optimization**: Minimize redundant requests
- **Flexible Strategies**: Support different backend architectures
- **Dynamic Virtual Sizing**: Adapt scrollable area for cursor pagination

## Configuration

```typescript
interface PaginationConfig {
  strategy?: "offset" | "page" | "cursor"; // Default: "offset"
  limit?: number; // Items per page/range, default: 20
}
```

### Basic Setup

```typescript
const viewport = createViewport({
  pagination: {
    strategy: "cursor",
    limit: 50,
  },
  collection: {
    adapter: myAdapter,
  },
});
```

## Pagination Strategies

### Offset Pagination

Traditional pagination using `offset` and `limit` parameters. Best for databases that support LIMIT/OFFSET queries.

**Characteristics:**

- Direct access to any position
- Consistent performance
- Simple implementation
- May have issues with real-time data changes

**Request Format:**

```typescript
{ offset: 100, limit: 20 } // Items 100-119
```

**Backend Example (SQL):**

```sql
SELECT * FROM users
ORDER BY id
LIMIT 20 OFFSET 100;
```

### Page Pagination

Page-based loading using page numbers. Common in REST APIs and traditional web applications.

**Characteristics:**

- Human-friendly page numbers
- Easy to implement pagination UI
- Direct access to any page
- Fixed page sizes

**Request Format:**

```typescript
{ page: 5, limit: 20 } // Page 5 (items 80-99)
```

**Backend Example:**

```javascript
const page = req.query.page || 1;
const limit = req.query.limit || 20;
const offset = (page - 1) * limit;
```

### Cursor Pagination

Sequential loading using opaque cursor tokens. Ideal for real-time data, large datasets, and stable pagination.

**Characteristics:**

- **Sequential Access Only**: Must load pages in order
- **Stable Results**: Immune to data insertions/deletions
- **Efficient for Large Datasets**: No offset performance degradation
- **Dynamic Virtual Sizing**: Scrollable area grows as data loads
- **Real-time Friendly**: Works well with changing data

**Request Format:**

```typescript
// First page
{ limit: 20 }

// Subsequent pages
{ cursor: "eyJwIjoyMCwibCI6MjAsInMiOiIiLCJ0IjoxNzUzNzU2NDgyMDYwfQ==", limit: 20 }
```

**Backend Example:**

```javascript
// Decode cursor to get last item info
const decodedCursor = cursor ? decodeCursor(cursor) : null;
const query = decodedCursor
  ? db.users.find({ id: { $gt: decodedCursor.lastId } })
  : db.users.find({});

const items = await query.limit(limit).toArray();
const nextCursor =
  items.length === limit
    ? encodeCursor({ lastId: items[items.length - 1].id })
    : null;
```

## Implementation Details

### Cursor Pagination Deep Dive

The cursor pagination implementation includes several sophisticated features:

#### 1. Sequential Loading Enforcement

```typescript
// When jumping to page 5, must load pages 2, 3, 4 first
if (targetPage > highestLoadedPage + 1) {
  for (let page = highestLoadedPage + 1; page <= targetPage; page++) {
    await loadPage(page);
  }
}
```

#### 2. Dynamic Virtual Sizing

Unlike other strategies where total size is known upfront, cursor pagination calculates virtual size dynamically:

```typescript
// Virtual size calculation
const loadedItemsCount = items.filter((item) => item !== undefined).length;
const marginItems = hasReachedEnd
  ? 0
  : rangeSize * CURSOR_SCROLL_MARGIN_MULTIPLIER;
const virtualSize = Math.max(loadedItemsCount + marginItems, minVirtualSize);
```

**Constants:**

- `CURSOR_SCROLL_MARGIN_MULTIPLIER`: 5 (scroll buffer = 5 × page size)
- `CURSOR_MIN_VIRTUAL_SIZE_MULTIPLIER`: 10 (minimum = 10 × page size)

#### 3. Cursor State Management

```typescript
// Internal state maintained by collection feature
const cursorState = {
  currentCursor: string | null, // Latest cursor
  cursorMap: Map<number, string>, // Page → Cursor mapping
  pageToOffsetMap: Map<number, number>, // Page → Offset mapping
  highestLoadedPage: number, // Furthest loaded page
  hasReachedEnd: boolean, // No more data available
};
```

#### 4. Scrollbar Behavior

The scrollbar adapts dynamically for cursor pagination:

- Thumb size reflects loaded content ratio
- Scrollable area grows as more data loads
- Smooth transitions as virtual size changes

### Request Flow Comparison

#### Offset/Page Strategy

```
User scrolls to position 1000
  → Calculate page/offset
  → Single request for that range
  → Render items
```

#### Cursor Strategy

```
User scrolls to position 1000
  → Calculate target page (e.g., page 50)
  → Check highest loaded page (e.g., page 2)
  → Load pages 3-50 sequentially:
    → Load page 3 with cursor from page 2
    → Load page 4 with cursor from page 3
    → ... continue until page 50
  → Update virtual size after each load
  → Render items
```

## API Reference

### Collection Adapter Interface

```typescript
interface CollectionAdapter {
  read(params: {
    // Common parameters
    limit: number;

    // Strategy-specific parameters
    offset?: number; // Offset strategy
    page?: number; // Page strategy
    cursor?: string; // Cursor strategy
  }): Promise<{
    items: any[];
    meta?: {
      total?: number; // Total items (optional for cursor)
      nextCursor?: string; // Next page cursor
      cursor?: string; // Alternative to nextCursor
      hasNext?: boolean; // More data available
    };
  }>;
}
```

### Viewport Methods

```typescript
// Scroll to a specific page
viewport.scrollToPage(pageNumber: number, alignment?: 'start' | 'center' | 'end');

// Get current cursor (cursor strategy only)
const cursor = viewport.collection?.getCurrentCursor();

// Get cursor for a specific page
const pageCursor = viewport.collection?.getCursorForPage(pageNumber);
```

### Events

```typescript
// Cursor stored
viewport.on(
  "collection:cursor-stored",
  (data: { page: number; cursor: string }) => {
    console.log(`Cursor for page ${data.page}: ${data.cursor}`);
  }
);

// Virtual size changed (cursor mode)
viewport.on("viewport:total-items-changed", (data: { total: number }) => {
  console.log(`Virtual size updated to ${data.total}`);
});
```

## Examples

### Complete Cursor Pagination Example

```typescript
import { createVList } from "mtrl-addons";

const list = createVList({
  container: document.getElementById("user-list"),

  // Virtual scrolling
  virtual: {
    itemSize: 84,
    overscan: 2,
  },

  // Cursor pagination
  pagination: {
    strategy: "cursor",
    limit: 20,
  },

  // Collection adapter
  collection: {
    adapter: {
      read: async (params) => {
        // Build URL
        const url = new URL("https://api.example.com/users");
        url.searchParams.set("limit", params.limit.toString());

        // Add cursor for subsequent pages
        if (params.cursor) {
          url.searchParams.set("cursor", params.cursor);
        }

        // Fetch data
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        // Return in expected format
        return {
          items: data.users,
          meta: {
            nextCursor: data.pagination.nextCursor,
            hasNext: data.pagination.hasMore,
            // total is optional and might not be provided
            total: data.pagination.totalCount,
          },
        };
      },
    },

    // Transform items before rendering
    transform: (user) => ({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      avatar: user.profilePicture || user.name[0],
    }),
  },

  // Item template
  template: (user) => [
    { class: "user-item", attributes: { "data-id": user.id } },
    [{ class: "user-item__avatar", text: user.avatar }],
    [
      "info",
      { class: "user-item__info" },
      [{ class: "user-item__name", text: user.name }],
      [{ class: "user-item__email", text: user.email }],
    ],
  ],
});

// Handle errors
list.on("error", (error) => {
  console.error("List error:", error);
  showErrorMessage(error.message);
});

// Monitor loading
list.on("collection:range-loaded", (data) => {
  console.log(`Loaded ${data.items.length} items at offset ${data.offset}`);
});
```

### Switching Between Strategies

```typescript
// Offset strategy
const offsetList = createVList({
  pagination: { strategy: "offset", limit: 50 },
  collection: {
    adapter: {
      read: async ({ offset, limit }) => {
        const response = await fetch(
          `/api/items?offset=${offset}&limit=${limit}`
        );
        return response.json();
      },
    },
  },
});

// Page strategy
const pageList = createVList({
  pagination: { strategy: "page", limit: 50 },
  collection: {
    adapter: {
      read: async ({ page, limit }) => {
        const response = await fetch(`/api/items?page=${page}&limit=${limit}`);
        return response.json();
      },
    },
  },
});

// Cursor strategy
const cursorList = createVList({
  pagination: { strategy: "cursor", limit: 50 },
  collection: {
    adapter: {
      read: async ({ cursor, limit }) => {
        const params = new URLSearchParams({ limit });
        if (cursor) params.set("cursor", cursor);

        const response = await fetch(`/api/items?${params}`);
        return response.json();
      },
    },
  },
});
```

## Best Practices

### 1. Choose the Right Strategy

- **Use Offset** when:
  - Dataset is relatively stable
  - Need random access to any position
  - Backend uses SQL with LIMIT/OFFSET
- **Use Page** when:
  - Building traditional paginated UIs
  - Users think in terms of pages
  - Backend already uses page numbers
- **Use Cursor** when:
  - Dataset changes frequently
  - Working with very large datasets
  - Need stable pagination (no duplicates/skips)
  - Building infinite scroll experiences

### 2. Optimize Cursor Pagination

```typescript
// Good: Reasonable scroll margin
pagination: {
  strategy: 'cursor',
  limit: 20  // 5 × 20 = 100 items scroll buffer
}

// Avoid: Too small limit creates excessive requests
pagination: {
  strategy: 'cursor',
  limit: 5   // Too many sequential requests
}
```

### 3. Handle Edge Cases

```typescript
// Handle cursor expiration
collection: {
  adapter: {
    read: async (params) => {
      try {
        return await fetchWithCursor(params);
      } catch (error) {
        if (error.code === "CURSOR_EXPIRED") {
          // Reset and start from beginning
          delete params.cursor;
          return await fetchWithCursor(params);
        }
        throw error;
      }
    };
  }
}
```

### 4. Provide Loading Feedback

```typescript
// Show loading state for cursor pagination
list.on("collection:loading-pages", (data) => {
  showProgress(`Loading pages ${data.from} to ${data.to}...`);
});

list.on("collection:pages-loaded", () => {
  hideProgress();
});
```

## Troubleshooting

### Cursor Pagination Issues

**Problem:** "Cannot jump to page X in cursor mode"

```typescript
// Solution: Understand sequential loading requirement
// Users must scroll through content, not jump arbitrarily
```

**Problem:** Virtual size not growing

```typescript
// Check response format
return {
  items: [...],
  meta: {
    nextCursor: cursor,  // or 'cursor'
    hasNext: true        // Required for growth
  }
};
```

**Problem:** Infinite loading loop

```typescript
// Ensure cursor changes with each request
if (data.meta.nextCursor === params.cursor) {
  console.error("Cursor not advancing!");
}
```

### Performance Optimization

**Problem:** Too many sequential requests

```typescript
// Increase page size
pagination: {
  strategy: 'cursor',
  limit: 50  // Larger pages = fewer requests
}

// Limit concurrent page loads
performance: {
  maxConcurrentRequests: 3
}
```

### Debug Mode

```typescript
// Enable pagination debugging
const list = createVList({
  debug: true,
  pagination: { strategy: "cursor", limit: 20 },
});

// Monitor cursor state
setInterval(() => {
  const collection = list.viewport.collection;
  console.log({
    currentCursor: collection.getCurrentCursor(),
    loadedPages: collection.getLoadedRanges().size,
    virtualSize: list.viewport.state.totalItems,
  });
}, 1000);
```

## Summary

The pagination feature provides flexible strategies for loading large datasets efficiently. While offset and page strategies offer random access simplicity, cursor pagination excels at handling real-time data and massive datasets through its sequential loading approach and dynamic virtual sizing. Choose the strategy that best fits your backend architecture and user experience requirements.
