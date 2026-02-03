# Layout Module - Performance Investigation

> **Status**: Open - Requires Investigation  
> **Priority**: High  
> **Created**: January 2025  
> **Context**: VList/Viewport virtual scrolling with heavy templates

## Problem Summary

When using the layout module to render track items in a virtual scrolling list (VList), memory usage grows rapidly during scrolling:

- **Before optimization**: 2.6 GB after 30 seconds of scrolling
- **After switching to HTML string template**: 151 MB (stable)

This represents a **17x difference** in memory consumption for the same visual output.

## Environment

- **Component**: `mtrl-addons` VList with `createLayout` from `mtrl-addons/src/core/layout`
- **Use Case**: Rendering ~50,000+ track items in a virtual scrolling list
- **Template Complexity**: ~50-80 DOM elements per item including:
  - 10 Button components with SVG icons
  - Multiple field adapters (Image, Country, Ranking, Email, Badge, TimeAgo, Text)
  - Nested div structure with many class names

## Observed Behavior

### Memory Growth Pattern

```
[Memory:load:0]  items=25,   loaded=1
[Memory:load:15] items=250,  loaded=10
[Memory:load:30] items=500,  loaded=20
[Memory:load:45] items=750,  loaded=30
...
[Memory:load:85] items=2843, loaded=114  → Memory: 2.6 GB
```

Even with cache eviction keeping JavaScript item count low (~500 items), memory continued to grow, indicating the leak is in DOM/rendering layer, not data layer.

### Chrome DevTools Heap Analysis

| Category | Before Scrolling | After 30s Scrolling | Growth |
|----------|-----------------|---------------------|--------|
| **Typed arrays** | 2 MB | **490 MB** | 240x |
| Strings | 2 MB | 19 MB | 8x |
| Code | 1 MB | 1.5 MB | 1.5x |
| **Total** | 7 MB | 591 MB | 81x |

The **Typed arrays** category (490 MB) suggests:
- Image data / canvas buffers
- Fetch response buffers
- GPU texture memory

## Hypothesis: Layout Module Issues

### 1. Component Instance Accumulation

Each call to `createLayout()` with component schemas (like `[Button, 'name', {...}]`) creates new component instances:

```javascript
// Track template calls createLayout for each item
const trackItemTemplate = (track) => {
  return [{ class: 'item' },
    [Button, 'onair', { icon: iconOnAir, ... }],
    [Button, 'validate', { icon: iconValidate, ... }],
    // ... 10 more buttons
  ]
}
```

**Questions to investigate:**
- Are Button/component instances properly garbage collected?
- Do components hold references that prevent GC?
- Is there a component instance registry that grows unbounded?

### 2. SVG Icon Handling

Each button includes an SVG icon. With 10 buttons per item × hundreds of items:

```javascript
[Button, 'onair', { icon: iconOnAir, ... }]
```

**Questions to investigate:**
- How are SVG icons cloned/inserted?
- Are SVG elements being properly released?
- Could we use `<use xlink:href>` for icon reuse?

### 3. Event Listener Accumulation

Components may attach event listeners that aren't cleaned up:

**Questions to investigate:**
- Do Button components add click handlers?
- Are event listeners removed when elements are released?
- Is there a destroy/cleanup method being called?

### 4. Layout Result Objects

`createLayout()` returns a `LayoutResult` object:

```typescript
interface LayoutResult {
  layout: Record<string, any>;
  element: HTMLElement;
  component: Record<string, any>;
  get(name: string): any;
  getAll(): Record<string, any>;
  destroy(): void;
}
```

**Questions to investigate:**
- Is `destroy()` being called when items are recycled?
- Does `destroy()` properly clean up all references?
- Are `layout` and `component` maps being cleared?

### 5. Class Cache Growth

The layout module has a class cache:

```typescript
const classCache = new Map<string, string>();
```

**Questions to investigate:**
- Does this cache grow unbounded?
- Should it be cleared periodically?

### 6. Fragment Pool

```typescript
class FragmentPool {
  private pool: DocumentFragment[] = [];
  private maxSize = 8;
}
```

**Questions to investigate:**
- Is the fragment pool working correctly?
- Are fragments being properly released?

## Comparison: Layout vs HTML String

### Layout Module Approach (Slow)

```javascript
const trackItemTemplate = (track) => {
  return [{ class: 'mtrl-item', attributes: { 'data-id': track.id } },
    [{ class: 'mtrl-body' },
      [ImageField, 'cover', { value: track.cover }],
      [{ class: 'mtrl-content' },
        [Button, 'onair', { icon: iconOnAir }],
        [Button, 'validate', { icon: iconValidate }],
        // ... many more components
      ]
    ]
  ]
}
```

**What happens per item:**
1. Parse schema array recursively
2. Instantiate each component class (Button, ImageField, etc.)
3. Each component creates DOM elements internally
4. Apply options, styles, attributes
5. Build component tree
6. Return LayoutResult with references

### HTML String Approach (Fast)

```javascript
const trackItemTemplate = (track) => {
  return `
    <div class="mtrl-item" data-id="${track.id}">
      <div class="mtrl-body">
        <div class="mtrl-image" style="background-image: url(${coverUrl})"></div>
        <div class="mtrl-content">
          <button class="button mtrl-onair" data-name="onair">
            <i class="icon">${iconOnAir}</i>
          </button>
          ...
        </div>
      </div>
    </div>
  `
}
```

**What happens per item:**
1. String concatenation (fast)
2. Single `innerHTML` parse by browser (optimized)
3. No component instances
4. No JavaScript object overhead

## Proposed Investigation Steps

### Step 1: Profile Component Creation

Add instrumentation to track component instance creation:

```javascript
let componentCount = 0;
const originalCreateComponent = createComponentInstance;
createComponentInstance = (Component, options) => {
  componentCount++;
  console.log(`[Layout] Component #${componentCount}: ${Component.name}`);
  return originalCreateComponent(Component, options);
};
```

### Step 2: Profile Memory per createLayout Call

```javascript
const before = performance.memory?.usedJSHeapSize;
const result = createLayout(schema);
const after = performance.memory?.usedJSHeapSize;
console.log(`[Layout] Memory delta: ${(after - before) / 1024} KB`);
```

### Step 3: Test destroy() Effectiveness

```javascript
const results = [];
for (let i = 0; i < 100; i++) {
  const result = createLayout(trackSchema);
  results.push(result);
}
// Measure memory
results.forEach(r => r.destroy());
// Force GC and measure memory again
```

### Step 4: Compare with Simple Schema

Test with minimal schema to isolate the issue:

```javascript
// Minimal - should be fast
const minimal = [{ class: 'item', text: 'Hello' }];

// With components - potential issue
const withComponents = [{ class: 'item' }, [Button, 'btn', {}]];
```

## Potential Solutions

### Solution 1: Component Pooling

Reuse component instances instead of creating new ones:

```javascript
const buttonPool = [];
const getButton = (options) => {
  const btn = buttonPool.pop() || new Button();
  btn.configure(options);
  return btn;
};
const releaseButton = (btn) => {
  btn.reset();
  buttonPool.push(btn);
};
```

### Solution 2: Lazy Component Instantiation

Only create components when they become visible:

```javascript
// Store schema, not instance
element.dataset.schema = JSON.stringify(schema);
// Create on intersection
observer.observe(element);
```

### Solution 3: Template Compilation

Pre-compile schemas to functions:

```javascript
const compiledTemplate = compileSchema(trackSchema);
// Later, just call with data
const element = compiledTemplate(track);
```

### Solution 4: Hybrid Approach

Use layout for complex interactive components, HTML strings for static content:

```javascript
const trackItemTemplate = (track) => {
  // Static parts as HTML string
  const staticHtml = `<div class="mtrl-item">...</div>`;
  
  // Only use layout for interactive parts
  const actionButtons = createLayout([
    [Button, 'onair', { icon: iconOnAir }],
  ]);
  
  return combineElements(staticHtml, actionButtons);
};
```

### Solution 5: Proper Cleanup Integration

Ensure VList calls destroy on recycled items:

```javascript
// In viewport rendering.ts releaseElement()
const releaseElement = (element) => {
  // Call layout destroy if available
  if (element._layoutResult) {
    element._layoutResult.destroy();
    element._layoutResult = null;
  }
  // ... rest of cleanup
};
```

## Success Criteria

The layout module should achieve:

1. **Memory stability**: No unbounded growth during scrolling
2. **Performance parity**: Within 2x of HTML string approach
3. **Proper cleanup**: All references released when elements are recycled
4. **No leaked listeners**: Event handlers properly removed

## Related Files

- `mtrl-addons/src/core/layout/schema.ts` - Main layout processor
- `mtrl-addons/src/core/layout/index.ts` - Public API
- `mtrl-addons/src/core/viewport/features/rendering.ts` - VList rendering
- `mtrl/src/button/button.ts` - Button component (frequently instantiated)

## References

- Original investigation: VList memory optimization session (January 2025)
- Test case: `radiooooo/monorepo/packages/desk/src/client/tracks/list.js`
- Working HTML template: Same file, `trackItemTemplate` function