# Route Adapter

A lightweight, flexible adapter for connecting to REST APIs with optimized features for pagination, query transformation, caching, and error handling.

<!-- ## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [Configuration](#configuration)
- [Pagination Strategies](#pagination-strategies)
  - [Cursor-Based Pagination](#cursor-based-pagination)
  - [Page-Based Pagination](#page-based-pagination)
  - [Offset-Based Pagination](#offset-based-pagination)
  - [Dynamic Pagination Strategy](#dynamic-pagination-strategy)
  - [Pagination Response Format](#pagination-response-format)
  - [Custom Response Parsing](#custom-response-parsing)
- [Query Operations](#query-operations)
  - [Basic Querying](#basic-querying)
  - [Advanced Filtering](#advanced-filtering)
  - [Query Operators](#query-operators)
  - [Sorting](#sorting)
  - [Field Selection](#field-selection)
  - [Search](#search)
- [Caching](#caching)
- [Error Handling](#error-handling)
- [Advanced Features](#advanced-features)
  - [Custom Headers](#custom-headers)
  - [Request Aborting](#request-aborting)
  - [URL Management](#url-management)
- [Performance Optimizations](#performance-optimizations)
- [Common Patterns](#common-patterns)
  - [Integration with Collections](#integration-with-collections)
  - [Handling Authentication](#handling-authentication)
  - [Working with Real-World APIs](#working-with-real-world-apis)
- [API Reference](#api-reference)
- [Troubleshooting](#troubleshooting) -->

## Overview

The Route Adapter provides a consistent interface for interacting with REST APIs while abstracting away the complexities of different pagination methods, query parameter formats, and response structures. It's designed to be lightweight, performant, and flexible.

Key features:

- Support for multiple pagination strategies (cursor, page, offset)
- Advanced query parameter transformation
- Intelligent response parsing
- Efficient request caching
- Automatic request cancellation
- Error handling with context
- URL parameter optimization
- Compatible with both browser and server environments

## Installation

This module is part of the core collection toolset and doesn't require separate installation if you're already using the collection module.

## Basic Usage

```typescript
import { createRouteAdapter } from 'core/collection/adapters/route';

// Create an adapter instance
const usersAdapter = createRouteAdapter({
  base: 'https://api.example.com/api',
  endpoints: {
    list: '/users',
    create: '/users',
    update: '/users/:id',
    delete: '/users/:id'
  },
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer TOKEN'
  }
});

// Read data from the API
const response = await usersAdapter.read({
  role: 'admin',
  status: 'active'
}, {
  sort: 'lastName,firstName',
  limit: 50
});

console.log(`Found ${response.items.length} users`);
console.log('Has more?', response.meta.hasNext);

// Create new items
const newUser = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com'
};

const createResponse = await usersAdapter.create([newUser]);
const createdUser = createResponse.items[0];

// Update an item
await usersAdapter.update([{
  id: createdUser.id,
  role: 'editor'
}]);

// Delete an item
await usersAdapter.delete([createdUser.id]);

// Clean up when done
usersAdapter.disconnect();
```

## Configuration

The Route Adapter accepts a variety of configuration options:

```typescript
interface RouteAdapterConfig {
  // Base URL for all requests
  base?: string;

  // API endpoints (relative to base)
  endpoints?: {
    create?: string;
    list?: string;
    update?: string;
    delete?: string;
  };

  // Default request headers
  headers?: Record<string, string>;

  // Enable response caching
  cache?: boolean;

  // Error handler
  onError?: (error: Error, context?: any) => void;

  // Custom adapter options
  adapter?: {
    parseResponse?: (response: any) => any;
  };

  // Pagination configuration
  pagination?: PaginationConfig;
}

interface PaginationConfig {
  // Pagination strategy to use: 'cursor', 'page', or 'offset'
  strategy: PaginationStrategy;
  
  // Parameter names for each strategy (customizable)
  cursorParamName?: string;
  pageParamName?: string;
  perPageParamName?: string;
  offsetParamName?: string;
  limitParamName?: string;
  
  // Default number of items per page
  defaultPageSize?: number;
}
```

## Pagination Strategies

The Route Adapter supports three primary pagination strategies, each designed for different API conventions and use cases.

### Cursor-Based Pagination

Cursor-based pagination (also known as keyset pagination) is ideal for large datasets, real-time data, and scenarios where items might be added or removed while paginating. It uses a cursor (pointer) from the current page to find the next set of results.

**When to use:**

- Large datasets where offset-based pagination would be inefficient
- Data that changes frequently
- When you need consistent pagination even as data is modified
- With sorted data (typically by ID or creation date)

**Configuration:**

```typescript
const adapter = createRouteAdapter({
  base: 'https://api.example.com/api',
  pagination: {
    strategy: 'cursor',                // Specify cursor strategy
    cursorParamName: 'cursor',         // Parameter name for cursor (default)
    limitParamName: 'limit',           // Parameter name for limit (default)
    defaultPageSize: 25                // Items per page (default: 20)
  }
});
```

**Usage Example:**

```typescript
// Initial request (no cursor for first page)
const firstPage = await adapter.read({ limit: 25 });

// Next page uses the cursor from previous response
if (firstPage.meta.hasNext && firstPage.meta.cursor) {
  const secondPage = await adapter.read({
    cursor: firstPage.meta.cursor,
    limit: 25
  });
  
  // Continue pagination
  if (secondPage.meta.hasNext) {
    const thirdPage = await adapter.read({
      cursor: secondPage.meta.cursor,
      limit: 25
    });
  }
}
```

This generates requests like:
- First page: `GET /api/users?limit=25`
- Second page: `GET /api/users?cursor=eyJpZCI6MTAwfQ==&limit=25`

**Common API Response Formats:**

```javascript
// Format 1 - cursor in "next" field
{
  "items": [...],
  "pagination": {
    "next": "eyJpZCI6MTAwfQ==",
    "hasMore": true
  }
}

// Format 2 - explicit cursor field
{
  "data": [...],
  "meta": {
    "cursor": "eyJpZCI6MTAwfQ==",
    "hasNext": true
  }
}

// Format 3 - cursor as a URL
{
  "results": [...],
  "links": {
    "next": "https://api.example.com/users?cursor=eyJpZCI6MTAwfQ=="
  }
}
```

The adapter automatically extracts the cursor and `hasNext` status from these common formats.

### Page-Based Pagination

Page-based pagination is the most traditional approach where you request a specific page number. This is intuitive for users familiar with "Page 1, 2, 3..." navigation.

**When to use:**

- User interfaces that display explicit page numbers
- When you need to show "Page X of Y" indicators
- For smaller datasets where jumping to arbitrary pages is helpful
- Simpler admin interfaces or reports

**Configuration:**

```typescript
const adapter = createRouteAdapter({
  base: 'https://api.example.com/api',
  pagination: {
    strategy: 'page',                  // Specify page strategy
    pageParamName: 'page',             // Parameter for page number (default)
    perPageParamName: 'per_page',      // Parameter for page size (default)
    defaultPageSize: 20                // Items per page (default: 20)
  }
});
```

**Usage Example:**

```typescript
// Get page 1
const page1 = await adapter.read({ page: 1, per_page: 20 });

// Get information about total pages
const totalPages = page1.meta.pages;
const totalItems = page1.meta.total;
console.log(`Showing page 1 of ${totalPages} (${totalItems} total items)`);

// Get a specific page
const page3 = await adapter.read({ page: 3, per_page: 20 });

// Navigate through pages sequentially
for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
  const pageData = await adapter.read({ page: pageNum, per_page: 20 });
  processItems(pageData.items);
}
```

This generates requests like:
- `GET /api/users?page=1&per_page=20`
- `GET /api/users?page=3&per_page=20`

**Common API Response Formats:**

```javascript
// Format 1 - common meta structure
{
  "items": [...],
  "meta": {
    "page": 2,
    "per_page": 20,
    "total_pages": 10,
    "total": 195
  }
}

// Format 2 - pagination object
{
  "data": [...],
  "pagination": {
    "current_page": 2,
    "page_size": 20,
    "total_pages": 10,
    "total_items": 195
  }
}

// Format 3 - page info in root
{
  "results": [...],
  "page": 2,
  "pageCount": 10,
  "total": 195
}
```

The adapter normalizes these different formats into a consistent structure.

### Offset-Based Pagination

Offset-based pagination uses an offset (starting position) and limit (number of items) to determine which slice of data to return. This is common in SQL-based APIs and provides random access to any portion of the dataset.

**When to use:**

- When you need to jump to arbitrary positions in data
- For compatibility with SQL-based backends
- When implementing infinite scrolling UIs
- For simple APIs without cursor support

**Configuration:**

```typescript
const adapter = createRouteAdapter({
  base: 'https://api.example.com/api',
  pagination: {
    strategy: 'offset',                // Specify offset strategy
    offsetParamName: 'offset',         // Parameter for offset (default)
    limitParamName: 'limit',           // Parameter for limit (default)
    defaultPageSize: 25                // Items per page (default: 20)
  }
});
```

**Usage Example:**

```typescript
// Initial request (offset 0)
const firstBatch = await adapter.read({ offset: 0, limit: 25 });

// Next batch
const secondBatch = await adapter.read({ offset: 25, limit: 25 });

// Jump to a specific position
const jumpTo200 = await adapter.read({ offset: 200, limit: 25 });

// For infinite scrolling, increment the offset by the number of items received
let currentOffset = 0;
const loadMoreItems = async () => {
  const response = await adapter.read({ offset: currentOffset, limit: 25 });
  currentOffset += response.items.length;
  return response.items;
};
```

This generates requests like:
- `GET /api/users?offset=0&limit=25`
- `GET /api/users?offset=25&limit=25`
- `GET /api/users?offset=200&limit=25`

**Common API Response Formats:**

```javascript
// Format 1 - standard offset pagination
{
  "items": [...],
  "meta": {
    "offset": 50,
    "limit": 25,
    "total": 327
  }
}

// Format 2 - pagination object
{
  "data": [...],
  "pagination": {
    "offset": 50,
    "limit": 25,
    "count": 327
  }
}

// Format 3 - minimal information
{
  "results": [...],
  "count": 327
}
```

### Dynamic Pagination Strategy

You can change the pagination strategy at runtime to accommodate different API endpoints or evolving requirements:

```typescript
// Create with default strategy (cursor-based)
const adapter = createRouteAdapter({
  base: 'https://api.example.com/api'
});

// Initial query using cursor-based pagination
const cursorResults = await adapter.read({ limit: 20 });

// Switch to page-based pagination for a different endpoint
adapter.setPaginationStrategy('page');

// Now using page-based parameters
const pageResults = await adapter.read({ page: 1, per_page: 20 });

// Switch to offset-based pagination for another endpoint
adapter.setPaginationStrategy('offset');

// Now using offset-based parameters
const offsetResults = await adapter.read({ offset: 0, limit: 20 });

// You can also inspect the current pagination configuration
const config = adapter.getPaginationConfig();
console.log(`Current strategy: ${config.strategy}`);
```

This is especially useful when working with multiple APIs or endpoints that use different pagination conventions.

### Pagination Response Format

Regardless of the pagination strategy used or the format of the API response, the Route Adapter normalizes the response into a consistent structure:

```typescript
interface ParsedResponse<T = any> {
  // Items returned by the API
  items: T[];
  
  // Pagination metadata
  meta: {
    // Cursor for the next page (null if no more pages)
    cursor: string | null;
    
    // Whether there are more items available
    hasNext: boolean;
    
    // Optional total number of items (if provided by API)
    total?: number;
    
    // Optional current page number (page-based pagination)
    page?: number;
    
    // Optional total number of pages (page-based pagination)
    pages?: number;
    
    // Optional current offset (offset-based pagination)
    offset?: number;
  };
}
```

This consistent format makes it easier to work with different APIs without having to adapt your code to each one's pagination scheme.

### Custom Response Parsing

For APIs with unique or nested response formats, you can provide a custom response parser:

```typescript
const adapter = createRouteAdapter({
  base: 'https://api.example.com/api',
  adapter: {
    parseResponse: (response) => {
      // Example: API returns data in a nested "data.records" path
      const items = response.data?.records || [];
      
      // Extract pagination information from a custom location
      const meta = {
        cursor: response.data?.pagination?.nextCursor || null,
        hasNext: Boolean(response.data?.pagination?.hasMore),
        total: response.data?.pagination?.totalRecords
      };
      
      return { items, meta };
    }
  }
});
```

This allows you to handle virtually any API response format while still maintaining a consistent interface for the rest of your application.

## Query Operations

The Route Adapter provides a rich set of options for querying, filtering, and manipulating the data you retrieve from the API.

### Basic Querying

The simplest way to query the API is to pass field name and value pairs:

```typescript
// Simple field equality
const activeUsers = await adapter.read({
  status: 'active',
  role: 'user'
});
// Generates: ?status=active&role=user
```

### Advanced Filtering

For more complex filtering, you can use the query operators:

```typescript
import { OPERATORS } from 'core/collection/adapters/base';

// Find users created after a certain date with specific roles
const result = await adapter.read({
  createdAt: { [OPERATORS.GT]: '2023-01-01' },
  role: { [OPERATORS.IN]: ['admin', 'editor'] },
  status: { [OPERATORS.NE]: 'deleted' }
});
// Generates: ?createdAt_gt=2023-01-01&role_in=admin&role_in=editor&status_ne=deleted
```

### Query Operators

The adapter supports a variety of operators for advanced filtering:

| Operator | Description | Example |
|----------|-------------|---------|
| `EQ` | Equals (default) | `{ name: { EQ: 'John' } }` or just `{ name: 'John' }` |
| `NE` | Not equals | `{ status: { NE: 'deleted' } }` |
| `GT` | Greater than | `{ age: { GT: 18 } }` |
| `GTE` | Greater than or equal | `{ price: { GTE: 100 } }` |
| `LT` | Less than | `{ quantity: { LT: 10 } }` |
| `LTE` | Less than or equal | `{ priority: { LTE: 3 } }` |
| `IN` | In array of values | `{ category: { IN: ['books', 'movies'] } }` |
| `NIN` | Not in array | `{ tag: { NIN: ['archived', 'draft'] } }` |
| `CONTAINS` | String contains | `{ name: { CONTAINS: 'john' } }` |
| `STARTS_WITH` | String starts with | `{ email: { STARTS_WITH: 'admin' } }` |
| `ENDS_WITH` | String ends with | `{ domain: { ENDS_WITH: '.com' } }` |

These operators are automatically transformed into appropriate URL parameters for the API.

### Sorting

You can sort results using the `sort` parameter in the options object:

```typescript
// Single field ascending sort
const result = await adapter.read({}, { sort: 'lastName' });
// Generates: ?sort=lastName

// Single field descending sort
const result = await adapter.read({}, { sort: '-lastName' });
// Generates: ?sort=-lastName

// Multiple fields
const result = await adapter.read({}, { sort: 'lastName,firstName' });
// Generates: ?sort=lastName,firstName

// Alternative format for some APIs
const result = await adapter.read({}, { sort: 'lastName:asc,firstName:desc' });
// Generates: ?sort=lastName:asc,firstName:desc
```

### Field Selection

You can specify which fields to include in the response:

```typescript
// Get only specific fields
const result = await adapter.read({}, { fields: 'id,name,email' });
// Generates: ?fields=id,name,email
```

This is useful for optimizing response size when you only need a subset of fields.

### Search

Many APIs support a search parameter for full-text search:

```typescript
// Full-text search
const result = await adapter.read({ search: 'john doe' });
// Generates: ?search=john%20doe
```

## Caching

The Route Adapter includes built-in response caching to improve performance and reduce redundant API calls:

```typescript
// Enable caching in adapter configuration
const adapter = createRouteAdapter({
  base: 'https://api.example.com/api',
  cache: true  // Enable caching
});

// First request goes to the API
const result1 = await adapter.read({ status: 'active' });

// Second identical request uses cached response
const result2 = await adapter.read({ status: 'active' });

// Different query parameters bypass the cache
const result3 = await adapter.read({ status: 'inactive' });

// Cache is automatically cleared when adapter is disconnected
adapter.disconnect();
```

The cache uses the full URL as the key and keeps responses for 5 minutes by default.

## Error Handling

The Route Adapter provides several ways to handle errors:

```typescript
// Global error handler in configuration
const adapter = createRouteAdapter({
  base: 'https://api.example.com/api',
  onError: (error, context) => {
    console.error('API error:', error.message, context);
    // Log to monitoring service, show notification, etc.
  }
});

// Try-catch for specific operations
try {
  const result = await adapter.read({ invalidParam: true });
} catch (error) {
  console.error('Error fetching data:', error.message);
  // Handle specific error case
}
```

The adapter enhances errors with useful context and consistent formatting.

## Advanced Features

### Custom Headers

You can set default headers for all requests:

```typescript
const adapter = createRouteAdapter({
  base: 'https://api.example.com/api',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + getToken(),
    'X-API-Key': apiKey,
    'Accept-Language': 'en-US'
  }
});
```

### Request Aborting

The adapter automatically cancels in-flight requests when new ones are made, preventing race conditions and wasted network traffic:

```typescript
// If the user types quickly in a search box:
searchBox.addEventListener('input', async (e) => {
  const searchTerm = e.target.value;
  
  // Each new request will cancel any previous pending request
  const results = await adapter.read({ search: searchTerm });
  updateResultsList(results.items);
});
```

This is handled internally via the AbortController API.

### URL Management

The adapter includes advanced URL management features:

```typescript
// The adapter carefully builds URLs to ensure they work correctly
const adapter = createRouteAdapter({
  // Works with absolute URLs
  base: 'https://api.example.com/api',
  
  // Works with relative URLs
  // base: '/api',
  
  endpoints: {
    list: '/users',
    // Path parameters are supported
    update: '/users/:id'
  }
});

// URL caching for better performance
const results = await adapter.read({ status: 'active' });
```

URL caching improves performance by avoiding repeated URL generation for identical queries.

## Performance Optimizations

The Route Adapter includes several performance optimizations:

1. **URL caching**: Identical request URLs are cached to avoid redundant URL generation
2. **Response caching**: API responses are cached to reduce network requests
3. **Request aborting**: Superseded requests are automatically canceled
4. **Minimal object creation**: The adapter reuses objects where possible to reduce garbage collection
5. **Optimized parameter handling**: Multiple values for the same parameter are handled efficiently
6. **Intelligent defaults**: Reasonable defaults reduce the need for configuration

These optimizations ensure that the adapter remains lightweight and performant even when used in high-frequency scenarios like search-as-you-type.

## Common Patterns

### Integration with Collections

The Route Adapter is designed to work seamlessly with the Collection module:

```typescript
import { createCollection } from 'core/collection';
import { createRouteAdapter } from 'core/collection/adapters/route';

// Create adapter
const adapter = createRouteAdapter({
  base: 'https://api.example.com/api',
  endpoints: {
    list: '/users'
  }
});

// Create collection
const users = createCollection<User>({
  transform: data => ({
    id: data._id || data.id,
    name: data.name || 'Unknown',
    email: data.email || '',
    role: data.role || 'user'
  })
});

// Load data from API to collection
const fetchUsers = async () => {
  const response = await adapter.read({ status: 'active' });
  await users.add(response.items);
  return users.getItems();
};
```

### Handling Authentication
  
You can handle authentication tokens in several ways:

```typescript
// 1. Set token at adapter creation
const token = getAuthToken();
const adapter = createRouteAdapter({
  base: 'https://api.example.com/api',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// 2. Update token when it changes
function updateToken(newToken) {
  adapter.disconnect(); // Clean up old requests
  
  // Create new adapter with updated token
  const updatedAdapter = createRouteAdapter({
    base: 'https://api.example.com/api',
    headers: {
      'Authorization': `Bearer ${newToken}`
    }
  });
  
  return updatedAdapter;
}

// 3. Handle token refresh with custom request wrapper
async function apiRequest(fn) {
  try {
    return await fn();
  } catch (error) {
    if (error.message.includes('401') || error.message.includes('unauthorized')) {
      // Token expired, refresh and retry
      const newToken = await refreshToken();
      adapter = updateToken(newToken);
      return await fn(); // Retry the request
    }
    throw error;
  }
}

// Use the wrapper
const users = await apiRequest(() => adapter.read({ role: 'admin' }));
```

### Working with Real-World APIs

Here are examples of using the adapter with common real-world API patterns:

**GitHub API (Link Header Pagination)**

```typescript
const githubAdapter = createRouteAdapter({
  base: 'https://api.github.com',
  headers: {
    'Accept': 'application/vnd.github.v3+json',
    'Authorization': `token ${githubToken}`
  },
  // Custom response parser for GitHub's Link header pagination
  adapter: {
    parseResponse: (response) => {
      // Extract Link header for pagination
      const linkHeader = response.headers?.get('Link') || '';
      const links = linkHeader.split(',').reduce((acc, link) => {
        const [url, rel] = link.split(';');
        const match = rel.match(/rel="([^"]+)"/);
        if (match) {
          acc[match[1]] = url.trim().slice(1, -1);
        }
        return acc;
      }, {});
      
      return {
        items: response.data || [],
        meta: {
          cursor: links.next ? new URL(links.next).searchParams.get('page') : null,
          hasNext: !!links.next
        }
      };
    }
  }
});
```

**REST API with Envelope Format**

```typescript
const apiAdapter = createRouteAdapter({
  base: 'https://api.example.com/v2',
  adapter: {
    parseResponse: (response) => {
      // Handle envelope format: { status, code, data }
      if (response.status === 'success' && response.data) {
        return {
          items: response.data.items || [],
          meta: {
            cursor: response.data.pagination?.next || null,
            hasNext: !!response.data.pagination?.hasMorePages,
            total: response.data.pagination?.total
          }
        };
      }
      
      // Handle error responses
      if (response.status === 'error') {
        throw new Error(response.message || 'API error');
      }
      
      // Fallback for unexpected formats
      return { items: [], meta: { cursor: null, hasNext: false } };
    }
  }
});
```

## API Reference

### createRouteAdapter

```typescript
function createRouteAdapter(config: RouteAdapterConfig): RouteAdapter;
```

Creates a new route adapter instance with the specified configuration.

### RouteAdapter Interface

```typescript
interface RouteAdapter {
  // Create one or more items
  create: (items: any[]) => Promise<ParsedResponse>;
  
  // Read items with query parameters
  read: (query?: Record<string, any>, options?: Record<string, any>) => Promise<ParsedResponse>;
  
  // Update one or more items
  update: (items: any[]) => Promise<ParsedResponse>;
  
  // Delete items by ID
  delete: (ids: string[]) => Promise<ParsedResponse>;
  
  // Advanced query with more options
  query: (query?: Record<string, any>, options?: Record<string, any>) => Promise<ParsedResponse>;
  
  // Change pagination strategy at runtime
  setPaginationStrategy: (strategy: PaginationStrategy) => void;
  
  // Get current pagination configuration
  getPaginationConfig: () => Required<PaginationConfig>;
  
  // Clean up resources and abort pending requests
  disconnect: () => void;
}
```

### OPERATORS

```typescript
const OPERATORS = {
  EQ: 'eq',    // Equal
  NE: 'ne',    // Not equal
  GT: 'gt',    // Greater than
  GTE: 'gte',  // Greater than or equal
  LT: 'lt',    // Less than
  LTE: 'lte',  // Less than or equal
  IN: 'in',    // In array
  NIN: 'nin',  // Not in array
  CONTAINS: 'contains',        // String contains
  STARTS_WITH: 'startsWith',   // String starts with
  ENDS_WITH: 'endsWith'        // String ends with
};
```

Constants for query operators used in filter conditions.

## Troubleshooting

**API returns unexpected format**

If the API returns data in a format that the adapter doesn't recognize automatically, use a custom response parser:

```typescript
const adapter = createRouteAdapter({
  // ...other config
  adapter: {
    parseResponse: (response) => {
      console.log('Raw API response:', response);
      // Implement custom parsing based on the actual response structure
    }
  }
});
```

**Authentication errors**

If you're encountering authentication errors:

1. Check that your authentication headers are correctly formatted
2. Verify that your token is valid and not expired
3. Implement token refresh as shown in the "Handling Authentication" section

**Requests are being aborted unexpectedly**

The adapter automatically aborts previous requests when new ones are made. If this is causing issues:

1. Create separate adapter instances for independent request streams
2. Ensure you're not making redundant calls for the same data
3. Consider disabling caching if it's causing stale data issues

**URL generation issues**

If the adapter is generating incorrect URLs:

1. Check the `base` URL configuration
2. Verify endpoint paths
3. Make sure the query parameters are formatted correctly for your API

**Performance concerns**

If you're experiencing performance issues:

1. Enable caching to reduce redundant network requests
2. Use field selection to reduce response size
3. Implement appropriate batching for create/update/delete operations
4. Consider using a more efficient pagination strategy (cursor-based typically performs best)