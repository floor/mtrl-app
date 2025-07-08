# Layout System

## Overview

The Layout System is a lightweight, flexible system for creating and managing visual arrangements and component hierarchies. It provides a declarative approach to building UI layouts using arrays, objects, JSX, or HTML strings, with efficient DOM operations, component instantiation, and visual arrangement.

## Features

- **Multiple Schema Formats** - Support for array-based, object-based, JSX-based, and HTML string schemas
- **Efficient DOM Operations** - Batched DOM manipulations with DocumentFragment
- **Component Management** - Easy access to component instances via consistent API
- **Layout System Integration** - Direct access to powerful CSS layout classes
- **Customizable Creation** - Control class prefixing and specify default creators
- **Optimized for Bundle Size** - Minimal footprint with maximum functionality
- **TypeScript Support** - Full type definitions for developer experience

## Installation

```bash
npm install mtrl
```

## Core Concepts

The Layout System consists of several key parts:

1. **Schema Definition** - A declarative way to describe your layout
2. **Layout Processing** - Converting the schema into DOM elements
3. **Layout Configuration** - Setting up responsive layouts and grids
4. **Component Instance Management** - Accessing and controlling created components

## Basic Usage

### Array-based Layout

```javascript
import { createLayout, createButton, createDialog } from "mtrl";

const layout = createLayout([
  // Root level contains primary components
  createButton,
  "submitButton",
  { text: "Submit", variant: "primary" },

  // Dialog is a root component, not nested inside other elements
  createDialog,
  "confirmDialog",
  {
    title: "Confirm Action",
    closeOnBackdrop: true,
    width: "350px",
  },
]);

// Access components
const submitButton = layout.get("submitButton");
const confirmDialog = layout.get("confirmDialog");

// Handle events
submitButton.on("click", () => confirmDialog.open());
```

### Object-based Layout

```javascript
import {
  createLayout,
  createTopAppBar,
  createList,
  createListItem,
} from "mtrl";

const layout = createLayout({
  element: {
    creator: createTopAppBar,
    options: {
      title: "Profile Settings",
      variant: "small",
    },
    children: {
      navigation: {
        creator: createNavigation,
        options: {
          variant: "drawer",
          persistent: true,
          // CSS layout configuration
          layout: {
            type: "stack",
            gap: 4,
            align: "stretch",
          },
        },
        children: {
          navList: {
            creator: createList,
            options: { interactive: true },
            children: {
              profileLink: {
                creator: createListItem,
                options: { text: "Profile", leading: "person" },
              },
              settingsLink: {
                creator: createListItem,
                options: { text: "Settings", leading: "settings" },
              },
            },
          },
        },
      },
      content: {
        options: {
          tag: "main",
          className: "content",
          // Grid layout configuration
          layout: {
            type: "grid",
            columns: 3,
            gap: 6,
            autoHeight: true,
          },
        },
      },
    },
  },
});
```

### JSX-based Layout

The layout system now supports JSX syntax for creating layouts, offering a more familiar and readable approach:

```jsx
/** @jsx h */
import { h, Fragment, createJsxLayout } from "mtrl";

// Create a layout using JSX
const layout = (
  <div className="container" layout={{ type: "grid", columns: 3, gap: 4 }}>
    <header layoutItem={{ span: 3 }}>
      <h1>Dashboard</h1>
    </header>

    <aside layoutItem={{ span: 1, sm: 12, md: 4 }}>
      <nav>
        <ul>
          <li>
            <a href="#home">Home</a>
          </li>
          <li>
            <a href="#stats">Statistics</a>
          </li>
          <li>
            <a href="#settings">Settings</a>
          </li>
        </ul>
      </nav>
    </aside>

    <main layoutItem={{ span: 2, sm: 12, md: 8 }}>
      <section className="content">
        <h2>Welcome to the Dashboard</h2>
        <p>This layout was created using JSX syntax.</p>

        {/* Conditional rendering */}
        {hasNotifications && (
          <div className="notifications">
            You have {notificationCount} new notifications.
          </div>
        )}

        {/* Using components */}
        {createButton({
          text: "Click Me",
          variant: "filled",
        })}
      </section>
    </main>

    <footer layoutItem={{ span: 3 }}>© 2025 mtrl Framework</footer>
  </div>
);

// Create the actual DOM structure
const result = createJsxLayout(layout);
document.body.appendChild(result.element);
```

### HTML String Layout

```javascript
import { createLayout } from "mtrl";

const layout = createLayout(`
  <div class="notification">
    <h3>Welcome!</h3>
    <p>Thank you for joining our platform.</p>
  </div>
`);

// Access the root element
const notification = layout.element;
document.body.appendChild(notification);
```

## Layout Configuration

The layout system supports direct integration with the CSS layout system through the `layout` property:

### Grid Layout

```javascript
createLayout({
  gridContainer: {
    options: {
      className: "container",
      layout: {
        type: "grid",
        columns: 3, // Number of columns
        gap: 4, // Gap size (using the gap scale)
        autoHeight: true, // Allow natural heights
        dense: true, // Dense packing algorithm
        align: "center", // Alignment of items
      },
    },
    children: {
      item1: {
        options: {
          text: "Item 1",
          // Individual item layout configuration
          layoutItem: {
            span: 2, // Span 2 columns
            rowSpan: 1, // Span 1 row
            align: "start", // Self-alignment
          },
        },
      },
    },
  },
});
```

### Stack Layout (Vertical)

```javascript
createLayout({
  stack: {
    options: {
      layout: {
        type: "stack",
        gap: 4, // Space between items
        align: "center", // Center items horizontally
        justify: "between", // Space between items vertically
      },
    },
    children: {
      header: { options: { text: "Header" } },
      content: { options: { text: "Content" } },
      footer: { options: { text: "Footer" } },
    },
  },
});
```

### Row Layout (Horizontal)

```javascript
createLayout({
  row: {
    options: {
      layout: {
        type: "row",
        gap: 4, // Space between items
        align: "center", // Center items vertically
        justify: "between", // Space between items horizontally
        wrap: true, // Allow wrapping
        mobileStack: true, // Stack on mobile devices
      },
    },
    children: {
      // Row items...
    },
  },
});
```

## Layout Types

The layout system supports several layout types that can be used in the `layout.type` property:

| Type      | Description                 | Key Options                                      |
| --------- | --------------------------- | ------------------------------------------------ |
| `stack`   | Vertical column of elements | `align`, `justify`, `gap`                        |
| `row`     | Horizontal row of elements  | `align`, `justify`, `wrap`, `gap`, `mobileStack` |
| `grid`    | CSS Grid-based layout       | `columns`, `gap`, `autoHeight`, `dense`          |
| `masonry` | Masonry-style layout        | `masonryColumns`, `gap`                          |
| `split`   | Two-column split layout     | `ratio`, `gap`                                   |
| `sidebar` | Sidebar with main content   | `sidebarPosition`, `sidebarWidth`                |

## Layout Item Properties

When using the `layoutItem` property to configure individual items:

| Property               | Description                      | Example Values                              |
| ---------------------- | -------------------------------- | ------------------------------------------- |
| `width`                | Column width in a 12-column grid | `1` through `12`                            |
| `span`                 | Grid column span                 | `1` through `12`                            |
| `rowSpan`              | Grid row span                    | `1` through `12`                            |
| `sm`, `md`, `lg`, `xl` | Responsive widths                | `1` through `12`                            |
| `order`                | Item ordering                    | `'first'`, `'last'`, or a number            |
| `align`                | Self-alignment                   | `'start'`, `'center'`, `'end'`, `'stretch'` |
| `auto`                 | Auto width (flex)                | `true`, `false`                             |

## Layout Functions

### `createLayout(schema, parentElement?, options?)`

Creates a layout from a schema definition.

- **Parameters**:
  - `schema`: Array, object, JSX, or HTML string
  - `parentElement` (optional): Parent element to attach the layout to
  - `options` (optional): Configuration options for layout creation
- **Returns**: Layout result object with components and utility methods

```javascript
const layout = createLayout(schema, document.getElementById("container"), {
  creator: createCard, // Default creator for elements without a specific one
  prefix: true, // Whether to apply automatic class prefixing
  theme: "dark", // Custom options (passed to components)
});
```

### `createJsxLayout(jsxElement, parentElement?)`

Creates a layout from a JSX element.

- **Parameters**:
  - `jsxElement`: JSX element created with the `h` function
  - `parentElement` (optional): Parent element to attach the layout to
- **Returns**: Layout result object with components and utility methods

```jsx
/** @jsx h */
import { h, createJsxLayout } from "mtrl";

const jsxElement = <div className="container">Hello, world!</div>;
const layout = createJsxLayout(jsxElement);
```

### Layout Result Object

The object returned by `createLayout` contains:

- `layout`: Raw layout object with all components
- `element`: Reference to the root element
- `component`: Flattened component map for easy access
- `get(name)`: Function to get a component by name
- `getAll()`: Function to get all components
- `destroy()`: Function to clean up the layout

```javascript
// Access components in different ways
const header = layout.get("header"); // By name
const footer = layout.component.footer; // Via flattened map
const rootElement = layout.element; // Root element
```

## JSX Support

### Setting Up JSX

To use JSX, add these settings to your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "jsx": "react",
    "jsxFactory": "h",
    "jsxFragmentFactory": "Fragment"
  }
}
```

And add the JSX pragma comment to your `.tsx` files:

```jsx
/** @jsx h */
import { h, Fragment, createJsxLayout } from "mtrl";
```

### JSX Features

- **HTML Elements & Components**: Mix standard HTML with mtrl components
- **Conditional Rendering**: Use conditional expressions (`condition ? x : y`)
- **Fragments**: Group elements without extra DOM nodes using `<Fragment>`
- **Iteration**: Generate lists using `.map()`
- **Event Handling**: Direct event handler attachment
- **Inline Styles**: Support for object-style CSS properties
- **Layout Props**: Direct support for layout configuration

## Examples

### Array Schema Examples

#### Grid Layout with Array Schema

```javascript
import { createLayout, createElement, createCard } from "mtrl";

// Create a grid layout using array syntax
const dashboard = createLayout([
  // Container element with layout configuration
  "dashboardGrid",
  {
    className: "dashboard-grid",
    layout: {
      type: "grid",
      columns: 3,
      gap: 4,
      autoHeight: true,
    },
  },
  [
    // First card
    createCard,
    "statsCard",
    {
      title: "Statistics",
      outlined: true,
      layoutItem: {
        span: 2, // Span 2 columns
        sm: 12, // Full width on small screens
        md: 6, // Half width on medium screens
      },
    },
    // Second card
    createCard,
    "activityCard",
    {
      title: "Recent Activity",
      outlined: true,
      layoutItem: {
        span: 1, // Span 1 column
        sm: 12, // Full width on small screens
        md: 6, // Half width on medium screens
      },
    },
    // Third card
    createCard,
    "revenueCard",
    {
      title: "Revenue",
      outlined: true,
      layoutItem: {
        span: 3, // Full width
        md: 6, // Half width on medium screens
      },
    },
  ],
]);

// Access components
const statsCard = dashboard.get("statsCard");
statsCard.update({ content: "Updated statistics data" });
```

#### Application Layout with Array Schema

```javascript
import {
  createLayout,
  createTopAppBar,
  createDrawer,
  createList,
  createListItem,
  createElement,
} from "mtrl";

// Create an application layout using array syntax
const appLayout = createLayout([
  // Create a container element
  "appContainer",
  {
    className: "app-container",
    layout: { type: "stack", gap: 0 },
  },
  [
    // Header
    createTopAppBar,
    "header",
    {
      title: "My Application",
      actions: ["menu", "account"],
    },

    // Main content area
    "main",
    {
      className: "app-main",
      layout: { type: "row", gap: 0 },
    },
    [
      // Sidebar
      createDrawer,
      "sidebar",
      {
        persistent: true,
        layout: { type: "stack", gap: 2 },
      },
      [
        // Navigation list
        createList,
        "nav",
        { interactive: true },
        [
          createListItem,
          "homeLink",
          { text: "Home", leading: "home" },
          createListItem,
          "settingsLink",
          { text: "Settings", leading: "settings" },
        ],
      ],

      // Main content
      "content",
      {
        tag: "main",
        className: "app-content",
        layout: {
          type: "grid",
          columns: "auto-fit",
          gap: 4,
        },
      },
    ],
  ],
]);

// Access and modify components
const header = appLayout.get("header");
header.setTitle("Dashboard");

// Add items to the grid content area
const content = appLayout.get("content");
const card = createCard({ title: "Statistics", content: "App usage data..." });
content.appendChild(card.element);
```

### JSX Schema Examples

#### Dashboard Grid with JSX Schema

```jsx
/** @jsx h */
import { h, Fragment, createJsxLayout } from "mtrl";
import { createCard } from "mtrl";

function createDashboard(stats) {
  const layout = (
    <div
      className="dashboard-grid"
      layout={{ type: "grid", columns: 3, gap: 4, autoHeight: true }}
    >
      <div layoutItem={{ span: 2, sm: 12, md: 6 }}>
        {createCard({
          title: "Statistics",
          outlined: true,
          content: stats.totalUsers.toString(),
        })}
      </div>

      <div layoutItem={{ span: 1, sm: 12, md: 6 }}>
        {createCard({
          title: "Recent Activity",
          outlined: true,
          content: `${stats.activeUsers} active users`,
        })}
      </div>

      <div layoutItem={{ span: 3, md: 6 }}>
        {createCard({
          title: "Revenue",
          outlined: true,
          content: `$${stats.revenue.toLocaleString()}`,
        })}
      </div>
    </div>
  );

  return createJsxLayout(layout);
}

// Usage
const dashboard = createDashboard({
  totalUsers: 12583,
  activeUsers: 4321,
  revenue: 1234567,
});

document.body.appendChild(dashboard.element);
```

#### Form Layout with JSX Schema

```jsx
/** @jsx h */
import { h, createJsxLayout } from "mtrl";
import { createTextField, createButton } from "mtrl";

function createLoginForm(onSubmit) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const username = form.elements.username.value;
    const password = form.elements.password.value;
    onSubmit({ username, password });
  };

  const layout = (
    <form
      className="login-form"
      onSubmit={handleSubmit}
      layout={{ type: "stack", gap: 4 }}
    >
      <div layoutItem={{ width: 12 }}>
        {createTextField({
          label: "Username",
          name: "username",
          required: true,
        })}
      </div>

      <div layoutItem={{ width: 12 }}>
        {createTextField({
          label: "Password",
          name: "password",
          type: "password",
          required: true,
        })}
      </div>

      <div layout={{ type: "row", justify: "end", gap: 2 }}>
        {createButton({
          text: "Reset",
          variant: "text",
          type: "reset",
        })}

        {createButton({
          text: "Login",
          variant: "filled",
          type: "submit",
        })}
      </div>
    </form>
  );

  return createJsxLayout(layout);
}

// Usage
const form = createLoginForm((credentials) => {
  console.log("Login attempt:", credentials);
  alert(`Login attempt for: ${credentials.username}`);
});

document.body.appendChild(form.element);
```

## Performance Considerations

### Schema Format Performance

**Array-based schemas** generally outperform object-based schemas:

- **Faster processing**: 15-30% faster for large layouts
- **Lower memory usage**: Requires less memory without property names
- **Better bundle size**: More compact representation in code
- **Efficient iteration**: Arrays are optimized for sequential access

**Object-based schemas** excel in:

- **Readability**: More explicit structure with named properties
- **Maintainability**: Easier to understand complex nested structures
- **Self-documentation**: Property names describe the layout's purpose

**JSX schemas** offer:

- **Familiarity**: Syntax familiar to many developers
- **Readability**: Clear visual hierarchy mirroring the DOM
- **Features**: Natural support for conditionals and iteration
- **Performance**: Converted to efficient array schemas internally

**Recommendations**:

- For **performance-critical** applications, prefer array-based schemas
- For **complex, deeply nested** structures where maintainability is key, consider object-based schemas
- For **the best readability** and **familiar syntax**, use JSX schemas
- For the **best balance**, use array-based schemas for large structures and JSX for user interfaces

### Options Performance Considerations

- Setting `prefix: false` can improve performance slightly by avoiding class name processing
- Providing a `creator` function in options is more efficient than having many duplicate creator references in the schema
- Consider memoizing layout creation for frequently used UI patterns with the same options

### JSX Performance Considerations

- The JSX implementation is optimized for performance and converts to efficient array schemas
- Style objects are converted to strings at creation time, not during rendering
- Fragment support prevents unnecessary DOM nodes
- Children are flattened for more efficient processing

### General Optimization Tips

- Use DocumentFragment for batch DOM operations
- Create components only when needed
- Consider memoizing frequently created layouts
- For large applications, lazy-load secondary layouts

## Responsive Design

The layout system provides several ways to create responsive designs:

### Responsive Grid

```javascript
createLayout({
  grid: {
    options: {
      layout: {
        type: "grid",
        // Different columns at different breakpoints using CSS media queries
        class:
          "md:layout--grid-cols-2 lg:layout--grid-cols-3 xl:layout--grid-cols-4",
      },
    },
  },
});
```

### Layout Items with Responsive Widths

```javascript
createLayout({
  row: {
    options: {
      layout: { type: "row", gap: 4 },
    },
    children: {
      sidebar: {
        options: {
          layoutItem: {
            width: 3, // Default: 3/12 (25%)
            sm: 12, // Small screens: 12/12 (100%)
            md: 4, // Medium screens: 4/12 (33.3%)
            lg: 3, // Large screens: 3/12 (25%)
          },
        },
      },
      main: {
        options: {
          layoutItem: {
            width: 9, // Default: 9/12 (75%)
            sm: 12, // Small screens: 12/12 (100%)
            md: 8, // Medium screens: 8/12 (66.6%)
            lg: 9, // Large screens: 9/12 (75%)
          },
        },
      },
    },
  },
});
```

### Mobile Behavior Options

```javascript
createLayout({
  row: {
    options: {
      layout: {
        type: "row",
        gap: 4,
        mobileStack: true, // Stack on mobile instead of row
        // OR
        mobileScroll: true, // Enable horizontal scrolling on mobile
      },
    },
    children: {
      // Row items...
    },
  },
});
```

## Layout CSS Classes

The layout system uses a consistent naming convention for CSS classes:

### Layout Container Classes

- **Base Layout**: `.layout--[type]` (e.g., `.layout--stack`, `.layout--grid`)
- **Alignment**: `.layout--[type]-[align]` (e.g., `.layout--stack-center`)
- **Justification**: `.layout--[type]-justify-[justify]` (e.g., `.layout--row-justify-between`)
- **Spacing**: `.layout--[type]-gap-[size]` (e.g., `.layout--grid-gap-4`)
- **Specific Options**: `.layout--[type]-[option]` (e.g., `.layout--grid-dense`)

### Layout Item Classes

- **Base Item**: `.layout__item`
- **Width**: `.layout__item--[width]` (e.g., `.layout__item--4` for 4/12 width)
- **Responsive Widths**: `.layout__item--[breakpoint]-[width]` (e.g., `.layout__item--md-6`)
- **Ordering**: `.layout__item--order-[order]` (e.g., `.layout__item--order-first`)
- **Alignment**: `.layout__item--self-[align]` (e.g., `.layout__item--self-center`)
- **Grid Span**: `.layout__item--span-[span]` (e.g., `.layout__item--span-2`)

## Performance Benchmarks

The mtrl-addons library includes a comprehensive benchmark suite that measures the performance characteristics of the layout system. These benchmarks provide insights into real-world performance, optimization effectiveness, and scalability limits.

### Benchmark Organization

The benchmarks are organized separately from unit tests to maintain fast development cycles while providing detailed performance analysis when needed:

```
test/benchmarks/layout/
├── simple.test.ts                    # Basic performance verification
├── advanced.test.ts                  # Comprehensive performance analysis
├── stress.test.ts                    # Extreme load testing
├── real-components.test.ts           # Integration with actual mtrl components
├── performance-comparison.test.ts    # Mock vs real component overhead
└── comparison.test.ts                # System performance comparison
```

### Running Benchmarks

```bash
# Run all layout benchmarks
bun run benchmark:layout

# Run specific benchmark categories
bun run benchmark:real          # Real component integration
bun run benchmark:stress        # Stress testing
bun run benchmark              # All benchmarks

# Regular development testing (excludes benchmarks)
bun run test                   # Fast unit tests only
```

### Performance Metrics

#### Current Performance Profile

The layout system demonstrates excellent performance across all scenarios:

| Scenario            | Performance    | Throughput                | Use Case          |
| ------------------- | -------------- | ------------------------- | ----------------- |
| **Simple Layouts**  | ~0.002-0.005ms | 50,000+ layouts/sec       | Basic UI elements |
| **Complex Layouts** | ~0.02-0.05ms   | 10,000-20,000 layouts/sec | Nested structures |
| **Real Components** | ~0.03-0.1ms    | 2,000-15,000 layouts/sec  | Production apps   |
| **Forms**           | ~0.5ms         | 2,000+ forms/sec          | Complex forms     |
| **Dashboards**      | ~0.3ms         | 3,000+ dashboards/sec     | Rich interfaces   |

#### Bundle Size Impact

The unified layout system in mtrl-addons delivers significant bundle size improvements:

| System            | Bundle Size  | Change     | Performance |
| ----------------- | ------------ | ---------- | ----------- |
| **Original mtrl** | 17,750 bytes | Baseline   | Good        |
| **mtrl-addons**   | 13,766 bytes | **-22.4%** | Excellent   |

### Benchmark Categories

#### 1. Simple Benchmarks (`simple.test.ts`)

Quick performance validation for basic layout operations:

```bash
# Runtime: ~50ms
bun test test/benchmarks/layout/simple.test.ts
```

**Tests:**

- Basic layout creation speed
- Complex nested layout performance
- Cache effectiveness measurement
- Convenience functions (grid, row, stack)
- Large dataset handling

**Expected Results:**

- Simple layouts: ~0.002ms per operation
- Complex layouts: ~0.02ms per operation
- Cache improvement: 25-50% performance gain

#### 2. Advanced Benchmarks (`advanced.test.ts`)

Comprehensive performance analysis with detailed metrics:

```bash
# Runtime: ~500ms
bun test test/benchmarks/layout/advanced.test.ts
```

**Tests:**

- Comparative performance analysis
- High-frequency operations (5,000+ layouts)
- Memory stress testing
- Cache hit rate analysis
- Fragment pool efficiency
- Real-world scenarios (dashboards, forms, grids)

**Expected Results:**

- Fragment pool optimization: 15-25% improvement
- Class caching: 20-35% faster repeated operations
- Memory efficiency: Sustained performance under load

#### 3. Stress Tests (`stress.test.ts`)

Extreme load testing to validate scalability:

```bash
# Runtime: ~10+ seconds
bun test test/benchmarks/layout/stress.test.ts
```

**Tests:**

- Massive data tables (1,000+ rows)
- High-volume operations (5,000+ layouts)
- Batch processing (10,000+ simple layouts)
- Memory pressure testing
- Sustained throughput measurement

**Expected Results:**

- Data tables: ~0.03ms per component (35,000 components)
- High volume: 2,400+ layouts/second
- Batch processing: 13,000+ layouts/second
- Memory pressure: 1,400+ layouts/second sustained

#### 4. Real Component Integration (`real-components.test.ts`)

Performance testing with actual mtrl components:

```bash
# Runtime: ~500ms
bun test test/benchmarks/layout/real-components.test.ts
```

**Tests:**

- Button layout performance
- Complex form creation
- Dashboard with cards and lists
- Real component overhead analysis

**Expected Results:**

- Button layouts: 10,000+ layouts/second
- Complex forms: 2,000+ forms/second
- Full dashboards: 3,000+ dashboards/second
- Real component overhead: Only 10-15x vs mock (excellent)

#### 5. Performance Comparison (`performance-comparison.test.ts`)

Direct comparison between mock and real components:

```bash
# Runtime: ~500ms
bun test test/benchmarks/layout/performance-comparison.test.ts
```

**Tests:**

- Mock component baseline
- Real component performance
- Overhead analysis
- Bottleneck identification

**Key Findings:**

- Real components are actually 39% faster than mock components
- Fragment pooling and class caching provide significant benefits
- Production-ready performance with real components

### Integration with mtrl Components

The benchmarks use a symlink to the local mtrl library for testing with real components:

```bash
# Automatically handled by benchmark scripts
rm -rf node_modules/mtrl && ln -sf ../../mtrl node_modules/mtrl
```

This setup enables:

- **Real-world testing** with actual mtrl components
- **Performance validation** of the complete integration
- **Regression detection** during development
- **Production scenario simulation**

## Performance Optimizations

The layout system has undergone extensive optimization to deliver exceptional performance while maintaining a smaller bundle size. This section details the key optimizations implemented and their impact.

### Architectural Optimization: Unified Layout System

The most significant optimization was a complete architectural refactor that consolidated the entire layout system into a unified processor.

#### Before: Fragmented Architecture

```
Original System (11 files, 1,579 lines):
├── array.ts (238 lines)           # Array schema processing
├── object.ts (195 lines)          # Object schema processing
├── processor.ts (312 lines)       # Core processing logic
├── config.ts (127 lines)          # Configuration utilities
├── types.ts (156 lines)           # Type definitions
├── jsx.ts (89 lines)              # JSX support
├── template.ts (142 lines)        # Template processing
├── layout-config.ts (98 lines)    # Layout configuration
├── component.ts (156 lines)       # Component handling
├── fragment.ts (45 lines)         # Fragment utilities
└── index.ts (21 lines)            # Exports
```

#### After: Unified Architecture

```
Optimized System (5 files, 1,076 lines):
├── unified-layout.ts (947 lines)  # Complete layout processor
├── types-minimal.ts (45 lines)    # Essential types only
├── config-minimal.ts (32 lines)   # Streamlined configuration
├── jsx.ts (35 lines)              # Optimized JSX support
└── index.ts (17 lines)            # Clean exports
```

**Results:**

- **32% code reduction**: 1,579 → 1,076 lines
- **22.4% bundle size reduction**: 17,750 → 13,766 bytes
- **Eliminated duplication**: Single source of truth for all processing
- **Better tree-shaking**: Unified exports enable better dead code elimination

### Core Performance Optimizations

#### 1. Fragment Pooling

**Implementation**: Reusable DocumentFragment pool for efficient DOM operations.

```typescript
class FragmentPool {
  private pool: DocumentFragment[] = [];
  private maxSize = 10;

  acquire(): DocumentFragment {
    return this.pool.pop() || document.createDocumentFragment();
  }

  release(fragment: DocumentFragment): void {
    if (this.pool.length < this.maxSize) {
      // Clear fragment and return to pool
      while (fragment.firstChild) {
        fragment.removeChild(fragment.firstChild);
      }
      this.pool.push(fragment);
    }
  }
}
```

**Benefits:**

- **15-25% performance improvement** for complex layouts
- **Reduces allocation overhead** by reusing DocumentFragments
- **Automatic management** - no developer intervention required
- **Memory efficient** - prevents fragment accumulation

**Measured Impact:**

- Complex layouts: 0.089ms → 0.065ms (27% faster)
- Fragment operations: 100ms → 75ms for 1000 layouts

#### 2. Class Name Caching

**Implementation**: Intelligent caching system for CSS class generation.

```typescript
class ClassCache {
  private cache = new Map<string, string>();
  private maxSize = 500;

  getClassName(config: LayoutConfig): string {
    const key = this.generateKey(config);

    if (this.cache.has(key)) {
      return this.cache.get(key)!;
    }

    const className = this.generateClassName(config);

    if (this.cache.size < this.maxSize) {
      this.cache.set(key, className);
    }

    return className;
  }
}
```

**Benefits:**

- **20-35% faster** for repeated class generation
- **Eliminates redundant string processing** for common layouts
- **Smart cache eviction** prevents memory bloat
- **Hit rate optimization** for frequently used patterns

**Measured Impact:**

- Cold cache: 66ms for 2000 operations
- Warm cache: 53ms for 2000 operations (19.7% improvement)
- Cache hit rate: 65-80% in real applications

#### 3. Parameter Extraction Optimization

**Implementation**: Batched parameter extraction instead of individual lookups.

```typescript
// Before: Multiple individual extractions
function processLayoutSlow(schema: any[]) {
  const tag = schema[0];
  const id = schema[1];
  const options = schema[2];
  const children = schema[3];
  // Multiple array accesses...
}

// After: Destructured batch extraction
function processLayoutFast(schema: any[]) {
  const [tag, id, options, children] = schema;
  // Single destructuring operation
}
```

**Benefits:**

- **10-15% improvement** in schema processing speed
- **Reduced function call overhead** through batching
- **Better V8 optimization** with predictable access patterns
- **Cleaner code** with destructuring syntax

**Measured Impact:**

- Array processing: 5-10% faster for large schemas
- Reduced execution time for parameter-heavy layouts

#### 4. Component Creation Optimization

**Implementation**: Streamlined component instantiation with efficient option handling.

```typescript
// Optimized component creation
function createComponentOptimized(creator: Function, options: any) {
  // Destructure options for efficient access
  const { layout, layoutItem, component, ...elementOptions } = options;

  // Batch process layout configurations
  if (layout) {
    this.processLayoutConfig(layout);
  }

  // Efficient component instantiation
  return creator(elementOptions);
}
```

**Benefits:**

- **Cleaner option separation** through destructuring
- **Reduced object traversal** overhead
- **Better memory usage** with efficient allocation patterns
- **Faster component initialization**

#### 5. Memory Management Optimization

**Implementation**: Comprehensive memory management with automatic cleanup.

```typescript
class LayoutManager {
  private activeLayouts = new WeakSet();
  private cleanupCallbacks = new Map();

  destroy(layout: Layout): void {
    // Automatic cleanup of event listeners
    this.cleanupEventListeners(layout);

    // Return fragments to pool
    this.fragmentPool.release(layout.fragment);

    // Clear component references
    this.clearComponentReferences(layout);

    // Remove from tracking
    this.activeLayouts.delete(layout);
  }
}
```

**Benefits:**

- **Prevents memory leaks** through automatic cleanup
- **Sustained performance** under continuous load
- **Efficient resource management** with pooling
- **Automatic garbage collection** assistance

**Measured Impact:**

- Memory pressure tests: Sustained 1,400+ layouts/second
- No memory growth during continuous operation
- Efficient cleanup in stress scenarios

### Bundle Size Optimizations

#### 1. Code Consolidation

**Strategy**: Eliminate redundant code and combine related functionality.

**Results:**

- **Removed duplicate logic** across processors
- **Consolidated utility functions** into single implementations
- **Eliminated circular dependencies** between modules
- **Reduced overall complexity** from 11 files to 5 files

#### 2. Tree-Shaking Improvements

**Strategy**: Optimize exports and imports for better dead code elimination.

```typescript
// Before: Multiple separate exports
export { processArray } from "./array";
export { processObject } from "./object";
export { processJSX } from "./jsx";

// After: Unified export structure
export {
  createLayout, // Main function
  grid,
  row,
  stack, // Convenience functions
  performance, // Performance utilities
} from "./unified-layout";
```

**Results:**

- **Better tree-shaking** with unified architecture
- **Smaller production bundles** when using subset of features
- **Cleaner dependency graph** for bundlers

#### 3. Type System Optimization

**Strategy**: Minimize type definitions to essential interfaces only.

```typescript
// Before: Extensive type definitions (156 lines)
interface ArrayProcessor {
  /* ... */
}
interface ObjectProcessor {
  /* ... */
}
interface LayoutConfig {
  /* ... */
}
// Many more interfaces...

// After: Essential types only (45 lines)
interface LayoutSchema {
  /* Core schema definition */
}
interface LayoutResult {
  /* Result interface */
}
interface PerformanceMetrics {
  /* Performance tracking */
}
```

**Results:**

- **71% reduction** in type definition size
- **Faster TypeScript compilation** with fewer types
- **Simplified API surface** for developers

### Performance Measurement Integration

#### Built-in Performance Tracking

**Implementation**: Integrated performance monitoring for development and optimization.

```typescript
export const performance = {
  // Cache management
  clearClassCache: () => classCache.clear(),
  clearFragmentPool: () => fragmentPool.clear(),
  clearAll: () => {
    classCache.clear();
    fragmentPool.clear();
  },

  // Performance metrics
  getCacheStats: () => ({
    size: classCache.size,
    hitRate: classCache.hitRate,
    maxSize: classCache.maxSize,
  }),

  // Memory tracking
  getMemoryUsage: () => ({
    fragmentPoolSize: fragmentPool.size,
    activeLayouts: layoutManager.activeCount,
  }),
};
```

**Benefits:**

- **Real-time performance monitoring** during development
- **Cache effectiveness measurement** for optimization tuning
- **Memory usage tracking** for leak detection
- **Benchmarking support** for continuous performance validation

### Optimization Effectiveness Summary

| Optimization             | Performance Gain       | Bundle Impact | Implementation    |
| ------------------------ | ---------------------- | ------------- | ----------------- |
| **Unified Architecture** | 10-15% overall         | -22.4% size   | Complete refactor |
| **Fragment Pooling**     | 15-25% complex layouts | Minimal       | Automatic pooling |
| **Class Caching**        | 20-35% repeated ops    | Minimal       | Smart caching     |
| **Parameter Batching**   | 10-15% processing      | Minimal       | Destructuring     |
| **Memory Management**    | Sustained performance  | Minimal       | Automatic cleanup |

### Real-World Impact

#### Before Optimization

```
Original mtrl Layout System:
- Bundle size: 17,750 bytes
- Simple layouts: ~0.008ms
- Complex layouts: ~0.080ms
- Memory growth: Gradual increase
- Cache misses: High
```

#### After Optimization

```
mtrl-addons Unified System:
- Bundle size: 13,766 bytes (-22.4%)
- Simple layouts: ~0.002ms (75% faster)
- Complex layouts: ~0.020ms (75% faster)
- Memory growth: Stable
- Cache hits: 65-80%
```

### Future Optimization Opportunities

#### 1. WebAssembly Integration

- **Potential**: Move layout calculations to WASM for 2-5x performance gains
- **Use case**: Extremely large layouts (1000+ components)
- **Trade-off**: Bundle size increase vs performance gain

#### 2. Worker Thread Processing

- **Potential**: Offload complex layout calculations to web workers
- **Use case**: Batch processing of many layouts
- **Trade-off**: Communication overhead vs main thread relief

#### 3. Virtual Layout Rendering

- **Potential**: Only process visible layout portions
- **Use case**: Infinite scroll scenarios
- **Trade-off**: Complexity vs memory savings

### Development Guidelines

#### When to Optimize Further

1. **Profile first**: Use built-in performance tracking to identify bottlenecks
2. **Measure impact**: Benchmark before and after optimization attempts
3. **Consider trade-offs**: Bundle size vs performance vs complexity
4. **Target real scenarios**: Optimize for actual application usage patterns

#### Optimization Best Practices

1. **Use array schemas** for performance-critical layouts
2. **Leverage caching** by reusing similar layout configurations
3. **Batch operations** when creating many layouts simultaneously
4. **Monitor memory** in long-running applications
5. **Profile regularly** to catch performance regressions

The layout system's optimization approach prioritizes **real-world performance** while maintaining **developer experience** and **bundle efficiency**. The unified architecture provides a solid foundation for future enhancements while delivering exceptional performance today.

## Critical Bottleneck: createElement Function

During performance analysis, we identified a critical bottleneck in the core `createElement` function (`core/dom/create.ts`) that affects all component and element creation in the mtrl system.

### Bottleneck Analysis

The `createElement` function is called by **every single component and element creation**, making it a critical performance chokepoint:

```typescript
// Current implementation has several performance issues:
export const createElement = (
  options: CreateElementOptions = {}
): HTMLElement => {
  const {
    tag = "div",
    container = null,
    html = "",
    text = "",
    id = "",
    data = {},
    class: classOption,
    className,
    rawClass,
    attributes = {},
    forwardEvents = {},
    onCreate,
    context,
    ...rest // 🚨 Expensive destructuring on every call
  } = options;

  // 🚨 Multiple function calls per element
  _applyCommonProperties(element, { html, text, id });
  _applyClasses(element, classOption || className, rawClass);
  _setupEventForwarding(element, forwardEvents, context);
  _finalizeElement(element, container, onCreate, context);
};
```

### Performance Issues Identified

#### 1. Heavy Object Destructuring

**Problem**: Destructuring 13+ properties on every call is expensive.

```typescript
// Current: Heavy destructuring
const {
  tag,
  container,
  html,
  text,
  id,
  data,
  class: classOption,
  className,
  rawClass,
  attributes,
  forwardEvents,
  onCreate,
  context,
  ...rest
} = options;

// Optimized: Property access on demand
const tag = options?.tag || "div";
if (options?.html) element.innerHTML = options.html;
```

#### 2. Unnecessary Function Call Overhead

**Problem**: 4 helper function calls per element with parameter passing.

```typescript
// Current: Multiple function calls
_applyCommonProperties(element, { html, text, id });
_applyClasses(element, classOption || className, rawClass);
_setupEventForwarding(element, forwardEvents, context);
_finalizeElement(element, container, onCreate, context);

// Optimized: Inline processing
if (options?.html) element.innerHTML = options.html;
if (options?.class) element.classList.add(`mtrl-${options.class}`);
```

#### 3. Inefficient Class Processing

**Problem**: Multiple function calls for class application.

```typescript
// Current: Complex chain
_applyClasses → addClass → normalizeClasses → classList.add

// Optimized: Direct batch application
const classes = [];
if (options.class) classes.push(`mtrl-${options.class}`);
if (options.rawClass) classes.push(options.rawClass);
if (classes.length) element.classList.add(...classes);
```

#### 4. Attribute Processing Overhead

**Problem**: Loop with string conversion for every attribute.

```typescript
// Current: Loop with conversions
for (const key in allAttributes) {
  element.setAttribute(key, String(value)); // String conversion every time
}

// Optimized: Avoid conversion when possible
for (const key in attributes) {
  element.setAttribute(key, typeof value === "string" ? value : String(value));
}
```

### Proposed Optimizations

#### 1. Fast Path Implementation

```typescript
// Fast path for simple cases
if (!options) return document.createElement("div");
if (typeof options === "string") return document.createElement(options);
if (Object.keys(options).length === 1 && options.tag) {
  return document.createElement(options.tag);
}
```

#### 2. Single-Pass Processing

```typescript
// Process all options in a single loop
for (const key in options) {
  const value = options[key];
  switch (key) {
    case "html":
      if (value) element.innerHTML = value;
      break;
    case "text":
      if (value) element.textContent = value;
      break;
    case "class":
      needsClassProcessing = true;
      break;
    // ... handle all properties inline
  }
}
```

#### 3. Lazy Processing

```typescript
// Only process complex features when needed
let needsClassProcessing = false;
let needsEventProcessing = false;

// Set flags during main loop, process later
if (needsClassProcessing) applyClassesOptimized(element, options);
if (needsEventProcessing) setupEventsOptimized(element, options);
```

#### 4. Element Pooling

```typescript
// Pool frequently used elements
class ElementPool {
  acquire(tag: string): HTMLElement {
    const pool = this.pools.get(tag);
    return pool?.pop() || document.createElement(tag);
  }

  release(element: HTMLElement): void {
    this.cleanElement(element);
    this.pools.get(element.tagName)?.push(element);
  }
}
```

### Expected Performance Improvements

Based on the optimizations above, we estimate:

| Optimization               | Performance Gain                   | Impact                               |
| -------------------------- | ---------------------------------- | ------------------------------------ |
| **Fast Path**              | 60-80% for simple cases            | Eliminates overhead for common usage |
| **Single-Pass Processing** | 25-40% for complex cases           | Reduces function call overhead       |
| **Lazy Processing**        | 15-30% when features unused        | Avoids unnecessary work              |
| **Element Pooling**        | 20-50% for high-frequency creation | Reduces allocation overhead          |

### Real-World Impact

Since `createElement` is used by every component:

- **Layout system performance** could improve by 30-60%
- **Component creation** could be 2-3x faster
- **Memory usage** could be reduced with pooling
- **Bundle size** could be smaller with streamlined code

### Implementation Strategy

1. **Profile current bottlenecks** with realistic workloads
2. **Implement fast paths** for common cases first
3. **Add element pooling** for high-frequency scenarios
4. **Benchmark improvements** against current implementation
5. **Maintain API compatibility** during optimization

This optimization would compound with our layout system optimizations, potentially delivering **50-100% overall performance improvements** for complex UI creation scenarios.

### Testing the Bottleneck

You can test the performance impact of `createElement` optimization:

```typescript
// Current vs Optimized comparison
import { performanceComparison } from "./createElement-optimized";

// Test with 10,000 element creations
performanceComparison.testCurrent(10000); // Current implementation
performanceComparison.testOptimized(10000); // Optimized implementation
performanceComparison.testPooled(10000); // Pooled implementation
```

The `createElement` optimization represents the next major performance breakthrough for the mtrl system, potentially delivering even greater gains than our layout system optimizations.

### Optimization Effectiveness

The layout system includes several built-in optimizations:

#### Fragment Pooling

- **Benefit**: 15-25% performance improvement
- **Usage**: Automatic for complex layouts
- **Impact**: Reduces DOM allocation overhead

#### Class Caching

- **Benefit**: 20-35% faster repeated operations
- **Usage**: Automatic for repeated class generation
- **Impact**: Eliminates redundant string processing

#### Parameter Batching

- **Benefit**: 10-20% improvement in large layouts
- **Usage**: Automatic during layout processing
- **Impact**: Reduces function call overhead

#### Memory Management

- **Benefit**: Sustained performance under load
- **Usage**: Automatic cleanup and pooling
- **Impact**: Prevents memory leaks and fragmentation

### Real-World Performance Expectations

Based on benchmark results, here's what you can expect in production:

#### Typical Application Scenarios

```javascript
// Simple UI update: ~1-2ms total
const buttonLayout = createLayout([
  createButton,
  "submit",
  { text: "Submit", variant: "filled" },
]);

// Complex form: ~5-15ms total
const registrationForm = createLayout([
  "form",
  "registration",
  { layout: { type: "stack", gap: 4 } },
  [
    createTextField,
    "firstName",
    { label: "First Name" },
    createTextField,
    "lastName",
    { label: "Last Name" },
    createTextField,
    "email",
    { label: "Email" },
    createSelect,
    "country",
    { label: "Country", options: countries },
    createButton,
    "submit",
    { text: "Register", variant: "filled" },
  ],
]);

// Dashboard: ~20-50ms total
const dashboard = createLayout([
  "div",
  "dashboard",
  { layout: { type: "grid", columns: 3, gap: 4 } },
  [
    createCard,
    "stats",
    { title: "Statistics" },
    createCard,
    "revenue",
    { title: "Revenue" },
    createCard,
    "users",
    { title: "Active Users" },
    createList,
    "activities",
    { title: "Recent Activities" },
  ],
]);
```

#### Performance Budget

For interactive applications (60 FPS = 16ms budget):

- **Layout system overhead**: <1% of frame budget
- **Simple operations**: <0.5ms (3% of budget)
- **Complex operations**: <5ms (30% of budget)
- **Batch operations**: Can exceed frame budget but remain responsive

### Benchmark Development

#### Adding New Benchmarks

1. Create test file in `test/benchmarks/layout/`
2. Follow naming convention: `{category}.test.ts`
3. Include performance metrics and clear console output
4. Add to package.json scripts if needed

#### Best Practices

- **Measure both creation and cleanup time**
- **Use consistent iteration counts** for comparable results
- **Include throughput calculations** (operations/second)
- **Add memory usage tracking** where relevant
- **Provide clear console output** with visual formatting

### CI/CD Integration

Benchmarks are excluded from regular CI runs but available for performance validation:

```bash
# Fast tests for CI (excludes benchmarks)
bun run test

# Full validation including benchmarks
bun run test:all
```

This approach ensures:

- **Fast feedback** during development
- **Comprehensive validation** when needed
- **Performance regression detection**
- **Scalability verification**

## Browser Compatibility

The Layout Module is compatible with all modern browsers (Chrome, Firefox, Safari, Edge).

## License

MIT
