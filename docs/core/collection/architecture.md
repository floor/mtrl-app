# Collection System Architecture

## Overview

The Collection System is the **pure data management layer** in the 3-layer mtrl-addons architecture. This document serves as the architectural implementation guide for the data layer only.

**Important**: This system leverages the extensive mtrl core infrastructure. See [`core.md`](./core.md) for a comprehensive overview of available mtrl core modules that we'll be using, including composition utilities, state management, and performance tools.

## 3-Layer Architecture Context

```
Collection (Data Layer)           ← THIS DOCUMENT
    ↓
List Manager (Performance Layer)   ← See list-manager/architecture.md
    ↓
List Component (Presentation Layer) ← mtrl Integration
```

## Collection Goals & Requirements

### Performance Targets (Data Layer Only)

- **Bundle Size**: < 5KB (pure data management)
- **Data Processing**: Handle 1M+ items efficiently
- **Memory Usage**: O(1) memory usage for data operations
- **API Response Time**: < 100ms for data transformations

### Functional Requirements (Data Only)

- **Data Persistence**: localStorage, indexedDB, offline sync
- **Background Processing**: Web workers for heavy data operations
- **Data Transformation**: Validation, normalization, aggregation
- **API Integration**: REST, GraphQL, WebSocket adapters
- **Data Caching**: Intelligent caching strategies
- **Real-time Updates**: Live data synchronization

### Quality Requirements

- **Zero UI Dependencies**: No DOM manipulation or performance concerns
- **Plugin Architecture**: Composable data features
- **TypeScript First**: Complete type safety for data operations
- **Framework Agnostic**: Works with any UI layer
- **Testable**: Pure functions for data operations

## Architecture Principles

### 1. Pure Data Management

- **Data Only**: Zero UI concerns, zero performance optimization
- **Single Responsibility**: Each module handles one data concern
- **Composition**: Data features composed using mtrl patterns
- **Functional Design**: Pure functions for predictable behavior

### 2. Plugin-Based Features

- **Data Plugins Only**: localStorage, web workers, validation, etc.
- **NO UI Plugins**: No virtual scrolling, templates, or DOM manipulation
- **Composable**: Mix and match data features as needed
- **Tree-shakable**: Include only needed data features

### 3. Event-Driven Data Flow

- **Data Events Only**: `items:loaded`, `loading:start`, `cache:hit`
- **NO UI Events**: No scroll, render, or viewport events
- **Loose Coupling**: Communicate via events with other layers
- **Predictable State**: Immutable data state management

## Module Structure (Pure Data)

```
mtrl-addons/src/core/collection/
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

## Core Data State Design

### Data State (NO UI State)

```typescript
interface CollectionDataState {
  // Data only
  items: any[];
  totalCount: number;
  loading: boolean;
  error: string | null;

  // Pagination data
  cursor: string | null;
  page: number;
  hasNext: boolean;
  hasPrevious: boolean;

  // Cache data
  cacheHits: number;
  cacheMisses: number;

  // Background processing
  workerTasks: number;
  prefetchQueue: string[];

  // NO UI state: scrollTop, containerHeight, visibleRange, etc.
}
```

### Data Events (NO UI Events)

```typescript
interface CollectionDataEvents {
  // Data lifecycle
  "items:loaded": { items: any[]; meta: any };
  "items:added": { items: any[]; indices: number[] };
  "items:updated": { items: any[]; indices: number[] };
  "items:removed": { ids: string[] };
  "items:cleared": {};

  // Data operations
  "loading:start": { reason: string };
  "loading:end": { reason: string };
  "error:occurred": { error: Error };

  // Cache operations
  "cache:hit": { key: string; size: number };
  "cache:miss": { key: string };
  "cache:cleared": { reason: string };

  // Background operations
  "worker:task:start": { operation: string; itemCount: number };
  "worker:task:complete": { operation: string; duration: number };
  "prefetch:start": { pages: number[] };
  "prefetch:complete": { items: any[] };

  // NO UI events: viewport:changed, scroll:changed, render:start, etc.
}
```

## Data Feature Architecture (mtrl Pattern)

### Data Feature Interface

```typescript
// Data features follow mtrl functional composition pattern
type CollectionDataFeature<T = any> = (
  config: T
) => (collection: BaseCollection) => EnhancedCollection;

// Example data feature signatures (using mtrl naming conventions)
export const withLocalStorage: (
  config: LocalStorageConfig
) => (collection: BaseCollection) => PersistentCollection;

export const withWebWorkers: (
  config: WebWorkerConfig
) => (collection: BaseCollection) => BackgroundProcessingCollection;

export const withValidation: (
  config: ValidationConfig
) => (collection: BaseCollection) => ValidatedCollection;
```

### Data Feature Composition (leverages mtrl core)

```typescript
import { pipe } from "mtrl/core/compose";
import { withEvents, withLifecycle } from "mtrl/core/compose/features";

const collection = pipe(
  createCollection(config),
  withEvents(), // From mtrl core
  withLifecycle(), // From mtrl core
  withLocalStorage(persistenceConfig),
  withWebWorkers(backgroundConfig),
  withValidation(validationConfig)
);
```

## API Design (Data Only)

### Simple Data Usage

```typescript
import { createCollection } from "mtrl-addons/collection";

const collection = createCollection({
  adapter: {
    read: async (params) => {
      const response = await fetch(`/api/items?page=${params.page}`);
      return response.json();
    },
  },
  transform: (item) => ({ ...item, processed: true }),
  validate: (item) => item.id && item.name,
});
```

### Advanced Data Usage (mtrl Functional Composition)

```typescript
import { createCollection } from "mtrl-addons/collection";
import {
  withLocalStorage,
  withWebWorkers,
  withValidation,
} from "mtrl-addons/collection/features";
import { pipe } from "mtrl/core/compose"; // Use mtrl core!
import { withEvents, withLifecycle } from "mtrl/core/compose/features";

const collection = pipe(
  createCollection({
    adapter: myApiAdapter,
    transform: transformUserData,
    validate: validateUserData,
  }),
  withEvents(), // mtrl core feature
  withLifecycle(), // mtrl core feature
  withLocalStorage({
    key: "users-data",
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  }),
  withWebWorkers({
    operations: ["transform", "validate", "filter"],
    maxWorkers: 4,
  }),
  withValidation({
    schema: userSchema,
    sanitize: true,
  })
);

// Load data
await collection.loadPage(1);

// Data operations only - NO UI operations
const users = collection.getItems();
const totalCount = collection.getTotalCount();
await collection.sync();
```

## Data Feature Plugins

### 1. Data Persistence Features

#### localStorage Plugin

```typescript
const withLocalStorage =
  (config: LocalStorageConfig) =>
  (collection: BaseCollection): PersistentCollection => {
    // Add localStorage data persistence
    return {
      ...collection,
      save: async () => {
        const data = collection.getItems();
        localStorage.setItem(config.key, JSON.stringify(data));
      },
      load: async () => {
        const data = localStorage.getItem(config.key);
        if (data) {
          collection.setItems(JSON.parse(data));
        }
      },
    };
  };
```

#### indexedDB Plugin

```typescript
const withIndexedDB =
  (config: IndexedDBConfig) =>
  (collection: BaseCollection): PersistentCollection => {
    // Add indexedDB data persistence for large datasets
    return {
      ...collection,
      saveToIndexedDB: async (items) => {
        // Implementation for indexedDB storage
      },
      loadFromIndexedDB: async () => {
        // Implementation for indexedDB retrieval
      },
    };
  };
```

### 2. Background Processing Features

#### Web Workers Plugin

```typescript
const withWebWorkers =
  (config: WebWorkerConfig) =>
  (collection: BaseCollection): BackgroundProcessingCollection => {
    // Add web worker data processing
    return {
      ...collection,
      transformInBackground: async (items, operation) => {
        // Process data in web workers
        const worker = new Worker("/data-worker.js");
        return new Promise((resolve) => {
          worker.postMessage({ items, operation });
          worker.onmessage = (e) => resolve(e.data);
        });
      },
    };
  };
```

### 3. Data Validation Features

#### Schema Validation Plugin

```typescript
const withValidation =
  (config: ValidationConfig) =>
  (collection: BaseCollection): ValidatedCollection => {
    // Add data validation
    return {
      ...collection,
      validateItem: (item) => {
        return config.schema.validate(item);
      },
      sanitizeItem: (item) => {
        return config.sanitizer.clean(item);
      },
    };
  };
```

## Implementation Strategy (Data Layer Only)

### Phase 1: Core Data Foundation

- [x] Data architecture documentation
- [ ] Core collection data management
- [ ] Data state management system
- [ ] Data event system
- [ ] Basic data adapters (REST, GraphQL)

### Phase 2: Data Persistence

- [ ] localStorage data plugin
- [ ] indexedDB data plugin
- [ ] Offline data sync capabilities
- [ ] Data caching strategies

### Phase 3: Background Processing

- [ ] Web worker data integration
- [ ] Background data prefetching
- [ ] Data transformation optimization
- [ ] Data memory management

### Phase 4: Advanced Data Features

- [ ] Real-time data sync
- [ ] Data conflict resolution
- [ ] Data validation pipeline
- [ ] Data analytics and monitoring

## Performance Benchmarks (Data Layer)

### Data Processing Targets

- Data transformation: < 10ms for 1000 items
- API response handling: < 50ms
- Cache operations: < 1ms
- Web worker dispatch: < 5ms
- Data validation: < 20ms for 1000 items

### Memory Usage (Data Only)

- Core collection: < 2KB base memory
- Item storage: ~100 bytes per item
- Cache overhead: < 50% of data size
- Worker memory: Isolated from main thread

## Integration with Other Layers

### Collection → List Manager Communication

```typescript
// Collection emits data events
collection.on("items:loaded", (items) => {
  listManager.updateItems(items);
});

// List Manager requests data
listManager.on("load:more:triggered", () => {
  collection.loadMore();
});
```

### Pure Data API

```typescript
// Collection exposes ONLY data operations
interface Collection {
  // Data operations
  getItems(): Item[];
  loadPage(page: number): Promise<Item[]>;
  addItems(items: Item[]): Promise<void>;

  // Data state
  isLoading(): boolean;
  getError(): Error | null;
  getTotalCount(): number;

  // Data events
  on(event: DataEvent, handler: Function): void;

  // NO UI methods: scrollTo, render, measureHeight, etc.
}
```

## Success Metrics (Data Layer)

### Technical Metrics

- Bundle size: < 5KB (pure data)
- Data processing speed: > 10,000 items/second
- Memory efficiency: < 100MB for 1M items
- API response time: < 100ms

### Quality Metrics

- Data integrity: 100% (no data corruption)
- Cache hit rate: > 90%
- Background processing: 3-5x faster with workers
- Zero UI dependencies: Verified through testing

This architecture establishes the Collection as the pure data foundation that powers the entire 3-layer system without any UI concerns.
