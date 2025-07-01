# List Component - Page Navigation

The List component now supports direct page navigation when using page-based pagination. This allows users to jump to any specific page without having to sequentially load pages. Additionally, the component now supports scrolling to previous pages after jumping to a specific page.

## Requirements

This feature only works when:

- Using page-based pagination strategy (`pagination.strategy: 'page'`)
- Connected to an API (not for static lists)

## Basic Usage

```javascript
import { createList } from "mtrl";

const userList = createList({
  collection: "users",
  baseUrl: "/api",
  pagination: {
    strategy: "page", // Must use 'page' strategy
    pageParamName: "page", // Query parameter for page number
    perPageParamName: "limit", // Query parameter for page size
    defaultPageSize: 20,
  },
  renderItem: (user) => {
    const element = document.createElement("div");
    element.innerHTML = `
      <div class="user-name">${user.name}</div>
      <div class="user-email">${user.email}</div>
    `;
    return element;
  },
});

// Jump to page 5 (replaces current content)
await userList.loadPage(5);

// Jump to page 10 while preserving previous pages
await userList.loadPage(10, { preservePrevious: true });

// Go back to first page
await userList.loadPage(1);
```

## Enhanced Navigation with Scroll Support

When jumping to a specific page, you can now preserve previous pages in memory, allowing users to scroll up to see earlier content:

```javascript
// Jump to page 5 but keep pages 1-4 available for scrolling
await userList.loadPage(5, { preservePrevious: true });

// User can now scroll up to see previous pages
// The list will automatically load previous pages as needed
```

## API

### `loadPage(pageNumber, options?)`

Loads a specific page of data.

**Parameters:**

- `pageNumber` (number): The page number to load (1-indexed, must be a positive integer)
- `options` (object, optional):
  - `preservePrevious` (boolean): Whether to keep previous pages in memory for scrolling. Default: false

**Returns:**

- Promise<{hasNext: boolean, items: any[]}>

**Throws:**

- Error if pageNumber is not a positive integer
- Error if pagination strategy is not 'page'

### `scrollNext()`

Scrolls to and loads the next page. This provides a symmetrical counterpart to automatic previous page loading.

**Returns:**

- Promise<{hasNext: boolean, items: any[]}>

### `scrollPrevious()`

Scrolls to and loads the previous page. Works just like `scrollNext()` but in the opposite direction.

**Returns:**

- Promise<{hasPrev: boolean, items: any[]}>

### `loadPreviousPage()`

Loads the previous page and prepends it to the beginning of the list. This is automatically called when scrolling near the top of the list.

**Returns:**

- Promise<{hasPrev: boolean, items: any[]}>

## Automatic Previous Page Loading

When using page-based pagination, the list component now automatically detects when you're scrolling near the top and loads previous pages:

```javascript
// Jump to page 5
await userList.loadPage(5, { preservePrevious: true });

// As user scrolls up, the component automatically loads pages 4, 3, 2, 1
// No manual intervention needed!
```

## Example with UI Controls

```javascript
// Create pagination controls
const paginationControls = document.createElement("div");
paginationControls.innerHTML = `
  <button id="first-page">First</button>
  <button id="prev-page">Previous</button>
  <input type="number" id="page-input" min="1" value="1">
  <button id="go-to-page">Go</button>
  <button id="next-page">Next</button>
  <label>
    <input type="checkbox" id="preserve-previous" checked>
    Keep previous pages when jumping
  </label>
  <span id="page-info"></span>
`;

let currentPage = 1;

// Handle page navigation
document.getElementById("first-page").addEventListener("click", async () => {
  currentPage = 1;
  const preservePrevious = document.getElementById("preserve-previous").checked;
  await userList.loadPage(currentPage, { preservePrevious });
  updatePageInfo();
});

document.getElementById("go-to-page").addEventListener("click", async () => {
  const pageInput = document.getElementById("page-input");
  const pageNumber = parseInt(pageInput.value);
  const preservePrevious = document.getElementById("preserve-previous").checked;

  if (pageNumber > 0) {
    currentPage = pageNumber;
    await userList.loadPage(currentPage, { preservePrevious });
    updatePageInfo();
  }
});

document.getElementById("next-page").addEventListener("click", async () => {
  if (userList.hasNextPage()) {
    currentPage++;
    await userList.loadPage(currentPage);
    updatePageInfo();
  }
});

function updatePageInfo() {
  document.getElementById("page-info").textContent = `Page ${currentPage}`;
  document.getElementById("page-input").value = currentPage;
}
```

## Important Notes

1. **Scroll Position**:

   - When `preservePrevious: false` (default), the list scrolls to the top after loading a new page
   - When `preservePrevious: true`, the current scroll position is maintained

2. **Data Management**:

   - `preservePrevious: false` - Replaces all content (traditional pagination)
   - `preservePrevious: true` - Keeps previous pages in memory (infinite scroll with direct access)

3. **Page Jump Behavior**:

   - When jumping to a non-adjacent page, the list always starts fresh at that page
   - This allows you to jump anywhere and use `scrollNext()`/`scrollPrevious()` from there
   - No intermediate pages are loaded, keeping it fast and simple

4. **Automatic Loading**: When scrolling up reaches within 200px of the top, the previous page is automatically loaded (if available)

## How It Works

### Jumping Between Pages

When you jump to any page:

```javascript
// Jump to page 3000
await userList.loadPage(3000);

// The list starts fresh at page 3000
// You can now navigate in both directions:
await userList.scrollPrevious(); // Loads page 2999
await userList.scrollNext(); // Loads page 3001
```

### No Gap Filling

The system doesn't try to fill gaps between pages. This means:

- **Fast**: Jump to page 3000 instantly
- **Simple**: No complex gap detection or filling logic
- **Predictable**: Always starts fresh when jumping

### Adjacent Page Navigation

The only exception is when loading an adjacent page (next or previous), which works seamlessly:

```javascript
// On page 5
await userList.loadMore(); // Loads page 6 and appends
await userList.scrollNext(); // Also loads page 6 and scrolls to it
```

## Comparison with Other Pagination Methods

| Method               | Use Case                  | Behavior                                    |
| -------------------- | ------------------------- | ------------------------------------------- |
| `loadMore()`         | Infinite scroll           | Appends next page to existing data          |
| `loadPage(n)`        | Page navigation           | Replaces data or preserves based on options |
| `loadPreviousPage()` | Manual previous page load | Prepends previous page to beginning         |
| `scrollNext()`       | Navigate to next page     | Loads next page and scrolls to show it      |
| `scrollPrevious()`   | Navigate to previous page | Loads previous page and scrolls to show it  |
| `refresh()`          | Reset list                | Loads first page, clears all data           |

## Use Cases

### Traditional Pagination

Jump between pages with only one page visible at a time:

```javascript
await userList.loadPage(5); // Only page 5 is visible
```

### Direct Page Access with Navigation

Jump to a specific page and navigate from there:

```javascript
await userList.loadPage(3000); // Start at page 3000
await userList.scrollPrevious(); // Go to page 2999
await userList.scrollNext(); // Back to page 3000
```

### Infinite Scroll

Start from page 1 and scroll naturally:

```javascript
// Automatic loading as you scroll down
// Use loadMore() or let auto-scroll handle it
```

## Error Handling

```javascript
try {
  await userList.loadPage(5, { preservePrevious: true });
} catch (error) {
  if (error.message.includes("positive integer")) {
    console.error("Invalid page number");
  } else if (error.message.includes("page-based pagination")) {
    console.error("This list is not configured for page navigation");
  } else {
    console.error("Failed to load page:", error);
  }
}
```

## Symmetric Navigation

The `scrollNext()` and `scrollPrevious()` methods provide symmetric navigation:

- **From any page**, you can scroll forward or backward
- **No gap filling** - jumping to page 3000 and scrolling up goes to 2999, not 1-2999
- **Natural scrolling** - the list behaves as if you had scrolled there naturally

**Special Case**: When you've jumped to a page using `loadPage()` and only have that single page loaded, `scrollPrevious()` will reload showing the previous page at the bottom of the viewport. This ensures you can always navigate backwards, even after jumping to a distant page.

## API Reference

### `loadPage(pageNumber, options?)`

Loads a specific page of data.

**Parameters:**

- `pageNumber` (number): The page number to load (1-indexed, must be a positive integer)
- `options` (object, optional):
  - `preservePrevious` (boolean): Whether to keep previous pages in memory for scrolling. Default: false

**Returns:**

- Promise<{hasNext: boolean, items: any[]}>

**Throws:**

- Error if pageNumber is not a positive integer
- Error if pagination strategy is not 'page'

### `scrollNext()`

Scrolls to and loads the next page. This provides a symmetrical counterpart to automatic previous page loading.

**Returns:**

- Promise<{hasNext: boolean, items: any[]}>

### `scrollPrevious()`

Scrolls to and loads the previous page. Works just like `scrollNext()` but in the opposite direction.

**Returns:**

- Promise<{hasPrev: boolean, items: any[]}>

### `loadPreviousPage()`

Loads the previous page and prepends it to the beginning of the list. This is automatically called when scrolling near the top of the list.

**Returns:**

- Promise<{hasPrev: boolean, items: any[]}>
