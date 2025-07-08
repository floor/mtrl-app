# Collection System Technical Blueprint

## Overview

The Collection System is the **pure data management layer** in the 3-layer mtrl-addons architecture. It handles data operations, state management, API integration, and data persistence - with **zero DOM manipulation or performance concerns**.

## 3-Layer Architecture

```
Collection (Data Layer)           ← THIS BLUEPRINT
    ↓
List Manager (Performance Layer)   ← Separate Blueprint
    ↓
List Component (Presentation Layer) ← mtrl Integration
```

## Collection Responsibilities (Data Only)

### ✅ What Collection DOES Handle:

- **Data State Management** - items, loading, error states
- **API Integration** - adapters, pagination parameters
- **Data Persistence** - localStorage, indexedDB, offline sync
- **Data Transformation** - validation, normalization, filtering
- **Data Events** - items:added, items:updated, loading:start
- **Data Caching** - intelligent data caching strategies
- **Background Operations** - prefetching, web workers

### ❌ What Collection DOES NOT Handle:

- DOM manipulation (List Manager responsibility)
- Virtual scrolling (List Manager responsibility)
- Element recycling (List Manager responsibility)
- CSS classes (List Component responsibility)
- Scroll behavior (List Manager responsibility)
- Performance optimization (List Manager responsibility)

## Core Architecture

### System Structure

```
src/core/collection/
├── index.ts                    # Main exports
├── collection.ts               # Core collection data management
├── state.ts                    # Reactive state management
├── events.ts                   # Event system
├── types.ts                    # Core type definitions
├── constants.ts                # Data-related constants
├── features/                   # Data features (plugin system)
│   ├── persistence/            # localStorage, indexedDB plugins
│   │   ├── local-storage.ts    # localStorage plugin
│   │   ├── indexed-db.ts       # indexedDB plugin
│   │   ├── offline-sync.ts     # offline synchronization
│   │   └── index.ts
│   ├── validation/             # Data validation plugins
│   │   ├── schema.ts           # Schema validation
│   │   ├── sanitization.ts     # Data sanitization
│   │   └── index.ts
│   ├── transformation/         # Data transformation plugins
│   │   ├── normalize.ts        # Data normalization
│   │   ├── aggregate.ts        # Data aggregation
│   │   └── index.ts
│   ├── caching/               # Data caching plugins
│   │   ├── memory-cache.ts    # In-memory caching
│   │   ├── lru-cache.ts       # LRU caching strategy
│   │   └── index.ts
│   └── background/            # Background processing plugins
│       ├── web-workers.ts     # Web worker integration
│       ├── prefetch.ts        # Data prefetching
│       └── index.ts
└── adapters/                  # Data source adapters
    ├── rest-adapter.ts        # REST API adapter
    ├── graphql-adapter.ts     # GraphQL adapter
    ├── websocket-adapter.ts   # WebSocket adapter
    └── index.ts
```

## Core Types

### Base Types

```typescript
// Core item interface
export interface CollectionItem {
  id: string;
  [key: string]: any;
}

// Collection configuration (DATA ONLY)
export interface CollectionConfig<T extends CollectionItem> {
  // Data source
  adapter?: CollectionAdapter<T>;
  items?: T[];

  // Data processing
  transform?: (item: any) => T;
  validate?: (item: T) => boolean;
  normalize?: (items: T[]) => T[];

  // Data persistence
  persistence?: PersistenceConfig;
  cache?: CacheConfig;

  // Background processing
  webWorkers?: WebWorkerConfig;
  prefetch?: PrefetchConfig;

  // No DOM/UI properties - those belong to List Manager/Component
}

// Data adapter interface
export interface CollectionAdapter<T> {
  read(params: AdapterParams): Promise<AdapterResponse<T>>;
  create?(item: Omit<T, "id">): Promise<T>;
  update?(id: string, item: Partial<T>): Promise<T>;
  delete?(id: string): Promise<void>;
}

export interface AdapterParams {
  // Pagination parameters (data concerns)
  page?: number;
  limit?: number;
  cursor?: string;
  offset?: number;

  // Data filtering/sorting (data concerns)
  filter?: Record<string, any>;
  sort?: Array<{ field: string; direction: "asc" | "desc" }>;

  // Custom parameters
  [key: string]: any;
}

export interface AdapterResponse<T> {
  items: T[];
  meta: {
    total?: number;
    page?: number;
    hasNext?: boolean;
    hasPrev?: boolean;
    nextCursor?: string;
    prevCursor?: string;
    filter?: Record<string, any>;
    sort?: Array<{ field: string; direction: "asc" | "desc" }>;
  };
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}
```

### Data Persistence Types

```typescript
// Persistence configuration
export interface PersistenceConfig {
  strategy: "localStorage" | "indexedDB" | "custom";
  key: string;
  version?: number;
  encryption?: boolean;
  compression?: boolean;
  syncInterval?: number;
  maxAge?: number;
}

// Cache configuration
export interface CacheConfig {
  strategy: "memory" | "lru" | "custom";
  maxSize: number;
  maxAge: number;
  invalidationStrategy?: "time" | "version" | "manual";
}

// Web worker configuration
export interface WebWorkerConfig {
  enabled: boolean;
  workerScript?: string;
  operations: Array<"transform" | "validate" | "normalize" | "filter" | "sort">;
  transferableObjects?: boolean;
}
```

### Data Event Types

```typescript
// Data-focused events (NO UI events)
export interface CollectionEventPayload<T = any> {
  event: CollectionDataEvents;
  data: T;
  timestamp: number;
  source: "collection";
}

export enum CollectionDataEvents {
  // Data lifecycle
  ITEMS_LOADED = "items:loaded",
  ITEMS_ADDED = "items:added",
  ITEMS_UPDATED = "items:updated",
  ITEMS_REMOVED = "items:removed",
  ITEMS_CLEARED = "items:cleared",

  // Data state
  LOADING_START = "loading:start",
  LOADING_END = "loading:end",
  ERROR_OCCURRED = "error:occurred",

  // Data operations
  CACHE_HIT = "cache:hit",
  CACHE_MISS = "cache:miss",
  SYNC_START = "sync:start",
  SYNC_COMPLETE = "sync:complete",

  // Background operations
  PREFETCH_START = "prefetch:start",
  PREFETCH_COMPLETE = "prefetch:complete",
  WORKER_TASK_START = "worker:task:start",
  WORKER_TASK_COMPLETE = "worker:task:complete",
}

// NO UI events like scroll, render, viewport changes
```

## Core Collection API (Data Only)

```typescript
export interface Collection<T extends CollectionItem> {
  // Data operations
  getItems(): T[];
  getItem(id: string): T | undefined;
  addItems(items: T[]): Promise<T[]>;
  updateItems(items: Partial<T>[]): Promise<T[]>;
  removeItems(ids: string[]): Promise<void>;
  clearItems(): Promise<void>;

  // Data queries
  filter(predicate: (item: T) => boolean): T[];
  sort(compareFn: (a: T, b: T) => number): T[];
  search(query: string, fields?: string[]): T[];
  aggregate(operations: AggregateOperation[]): any;

  // Data loading
  loadPage(page: number): Promise<AdapterResponse<T>>;
  loadMore(): Promise<AdapterResponse<T>>;
  refresh(): Promise<AdapterResponse<T>>;
  prefetch(pages: number[]): Promise<void>;

  // Data state
  getSize(): number;
  getTotalCount(): number;
  isLoading(): boolean;
  getError(): Error | null;
  hasMore(): boolean;
  getCurrentPage(): number;

  // Data persistence
  save(): Promise<void>;
  load(): Promise<void>;
  clearCache(): Promise<void>;
  sync(): Promise<void>;

  // Events (data events only)
  subscribe(observer: CollectionObserver<T>): CollectionUnsubscribe;
  emit(event: CollectionDataEvents, data: any): void;

  // Lifecycle
  destroy(): void;

  // Plugin system for data features
  use(plugin: CollectionPlugin): Collection<T>;

  // NO UI methods - those belong to List Manager
  // ❌ scrollTo, render, viewport, measurements, etc.
}
```

## Plugin System for Data Features

```typescript
// Plugin interface for data features
export interface CollectionPlugin<T = any> {
  name: string;
  version: string;
  dependencies?: string[];

  install(collection: Collection<any>, config: T): void;
  uninstall?(collection: Collection<any>): void;
}

// Example data plugins
export const localStorage = (config: LocalStorageConfig): CollectionPlugin => ({
  name: "localStorage",
  version: "1.0.0",
  install: (collection, config) => {
    // Add localStorage capabilities to collection
  },
});

export const webWorkers = (config: WebWorkerConfig): CollectionPlugin => ({
  name: "webWorkers",
  version: "1.0.0",
  install: (collection, config) => {
    // Add web worker processing capabilities
  },
});

export const indexedDB = (config: IndexedDBConfig): CollectionPlugin => ({
  name: "indexedDB",
  version: "1.0.0",
  install: (collection, config) => {
    // Add indexedDB persistence capabilities
  },
});
```

## Usage Examples

### Basic Data Collection

```typescript
import { createCollection } from "mtrl-addons/collection";

// Pure data management
const userCollection = createCollection({
  adapter: {
    read: async (params) => {
      const response = await fetch(`/api/users?page=${params.page}`);
      return response.json();
    },
  },

  // Data transformation
  transform: (user) => ({
    id: user.id,
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    role: user.role,
    avatar: user.avatarUrl,
  }),

  // Data validation
  validate: (user) => user.id && user.name && user.email,
});

// Data operations
await userCollection.loadPage(1);
const users = userCollection.getItems();
const user = userCollection.getItem("123");
```

### Advanced Data Collection with Plugins

```typescript
import { createCollection } from "mtrl-addons/collection";
import {
  localStorage,
  webWorkers,
  indexedDB,
} from "mtrl-addons/collection/plugins";

const userCollection = createCollection({
  adapter: myAdapter,
  transform: transformUser,
  validate: validateUser,
})
  .use(
    localStorage({
      key: "users-cache",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    })
  )
  .use(
    webWorkers({
      enabled: true,
      operations: ["transform", "validate", "filter"],
    })
  )
  .use(
    indexedDB({
      database: "myapp",
      table: "users",
      version: 1,
    })
  );

// Background operations
userCollection.prefetch([2, 3, 4]); // Preload next pages
await userCollection.sync(); // Sync with server
```

## Integration with List Manager

```typescript
// Collection provides data, List Manager handles performance
const userCollection = createCollection(collectionConfig);
const listManager = createListManager({
  collection: userCollection, // Pass collection as data source
  itemHeight: "auto",
  virtualScrolling: true,
});

// Collection emits data events
userCollection.subscribe((payload) => {
  switch (payload.event) {
    case "items:loaded":
      listManager.updateItems(payload.data.items);
      break;
    case "loading:start":
      listManager.showLoading();
      break;
  }
});

// List Manager requests data via Collection
listManager.onScrollNearEnd(() => {
  userCollection.loadMore();
});
```

## Data Constants

```typescript
// Data-related constants only
export const DATA_CONSTANTS = {
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 20,
    DEFAULT_CURRENT_PAGE: 1,
    MAX_PREFETCH_PAGES: 5,
  },

  CACHE: {
    DEFAULT_MAX_SIZE: 1000,
    DEFAULT_MAX_AGE: 60 * 60 * 1000, // 1 hour
    CLEANUP_INTERVAL: 5 * 60 * 1000, // 5 minutes
  },

  PERSISTENCE: {
    DEFAULT_KEY_PREFIX: "mtrl-collection-",
    DEFAULT_VERSION: 1,
    SYNC_DEBOUNCE: 1000, // 1 second
  },

  WEB_WORKERS: {
    MAX_WORKERS: navigator.hardwareConcurrency || 4,
    TASK_TIMEOUT: 30000, // 30 seconds
    CHUNK_SIZE: 1000, // Items per worker task
  },
};

// NO UI constants - those belong to List Manager
```

## Performance Characteristics

### Data Operations

- **Memory Usage**: O(n) where n = cached items
- **Query Performance**: O(log n) with proper indexing
- **Load Performance**: Configurable batch sizes
- **Cache Hit Rate**: >90% with proper cache strategy
- **Background Processing**: Up to 4x faster with web workers

### Web Worker Integration

- **Transform Operations**: 3-5x faster for large datasets
- **Validation**: 2-4x faster for complex validation
- **Filtering/Sorting**: 2-6x faster for large lists
- **Non-blocking**: Main thread remains responsive

## Testing Strategy

### Data-Focused Tests

```typescript
describe("Collection Data Management", () => {
  test("loads data from adapter", async () => {
    const collection = createCollection({ adapter: mockAdapter });
    await collection.loadPage(1);
    expect(collection.getItems()).toHaveLength(20);
  });

  test("persists data to localStorage", async () => {
    const collection = createCollection(config).use(localStorage());
    await collection.save();
    expect(localStorage.getItem("collection-data")).toBeDefined();
  });

  test("processes data in web workers", async () => {
    const collection = createCollection(config).use(webWorkers());
    const items = await collection.transform(largeDataset);
    expect(items).toEqual(expectedTransformedData);
  });
});
```

## Implementation Phases

### Phase 1: Core Data Management (Week 1)

- ✅ Architecture documentation
- [ ] Core collection implementation
- [ ] State management system
- [ ] Event system
- [ ] Basic adapters (REST, GraphQL)

### Phase 2: Data Persistence (Week 2)

- [ ] localStorage plugin
- [ ] indexedDB plugin
- [ ] Offline sync capabilities
- [ ] Data caching strategies

### Phase 3: Performance Features (Week 3)

- [ ] Web worker integration
- [ ] Background prefetching
- [ ] Data transformation optimization
- [ ] Memory management

### Phase 4: Advanced Data Features (Week 4)

- [ ] Real-time data sync
- [ ] Conflict resolution
- [ ] Data validation pipeline
- [ ] Analytics and monitoring

This blueprint establishes the Collection as the pure data management foundation that powers the entire 3-layer system.
