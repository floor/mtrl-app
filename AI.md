# MTRL-APP - AI Assistant Guide

This document provides specific guidance for AI assistants working with mtrl-app - the showcase and documentation platform for the mtrl ecosystem.

## 🔗 Package Ecosystem & Interactions

mtrl-app serves as the comprehensive showcase and documentation platform for the mtrl ecosystem:

### Package Relationships

```
mtrl (Main Library) ← Foundation
    ↑
    ├── mtrl-addons (Advanced Features)
    │   ├── Depends on mtrl main components
    │   ├── Extends with virtual scrolling & collections
    │   └── Provides performance optimizations
    │
    └── mtrl-app (Showcase & Documentation)
        ├── Uses mtrl components for demonstrations
        ├── Documents mtrl-addons capabilities
        └── Provides development environment
```

### How mtrl-app Interacts

1. **Showcases mtrl main library**
   - Imports components: `import { createButton } from 'mtrl'`
   - Creates interactive demonstrations using layout system
   - Documents API and usage patterns

2. **Demonstrates mtrl-addons**
   - Uses advanced features: `import { createLayout } from 'mtrl-addons'`
   - Showcases virtual scrolling and collection management
   - Documents performance optimizations

## 🎯 Package Purpose

mtrl-app is a dual-purpose platform serving both development and documentation needs:

### 1. Examples System (public/examples/)

- **Standalone HTML examples** - Independent component testing
- **Real browser environment** - Actual component behavior
- **Development debugging** - Quick component validation
- **ES modules integration** - Modern JavaScript imports

### 2. Documentation App (client/)

- **Component showcases** - Interactive demonstrations
- **Array-based layout system** - Declarative UI composition
- **Content management** - Organized documentation structure
- **Client-side routing** - Single-page application

## 🏗️ Architecture

### Core Structure

```
mtrl-app/
├── public/
│   └── examples/           # Standalone HTML examples
│       └── list/          # List component example
│           ├── index.html # Main example file
│           └── script.js  # Component implementation
├── client/                # Client-side documentation app
│   ├── content/           # Component showcases
│   │   ├── components/    # Component demonstrations
│   │   ├── core/         # Core system showcases
│   │   └── styles/       # Styling demonstrations
│   ├── layout/           # Layout system
│   │   ├── content.js    # Layout schema definitions
│   │   └── section.js    # Section layouts
│   ├── core/             # App core systems
│   │   ├── router/       # Client-side routing
│   │   └── theme/        # Theme management
│   └── styles/           # App styling
├── server/               # Server implementation
│   ├── index.ts          # Server entry point
│   └── handlers/         # Request handlers
├── scripts/              # Build and debug tools
│   ├── build-mtrl.js     # Ultra-fast mtrl builds (37ms)
│   ├── build-addons.js   # Ultra-fast addons builds (45ms)
│   └── puppeteer.ts      # Automated testing
├── dist/                 # Built distributions
│   ├── mtrl/            # Built mtrl package
│   └── mtrl-addons/     # Built mtrl-addons package
├── docs/                 # Documentation guides
│   ├── examples/        # Examples system guide
│   └── server/          # Server management guide
└── server.ts            # PM2 server entry point
```

### Key Systems

**Examples System (`public/examples/`)**

- Standalone HTML files for component testing
- ES modules with import maps
- Dual-layer CSS system (mtrl + mtrl-addons)
- Real browser environment for debugging

**Documentation App (`client/`)**

- Array-based layout schema for component showcases
- Client-side routing and content management
- Interactive component demonstrations
- Centralized content system

**Build System (`scripts/`)**

- Ultra-fast development builds (37-45ms)
- Watch mode for live development
- Distribution generation for both packages

**Server System (`server/`)**

- PM2-based process management
- Static file serving for examples
- API endpoints for documentation

## 🛠️ Development Guidelines

### Examples System Development

#### Creating New Examples

1. **Create example directory**

   ```
   public/examples/my-component/
   ├── index.html
   └── script.js (optional)
   ```

2. **Basic example template**

   ```html
   <!DOCTYPE html>
   <html lang="en">
     <head>
       <meta charset="UTF-8" />
       <meta name="viewport" content="width=device-width, initial-scale=1.0" />
       <title>My Component Example</title>

       <!-- Load mtrl core styles (Material Design 3 base) -->
       <link rel="stylesheet" href="/dist/mtrl/styles.css" />

       <!-- Load mtrl-addons styles (custom enhancements) -->
       <link rel="stylesheet" href="/dist/mtrl-addons/styles/main.css" />

       <style>
         .container {
           max-width: 800px;
           margin: 0 auto;
           padding: 20px;
         }
       </style>
     </head>
     <body>
       <div class="container">
         <h1>My Component Example</h1>
         <div id="componentContainer"></div>
       </div>

       <script type="importmap">
         {
           "imports": {
             "mtrl/": "/dist/mtrl/",
             "mtrl-addons/": "/dist/mtrl-addons/"
           }
         }
       </script>

       <script type="module">
         import { createMyComponent } from "/dist/mtrl/index.mjs";

         const component = createMyComponent({
           container: document.getElementById("componentContainer"),
         });
       </script>
     </body>
   </html>
   ```

3. **Access example**
   - URL: `http://localhost:4000/examples/my-component/`
   - Directory index serving automatically loads `index.html`

#### CSS Styling System

**Dual-layer styling approach:**

```html
<!-- 1. mtrl core styles (Material Design 3 base) -->
<link rel="stylesheet" href="/dist/mtrl/styles.css" />

<!-- 2. mtrl-addons styles (custom enhancements) -->
<link rel="stylesheet" href="/dist/mtrl-addons/styles/main.css" />
```

**File sizes:**

- mtrl core: ~294KB (complete Material Design 3 system)
- mtrl-addons: ~3.3KB (custom enhancements only)

### Documentation App Development

#### Array-Based Layout Schema

The documentation app uses an array-based layout system:

```javascript
// client/content/components/example.js
import { createLayout } from "mtrl-addons";
import { createComponentsLayout, createComponentSection } from "../../layout";

export const createExampleContent = (container) => {
  const info = {
    title: "Example Component",
    description: "Component description and usage",
  };

  const layout = createLayout(
    createComponentsLayout(info),
    container
  ).component;

  createBasicExample(layout.body);
  createAdvancedExample(layout.body);
};

const createBasicExample = (container) => {
  const title = "Basic Example";
  const layout = createLayout(
    createComponentSection({ title }),
    container
  ).component;

  // Create actual component
  const component = createMyComponent({
    variant: "primary",
    size: "medium",
  });

  layout.body.appendChild(component);
};
```

#### Layout Schema Format

```javascript
// Array-based layout schema
const layoutSchema = [
  [
    "head",
    { class: "content__header" },
    [
      { tag: "section", class: "content__box content-info" },
      ["title", { tag: "h1", class: "content__title", text: info.title }],
      [
        "description",
        { tag: "p", class: "content__description", text: info.description },
      ],
    ],
  ],
  ["body", { class: "content__body" }],
  ["foot", { class: "content__footer" }],
];
```

#### Content Structure

```javascript
// client/content/components/my-component/index.js
export { createMyComponentContent } from "./basic.js";
export { createVariantExamples } from "./variants.js";
export { createAdvancedExamples } from "./advanced.js";
```

## 🚀 Build System

### Ultra-Fast Development Builds

```bash
# Individual builds
bun run build:mtrl        # Build mtrl package (~37ms)
bun run build:addons      # Build mtrl-addons package (~45ms)
bun run build:deps        # Build both packages (~51ms)

# Watch mode (auto-rebuild on changes)
bun run build:mtrl:watch     # Watch mtrl source files
bun run build:addons:watch   # Watch mtrl-addons source files
```

### Build Outputs

**mtrl package:**

- `dist/mtrl/index.mjs` - ES modules
- `dist/mtrl/styles.css` - Material Design 3 styles

**mtrl-addons package:**

- `dist/mtrl-addons/index.mjs` - ES modules
- `dist/mtrl-addons/index.js` - CommonJS
- `dist/mtrl-addons/styles/main.css` - Custom enhancements

### Development Workflow

```bash
# Terminal 1: Start server
bun run server:start

# Terminal 2: Watch builds
bun run build:addons:watch

# Terminal 3: Test examples
bun run puppeteer examples/list
```

## 🔧 Server Management

### PM2 Process Management

```bash
# Start server with PM2
bun run server:start

# Check server status
bun run server:status

# Reload server gracefully
bun run server:reload

# Stop server
bun run server:stop

# View logs
bun run server:logs

# Monitor dashboard
bun run server:monitor
```

### Server Configuration

**File**: `ecosystem.config.js`

```javascript
module.exports = {
  apps: [
    {
      name: "mtrl-app",
      script: "./server.ts",
      interpreter: "bun",
      instances: 1,
      exec_mode: "fork",
      max_memory_restart: "200M",
      env: {
        NODE_ENV: "production",
        PORT: 4000,
      },
    },
  ],
};
```

### Server Features

- **Static file serving** - Examples and distributions
- **Directory index** - Automatic `index.html` serving
- **ES modules support** - Proper MIME types for `.mjs`
- **Compression** - Gzip/Brotli for production
- **API endpoints** - Documentation and data services

## 🎭 Puppeteer Debugging System

### Automated Testing

```bash
# Test any example
bun run puppeteer examples/list
bun run puppeteer examples/grid
bun run puppeteer examples/form
```

### What Puppeteer Does

1. **Launches Chrome** in headless mode
2. **Navigates** to example page
3. **Captures** console messages and errors
4. **Analyzes** DOM structure and component health
5. **Reports** detailed findings

### Debug Output Analysis

```
🚀 [PUPPETEER] Starting automated testing session...
📄 [PUPPETEER] Loading http://localhost:4000/examples/list...
💬 [LOG] 🚀 [LIST-EXAMPLE] Starting list component example
💬 [LOG] ✅ List component created successfully

=== 🎯 COMPONENT DETECTION ===
🎯 Component container: ✅ Found
🎯 mtrl elements: ✅ Found 106
🎯 Error elements: ✅ None found

=== 🎯 FINAL ASSESSMENT ===
🎉 SUCCESS: Component appears to be working correctly!
```

### Success Indicators

- **✅ Component container found** - Main structure exists
- **✅ High mtrl element count** - Rich component structure
- **✅ No error elements** - No JavaScript errors
- **✅ Console success messages** - Component initialization worked

## 🔍 Common Development Tasks

### Adding New Component Example

1. **Create example directory**

   ```bash
   mkdir public/examples/my-component
   ```

2. **Create index.html**

   ```html
   <!-- Use template with dual CSS loading -->
   <link rel="stylesheet" href="/dist/mtrl/styles.css" />
   <link rel="stylesheet" href="/dist/mtrl-addons/styles/main.css" />
   ```

3. **Add ES module imports**

   ```javascript
   <script type="importmap">
     {
       "imports": {
         "mtrl/": "/dist/mtrl/",
         "mtrl-addons/": "/dist/mtrl-addons/"
       }
     }
   </script>
   ```

4. **Test with Puppeteer**
   ```bash
   bun run puppeteer examples/my-component
   ```

### Adding Component to Documentation App

1. **Create component content**

   ```javascript
   // client/content/components/my-component.js
   import { createLayout } from "mtrl-addons";
   import { createComponentsLayout } from "../../layout";

   export const createMyComponentContent = (container) => {
     const info = {
       title: "My Component",
       description: "Component description",
     };

     const layout = createLayout(
       createComponentsLayout(info),
       container
     ).component;

     // Add component demonstrations
     createBasicExample(layout.body);
   };
   ```

2. **Add to navigation**
   ```javascript
   // client/content/components/index.js
   export { createMyComponentContent } from "./my-component.js";
   ```

### Live Development Workflow

1. **Start watch mode**

   ```bash
   bun run build:addons:watch
   ```

2. **Edit source files**
   - TypeScript: `mtrl-addons/src/`
   - SCSS: `mtrl-addons/src/styles/`

3. **Auto-rebuild occurs**

   ```
   📁 [BUILD-ADDONS] File changed: list-manager.ts
   ✅ [BUILD-ADDONS] Built in 52ms
   ```

4. **Test changes**
   ```bash
   bun run puppeteer examples/list
   ```

### Performance Optimization

1. **Monitor build times**

   ```
   ✅ [BUILD-ADDONS] Built in 45ms
     ES: 1958.1KB | CJS: 1960.4KB | CSS: 3.3KB
   ```

2. **Check component performance**

   ```bash
   bun run puppeteer examples/list
   # Look for component initialization times
   ```

3. **Optimize CSS delivery**
   ```html
   <!-- Only load needed styles -->
   <link rel="stylesheet" href="/dist/mtrl/styles.css" />
   <!-- Only if using addons features -->
   <link rel="stylesheet" href="/dist/mtrl-addons/styles/main.css" />
   ```

## 🐛 Troubleshooting

### Server Issues

**Server won't start:**

```bash
# Check if running in mtrl-app directory
cd mtrl-app
bun run server:start
```

**Port already in use:**

```bash
bun run server:stop
# or if needed: npx pm2 kill
```

### Build Issues

**Build failures:**

```bash
# Rebuild both packages
bun run build:deps

# Check file existence
ls -la dist/mtrl/
ls -la dist/mtrl-addons/
```

### Example Issues

**Examples not loading:**

```bash
# Check server status
bun run server:status

# Check file location
ls -la public/examples/my-component/index.html
```

**CSS not loading:**

```bash
# Check file accessibility
curl -I http://localhost:4000/dist/mtrl/styles.css
curl -I http://localhost:4000/dist/mtrl-addons/styles/main.css
```

### Puppeteer Issues

**Component not found:**

```bash
❌ [PUPPETEER] Component does not appear to be working
```

**Solution:**

```bash
# Rebuild dependencies
bun run build:deps

# Check imports in example
# Verify component exports
```

## 📊 Key Files Reference

### Examples System

- `public/examples/*/index.html` - Standalone examples
- `public/examples/list/` - List component example
- `dist/mtrl/` - Built mtrl package
- `dist/mtrl-addons/` - Built mtrl-addons package

### Documentation App

- `client/content/components/` - Component showcases
- `client/layout/` - Layout system
- `client/core/` - App core systems
- `client/styles/` - App styling

### Build System

- `scripts/build-mtrl.js` - mtrl package builds
- `scripts/build-addons.js` - mtrl-addons package builds
- `scripts/puppeteer.ts` - Automated testing

### Server System

- `server.ts` - PM2 server entry
- `ecosystem.config.js` - PM2 configuration
- `server/` - Server implementation

### Documentation

- `docs/examples/guide.md` - Examples system guide
- `docs/server/guide.md` - Server management guide

## 🎯 Best Practices

### Examples Development

1. **Always include both CSS files**

   ```html
   <link rel="stylesheet" href="/dist/mtrl/styles.css" />
   <link rel="stylesheet" href="/dist/mtrl-addons/styles/main.css" />
   ```

2. **Use proper ES module imports**

   ```javascript
   <script type="importmap">
     { "imports": { "mtrl-addons/": "/dist/mtrl-addons/" } }
   </script>
   ```

3. **Test with Puppeteer**
   ```bash
   bun run puppeteer examples/my-component
   ```

### Documentation App Development

1. **Use array-based layout schema**

   ```javascript
   const layout = createLayout(createComponentsLayout(info), container);
   ```

2. **Import from proper packages**

   ```javascript
   import { createMyComponent } from "mtrl";
   import { createLayout } from "mtrl-addons";
   ```

3. **Follow content structure**
   ```javascript
   client/content/components/my-component/
   ├── index.js      # Main exports
   ├── basic.js      # Basic examples
   ├── variants.js   # Variant examples
   └── advanced.js   # Advanced examples
   ```

### Performance

1. **Use watch mode during development**

   ```bash
   bun run build:addons:watch
   ```

2. **Monitor build performance**

   ```
   ✅ [BUILD-ADDONS] Built in 45ms
   ```

3. **Optimize for production**
   ```bash
   bun run build:deps  # Full builds for production
   ```

---

This guide focuses specifically on mtrl-app development, covering both the examples system for standalone testing and the documentation app for comprehensive component showcases. For main library development, see `mtrl/CLAUDE.md`. For advanced features, see `mtrl-addons/CLAUDE.md`.
