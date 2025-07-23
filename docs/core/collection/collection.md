# Collection

The collection is the core data management layer in mtrl-addons. It provides efficient data handling with support for pagination, range-based loading, filtering, sorting, searching, and API integration.

## Concept

The collection implements a flexible data management system that handles both static and dynamic datasets. It is designed to work seamlessly with virtual scrolling viewports and provides:

1. **State Management** - Single source of truth for data with reactive updates
2. **Range-Based Loading** - Loads data in chunks for optimal performance
3. **Data Operations** - Built-in filtering, sorting, and searching
4. **API Integration** - Adapter pattern for connecting to any data source
5. **Event System** - Observable pattern for reactive updates
6. **Memory Efficiency** - Smart data management with configurable limits

## Architecture

The collection uses a composable architecture where features are mixed in using functional composition:

```typescript
import { createCollection } from "mtrl-addons/core/collection";
import { withRouteAdapter } from "mtrl-addons/core/collection/features/adapter";
import { pipe } from "mtrl/core/compose";

// Core collection features (applied by default)
const collection = pipe(
  withAPI, // Core state and event system
  withLoading, // Range-based data loading
  withOperations // Filter, sort, search
)(baseState);

// Additional features can be added
const advancedCollection = pipe(
  createCollection(config),
  withRouteAdapter({
    // REST API integration
    base: "/api",
    endpoints: { list: "/users" },
  }),
  withCache({ maxSize: 1000 }), // Future feature
  withPersistence({ strategy: "localStorage" }), // Future feature
  withValidation({ strict: true }) // Future feature
)(baseState);
```

## Constants

The collection behavior is controlled by organized constant groups:

### Data Pagination Constants

Controls pagination behavior:

```typescript
DATA_PAGINATION: {
  DEFAULT_PAGE_SIZE: 20,      // Items per page
  DEFAULT_CURRENT_PAGE: 1,    // Starting page
  MAX_PREFETCH_PAGES: 5,      // Pages to prefetch
  MIN_PAGE_SIZE: 1,           // Minimum page size
  MAX_PAGE_SIZE: 1000         // Maximum page size
}
```

### Data Cache Constants

Controls caching behavior:

```typescript
DATA_CACHE: {
  DEFAULT_MAX_SIZE: 1000,           // Max cached items
  DEFAULT_MAX_AGE: 3600000,         // 1 hour in ms
  CLEANUP_INTERVAL: 300000,         // 5 minutes
  DEFAULT_STRATEGY: "memory",       // Cache strategy
  LRU_DEFAULT_SIZE: 500            // LRU cache size
}
```

### Data Persistence Constants

Controls data persistence:

```typescript
DATA_PERSISTENCE: {
  DEFAULT_KEY_PREFIX: "mtrl-collection-",
  DEFAULT_VERSION: 1,
  SYNC_DEBOUNCE: 1000,              // 1 second
  DEFAULT_STRATEGY: "localStorage",
  MAX_LOCALSTORAGE_SIZE: 5242880,   // 5MB
  INDEXED_DB_VERSION: 1
}
```

### Web Workers Constants

Controls background processing:

```typescript
WEB_WORKERS: {
  MAX_WORKERS: 4,                   // Based on CPU cores
  TASK_TIMEOUT: 30000,              // 30 seconds
  CHUNK_SIZE: 1000,                 // Items per task
  DEFAULT_PRIORITY: "normal",
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000                 // 1 second
}
```

### Data Validation Constants

Controls data validation:

```typescript
DATA_VALIDATION: {
  DEFAULT_STRICT_MODE: false,
  MAX_VALIDATION_ERRORS: 100,
  VALIDATION_TIMEOUT: 5000,         // 5 seconds
  DEFAULT_SANITIZE: true
}
```

### API Adapter Constants

Controls API communication:

```typescript
API_ADAPTER: {
  DEFAULT_TIMEOUT: 30000,           // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,                // 1 second
  MAX_CONCURRENT_REQUESTS: 5,
  DEFAULT_HEADERS: {
    "Content-Type": "application/json"
  }
}
```

### Data Search Constants

Controls search functionality:

```typescript
DATA_SEARCH: {
  DEFAULT_FIELDS: ["id"],           // Fields to search
  MAX_SEARCH_FIELDS: 20,
  SEARCH_DEBOUNCE: 300,             // 300ms
  MIN_SEARCH_LENGTH: 1,
  MAX_SEARCH_LENGTH: 1000
}
```

## Features

The collection is composed of multiple features, each providing specific functionality:

### API Feature (`withAPI`)

Provides the core state management and event system:

- **`getItems()`** - Returns all loaded items
- **`getItem(id)`** - Returns a specific item by ID
- **`getTotalItems()`** - Returns total count (if known)
- **`getLoadedRanges()`** - Returns loaded data ranges
- **`clear()`** - Clears all data
- **`on(event, handler)`** - Subscribe to events
- **`off(event, handler)`** - Unsubscribe from events
- **`emit(event, data)`** - Emit an event

Available events:

- `data:changed` - Fired when data changes
- `range:loaded` - Fired when a range loads
- `item:added` - Fired when item is added
- `item:updated` - Fired when item is updated
- `item:removed` - Fired when item is removed
- `loading:start` - Fired when loading starts
- `loading:end` - Fired when loading ends
- `error` - Fired on errors

### Loading Feature (`withLoading`)

Manages range-based data loading:

- **`loadRange(start, end)`** - Loads a specific range of items
- **`loadPage(page, pageSize)`** - Loads a specific page
- **`setAdapter(adapter)`** - Sets the data adapter
- **`getAdapter()`** - Returns current adapter
- **`isLoading()`** - Returns loading state
- **`hasMore()`** - Returns if more data is available
- **`getPendingRanges()`** - Returns ranges being loaded
- **`cancelLoading()`** - Cancels active loads

### Operations Feature (`withOperations`)

Provides data manipulation capabilities:

- **`filter(predicate)`** - Filters items
- **`sort(compareFn)`** - Sorts items
- **`search(query, fields)`** - Searches items
- **`clearFilters()`** - Removes all filters
- **`clearSort()`** - Removes sorting
- **`clearSearch()`** - Clears search
- **`getFilteredItems()`** - Returns filtered results
- **`getOperations()`** - Returns active operations

## Usage Example

```typescript
import { createCollection } from "mtrl-addons/core/collection";
import {
  createRouteAdapter,
  withRouteAdapter,
} from "mtrl-addons/core/collection/features/adapter";
import { pipe } from "mtrl/core/compose";

// Create route adapter for API integration
const routeAdapter = createRouteAdapter({
  base: "/api",
  endpoints: { list: "/users" },
  headers: { Authorization: "Bearer token" },
  pagination: { strategy: "offset", limitSize: 50 },
});

// Create collection with route adapter
const collection = createCollection({
  adapter: routeAdapter,
  pageSize: 50,
  rangeSize: 100,
  transform: (item) => ({
    ...item,
    displayName: `${item.firstName} ${item.lastName}`,
  }),
});

// Use collection
await collection.loadRange(0, 50);

// Subscribe to changes
collection.on("data:changed", ({ items }) => {
  console.log("Data updated:", items.length);
});

// Apply operations
collection.filter((item) => item.active);
collection.sort((a, b) => a.name.localeCompare(b.name));
collection.search("john", ["name", "email"]);

// Or use the composable pattern
const collectionWithRoute = pipe(
  createCollection({ pageSize: 50 }),
  withRouteAdapter({
    base: "/api",
    endpoints: { list: "/users" },
  })
)(initialState);
```

## Adapter Pattern

The collection uses adapters to connect to different data sources. The recommended approach is to use the Route Adapter for REST APIs:

```typescript
interface CollectionAdapter<T> {
  read(params: AdapterParams): Promise<AdapterResponse<T>>;
}

// REST API Adapter
const restAdapter = {
  async read({ offset, limit, filters, sort }) {
    const response = await fetch("/api/items", {
      method: "POST",
      body: JSON.stringify({ offset, limit, filters, sort }),
    });
    return response.json();
  },
};

// GraphQL Adapter
const graphqlAdapter = {
  async read({ offset, limit }) {
    const query = `
      query GetItems($offset: Int!, $limit: Int!) {
        items(offset: $offset, limit: $limit) {
          nodes { id, name }
          totalCount
          hasNextPage
        }
      }
    `;
    const result = await graphqlClient.request(query, { offset, limit });
    return {
      items: result.items.nodes,
      total: result.items.totalCount,
      hasMore: result.items.hasNextPage,
    };
  },
};

// Static Data Adapter
const staticAdapter = {
  async read({ offset, limit }) {
    const items = staticData.slice(offset, offset + limit);
    return {
      items,
      total: staticData.length,
      hasMore: offset + limit < staticData.length,
    };
  },
};
```

## Route Adapter

The collection provides a powerful route adapter for REST API integration with advanced features:

### Basic Usage

```typescript
import { createCollection } from "mtrl-addons/core/collection";
import { createRouteAdapter } from "mtrl-addons/core/collection/features/adapter";

// Create route adapter
const routeAdapter = createRouteAdapter({
  base: "/api",
  endpoints: {
    list: "/users",
    create: "/users",
    update: "/users",
    delete: "/users",
  },
  headers: {
    Authorization: "Bearer token",
  },
});

// Create collection with route adapter
const collection = createCollection({
  adapter: routeAdapter,
  pageSize: 50,
});
```

### Pagination Strategies

The route adapter supports three pagination strategies:

#### 1. Cursor-based (default)

```typescript
const cursorAdapter = createRouteAdapter({
  base: "/api",
  pagination: {
    strategy: "cursor",
    indexName: "cursor", // Parameter name
    limitParam: "limit", // Limit parameter
    limitSize: 20, // Default limit
  },
});

// Usage: collection.loadPage(1) sends: /api/users?limit=20
// Next page uses cursor from response: /api/users?cursor=xyz&limit=20
```

#### 2. Offset-based

```typescript
const offsetAdapter = createRouteAdapter({
  base: "/api",
  pagination: {
    strategy: "offset",
    indexName: "offset",
    limitParam: "limit",
    limitSize: 50,
  },
});

// Usage: collection.loadRange(100, 150) sends: /api/users?offset=100&limit=50
```

#### 3. Page-based

```typescript
const pageAdapter = createRouteAdapter({
  base: "/api",
  pagination: {
    strategy: "page",
    indexName: "page",
    limitParam: "per_page",
    limitSize: 25,
  },
});

// Usage: collection.loadPage(3) sends: /api/users?page=3&per_page=25
```

### Query Operators

The route adapter supports advanced filtering with operators:

```typescript
// Query with operators
await collection.query({
  age: { gt: 18, lt: 65 }, // age > 18 AND age < 65
  status: { eq: "active" }, // status = 'active'
  tags: { in: ["vip", "premium"] }, // tags IN ['vip', 'premium']
  name: { contains: "john" }, // name CONTAINS 'john'
});

// Transforms to: /api/users?age_gt=18&age_lt=65&status_eq=active&tags_in=vip,premium&name_contains=john
```

Available operators:

- `eq` - Equal
- `ne` - Not equal
- `gt` - Greater than
- `gte` - Greater than or equal
- `lt` - Less than
- `lte` - Less than or equal
- `in` - In array
- `nin` - Not in array
- `contains` - Contains substring
- `startsWith` - Starts with
- `endsWith` - Ends with

### Response Parsing

The route adapter intelligently parses various response formats:

```typescript
// Standard format (recommended)
{
  items: [...],
  meta: {
    cursor: 'next-cursor',
    hasNext: true,
    total: 1000
  }
}

// Array response (auto-wrapped)
[...] // Becomes: { items: [...], meta: { hasNext: false } }

// Common API formats (auto-detected)
{
  data: [...],        // Laravel
  results: [...],     // Django
  content: [...],     // Spring
  pagination: {...}   // Various meta fields
}

// Custom parser
const customAdapter = createRouteAdapter({
  adapter: {
    parseResponse: (response) => ({
      items: response.users,
      meta: {
        cursor: response.nextPageToken,
        hasNext: response.hasMorePages,
        total: response.totalUsers
      }
    })
  }
});
```

### Advanced Features

#### Caching

```typescript
const cachedAdapter = createRouteAdapter({
  base: "/api",
  cache: true, // Enables 5-minute response caching
});
```

#### Error Handling

```typescript
const adapter = createRouteAdapter({
  onError: (error, context) => {
    console.error("API Error:", error, context);
    // Custom error handling
  },
});
```

#### Request Cancellation

```typescript
// All pending requests are automatically cancelled when:
collection.cancelLoading(); // Manual cancel
collection.disconnect(); // Cleanup
```

### Full Example

```typescript
import { createCollection } from "mtrl-addons/core/collection";
import { createRouteAdapter } from "mtrl-addons/core/collection/features/adapter";

// Configure route adapter
const adapter = createRouteAdapter({
  base: "https://api.example.com",
  endpoints: {
    list: "/v1/users",
    create: "/v1/users",
    update: "/v1/users",
    delete: "/v1/users",
  },
  headers: {
    Authorization: `Bearer ${authToken}`,
    "X-API-Version": "1.0",
  },
  pagination: {
    strategy: "cursor",
    limitSize: 100,
  },
  cache: true,
  onError: (error) => {
    notifyError(error.message);
  },
});

// Create collection
const userCollection = createCollection({
  adapter,
  transform: (user) => ({
    ...user,
    fullName: `${user.firstName} ${user.lastName}`,
    avatar: user.avatar || "/default-avatar.png",
  }),
});

// Use with viewport
const viewport = createViewport({
  collection: userCollection,
  estimatedItemSize: 84,
})(component);

// Advanced queries
await userCollection.query(
  {
    role: { in: ["admin", "moderator"] },
    lastLogin: { gte: new Date("2024-01-01") },
    email: { endsWith: "@company.com" },
  },
  {
    sort: "-lastLogin", // Sort by lastLogin descending
    fields: ["id", "name", "email", "role"], // Select specific fields
    search: "john", // Full-text search
  }
);
```

## Performance Tips

1. **Use appropriate `rangeSize`** - Larger ranges mean fewer requests but more memory
2. **Enable caching** - Reduces redundant API calls (route adapter has built-in caching)
3. **Debounce operations** - Avoid excessive filtering/sorting
4. **Use transforms wisely** - Heavy transforms impact performance
5. **Monitor loaded ranges** - Clear unused ranges to free memory
6. **Batch operations** - Apply multiple filters before triggering updates
7. **Choose right pagination** - Cursor is best for real-time data, offset for stable datasets

## Global Configuration

You can control collection behavior globally by modifying the constants:

```typescript
import { COLLECTION_CONSTANTS } from "mtrl-addons/core/collection/constants";

// Change default page size
COLLECTION_CONSTANTS.DATA_PAGINATION.DEFAULT_PAGE_SIZE = 50;

// Adjust API timeouts
COLLECTION_CONSTANTS.API_ADAPTER.DEFAULT_TIMEOUT = 60000; // 1 minute

// Configure search behavior
COLLECTION_CONSTANTS.DATA_SEARCH.SEARCH_DEBOUNCE = 500; // 500ms

// Set cache limits (when feature is added)
COLLECTION_CONSTANTS.DATA_CACHE.DEFAULT_MAX_SIZE = 5000;
```

These changes affect all collections created after the modification.

## Advanced Configuration

```typescript
// Configure collection with all options
const collectionConfig = {
  // Data source
  adapter: myAdapter,
  items: initialItems,

  // Loading
  pageSize: 100,
  rangeSize: 200,

  // Transformation
  transform: (raw) => ({
    ...raw,
    computed: calculateValue(raw),
  }),

  // Future features configuration
  cache: {
    enabled: true,
    maxSize: 2000,
    maxAge: 3600000, // 1 hour
  },

  persistence: {
    enabled: true,
    strategy: "indexedDB",
    key: "my-collection",
  },

  validation: {
    enabled: true,
    strict: false,
    schema: myValidationSchema,
  },
};

// Create collection with future features
const advancedCollection = pipe(
  createCollection(collectionConfig),
  // Add features as they become available
  withCache(collectionConfig.cache),
  withPersistence(collectionConfig.persistence),
  withValidation(collectionConfig.validation),
  withWebWorkers({ enabled: true })
)(initialState);
```

## Integration with Viewport

The collection is designed to work seamlessly with the viewport:

```typescript
import { createViewport } from "mtrl-addons/core/viewport";
import { createCollection } from "mtrl-addons/core/collection";
import { createRouteAdapter } from "mtrl-addons/core/collection/features/adapter";

// Create route adapter
const adapter = createRouteAdapter({
  base: "/api",
  endpoints: { list: "/users" },
  pagination: { strategy: "cursor" },
});

// Create collection
const collection = createCollection({
  adapter,
  rangeSize: 100,
});

// Create viewport with collection
const viewport = createViewport({
  collection,
  estimatedItemSize: 84,
  enablePlaceholders: true,
})(component);

// Viewport automatically loads ranges as needed
viewport.on("rangechange", ({ start, end }) => {
  // Collection loads data automatically
});
```

## Future Features

The collection architecture supports adding these features progressively:

- **Caching** - In-memory and persistent caching
- **Persistence** - Save/restore collection state
- **Validation** - Schema-based data validation
- **Web Workers** - Background data processing
- **Aggregation** - Sum, count, average operations
- **Transactions** - Batch updates with rollback
- **Sync** - Real-time data synchronization
- **Offline** - Offline-first capabilities
