# Layout Module - Optimization Roadmap

> **Status**: Planning  
> **Related**: [issues.md](./issues.md) - Detailed problem analysis  
> **Target**: Memory-efficient layout rendering matching HTML string performance

---

## Objective

Optimize `createLayout()` to eliminate memory leaks identified in [issues.md](./issues.md):

- **Current**: 2.6 GB after 30s scrolling with layout templates
- **Target**: <300 MB (matching HTML string template baseline of 151 MB)

---

## Phase 1: Profiling & Diagnosis

**Goal**: Identify exact memory leak sources

### 1.1 Layout Debug Instrumentation

```typescript
// src/core/layout/debug.ts
export const LayoutDebug = {
  enabled: false,
  stats: {
    createCalls: 0,
    destroyCalls: 0,
    componentInstances: 0,
    activeLayoutResults: new WeakSet(),
  },
  reset(): void,
  report(): DebugReport,
};
```

**Tasks**:
- [ ] Create `debug.ts` module
- [ ] Instrument `createLayout()` entry/exit
- [ ] Instrument `createComponentInstance()`
- [ ] Instrument `LayoutResult.destroy()`
- [ ] Expose `window.__LAYOUT_DEBUG__` for browser inspection

### 1.2 Memory Profiling Test Suite

```typescript
// test/layout/memory.test.ts
describe('Layout Memory', () => {
  it('should release memory after destroy');
  it('should not grow with repeated create/destroy cycles');
  it('should match HTML string memory baseline');
});
```

**Tasks**:
- [ ] Create memory benchmark tests
- [ ] Test component-heavy schemas (see [issues.md#hypothesis-1](./issues.md#1-component-instance-accumulation))
- [ ] Test SVG-heavy schemas (see [issues.md#hypothesis-2](./issues.md#2-svg-icon-handling))
- [ ] Test nested schemas
- [ ] Document findings in [issues.md](./issues.md)

### 1.3 Chrome DevTools Analysis

**Tasks**:
- [ ] Heap snapshots before/after createLayout cycles
- [ ] Identify retained object trees
- [ ] Check for detached DOM nodes
- [ ] Profile event listener accumulation

**Deliverable**: Root cause identification documented in [issues.md](./issues.md)

---

## Phase 2: Core Fixes

**Goal**: Fix identified leaks without API changes

### 2.1 LayoutResult.destroy() Implementation

Address [issues.md#hypothesis-4](./issues.md#4-layout-result-objects):

```typescript
destroy(): void {
  // 1. Remove event listeners
  this._listeners.forEach(({ el, type, fn }) => {
    el.removeEventListener(type, fn);
  });
  this._listeners = [];

  // 2. Destroy child components recursively
  Object.values(this.component).forEach(comp => {
    comp?.destroy?.();
  });

  // 3. Remove from DOM
  this.element?.remove();

  // 4. Null references for GC
  this.layout = null;
  this.element = null;
  this.component = null;
}
```

**Tasks**:
- [ ] Audit current destroy() implementation
- [ ] Add recursive component destruction
- [ ] Add event listener tracking and cleanup
- [ ] Null all object references
- [ ] Test with WeakRef verification

### 2.2 Event Listener Management

Address [issues.md#hypothesis-3](./issues.md#3-event-listener-accumulation):

```typescript
// Track listeners during creation
interface TrackedListener {
  element: Element;
  type: string;
  handler: EventListener;
}

const listeners: TrackedListener[] = [];

// Attach with tracking
function addTrackedListener(el: Element, type: string, handler: EventListener) {
  el.addEventListener(type, handler);
  listeners.push({ element: el, type, handler });
}

// Cleanup all
function removeAllListeners() {
  listeners.forEach(({ element, type, handler }) => {
    element.removeEventListener(type, handler);
  });
  listeners.length = 0;
}
```

**Tasks**:
- [ ] Implement listener tracking in layout creation
- [ ] Store listeners on LayoutResult instance
- [ ] Call cleanup in destroy()
- [ ] Verify with Chrome DevTools listener count

### 2.3 Cache Management

Address [issues.md#hypothesis-5](./issues.md#5-class-cache-growth):

```typescript
// Bounded class cache with LRU eviction
const CLASS_CACHE_MAX_SIZE = 500;

function getCachedClassName(key: string): string {
  if (classCache.size >= CLASS_CACHE_MAX_SIZE) {
    const firstKey = classCache.keys().next().value;
    classCache.delete(firstKey);
  }
  // ... rest of implementation
}

// Manual clear for app lifecycle events
export function clearLayoutCaches(): void {
  classCache.clear();
  fragmentPool.clear();
}
```

**Tasks**:
- [ ] Add max size to classCache
- [ ] Implement LRU eviction
- [ ] Export `clearLayoutCaches()` function
- [ ] Integrate with VList category switching

---

## Phase 3: Component Optimization

**Goal**: Reduce per-component memory overhead

### 3.1 Component Instance Pooling

Address [issues.md#solution-1](./issues.md#solution-1-component-pooling):

```typescript
// src/core/layout/pool.ts
interface PoolableComponent {
  configure(options: any): void;
  reset(): void;
  destroy(): void;
}

class ComponentPool<T extends PoolableComponent> {
  private pool: T[] = [];
  private maxSize = 50;

  acquire(factory: () => T, options: any): T {
    const instance = this.pool.pop() ?? factory();
    instance.configure(options);
    return instance;
  }

  release(instance: T): void {
    instance.reset();
    if (this.pool.length < this.maxSize) {
      this.pool.push(instance);
    }
  }

  clear(): void {
    this.pool.forEach(i => i.destroy());
    this.pool.length = 0;
  }
}
```

**Tasks**:
- [ ] Define `PoolableComponent` interface
- [ ] Add `configure()` / `reset()` to mtrl base components
- [ ] Implement `ComponentPool` class
- [ ] Integrate with `createComponentInstance()`
- [ ] Add pool statistics to debug mode

### 3.2 SVG Icon Deduplication

Address [issues.md#hypothesis-2](./issues.md#2-svg-icon-handling):

```typescript
// src/core/layout/icons.ts
const iconSymbols = new Map<string, string>();
let symbolContainer: SVGElement | null = null;

function getIconReference(svgContent: string): string {
  const hash = hashString(svgContent);
  
  if (!iconSymbols.has(hash)) {
    ensureSymbolContainer();
    const symbolId = `icon-${hash}`;
    const symbol = createSymbol(symbolId, svgContent);
    symbolContainer.appendChild(symbol);
    iconSymbols.set(hash, symbolId);
  }

  return `<svg class="icon"><use href="#${iconSymbols.get(hash)}"/></svg>`;
}
```

**Tasks**:
- [ ] Create icon symbol registry
- [ ] Generate symbols lazily on first use
- [ ] Modify Button/Icon components to use `<use>` references
- [ ] Test cross-browser compatibility
- [ ] Add fallback for unsupported browsers

### 3.3 Static Component Mode

Address [issues.md#comparison](./issues.md#comparison-layout-vs-html-string):

```typescript
// Skip component instantiation for non-interactive elements
const schema = [
  { class: 'item' },
  [Button, 'btn', { icon: svg, __static: true }], // Renders HTML only
];

function createComponentInstance(Component, options) {
  if (options.__static && Component.renderStatic) {
    // Return HTML element directly, no instance
    return { element: Component.renderStatic(options) };
  }
  // Normal component instantiation
  return new Component(options);
}
```

**Tasks**:
- [ ] Define `__static` option behavior
- [ ] Add `renderStatic()` to common components
- [ ] Implement static path in createComponentInstance
- [ ] Document usage guidelines

---

## Phase 4: Advanced Optimizations

**Goal**: Architecture improvements for maximum performance

### 4.1 Template Compilation

Address [issues.md#solution-3](./issues.md#solution-3-template-compilation):

```typescript
// Pre-compile schema to optimized render function
const trackTemplate = compileTemplate([
  { class: 'mtrl-item', attributes: { 'data-id': '{{id}}' } },
  [{ class: 'mtrl-title', text: '{{title}}' }],
  [{ class: 'mtrl-artist', text: '{{artist}}' }],
]);

// Fast repeated rendering
const el1 = trackTemplate({ id: '1', title: 'Song', artist: 'Artist' });
const el2 = trackTemplate({ id: '2', title: 'Song 2', artist: 'Artist 2' });
```

**Implementation**:
```typescript
function compileTemplate(schema: Schema): CompiledTemplate {
  // 1. Analyze schema structure
  const analysis = analyzeSchema(schema);
  
  // 2. Generate optimized render function
  const renderFn = generateRenderFunction(analysis);
  
  // 3. Return bound template
  return (data: Record<string, any>) => {
    return renderFn(data);
  };
}
```

**Tasks**:
- [ ] Design compilation API
- [ ] Implement schema analysis
- [ ] Generate optimized render functions
- [ ] Handle variable substitution (`{{var}}`)
- [ ] Handle conditional sections
- [ ] Benchmark vs standard createLayout

### 4.2 Hybrid Rendering Strategy

Address [issues.md#solution-4](./issues.md#solution-4-hybrid-approach):

```typescript
type RenderStrategy = 'layout' | 'html' | 'auto';

function createLayout(schema: Schema, options?: { strategy?: RenderStrategy }) {
  const strategy = options?.strategy ?? 'auto';
  
  if (strategy === 'auto') {
    return isStaticSchema(schema) 
      ? renderAsHtml(schema)
      : renderAsLayout(schema);
  }
  
  return strategy === 'html' 
    ? renderAsHtml(schema) 
    : renderAsLayout(schema);
}

function isStaticSchema(schema: Schema): boolean {
  // No component constructors
  // No event handlers
  // No dynamic bindings
  return !hasComponents(schema) && !hasEvents(schema);
}
```

**Tasks**:
- [ ] Define schema complexity heuristics
- [ ] Implement HTML string renderer
- [ ] Add `strategy` option to createLayout
- [ ] Default to 'auto' with smart detection
- [ ] Document behavior differences

---

## Phase 5: Integration

**Goal**: Validate in production use cases

### 5.1 VList/Viewport Integration

```typescript
// viewport/features/rendering.ts
const releaseElement = (element: HTMLElement): void => {
  // Call layout destroy if available
  const layoutResult = element._layoutResult;
  if (layoutResult?.destroy) {
    layoutResult.destroy();
    element._layoutResult = null;
  }
  
  // Continue with element cleanup...
};
```

**Tasks**:
- [ ] Store LayoutResult reference on rendered elements
- [ ] Call destroy() in releaseElement
- [ ] Test with VList scrolling benchmark
- [ ] Verify memory stability over 60s scroll test

### 5.2 Performance Benchmarks

```typescript
// benchmark/layout.bench.ts
const benchmarks = {
  'createLayout - minimal': () => 
    createLayout([{ class: 'item' }]),
    
  'createLayout - with text': () => 
    createLayout([{ class: 'item', text: 'Hello' }]),
    
  'createLayout - with component': () => 
    createLayout([[Button, 'btn', { label: 'Click' }]]),
    
  'createLayout - complex (track item)': () => 
    createLayout(trackItemSchema),
    
  'HTML string - complex (track item)': () => 
    parseHtml(trackItemHtml),
};
```

**Metrics**:
| Benchmark | Target ops/sec | Target memory/op |
|-----------|---------------|------------------|
| Minimal | >10,000 | <1 KB |
| With text | >8,000 | <2 KB |
| With component | >2,000 | <5 KB |
| Complex | >500 | <10 KB |

**Tasks**:
- [ ] Create benchmark suite
- [ ] Add to CI pipeline
- [ ] Set performance budgets
- [ ] Alert on regressions

---

## Success Criteria

| Metric | Current | Target | Verified |
|--------|---------|--------|----------|
| Memory (30s scroll) | 2.6 GB | <300 MB | [ ] |
| Memory per createLayout | ~50 KB | <10 KB | [ ] |
| Ops/sec (complex schema) | ~100 | >500 | [ ] |
| Event listener leaks | Yes | None | [ ] |
| Detached DOM nodes | Yes | None | [ ] |

---

## References

- [issues.md](./issues.md) - Problem analysis and hypotheses
- [array-schema.md](./array-schema.md) - Schema format documentation
- `mtrl-addons/src/core/layout/schema.ts` - Main implementation
- `mtrl-addons/src/core/viewport/features/rendering.ts` - VList integration

---

*Last Updated: December 2025*