
<!-- 
## Table of Contents

- [Overview](#overview)
- [Core Components](#core-components)
  - [createCollection](#createcollection)
  - [createListManager](#createlistmanager)
  - [createRouteAdapter](#createrouteadapter)
  - [createBaseAdapter](#createbaseadapter)
- [Detailed API Reference](#detailed-api-reference)
  - [Collection API](#collection-api)
  - [List Manager API](#list-manager-api)
  - [Route Adapter API](#route-adapter-api)
- [Usage Patterns](#usage-patterns)
  - [Basic Usage](#basic-usage)
  - [API Integration](#api-integration)
  - [Virtual Lists](#virtual-lists)
  - [Custom Transform Functions](#custom-transform-functions)
- [Examples](#examples)
  - [Creating a Collection](#creating-a-collection)
  - [Setting up a List Manager](#setting-up-a-list-manager)
  - [Working with the Route Adapter](#working-with-the-route-adapter)
  - [Virtual Scrolling Implementation](#virtual-scrolling-implementation)
- [Performance Optimization](#performance-optimization)
  - [Result Caching](#result-caching)
  - [Memory Efficiency](#memory-efficiency)
  - [Processing Large Datasets](#processing-large-datasets)
 -->
## Overview

The Collection module consists of several highly optimized factory functions that work together to provide a complete data management solution:

- `createCollection`: A lightweight factory function that creates a collection with support for querying, sorting, and observing changes.
- `createListManager`: A utility for handling paginated data with virtualized rendering.
- `createRouteAdapter`: An adapter for integrating with REST APIs, handling serialization, parameters, and caching.
- `createBaseAdapter`: A common foundation for all adapters with error handling.

These components can be used independently or combined to create powerful data management solutions for your applications while maintaining excellent performance characteristics.

## Core Components

### createCollection

The Collection module provides a functional approach to data management through the `createCollection` factory function. It offers a consistent interface for working with collections of data, managing items with unique IDs, providing filtering and sorting capabilities, and supporting observers for reacting to changes.

This highly optimized implementation includes result caching, batch processing, and memory efficiency features to ensure excellent performance even with large datasets:

- Add, update, and remove items with optimized batch operations
- Smart filtering and sorting with result caching
- Subscribe to collection changes with efficient notification system
- Type-safe operations with generics
- Error and loading state handling
- Minimal memory footprint and optimized event notification

### createListManager

The `createListManager` builds on top of the optimized Collection factory to provide specialized handling for paginated lists with virtual rendering, including:

- Memory-efficient cursor-based pagination
- Virtual list rendering for performance with minimal DOM operations
- Smart recycling of DOM elements for better memory usage
- Automatic loading of new pages on scroll with configurable thresholds
- Intelligent visibility detection using hybrid scrolling strategy
- Page history for navigation
- Seamless integration with DOM elements

### createRouteAdapter

The `createRouteAdapter` provides lightweight connectivity to REST APIs with optimized features like:

- Minimal-overhead URL building and query parameter handling with reused objects
- Efficient response parsing with specialized error handling
- Intelligent request caching to reduce network calls
- Optimized support for cursor-based pagination
- Streamlined transformation of complex query conditions into URL parameters
- Automatic abort of superseded requests

### createBaseAdapter

The `createBaseAdapter` is a minimalist foundational component providing common functionality for all adapters with minimal overhead:

- Streamlined error handling with context preservation
- Efficient error reporting
- Minimal base interface implementation
- Zero dependencies and small footprint

## Detailed API Reference

### Collection API

#### Creating a Collection

```typescript
import { createCollection } from 'core/collection';

// Define your item type
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Create a collection with performance optimization options
const users = createCollection<User>({
  // Transform function to normalize data
  transform: (data) => ({
    id: data._id || data.id,
    name: data.name || 'Unknown',
    email: data.email || '',
    role: data.role || 'user'
  }),
  // Validation function for data integrity
  validate: (item) => Boolean(item.id && item.email),
  // Optional capacity hint for large collections
  initialCapacity: 1000
});
```

#### Collection Methods

| Method | Description | Performance Notes |
|--------|-------------|-------------------|
| `subscribe(observer)` | Subscribe to collection changes, returns unsubscribe function | Optimized notification system that reuses objects |
| `getItems()` | Get collection items based on current query and sort | Uses result caching for repeated calls |
| `getSize()` | Get collection size | O(1) operation using Map size |
| `isLoading()` | Get loading state | Simple boolean flag access |
| `getError()` | Get error state | Direct reference access |
| `query(queryFn)` | Set query filter function | Invalidates cache intelligently |
| `sort(sortFn)` | Set sort function | Uses optimized sorting with result caching |
| `add(items)` | Add items to collection, returns added items | Batch processing for multiple items |
| `update(items)` | Update items in collection, returns updated items | Optimized with validation check before updates |
| `remove(ids)` | Remove items from collection, returns removed item IDs | Batch deletion with minimal overhead |
| `clear()` | Clear all items from collection | Efficient reset of internal state |

#### Collection Events

| Event | Description |
|-------|-------------|
| `change` | Fired when collection items change |
| `add` | Fired when items are added |
| `update` | Fired when items are updated |
| `remove` | Fired when items are removed |
| `error` | Fired when an error occurs |
| `loading` | Fired when loading state changes |

### List Manager API

#### Creating a List Manager

```typescript
import { createListManager } from 'core/collection';

const listManager = createListManager('users', containerElement, {
  // Item rendering function (required)
  renderItem: (user, index) => {
    const el = document.createElement('div');
    el.className = 'user-item';
    el.innerHTML = `<h3>${user.name}</h3><p>${user.email}</p>`;
    return el;
  },
  
  // Optional configuration
  transform: (data) => ({
    id: data._id,
    name: data.name || 'Unknown',
    email: data.email || '',
    meta: data.role
  }),
  baseUrl: 'https://api.example.com/api',
  itemHeight: 60,
  pageSize: 25,
  afterLoad: ({ loading, hasNext, items }) => {
    // Update UI or emit events after data loads
    updateLoadingIndicator(loading);
  }
});
```

#### List Manager Methods

| Method | Description |
|--------|-------------|
| `loadItems(params)` | Load items with parameters, returns response |
| `loadMore()` | Load next page of items, returns result |
| `refresh()` | Refresh list with latest data |
| `updateVisibleItems()` | Update visible items based on scroll position |
| `scrollToItem(itemId, position)` | Scroll to specific item by ID |
| `setItemHeights(heightsMap)` | Set custom heights for specific items |
| `getCollection()` | Get the underlying Collection instance |
| `getVisibleItems()` | Get currently visible items |
| `getAllItems()` | Get all loaded items |
| `isLoading()` | Check if items are currently loading |
| `hasNextPage()` | Check if there are more items to load |
| `isApiMode()` | Check if manager is in API mode |
| `setRenderHook(hookFn)` | Set hook function for customizing rendering |
| `destroy()` | Clean up resources and event listeners |

#### Page Loader

For simpler cases where you don't need virtualization, you can create a page loader:

```typescript
const pageLoader = listManager.createPageLoader(list, {
  onLoad: ({ loading, hasNext, hasPrev, items }) => {
    updateUI({ loading, hasNext, hasPrev });
  },
  pageSize: 20
});

// Initial load
await pageLoader.load();

// Navigation
nextButton.onclick = () => pageLoader.loadNext();
prevButton.onclick = () => pageLoader.loadPrev();
```

### Route Adapter API

#### Creating a Route Adapter

```typescript
import { createRouteAdapter } from 'core/collection';

const adapter = createRouteAdapter({
  base: 'https://api.example.com/api',
  endpoints: {
    list: '/users',
    create: '/users',
    update: '/users',
    delete: '/users'
  },
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  },
  cache: true,
  onError: (error, context) => {
    console.error('API error:', error, context);
    notifyUser(`Error: ${error.message}`);
  }
});
```

#### Route Adapter Methods

| Method | Description |
|--------|-------------|
| `create(items)` | Create new items, returns response |
| `read(query, options)` | Read items with query parameters, returns response |
| `update(items)` | Update existing items, returns response |
| `delete(ids)` | Delete items by ID, returns response |
| `query(query, options)` | Advanced query with more options, returns response |
| `disconnect()` | Clean up resources and abort pending requests |

#### Query Operators

The route adapter supports various query operators that get transformed into appropriate URL parameters:

| Operator | Description | Example |
|----------|-------------|---------|
| `EQ` | Equals | `{ name: { EQ: 'John' } }` |
| `NE` | Not equals | `{ status: { NE: 'inactive' } }` |
| `GT` | Greater than | `{ age: { GT: 18 } }` |
| `GTE` | Greater than or equal | `{ price: { GTE: 10 } }` |
| `LT` | Less than | `{ stock: { LT: 5 } }` |
| `LTE` | Less than or equal | `{ priority: { LTE: 3 } }` |
| `IN` | In array | `{ category: { IN: ['book', 'dvd'] } }` |
| `NIN` | Not in array | `{ status: { NIN: ['deleted', 'archived'] } }` |
| `CONTAINS` | String contains | `{ name: { CONTAINS: 'john' } }` |
| `STARTS_WITH` | String starts with | `{ email: { STARTS_WITH: 'admin' } }` |
| `ENDS_WITH` | String ends with | `{ domain: { ENDS_WITH: '.com' } }` |

## Usage Patterns

### Basic Usage

The most common pattern is to create a Collection for your data type, then use it to manage your items with excellent performance:

```typescript
// Create a Collection for your data
const tasks = createCollection<Task>();

// Add items with batch operation
await tasks.add([
  { id: '1', title: 'Complete documentation', completed: false },
  { id: '2', title: 'Write tests', completed: true }
]);

// Filter for incomplete tasks - results will be cached
tasks.query(task => !task.completed);

// Sort by title - sort results are also cached
tasks.sort((a, b) => a.title.localeCompare(b.title));

// Subscribe to changes with efficient notifications
const unsubscribe = tasks.subscribe(({ event, data }) => {
  if (event === 'change') {
    updateTaskList(data);
  }
});

// Clean up when done
unsubscribe();
```

### API Integration

For API-connected collections, use the Route Adapter with a Collection:

```typescript
// Create an adapter
const adapter = createRouteAdapter({
  base: 'https://api.example.com/api',
  endpoints: {
    list: '/products',
    create: '/products',
    update: '/products/:id',
    delete: '/products/:id'
  }
});

// Create a collection
const products = createCollection<Product>({
  transform: data => ({
    id: data._id,
    name: data.name,
    price: data.price,
    stock: data.inventory?.count || 0
  })
});

// Load data from API
const response = await adapter.read({ 
  category: 'electronics',
  price: { GTE: 100 }
}, {
  sort: 'price:desc',
  limit: 50
});

// Add items to collection
await products.add(response.items);
```

### Virtual Lists

For handling large datasets with performance, use the List Manager:

```typescript
// Create a virtual list manager
const productList = createListManager('products', containerElement, {
  renderItem: (product, index) => {
    const el = document.createElement('div');
    el.className = 'product-item';
    el.innerHTML = `
      <h3>${product.name}</h3>
      <p>$${product.price.toFixed(2)}</p>
      <p>In stock: ${product.stock}</p>
    `;
    return el;
  },
  baseUrl: 'https://api.example.com/api',
  itemHeight: 80,
  pageSize: 50,
  scrollStrategy: 'hybrid'
});

// Handle out-of-stock products differently
productList.setRenderHook((product, element) => {
  if (product.stock <= 0) {
    element.classList.add('out-of-stock');
  }
});

// Scroll to a specific product
searchButton.addEventListener('click', () => {
  const productId = searchInput.value;
  productList.scrollToItem(productId, 'center');
});

// Clean up when component unmounts
onDestroy(() => {
  productList.destroy();
});
```

### Custom Transform Functions

The module provides built-in transform functions for common data types, but you can create your own:

```typescript
import { createListManager, transforms } from 'core/collection';

// Use a built-in transform
const trackList = createListManager('tracks', container, {
  transform: transforms.track,
  // ...other config
});

// Create a custom transform
const customTransform = (data) => ({
  id: data.uid || data._id,
  headline: data.title || data.name,
  supportingText: `${data.artist} • ${data.album}`,
  meta: data.duration ? formatDuration(data.duration) : '',
  original: data  // Keep original data if needed
});

const musicList = createListManager('music', container, {
  transform: customTransform,
  // ...other config
});
```

## Examples

### Creating a Collection

```typescript
import { createCollection } from 'core/collection';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: number;
  dueDate?: string;
}

// Create a new collection with performance options
const taskCollection = createCollection<Task>({
  // Transform function to normalize data
  transform: (data) => ({
    id: data.id || `task-${Date.now()}`,
    title: data.title || 'Untitled Task',
    completed: Boolean(data.completed),
    priority: data.priority || 0,
    dueDate: data.dueDate
  }),
  
  // Validate items before adding
  validate: (item) => {
    return Boolean(item.title && item.title.trim().length > 0);
  },
  
  // Optional size hint for large collections
  initialCapacity: 500
});

// Subscribe to collection changes
const unsubscribe = taskCollection.subscribe(({ event, data }) => {
  console.log(`Collection event: ${event}`, data);
  
  if (event === 'change') {
    renderTaskList(data);
  } else if (event === 'error') {
    showErrorMessage(data.message);
  } else if (event === 'loading') {
    updateLoadingIndicator(data);
  }
});

// Add items to the collection
async function addTasks(newTasks) {
  try {
    await taskCollection.add(newTasks);
    showSuccessMessage('Tasks added successfully');
  } catch (error) {
    showErrorMessage('Failed to add tasks: ' + error.message);
  }
}

// Filter for high priority incomplete tasks
taskCollection.query(task => !task.completed && task.priority >= 3);

// Sort by due date, then by priority
taskCollection.sort((a, b) => {
  // Sort by due date first
  if (a.dueDate && b.dueDate) {
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  } else if (a.dueDate) {
    return -1; // a has due date, b doesn't
  } else if (b.dueDate) {
    return 1;  // b has due date, a doesn't
  }
  
  // If no due dates or they're equal, sort by priority (descending)
  return b.priority - a.priority;
});

// Clean up when done
function cleanup() {
  unsubscribe();
  taskCollection.clear();
}
```

### Setting up a List Manager

```typescript
import { createListManager } from 'core/collection';

// Get container element
const container = document.getElementById('task-list-container');

// Create a list manager
const taskList = createListManager('tasks', container, {
  // Required: Function to render each item
  renderItem: (task, index, recycledElement) => {
    // Reuse element if available
    const element = recycledElement || document.createElement('div');
    element.className = 'task-item';
    element.innerHTML = `
      <div class="task-header">
        <h3>${task.title}</h3>
        <span class="priority priority-${task.priority}">P${task.priority}</span>
      </div>
      <div class="task-details">
        ${task.dueDate ? `<span class="due-date">Due: ${formatDate(task.dueDate)}</span>` : ''}
        <span class="status ${task.completed ? 'completed' : 'pending'}">
          ${task.completed ? 'Completed' : 'Pending'}
        </span>
      </div>
    `;
    
    // Add data attributes for better selection targeting
    element.dataset.id = task.id;
    element.dataset.itemType = 'task';
    
    return element;
  },
  
  // Optional: Transform function for data
  transform: (data) => ({
    id: data.id || `task-${Date.now()}`,
    title: data.title || 'Untitled Task',
    completed: Boolean(data.completed),
    priority: data.priority || 0,
    dueDate: data.dueDate
  }),
  
  // Specify API endpoint or use null for static data
  baseUrl: 'https://api.example.com/api',
  
  // Item measurements and rendering
  itemHeight: 80,
  renderBufferSize: 5,
  overscanCount: 2,
  
  // Pagination and loading
  pageSize: 25,
  loadThreshold: 0.7,
  
  // Performance options
  throttleMs: 16,
  dedupeItems: true,
  scrollStrategy: 'hybrid',
  
  // Callback after loading data
  afterLoad: ({ loading, hasNext, hasPrev, items }) => {
    // Update UI based on load status
    document.getElementById('loading-indicator').style.display = loading ? 'block' : 'none';
    document.getElementById('load-more-button').disabled = !hasNext;
    document.getElementById('item-count').textContent = `${items.length} items loaded`;
  }
});

// Add custom rendering hook
taskList.setRenderHook((task, element) => {
  // Add special styling for overdue tasks
  if (task.dueDate && new Date(task.dueDate) < new Date() && !task.completed) {
    element.classList.add('overdue');
  } else {
    element.classList.remove('overdue');
  }
  
  // Handle task completion
  const statusEl = element.querySelector('.status');
  if (statusEl) {
    statusEl.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleTaskCompletion(task.id);
    });
  }
});

// Set custom heights for some items
taskList.setItemHeights({
  'task-123': 120,  // Task with notes needs more space
  'task-456': 60    // Simple task needs less space
});

// Implement search by scrolling to matching item
function searchTasks(query) {
  const tasks = taskList.getAllItems();
  const matchingTask = tasks.find(task => 
    task.title.toLowerCase().includes(query.toLowerCase())
  );
  
  if (matchingTask) {
    taskList.scrollToItem(matchingTask.id, 'center');
    highlightTask(matchingTask.id);
  }
}

// Clean up when component unmounts
function destroyTaskList() {
  taskList.destroy();
}
```

### Working with the Route Adapter

```typescript
import { createRouteAdapter, OPERATORS } from 'core/collection';

// Create a route adapter
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
    'Authorization': `Bearer ${getAuthToken()}`
  },
  cache: true,
  onError: (error, context) => {
    logApiError(error, context);
    showErrorNotification(`API Error: ${error.message}`);
  }
});

// Read users with filtering
async function getUsersByRole(role, status, options = {}) {
  try {
    const response = await usersAdapter.read({
      role: role,
      status: { [OPERATORS.NE]: 'deleted' },
      lastLogin: { [OPERATORS.GTE]: '2023-01-01' }
    }, {
      sort: 'name:asc',
      limit: options.limit || 50,
      fields: 'id,name,email,role,status'
    });
    
    return response.items;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

// Create a new user
async function createUser(userData) {
  try {
    const response = await usersAdapter.create([userData]);
    return response.items[0];
  } catch (error) {
    throw new Error(`Failed to create user: ${error.message}`);
  }
}

// Update a user
async function updateUser(id, updates) {
  // First fetch current user data
  const currentUser = await usersAdapter.read({ id: { [OPERATORS.EQ]: id } });
  
  if (!currentUser.items.length) {
    throw new Error(`User with ID ${id} not found`);
  }
  
  // Merge updates with current data
  const updatedUser = {
    ...currentUser.items[0],
    ...updates,
    id // Ensure ID is preserved
  };
  
  // Perform update
  const result = await usersAdapter.update([updatedUser]);
  return result.items[0];
}

// Delete users
async function deleteUsers(userIds) {
  try {
    const result = await usersAdapter.delete(userIds);
    return result;
  } catch (error) {
    throw new Error(`Failed to delete users: ${error.message}`);
  }
}

// Advanced query example
async function searchUsers(criteria) {
  const query = {};
  
  // Build query conditions
  if (criteria.name) {
    query.name = { [OPERATORS.CONTAINS]: criteria.name };
  }
  
  if (criteria.roles && criteria.roles.length) {
    query.role = { [OPERATORS.IN]: criteria.roles };
  }
  
  if (criteria.status) {
    query.status = { [OPERATORS.EQ]: criteria.status };
  }
  
  if (criteria.dateRange) {
    query.createdAt = {
      [OPERATORS.GTE]: criteria.dateRange.start,
      [OPERATORS.LTE]: criteria.dateRange.end
    };
  }
  
  return usersAdapter.query(query, {
    sort: criteria.sort || 'createdAt:desc',
    limit: criteria.limit || 25,
    page: criteria.page || 1
  });
}

// Cleanup when done
function cleanup() {
  usersAdapter.disconnect();
}
```

### Virtual Scrolling Implementation

```typescript
import { createListManager } from 'core/collection';

// Get container element
const container = document.querySelector('.product-grid');

// Create styles for items
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .product-item {
    border: 1px solid #eee;
    border-radius: 8px;
    padding: 16px;
    margin: 8px;
    background: white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    transition: transform 0.2s;
  }
  
  .product-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }
  
  .product-item img {
    width: 100%;
    height: 120px;
    object-fit: contain;
    margin-bottom: 8px;
  }
  
  .product-name {
    font-weight: bold;
    margin-bottom: 4px;
  }
  
  .product-price {
    color: #e63946;
    font-weight: bold;
  }
  
  .product-stock {
    font-size: 0.8em;
    color: #666;
  }
  
  .out-of-stock {
    opacity: 0.7;
  }
  
  .out-of-stock .product-stock {
    color: #e63946;
  }
`;
document.head.appendChild(styleSheet);

// Create the list manager
const productGrid = createListManager('products', container, {
  // Item rendering function
  renderItem: (product, index, recycledElement) => {
    // Either use the recycled element or create a new one
    const element = recycledElement || document.createElement('div');
    element.className = 'product-item';
    
    // For dynamic height calculation, consider image height variations
    if (product.image) {
      element.dataset.needsMeasurement = 'true';
    }
    
    element.innerHTML = `
      ${product.image ? `<img src="${product.image}" alt="${product.name}">` : ''}
      <div class="product-name">${product.name}</div>
      <div class="product-price">$${product.price.toFixed(2)}</div>
      <div class="product-stock">
        ${product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
      </div>
    `;
    
    return element;
  },
  
  // Transform function for data normalization
  transform: (data) => ({
    id: data.id || data._id,
    name: data.name || 'Unnamed Product',
    price: typeof data.price === 'number' ? data.price : parseFloat(data.price || '0'),
    stock: data.stock || data.inventory || 0,
    image: data.image || data.imageUrl || null
  }),
  
  // API connection
  baseUrl: 'https://api.example.com/api',
  
  // Layout and item sizing
  itemHeight: 220, // Base height, will be adjusted after measurement
  
  // Scroll and performance settings
  scrollStrategy: 'hybrid', // Use both scroll events and intersection observer
  dedupeItems: true,        // Prevent duplicate items
  loadThreshold: 0.7,       // Load more when 70% scrolled
  
  // Callback after data loads
  afterLoad: ({ loading, hasNext }) => {
    updateLoadingIndicator(loading);
    updateLoadMoreButton(hasNext);
  }
});

// Add a render hook for special cases
productGrid.setRenderHook((product, element) => {
  // Add out-of-stock class for styling
  if (product.stock <= 0) {
    element.classList.add('out-of-stock');
  } else {
    element.classList.remove('out-of-stock');
  }
  
  // Add click event handler
  element.addEventListener('click', () => {
    showProductDetails(product);
  });
});

// Add filter controls
document.getElementById('filter-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // Get filter values
  const minPrice = parseFloat(document.getElementById('min-price').value || '0');
  const maxPrice = parseFloat(document.getElementById('max-price').value || '1000000');
  const category = document.getElementById('category').value;
  const inStock = document.getElementById('in-stock').checked;
  
  // Reload with filters
  await productGrid.loadItems({
    price: {
      GTE: minPrice,
      LTE: maxPrice
    },
    category: category || undefined,
    stock: inStock ? { GT: 0 } : undefined
  });
});

// Add sort controls
document.getElementById('sort-select').addEventListener('change', (e) => {
  const sortValue = e.target.value;
  let sort = '';
  
  switch (sortValue) {
    case 'price-asc':
      sort = 'price:asc';
      break;
    case 'price-desc':
      sort = 'price:desc';
      break;
    case 'name-asc':
      sort = 'name:asc';
      break;
    case 'popularity':
      sort = 'popularity:desc';
      break;
  }
  
  // Reload with new sort
  productGrid.loadItems({ sort });
});

// Add search function
document.getElementById('search-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const query = document.getElementById('search-input').value.trim();
  
  if (query) {
    productGrid.loadItems({ search: query });
  }
});

// Clean up on unmount
function unmountProductGrid() {
  productGrid.destroy();
  document.head.removeChild(styleSheet);
}
```

## Performance Optimization

The Collection module is designed with performance as a primary concern. Here are the key optimization strategies used:

### Result Caching

The `createCollection` factory implements smart caching of filtered and sorted results:

```typescript
// Filtering and sorting operations cache their results
const largeCollection = createCollection<Item>();

// Initial filtering - computes and caches the result
largeCollection.query(item => item.category === 'electronics');

// Subsequent calls to getItems() use the cached result without recomputing
const items1 = largeCollection.getItems(); // Uses cached result
const items2 = largeCollection.getItems(); // Uses same cached result

// Cache is automatically invalidated when data changes
await largeCollection.add(newItem);

// This will trigger a new computation and caching
const refreshedItems = largeCollection.getItems();
```

### Memory Efficiency

The implementation minimizes object creation and garbage collection:

```typescript
// Notification system reuses objects
const collection = createCollection<DataItem>();

collection.subscribe(event => {
  // The event object is reused across notifications
  console.log(event.type); 
});

// Pre-allocate arrays where possible
await collection.add(items); // Uses optimized batch processing

// Efficient looping instead of multiple array transformations
const filtered = collection.getItems(); // Uses direct loops for large datasets
```

### Processing Large Datasets

Special optimizations are applied for large collections:

```typescript
// Create a collection with initial capacity hint
const bigCollection = createCollection<Entry>({
  initialCapacity: 10000 // Hint for expected size
});

// Large dataset operations use optimized algorithms
bigCollection.query(item => {
  // For collections >1000 items, uses direct loops instead of Array.filter()
  return item.value > 1000;
});

// Batch processing is used for multiple items
await bigCollection.add(hugeArrayOfItems); 

// Minimal object creation during event notification
bigCollection.subscribe(({ event, data }) => {
  // Event object is reused, data is passed by reference
});
```

These optimizations ensure the collection module maintains excellent performance even when dealing with large datasets or high-frequency operations.# Collection Module Documentation

The Collection module provides tools for managing, transforming and displaying collections of data in a performant and type-safe way. This module is designed to solve common data management patterns with highly optimized tools to handle data fetching, pagination, filtering, and virtualized rendering.