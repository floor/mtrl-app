# VList Item Removal Optimization

## Current Status: NOT WORKING - Multiple Issues Discovered

**Date:** January 2025  
**Last Updated:** January 2025 (extensive debugging session)  
**Affected Files:** `mtrl-addons/src/core/viewport/features/rendering.ts`

## Problem Summary

When removing items from a VList, multiple interacting issues cause the list to become empty or display orphaned elements, even when items should still be visible.

---

## Issue 1: Map Keys vs DOM Order Mismatch

### Description

The VList maintains a `renderedElements` Map keyed by data index. However, DOM elements are **reordered** after async loading (for CSS `::before` pseudo-selectors to work correctly). This causes:

- **Map keys** to be based on original data indices
- **DOM order** to be different after reordering
- **Element's `data-index` attribute** may not match its map key

### Evidence

```
[REMOVE] Found element: foundMapKey=0, elementId=696e9d4938a1c3c58f40fb08, elementIndex=0
```

But when removing item at `index=1`, we find an element with `data-index=0`. The shift logic then fails because it shifts based on the wrong index.

### Attempted Fix

Rebuild the map from DOM by scanning all elements and using their `data-index` attributes as keys. This partially worked but introduced new issues.

---

## Issue 2: `renderItems()` Called Multiple Times

### Description

After our removal handler runs, `api.ts` calls `setTotalItems()`, which triggers `viewport:total-items-changed`, which calls `renderItems()` again. This second call can:

1. Create new orphan elements
2. Overwrite our carefully managed state
3. Use stale `totalItems` count from the server

### Call Stack

```
renderItems @ rendering.ts
component.viewport.renderItems @ rendering.ts
(anonymous) @ virtual.ts:509
emit @ events.ts
setTotalItems @ collection.ts:965
removeItem @ api.ts:564
```

### Attempted Fix

Added `isRemovingItem` flag to skip `renderItems()` calls during removal. Used `queueMicrotask()` to reset the flag after synchronous chain completes.

**Problem:** When we call `renderItems()` ourselves, the flag blocks our own call too! Temporarily disabling/re-enabling the flag creates timing issues.

---

## Issue 3: `collectionItems` vs Server `totalItems` Mismatch

### Description

The local `collectionItems` array may have more items than the server's `totalItems` count:

```
[REMOVE] collectionItems.length=14, visibleCount=14
Total items after removal: 2  ← Server says only 2!
```

This happens because:
1. Local array has 14 items from previous page loads
2. Server reports only 2 items remaining (others were moved/deleted)
3. We set `viewportState.totalItems = collectionItems.length` (14)
4. But `setTotalItems()` then overwrites it with server count (2)
5. `renderItems()` sees `totalItems=2` and only renders 2 items

### Root Cause

The `collectionItems` array contains stale items that no longer match the server state. When items are moved to another category, they're removed from the server's filtered results but remain in the local array until explicitly cleared.

---

## Issue 4: `loadMissingRanges` Not Filling the Gap

### Description

After removing items, we call `loadMissingRanges()` to fetch more items from the server. However:

1. The collection's `loadedRanges` may think range 0-14 is already loaded
2. Or the fetch returns items that don't match what's displayed
3. Or the server count changes between our render and the fetch

### Attempted Fix

Always call `loadMissingRanges()` after removal:

```typescript
collection.loadMissingRanges(
  { start: 0, end: visibleCount },
  "rendering:after-removal",
);
```

This helps but doesn't solve the core synchronization issue.

---

## Issue 5: Orphan Elements Still Clickable

### Description

Even after clearing and rebuilding, orphan elements remain in the DOM and are clickable:

```
[ActionBar] Emitting "validate" for track 697835f4017e7a3829988940
...
[ActionBar] Emitting "validate" for track 697835f4017e7a3829988940  ← Same ID clicked twice!
```

The user clicks on what looks like a valid item, but it's actually an orphan from a previous removal that wasn't properly cleaned up.

---

## Current State of the Code

The current implementation in `rendering.ts`:

```typescript
component.on?.("item:remove-request", (data: any) => {
  const { index, item } = data;
  const itemId = item?._id || item?.id;

  // Guard against duplicates
  if (itemId && removingIds.has(itemId)) {
    return;
  }
  removingIds.add(itemId);
  setTimeout(() => removingIds.delete(itemId), 100);

  isRemovingItem = true;

  // Clear ALL rendered elements
  renderedElements.forEach((element) => {
    if (element.parentNode) {
      releaseElement(element);
    }
  });
  renderedElements.clear();

  // Reset visible range
  currentVisibleRange = { start: -1, end: -1 };

  // Emit completion
  component.emit?.("item:removed", { item, index });

  // Try to render local items
  const collectionItems = getCollectionItems();
  if (collectionItems.length > 0) {
    if (viewportState) {
      viewportState.totalItems = collectionItems.length;
    }
    isRemovingItem = false;
    renderItems();
    isRemovingItem = true;
  }

  // Request more items from server
  const collection = component.viewport?.collection;
  if (collection?.loadMissingRanges) {
    collection.loadMissingRanges(
      { start: 0, end: visibleCount },
      "rendering:after-removal",
    );
  }

  // Reset flag via microtask
  queueMicrotask(() => {
    isRemovingItem = false;
  });
});
```

---

## Recommended Solution: Complete Rewrite

The current approach of trying to synchronize multiple sources of truth (Map, DOM, data array, server count) is fundamentally flawed. 

### Option A: Server-Authoritative Refresh

After each removal:
1. Clear all local state
2. Fetch fresh data from server for range 0-visibleCount
3. Render only what the server returns
4. Accept the network latency as a tradeoff for correctness

```typescript
component.on?.("item:remove-request", async (data) => {
  // Clear everything
  renderedElements.forEach(el => releaseElement(el));
  renderedElements.clear();
  collectionItems.length = 0;
  
  // Show loading state
  showLoadingIndicator();
  
  // Fetch fresh from server
  await collection.loadMissingRanges({ start: 0, end: visibleCount }, "removal-refresh");
  
  // Render what came back
  renderItems();
  hideLoadingIndicator();
});
```

### Option B: Optimistic Local Update + Background Sync

1. Immediately remove the element from DOM
2. Shift indices in the Map
3. Render the change optimistically
4. In background, sync with server
5. If server state differs, reconcile

### Option C: Use IDs as Map Keys (Breaking Change)

Change `renderedElements` from `Map<index, element>` to `Map<id, {element, index}>`:

```typescript
const renderedElements = new Map<string, {element: HTMLElement, index: number}>();

// On removal - simple lookup by ID
const entry = renderedElements.get(itemId);
if (entry) {
  releaseElement(entry.element);
  renderedElements.delete(itemId);
}

// Update indices for remaining items
for (const [id, data] of renderedElements.entries()) {
  if (data.index > removedIndex) {
    data.index--;
    data.element.setAttribute("data-index", String(data.index));
  }
}
```

This eliminates the index/ID synchronization problem entirely.

---

## Test Scenarios

When implementing a fix, test these scenarios:

1. **Rapid removal at position 0:** Click action button 15+ times quickly
2. **Remove all items:** Start with 25 items, remove all one by one
3. **Remove past loaded page:** Have 25 loaded, remove items 20-25 (triggers fetch)
4. **Interleaved positions:** Remove index 5, then 3, then 7 in quick succession
5. **Scroll during removal:** Remove item while list is scrolling
6. **Empty to refill:** Remove all items, then items arrive from server

---

## Files Involved

| File | Role |
|------|------|
| `mtrl-addons/src/core/viewport/features/rendering.ts` | Main removal logic, `renderItems()` |
| `mtrl-addons/src/components/vlist/features/api.ts` | `removeItem()`, `removeItemById()`, calls `setTotalItems()` |
| `mtrl-addons/src/core/viewport/features/collection.ts` | `loadMissingRanges()`, `setTotalItems()` |
| `mtrl-addons/src/core/viewport/features/virtual.ts` | Listens to `viewport:total-items-changed`, calls `renderItems()` |
| `monorepo/packages/desk/src/client/tracks/actions/status.js` | Triggers removal via `updateStatus()` |

---

## Debug Logging Currently in Place

```typescript
console.log(`[REMOVE] collectionItems.length=${collectionItems.length}, visibleCount=${visibleCount}`);
console.log(`[REMOVE] Calling loadMissingRanges for range 0-${visibleCount}`);
```

---

## Priority

**HIGH** - The feature is currently broken. Users cannot reliably move tracks between categories without the list becoming empty or showing ghost elements.

---

## References

- VList component: `mtrl-addons/src/components/vlist/`
- Viewport rendering: `mtrl-addons/src/core/viewport/features/rendering.ts`
- Desk tracks list: `monorepo/packages/desk/src/client/list/tracks.js`
- Status actions: `monorepo/packages/desk/src/client/tracks/actions/status.js`
