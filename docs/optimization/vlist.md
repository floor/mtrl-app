# VList Scroll Performance Optimization

## Overview

This document tracks performance optimization efforts for the VList component's scroll handling, particularly for large datasets (1M+ items).

## Completed Optimizations

### 1. Fix Duplicate Event Listeners (commit `aa89388`)

**Problem:** `updateItemAccessibility` and `applySelectionToElements` were subscribed to BOTH `viewport:items-rendered` AND `viewport:rendered` events, causing 4 DOM iterations per scroll frame.

**Solution:**
- Removed duplicate event subscriptions (now only listen to `viewport:rendered`)
- Added RAF debouncing to batch updates and prevent blocking

**Impact:**
- Scroll handler time: ~60ms → ~12ms (5x improvement)
- DOM iterations: 4x → 1x per frame

**Files changed:**
- `mtrl-addons/src/components/vlist/features/keyboard.ts`
- `mtrl-addons/src/components/vlist/features/selection.ts`

---

### 2. RAF-Based Render Throttling (commit `2fd2e74`)

**Problem:** Every wheel event triggered a full render cycle, even when scrolling faster than 60fps.

**Solution:** Implemented RAF-based render loop to coalesce rapid wheel events.

```typescript
// In scrolling.ts
let renderScheduled = false;
let pendingScrollData = null;

// In handleWheel:
pendingScrollData = { position, direction, previousPosition };

if (!renderScheduled) {
  renderScheduled = true;
  requestAnimationFrame(() => {
    renderScheduled = false;
    // Emit events and render with latest position
    component.emit?.("viewport:scroll", pendingScrollData);
    component.viewport.renderItems();
  });
}
```

**Impact:**
- Prevents wasted renders during fast scrolling
- Ensures max 60fps render rate
- Multiple wheel events coalesced into single render

**Files changed:**
- `mtrl-addons/src/core/viewport/features/scrolling.ts`

---

## Final Performance Results

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Total frame time | ~60ms | ~2-5ms | **10-30x faster** |
| renderItemAvg | N/A (blocking) | ~0.21ms | ✅ Excellent |
| updateItemAccessibility | ~50ms (2x calls) | 0ms (RAF deferred) | ✅ Fixed |
| Target FPS | ~16 FPS | ~60+ FPS | ✅ Smooth |

**Frame budget:** 16.67ms for 60fps — now consistently under budget ✅

---

## Layout System Performance

We investigated whether the layout system was a bottleneck.

### Comparison: Layout System vs Pure HTML Template

| Metric | Layout System | Pure HTML |
|--------|---------------|-----------|
| renderItemAvg | 0.21ms | 0.03ms |
| Components per item | 18 | N/A |
| avgPerComponent | 0.03-0.05ms | N/A |

### Conclusion

The layout system adds ~0.18ms overhead per item due to:
- 18 component instantiations (ImageField, TextField, EmailField, etc.)
- Each component creates DOM elements, adds classes, calls `set()`

**However**, at 0.21ms per item with full component features, this is acceptable:
- 21 items × 0.21ms = ~4.4ms (well under 16ms budget)
- You retain full component API (`.set()`, events, validation)

### Optimization Options (Not Implemented - Not Needed)

These were considered but not implemented since current performance is acceptable:

1. **Element pooling for field components** - Reuse field instances
2. **Compile to HTML string** - Lose component benefits
3. **Hybrid approach** - HTML for structure, components for interactive elements

---

## Investigation Notes

### The Console.log Mystery (Solved)

During investigation, we discovered that `console.log` statements appeared to "prevent" scroll blocking. This was a red herring.

**What was actually happening:**
- The 60ms long task was being broken into smaller chunks by console.log
- This allowed the browser to paint between chunks
- Without console.log, the entire 60ms ran as one long task, blocking paint

**Root cause:** Duplicate event listeners causing 4x the expected work per frame.

**Lesson:** When debugging performance, don't trust accidental fixes. Find the real bottleneck.

---

## Performance Testing

### How to measure

1. Open Chrome DevTools → Performance tab
2. Start recording
3. Scroll rapidly through the list
4. Stop recording
5. Look for:
   - Long tasks (>50ms, marked in red)
   - Frame rate drops
   - JavaScript execution time in scroll handlers

### Target metrics

| Metric | Target | Excellent |
|--------|--------|-----------|
| Frame time | <16ms | <8ms |
| FPS during scroll | 60 | 60 |
| Long tasks | None | None |
| Input latency | <16ms | <8ms |

---

## Branch & Commits

**Branch:** `feat/vlist-scrolling-optimization`

| Commit | Description |
|--------|-------------|
| `aa89388` | Fix duplicate event listeners + RAF debounce for accessibility/selection |
| `cede6ac` | Remove debug logging |
| `2fd2e74` | RAF-based render throttling for scroll events |

---

## Related Files

- `mtrl-addons/src/core/viewport/features/scrolling.ts` - Scroll event handling
- `mtrl-addons/src/core/viewport/features/rendering.ts` - Item rendering
- `mtrl-addons/src/core/viewport/features/events.ts` - Event system
- `mtrl-addons/src/core/viewport/features/virtual.ts` - Virtual scrolling calculations
- `mtrl-addons/src/components/vlist/features/keyboard.ts` - Accessibility updates
- `mtrl-addons/src/components/vlist/features/selection.ts` - Selection handling
- `mtrl-addons/src/core/layout/schema.ts` - Layout system schema processing

---

*Last updated: January 2026*
*Status: ✅ Optimization complete*