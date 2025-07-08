# 3-Layer Architecture for Infinite Data Lists

## Overview

The mtrl-addons list system uses a **3-layer architecture** specifically designed for handling infinite data with the best performance possible. Each layer has distinct responsibilities and clear boundaries.

## Architecture Layers

```
┌─────────────────────────────────────────────────────┐
│                LIST COMPONENT                       │
│             (Presentation Layer)                    │
│  • mtrl styling integration                        │
│  • Template rendering                              │
│  • Event handling                                  │
│  • User-facing API                                 │
│  • CSS class management                            │
└─────────────────────────┬───────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────┐
│                LIST MANAGER                         │
│             (Performance Layer)                     │
│  • Virtual scrolling                               │
│  • Element recycling                               │
│  • Viewport management                             │
│  • Height management                               │
│  • Performance optimization                        │
└─────────────────────────┬───────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────┐
│                COLLECTION                           │
│              (Data Layer)                           │
│  • Data state management                           │
│  • API integration                                 │
│  • Data persistence                                │
│  • Background processing                           │
│  • Web workers                                     │
└─────────────────────────────────────────────────────┘
```

## Layer Responsibilities

### 1. Collection (Data Layer)

**Purpose**: Pure data management with zero UI concerns

**Responsibilities**:

- **Data Operations**: CRUD operations, filtering, sorting, searching
- **API Integration**: REST, GraphQL, WebSocket adapters
- **Data Persistence**: localStorage, indexedDB, offline sync
- **Data Transformation**: Validation, normalization, aggregation
- **Background Processing**: Web workers, prefetching, caching
- **Data Events**: `items:loaded`, `items:added`, `loading:start`

**What it DOESN'T do**:

- ❌ DOM manipulation
- ❌ Virtual scrolling
- ❌ Element recycling
- ❌ CSS styling
- ❌ Performance optimization

### 2. List Manager (Performance Layer)

**Purpose**: Performance and UI management with zero data concerns

**Responsibilities**:

- **Virtual Scrolling**: Window-based and custom scrollbar strategies
- **Element Recycling**: DOM element pool management
- **Viewport Management**: Visible range calculations
- **Height Management**: Dynamic height measurement and caching
- **Performance Optimization**: Frame scheduling, memory monitoring
- **Intersection Observers**: Lazy loading, pagination triggers
- **Performance Events**: `viewport:changed`, `scroll:start`, `element:recycled`

**What it DOESN'T do**:

- ❌ Data operations
- ❌ API calls
- ❌ Data persistence
- ❌ Template rendering
- ❌ CSS styling

### 3. List Component (Presentation Layer)

**Purpose**: User interface and mtrl integration

**Responsibilities**:

- **Template Rendering**: Object templates, EJS, Handlebars, etc.
- **mtrl Integration**: Styling, theming, accessibility
- **Event Handling**: User interactions, keyboard navigation
- **CSS Management**: Adding/removing mtrl classes
- **Public API**: User-facing interface
- **Component Events**: `item:clicked`, `selection:changed`

**What it DOESN'T do**:

- ❌ Data operations
- ❌ Performance optimization
- ❌ Virtual scrolling logic

## Data Flow

### 1. Data Flow (Collection → List Manager → List Component)

```typescript
// Collection loads data
collection.loadPage(1) → API Request → items:loaded event

// List Manager responds to data changes
collection.on('items:loaded', (items) => {
  listManager.updateViewport();
  listManager.invalidateHeights();
});

// List Component renders the UI
listManager.on('viewport:changed', (range) => {
  listComponent.renderVisibleItems(range);
});
```

### 2. User Interaction Flow (List Component → List Manager → Collection)

```typescript
// User scrolls
listComponent.onScroll() → listManager.updateViewport()

// List Manager triggers loading
listManager.on('load:more:triggered', () => {
  collection.loadMore();
});

// User clicks item
listComponent.onItemClick(item) → application logic
```

## Communication Patterns

### 1. Event-Driven Communication

Each layer communicates through events, ensuring loose coupling:

```typescript
// Collection events (data-focused)
collection.on("items:loaded", handleItemsLoaded);
collection.on("loading:start", showLoadingIndicator);
collection.on("error:occurred", handleError);

// List Manager events (performance-focused)
listManager.on("viewport:changed", updateVisibleItems);
listManager.on("scroll:position:changed", updateScrollPosition);
listManager.on("element:recycled", trackRecycling);

// List Component events (UI-focused)
listComponent.on("item:clicked", handleItemClick);
listComponent.on("selection:changed", handleSelectionChange);
```

### 2. Direct API Calls

Some operations require direct API calls for performance:

```typescript
// List Manager → Collection (performance critical)
const items = collection.getItems();
const totalCount = collection.getTotalCount();

// List Component → List Manager (UI critical)
listManager.scrollToItem(itemId);
const visibleRange = listManager.getVisibleRange();
```

## Implementation Example

### Basic Setup

```typescript
import { createCollection } from "mtrl-addons/collection";
import { createListManager } from "mtrl-addons/list-manager";
import { createListComponent } from "mtrl-addons/list";

// 1. Create Collection (Data Layer)
const collection = createCollection({
  adapter: {
    read: async (params) => {
      const response = await fetch(`/api/users?page=${params.page}`);
      return response.json();
    },
  },
  transform: (user) => ({
    id: user.id,
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
  }),
});

// 2. Create List Manager (Performance Layer)
const listManager = createListManager({
  collection,
  virtualScroll: {
    strategy: "window-based",
    itemHeight: "auto",
    overscan: 5,
  },
  recycling: {
    enabled: true,
    maxPoolSize: 100,
  },
});

// 3. Create List Component (Presentation Layer)
const listComponent = createListComponent({
  listManager,
  container: document.getElementById("user-list"),
  template: {
    tag: "div",
    className: "mtrl-list-item",
    children: [
      { tag: "span", textContent: "{{name}}", className: "user-name" },
      { tag: "span", textContent: "{{email}}", className: "user-email" },
    ],
  },
});

// 4. Initialize the system
await collection.loadPage(1);
listManager.initialize();
listComponent.render();
```

### Advanced Setup with Plugins

```typescript
import { localStorage, webWorkers } from "mtrl-addons/collection/plugins";
import { performanceMonitoring } from "mtrl-addons/list-manager/plugins";

// Collection with data plugins
const collection = createCollection(config)
  .use(localStorage({ key: "users-cache" }))
  .use(
    webWorkers({
      operations: ["transform", "validate", "filter"],
    })
  );

// List Manager with performance plugins
const listManager = createListManager({ collection }).use(
  performanceMonitoring({
    fpsMonitoring: true,
    memoryMonitoring: true,
  })
);

// List Component with template engine
const listComponent = createListComponent({
  listManager,
  templateEngine: "handlebars",
  template: `
    <div class="mtrl-list-item">
      <span class="user-name">{{name}}</span>
      {{#if isOnline}}
        <span class="status online">🟢</span>
      {{/if}}
    </div>
  `,
});
```

## Performance Characteristics

### Infinite Data Handling

| Data Size      | Collection         | List Manager         | List Component      | Total Performance |
| -------------- | ------------------ | -------------------- | ------------------- | ----------------- |
| **1M items**   | ✅ O(1) memory     | ✅ ~50 DOM elements  | ✅ Instant render   | ✅ Excellent      |
| **10M items**  | ✅ Web workers     | ✅ Element recycling | ✅ Template caching | ✅ Very Good      |
| **100M items** | ✅ Background sync | ✅ Custom scrollbar  | ✅ Lazy templates   | ✅ Good           |

### Feature Distribution

```typescript
// Collection features (Data)
collection.use(localStorage()); // Data persistence
collection.use(webWorkers()); // Background processing
collection.use(indexedDB()); // Large data storage
collection.use(offlineSync()); // Offline capabilities

// List Manager features (Performance)
listManager.use(virtualScrolling()); // Virtual scrolling
listManager.use(elementRecycling()); // DOM optimization
listManager.use(heightManager()); // Dynamic heights
listManager.use(performanceMonitor()); // Performance tracking

// List Component features (Presentation)
listComponent.use(templates()); // Template engines
listComponent.use(accessibility()); // ARIA support
listComponent.use(theming()); // mtrl theming
listComponent.use(interactions()); // User interactions
```

## Key Architectural Benefits

### 1. Separation of Concerns

- **Data logic** is completely separate from **UI logic**
- **Performance optimizations** don't affect **data operations**
- **Presentation layer** focuses purely on **user experience**

### 2. Scalability

- Each layer can be optimized independently
- Features can be added without affecting other layers
- Plugin system allows for extensibility

### 3. Testability

- Data layer can be tested without DOM
- Performance layer can be tested with mock data
- UI layer can be tested with mock managers

### 4. Performance

- **Collection**: Background processing with web workers
- **List Manager**: Virtual scrolling with element recycling
- **List Component**: Template caching and lazy rendering

## Variable Height Support

### Dynamic Height Management

```typescript
// Collection provides data
const items = collection.getItems();

// List Manager handles height measurement
listManager.measureAllVisible();
listManager.on("height:measured", (measurement) => {
  // Heights are cached automatically
});

// List Component renders with measured heights
listComponent.render(); // Uses cached heights from List Manager
```

### Height Strategies

```typescript
// Dynamic height strategy (default)
const listManager = createListManager({
  collection,
  virtualScroll: {
    itemHeight: "auto",
    measurementStrategy: "progressive",
  },
});

// Pre-calculated heights
const listManager = createListManager({
  collection,
  virtualScroll: {
    itemHeight: (item) => (item.type === "header" ? 80 : 60),
  },
});
```

## Web Workers Integration

### Background Processing

```typescript
// Collection handles web workers
const collection = createCollection(config).use(
  webWorkers({
    operations: ["transform", "validate", "filter", "sort"],
    maxWorkers: 4,
  })
);

// List Manager stays on main thread for DOM operations
const listManager = createListManager({
  collection,
  // Performance optimizations on main thread
});

// List Component renders results
collection.on("worker:task:complete", (transformedData) => {
  listComponent.updateItems(transformedData);
});
```

## Future Enhancements

### 1. Shared State Management

Multiple lists sharing the same collection:

```typescript
// One collection, multiple presentations
const userCollection = createCollection(userConfig);

const listView = createListComponent({
  listManager: createListManager({ collection: userCollection }),
  template: listTemplate,
});

const gridView = createGridComponent({
  listManager: createListManager({ collection: userCollection }),
  template: gridTemplate,
});
```

### 2. Plugin Ecosystem

Community-developed plugins for each layer:

```typescript
// Collection plugins
collection.use(realtimeSync());
collection.use(conflictResolution());
collection.use(dataValidation());

// List Manager plugins
listManager.use(smoothScrolling());
listManager.use(selectionManager());
listManager.use(keyboardNavigation());

// List Component plugins
listComponent.use(dragAndDrop());
listComponent.use(contextMenu());
listComponent.use(bulkActions());
```

### 3. Development Tools

Layer-specific debugging and monitoring:

```typescript
// Development mode
const collection = createCollection(config, { debug: true });
const listManager = createListManager({ collection }, { debug: true });
const listComponent = createListComponent({ listManager }, { debug: true });

// Each layer provides debugging information
collection.getDebugInfo(); // Data operations, cache hits, worker tasks
listManager.getDebugInfo(); // Viewport calculations, recycling stats
listComponent.getDebugInfo(); // Render times, template cache, events
```

## Implementation Priority

Based on user requirements for **infinite data** with **best performance**:

### Phase 1: Core 3-Layer Architecture ✨

1. **Collection**: Core data management
2. **List Manager**: Window-based virtual scrolling
3. **List Component**: Basic template rendering
4. **Integration**: Event-driven communication

### Phase 2: Variable Heights Support ⚡

1. **List Manager**: Dynamic height measurement
2. **List Manager**: Height caching system
3. **List Component**: Variable height rendering
4. **Integration**: Height-aware virtual scrolling

### Phase 3: Web Workers Integration 🚀

1. **Collection**: Web worker plugins
2. **Collection**: Background data processing
3. **List Manager**: Non-blocking height calculations
4. **Integration**: Worker-aware performance optimization

### Phase 4: Plugin System & Polish 🎯

1. **Plugin Architecture**: Standardized plugin interface
2. **Community Plugins**: Template engines, performance monitors
3. **Development Tools**: Debug interfaces, performance profiling
4. **Documentation**: Complete API documentation

This 3-layer architecture provides the foundation for handling infinite data with optimal performance while maintaining clean separation of concerns and extensibility.
