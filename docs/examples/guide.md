# Examples Guide

## Overview

The mtrl-app examples system provides a standalone testing environment for mtrl and mtrl-addons components. Examples are self-contained folders with HTML files that demonstrate component functionality without requiring the full application stack.

## Architecture

### Directory Structure

```
mtrl-app/
├── public/
│   └── examples/             # Example folders (served by static server)
│       └── list/            # List component example
│           └── index.html   # Example HTML file
├── dist/                    # Built distributions
│   ├── mtrl/               # Built mtrl package
│   │   ├── index.js        # Core JavaScript bundle
│   │   └── styles.css      # Material Design 3 core styles
│   └── mtrl-addons/        # Built mtrl-addons package
│       ├── index.mjs       # Addons JavaScript bundle (ES modules)
│       ├── index.js        # Addons JavaScript bundle (CommonJS)
│       └── styles/         # Addons styles
│           └── main.css    # Custom scrollbar and list enhancements
├── scripts/                # Build and debug scripts
│   ├── build-mtrl.js       # Ultra-fast mtrl builds (37ms)
│   ├── build-addons.js     # Ultra-fast addons builds (45ms)
│   └── puppeteer.ts        # General-purpose component testing
└── docs/examples/          # This guide
    └── guide.md
```

### Example URLs

Examples are accessible via **elegant directory URLs**:

- **List Example**: http://localhost:4000/examples/list
- **Grid Example**: http://localhost:4000/examples/grid
- **Form Example**: http://localhost:4000/examples/form

**Directory Index Serving**: The server automatically serves `index.html` when accessing directory URLs, so both URLs work identically:

- `http://localhost:4000/examples/list` ✅ (elegant)
- `http://localhost:4000/examples/list/index.html` ✅ (traditional)

## CSS Styling System

### How It Works

The examples use a **dual-layer styling system** that combines:

1. **mtrl core styles** - Complete Material Design 3 base styles
2. **mtrl-addons styles** - Custom enhancements and component-specific styles

### CSS Build Process

#### 1. mtrl Core Styles

```bash
# Built from mtrl/src/styles/main.scss
# Output: mtrl-app/dist/mtrl/styles.css (294KB)
# Contains: All Material Design 3 base styles, components, themes
```

#### 2. mtrl-addons Styles

```bash
# Built from mtrl-addons/src/styles/index.scss
# Output: mtrl-app/dist/mtrl-addons/styles/main.css (3.3KB)
# Contains: Custom scrollbar, list enhancements, addons-specific features
```

### Source Structure

```
mtrl-addons/src/styles/
├── index.scss              # Main entry point
└── components/
    └── _list.scss          # List component enhancements
```

**mtrl-addons/src/styles/index.scss:**

```scss
// mtrl-addons Styles Index
// Main entry point for mtrl-addons component styles

// Import component styles (only addons-specific enhancements)
@forward "./components/list";

// Future addons-specific component styles will be added here
// @forward "./components/data-grid";      // Advanced grid functionality
// @forward "./components/tree-view";      // Tree navigation
```

**mtrl-addons/src/styles/components/\_list.scss:**

```scss
// Import mtrl base styles for variables and mixins
@use "../../../../mtrl/src/styles/abstract/base" as base;
@use "../../../../mtrl/src/styles/abstract/variables" as v;

// Custom scrollbar styles
.#{base.$prefix}-list.#{base.$prefix}-list-addons {
  &[data-addons="true"] {
    // Custom scrollbar track
    .#{base.$prefix}-list__scrollbar-track {
      position: absolute;
      top: 0;
      right: 0;
      width: 8px;
      height: 100%;
      background: rgba(0, 0, 0, 0.1);
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    // Custom scrollbar thumb
    .#{base.$prefix}-list__scrollbar-thumb {
      background: rgba(0, 0, 0, 0.3);
      border-radius: 4px;

      &:hover {
        background: rgba(0, 0, 0, 0.5);
      }
    }
  }
}
```

### Including Styles in Examples

**Every example MUST include both CSS files:**

```html
<!-- public/examples/list/index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>mtrl-addons List Component Example</title>

    <!-- 1. Load mtrl core styles (Material Design 3 base) -->
    <link rel="stylesheet" href="/dist/mtrl/styles.css" />

    <!-- 2. Load mtrl-addons styles (custom enhancements) -->
    <link rel="stylesheet" href="/dist/mtrl-addons/styles/main.css" />

    <!-- 3. Example-specific styles -->
    <style>
      .container {
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
      }
    </style>
  </head>
  <body>
    <!-- Component markup -->
  </body>
</html>
```

### Build Commands

#### Manual Builds

```bash
# Build mtrl core (includes CSS compilation)
bun run build:mtrl

# Build mtrl-addons (includes SCSS compilation)
bun run build:addons

# Build both packages
bun run build:deps
```

#### Watch Mode (Live Development)

```bash
# Watch mtrl for changes
bun run build:mtrl:watch

# Watch mtrl-addons for changes (includes SCSS watching)
bun run build:addons:watch
```

### Live Development Workflow

#### 1. Start Watch Mode

```bash
# In mtrl-app directory
bun run build:addons:watch
```

**Output:**

```
🔨 [BUILD-ADDONS] Ultra-fast watch mode...
✅ [BUILD-ADDONS] SCSS compiled in 509ms
✅ [BUILD-ADDONS] Built in 553ms
  ES: 1958.1KB | CJS: 1960.4KB | CSS: 3.3KB
👀 [BUILD-ADDONS] Watching for changes...
```

#### 2. Edit Styles

Edit any file in `mtrl-addons/src/styles/`:

- `index.scss` - Main entry point
- `components/_list.scss` - List component styles
- Add new `components/_your-component.scss` files

#### 3. Automatic Rebuild

Watch mode detects changes and rebuilds:

```
📁 [BUILD-ADDONS] File changed: _list.scss
✅ [BUILD-ADDONS] SCSS compiled in 45ms
✅ [BUILD-ADDONS] Built in 89ms
  ES: 1958.1KB | CJS: 1960.4KB | CSS: 3.4KB
```

#### 4. See Changes

1. **Refresh browser**: http://localhost:4000/examples/list/index.html
2. **Debug with script**: `bun run node scripts/debug_list_modern.js`

### CSS File Locations

#### Accessible URLs

- **mtrl core**: http://localhost:4000/dist/mtrl/styles.css
- **mtrl-addons**: http://localhost:4000/dist/mtrl-addons/styles/main.css

#### File Sizes

- **mtrl core**: ~294KB (complete Material Design 3 system)
- **mtrl-addons**: ~3.3KB (custom enhancements only)

### Example: Adding New Component Styles

#### 1. Create SCSS File

```scss
// mtrl-addons/src/styles/components/_data-grid.scss
@use "../../../../mtrl/src/styles/abstract/base" as base;

.#{base.$prefix}-data-grid.#{base.$prefix}-data-grid-addons {
  // Your custom data grid styles here
  .#{base.$prefix}-data-grid__header {
    position: sticky;
    top: 0;
    z-index: 10;
  }
}
```

#### 2. Add to Index

```scss
// mtrl-addons/src/styles/index.scss
@forward "./components/list";
@forward "./components/data-grid"; // Add this line
```

#### 3. Watch Mode Auto-Rebuilds

```
📁 [BUILD-ADDONS] File changed: _data-grid.scss
✅ [BUILD-ADDONS] SCSS compiled in 52ms
✅ [BUILD-ADDONS] Built in 95ms
  ES: 1958.1KB | CJS: 1960.4KB | CSS: 4.1KB
```

#### 4. Include in Example

```html
<!-- Same CSS includes work for all components -->
<link rel="stylesheet" href="/dist/mtrl/styles.css" />
<link rel="stylesheet" href="/dist/mtrl-addons/styles/main.css" />
```

### Troubleshooting

#### CSS Not Loading

1. **Check file exists**: `curl -I http://localhost:4000/dist/mtrl-addons/styles/main.css`
2. **Rebuild**: `bun run build:addons`
3. **Check imports**: Verify SCSS import paths are correct

#### SCSS Compilation Errors

```bash
Error: Can't find stylesheet to import.
```

**Solution**: Check import paths in `_list.scss`:

```scss
// Correct path from mtrl-addons/src/styles/components/ to mtrl
@use "../../../../mtrl/src/styles/abstract/base" as base;
```

#### Watch Mode Not Working

1. **Check watch process**: `ps aux | grep build-addons`
2. **Restart watch**: `bun run build:addons:watch`
3. **Check file extensions**: Watch only triggers on `.scss`, `.ts`, `.js` files

### Performance Notes

- **Ultra-fast builds**: CSS compilation in ~45-500ms
- **Efficient watching**: 100ms debounced rebuilds
- **Minimal output**: Only addons-specific styles (~3.3KB)
- **Source maps**: Included for debugging

This system ensures that **every example gets both the complete Material Design 3 styling AND custom addons enhancements** with minimal overhead and maximum development speed.

## Practical Example: Testing CSS Changes

### Step-by-Step Walkthrough

#### 1. Start the System

```bash
# In mtrl-app directory
bun run build:addons:watch
```

#### 2. Open Example

Visit: http://localhost:4000/examples/list/index.html

You'll see a **Material Design 3 styled list** with:

- Custom scrollbar (mtrl-addons enhancement)
- Virtual scrolling container
- Proper Material Design typography and spacing

#### 3. Edit Styles Live

Edit `mtrl-addons/src/styles/components/_list.scss`:

```scss
// Add custom styling to the scrollbar
.#{base.$prefix}-list.#{base.$prefix}-list-addons {
  &[data-addons="true"] {
    .#{base.$prefix}-list__scrollbar-track {
      // Change the scrollbar track color
      background: rgba(255, 0, 0, 0.2); // Red background
      width: 12px; // Make it wider
    }

    .#{base.$prefix}-list__scrollbar-thumb {
      // Change the scrollbar thumb color
      background: rgba(255, 0, 0, 0.6); // Red thumb
      border-radius: 6px; // More rounded

      &:hover {
        background: rgba(255, 0, 0, 0.8); // Darker red on hover
      }
    }
  }
}
```

#### 4. Watch Auto-Rebuild

The console will show:

```
📁 [BUILD-ADDONS] File changed: _list.scss
✅ [BUILD-ADDONS] SCSS compiled in 52ms
✅ [BUILD-ADDONS] Built in 89ms
  ES: 1958.1KB | CJS: 1960.4KB | CSS: 3.4KB
```

#### 5. See Changes

1. **Refresh browser**: The scrollbar is now red and wider!
2. **Debug verification**: `bun run node scripts/debug_list_modern.js`

### Real Output Example

**Before changes:**

```
📋 List container content preview:
<div class="mtrl-list-manager-scrollbar-track" style="background: rgba(0, 0, 0, 0.1); width: 8px;">
  <div class="mtrl-list-manager-scrollbar-thumb" style="background: rgba(0, 0, 0, 0.3);"></div>
</div>
```

**After changes:**

```
📋 List container content preview:
<div class="mtrl-list-manager-scrollbar-track" style="background: rgba(255, 0, 0, 0.2); width: 12px;">
  <div class="mtrl-list-manager-scrollbar-thumb" style="background: rgba(255, 0, 0, 0.6);"></div>
</div>
```

### CSS File Verification

Check that your changes are applied:

```bash
# Check CSS file exists and has correct size
curl -I http://localhost:4000/dist/mtrl-addons/styles/main.css

# Output should show:
# HTTP/1.1 200 OK
# Content-Type: text/css
# content-length: 3400  # Size increased with new styles
```

## Puppeteer Debugging System

### What is Puppeteer?

**Puppeteer** is a Node.js library that provides a high-level API to control Chrome/Chromium browsers. We use it to **programmatically test and debug examples** without manual browser interaction.

### Why Use Puppeteer for Examples?

- **Automated testing**: Test components without opening browser manually
- **Real browser environment**: Uses actual Chrome, not simulated DOM
- **Console capture**: See all JavaScript logs and errors
- **DOM inspection**: Analyze component structure and styling
- **CI/CD ready**: Can run in headless mode for automated testing

### The Debug Script

**Location**: `mtrl-app/scripts/puppeteer.ts`

This script provides **comprehensive component analysis** by:

1. **Loading any example page** in a real Chrome browser
2. **Capturing console messages** from the JavaScript execution
3. **Analyzing DOM structure** to verify component rendering
4. **Detecting errors** and reporting component health
5. **Providing detailed reports** about component behavior

### How to Use the Debug Script

#### Basic Usage

```bash
# In mtrl-app directory - test any example
bun run puppeteer examples/list
bun run puppeteer examples/grid
bun run puppeteer examples/form

# Or use the full script path
bun run scripts/puppeteer.ts examples/list
```

#### Usage Help

```bash
# Show available commands
bun run puppeteer

# Output:
❌ [PUPPETEER] Usage: bun run puppeteer <example_path>
📋 [PUPPETEER] Examples:
   bun run puppeteer examples/list
   bun run puppeteer examples/grid
   bun run puppeteer examples/form
```

#### What It Does

1. **Launches Chrome** in headless mode
2. **Navigates** to the specified example URL
3. **Waits** for component initialization (2 seconds)
4. **Captures** all console messages and JavaScript errors
5. **Analyzes** DOM structure and component elements
6. **Reports** detailed findings and component health

### Development Workflow Integration

#### 1. Make Code Changes

Edit files in `mtrl-addons/src/`:

- TypeScript files: `core/list-manager/`, `components/list/`
- SCSS files: `styles/components/_list.scss`

#### 2. Watch Mode Auto-Rebuild

```bash
bun run build:addons:watch
```

Output:

```
📁 [BUILD-ADDONS] File changed: list-manager.ts
✅ [BUILD-ADDONS] Built in 52ms
  ES: 1958.1KB | CJS: 1960.4KB | CSS: 3.3KB
```

#### 3. Test with Puppeteer

```bash
bun run puppeteer examples/list
```

#### 4. Verify Changes

The debug script will show:

- **Console messages** from your code changes
- **DOM structure** with new elements or classes
- **JavaScript errors** if something broke
- **Component health** status

### Real Example: Testing Style Changes

#### 1. Edit Styles

```scss
// mtrl-addons/src/styles/components/_list.scss
.#{base.$prefix}-list__scrollbar-track {
  background: rgba(255, 0, 0, 0.2); // Red background
  width: 12px; // Wider track
}
```

#### 2. Watch Rebuild

```
📁 [BUILD-ADDONS] File changed: _list.scss
✅ [BUILD-ADDONS] SCSS compiled in 45ms
✅ [BUILD-ADDONS] Built in 89ms
  ES: 1958.1KB | CJS: 1960.4KB | CSS: 3.4KB
```

#### 3. Debug Verification

```bash
bun run puppeteer examples/list
```

#### 4. Expected Output

```
🎯 [PUPPETEER] Testing example: examples/list
🚀 [PUPPETEER] Starting automated testing session...
📄 [PUPPETEER] Loading http://localhost:4000/examples/list...
💬 [LOG] 🚀 [LIST-EXAMPLE] Starting list component example
💬 [LOG] ✅ List component created successfully
💬 [LOG] 🎉 List component initialized

=== 🎯 FINAL ASSESSMENT ===
🎉 SUCCESS: Component appears to be working correctly!
```

### Real Example: Successful Component Testing

#### Example Command

```bash
bun run puppeteer examples/list
```

#### Example Output (Success)

```
🎯 [PUPPETEER] Testing example: examples/list
🚀 [PUPPETEER] Starting automated testing session...
📄 [PUPPETEER] Loading http://localhost:4000/examples/list...
💬 [LOG] 🚀 [COLLECTION-ADDONS] Starting mtrl-addons collection component example
💬 [LOG] 📄 [COLLECTION-ADDONS] DOM loaded, initializing collection component
💬 [LOG] 🚀 [COLLECTION-ADDONS] Initializing list component showcase
💬 [LOG] 🚀 [COLLECTION-ADDONS] Creating new list component (collection-powered)
💬 [LOG] 🧪 [COLLECTION-ADDONS] Testing API endpoint...
💬 [LOG] ✅ [COLLECTION-ADDONS] List component showcase initialized successfully
💬 [LOG] 🎯 [LIST-ADDONS] Component: JSHandle@object
💬 [LOG] 🚀 List component initialized with Phase 1 List Manager
✅ [PUPPETEER] Page loaded successfully

=== 📊 DETAILED PAGE ANALYSIS ===
📄 Page title: mtrl-addons List Component Example
📄 Body content length: 9880 characters
📊 Total divs with classes: 65
📊 Script tags: 2 (1 ES modules)
📊 Import maps: 1

=== 🎯 COMPONENT DETECTION ===
🎯 Component container: ✅ Found
🎯 mtrl elements: ✅ Found 106
🎯 Error elements: ✅ None found

📋 Container content preview:
<div class="mtrl-chip mtrl-chip--selected mtrl-chip--filter" role="button" tabindex="0" aria-selected="true" data-value="1">
<div class="mtrl-ripple"></div>
<div class="mtrl-chip-content">...

=== 🎯 FINAL ASSESSMENT ===
🎉 SUCCESS: Component appears to be working correctly!
👋 [PUPPETEER] Browser closed
```

#### Analysis of Success Indicators

- **✅ Component container found**: Main component structure exists
- **✅ 106 mtrl elements**: Rich Material Design component structure
- **✅ No error elements**: No JavaScript errors or broken components
- **✅ Console logs**: Clear initialization and success messages
- **✅ 9880 character body**: Substantial content indicating proper rendering

#### Common Success Patterns

- **Component initialization logs**: `🚀 [COMPONENT] Starting...`, `✅ [COMPONENT] Success...`
- **High mtrl element count**: 50+ elements indicates complex component structure
- **No error elements**: `Error elements: ✅ None found`
- **Substantial content**: Body length > 5000 characters suggests proper rendering

### Common Debug Patterns

#### Testing Component Initialization

```
💬 [LOG] 🔧 Initializing list component...
💬 [LOG] ✅ List component created successfully
```

**✅ Good**: Component initializes without errors

#### Testing Virtual Scrolling

```
🎯 mtrl-list elements: ✅ Found 3
📋 Sample div classes:
  4. mtrl-list-manager-items
  5. mtrl-list-manager-scrollbar-track
  6. mtrl-list-manager-scrollbar-thumb
```

**✅ Good**: Virtual scrolling structure created

#### Testing Error Handling

```
=== ❌ JAVASCRIPT ERRORS SUMMARY ===
❌ TypeError: Cannot read property 'on' of undefined
   at http://localhost:4000/examples/list/index.html:45:23
```

**❌ Problem**: JavaScript error needs fixing

#### Testing CSS Loading

```
📊 Total divs with classes: 7
📋 Sample div classes:
  1. container
  2. controls
  3. list-container
```

**✅ Good**: CSS classes applied correctly

### Troubleshooting Debug Script

#### Debug Script Fails

```bash
❌ [PUPPETEER] Navigation failed: net::ERR_CONNECTION_REFUSED
```

**Solution**: Server is not running

```bash
# Check if server is running
lsof -i :4000

# If not running, start it
cd mtrl-app
bun run server:start
```

#### Component Not Found

```bash
❌ [PUPPETEER] Component does not appear to be working
```

**Solution**: Check if JavaScript is building correctly

```bash
bun run build:addons
```

#### JavaScript Errors

```bash
❌ ReferenceError: createListManager is not defined
```

**Solution**: Check import paths and build process

```bash
# Verify file exists
ls -la dist/mtrl-addons/index.mjs

# Check exports
grep -n "createListManager" dist/mtrl-addons/index.mjs
```

### Advanced Debug Usage

#### Custom Debug Messages

Add debug messages to your code:

```typescript
// In your TypeScript files
console.log("🔍 [DEBUG] Custom debug message:", someVariable);
```

They'll appear in the debug output:

```
💬 [LOG] 🔍 [DEBUG] Custom debug message: {...}
```

#### Testing Multiple Components

Test different examples easily:

```bash
# Test various components
bun run puppeteer examples/list
bun run puppeteer examples/grid
bun run puppeteer examples/form
bun run puppeteer examples/datepicker
```

### Performance Monitoring

The debug script also provides performance insights:

- **Page load time**: How long the example takes to load
- **Component initialization**: Time to create components
- **DOM complexity**: Number of elements and classes
- **Resource loading**: CSS and JavaScript file sizes

This **Puppeteer debugging system** gives you **complete visibility** into your component development, making it easy to catch issues early and verify that changes work correctly.

## Server Management

### Understanding the Server Architecture

**Important distinction:**

- **mtrl-app**: Has a server (serves examples, documentation, static files)
- **mtrl**: Library only - no server
- **mtrl-addons**: Library only - no server

Only **mtrl-app** runs a server that serves:

- Examples at `http://localhost:4000/examples/`
- Built distributions at `http://localhost:4000/dist/`
- Static assets and documentation

### Checking Server Status

#### Check if Server is Running

```bash
# Check what's running on port 4000
lsof -i :4000
```

**Expected output:**

```
COMMAND     PID  USER   FD   TYPE             DEVICE SIZE/OFF NODE NAME
bun       83550 jvial    6u  IPv6 0x43572ed6228d5f22      0t0  TCP *:terabase (LISTEN)
```

#### Check Server Health

```bash
# Quick health check
curl -I http://localhost:4000/examples/list/index.html
```

**Expected output:**

```
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
```

### Reloading the Server

#### Method 1: Elegant PM2 Commands (Recommended)

Using the **PM2 process manager** for graceful server management:

```bash
# Start the server with PM2
bun run server:start

# Reload the server (graceful restart)
bun run server:reload

# Stop the server
bun run server:stop

# Check server status
bun run server:status

# View server logs
bun run server:logs

# Live monitoring dashboard
bun run server:monitor
```

**Benefits of PM2:**

- ✅ **Graceful restart** - No forced termination or ugly error messages
- ✅ **Process monitoring** - CPU, memory, restart count tracking
- ✅ **Log management** - Centralized logging with timestamps
- ✅ **Auto-restart** - Automatic restart on crashes
- ✅ **Zero-downtime** - Rolling restarts with proper signal handling
- ✅ **Professional output** - Clean status tables and monitoring

**Example PM2 Status:**

```
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ mtrl-app           │ fork     │ 2    │ online    │ 0%       │ 418.0mb  │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘
```

#### Method 2: Terminal Control

If you need to manually control the server in your terminal:

1. **Stop server**: `Ctrl+C` (or `Cmd+C` on Mac)
2. **Restart server**: `bun run server:start`

```bash
# In the terminal running the server
^C  # Press Ctrl+C
bun run server:start  # Restart
```

#### Method 3: Manual Process Management

If you need to find and kill the process manually:

```bash
# 1. Find the server process
lsof -i :4000

# 2. Kill the process (replace PID with actual process ID)
kill 83550

# 3. Restart server
bun run server:start
```

### Common Server Issues

#### Port Already in Use

```bash
Error: listen EADDRINUSE: address already in use :::4000
```

**Solution:**

```bash
# Kill whatever is using port 4000
kill -9 $(lsof -ti :4000)

# Then restart
bun run serve
```

#### Server Won't Start

```bash
error: Script not found "serve"
```

**Solution:** Make sure you're in the mtrl-app directory:

```bash
# Wrong - from mtrl or mtrl-addons
cd /path/to/mtrl-addons
bun run serve  # ❌ Error: Script not found

# Correct - from mtrl-app
cd /path/to/mtrl-app
bun run serve  # ✅ Works
```

#### Examples Not Loading

```bash
# Check if dist files are built
ls -la dist/mtrl/
ls -la dist/mtrl-addons/

# If missing, build them
bun run build:deps
```

### Server Commands Reference

#### Available Commands (run from mtrl-app directory)

```bash
# Start development server
bun run serve

# Start server with specific port
PORT=3000 bun run serve

# Check server configuration
grep -n "port\|listen" server/index.ts
```

#### Server Directory Structure

```
mtrl-app/
├── server/           # Server source code
│   ├── index.ts     # Main server file
│   ├── config.ts    # Server configuration
│   └── handlers/    # Request handlers
├── public/          # Static files served by server
│   ├── examples/    # Example HTML files
│   ├── dist/        # Built distributions
│   └── img/         # Static images
└── package.json     # Contains "serve" script
```

### Development Workflow with Server

#### Typical Development Session

```bash
# Terminal 1: Start server
cd mtrl-app
bun run serve

# Terminal 2: Watch builds
cd mtrl-app
bun run build:addons:watch

# Terminal 3: Debug/test
cd mtrl-app
bun run node scripts/debug_list_modern.js
```

#### When to Reload Server

- **Code changes**: Usually not needed (server serves static files)
- **Server config changes**: Always reload
- **New examples**: Reload to serve new files
- **Build issues**: Reload if files aren't serving correctly
- **Performance issues**: Reload to clear memory

#### Server Logs

The server shows request logs:

```
[2024-01-08 18:34:25] GET /examples/list/index.html - 200
[2024-01-08 18:34:25] GET /dist/mtrl/styles.css - 200
[2024-01-08 18:34:25] GET /dist/mtrl-addons/styles/main.css - 200
[2024-01-08 18:34:25] GET /dist/mtrl-addons/index.mjs - 200
```

### Troubleshooting Server Issues

#### Debug Script Fails

```bash
❌ [PUPPETEER] Navigation failed: net::ERR_CONNECTION_REFUSED
```

**Solution**: Server is not running

```bash
# Check if server is running
lsof -i :4000

# If not running, start it
cd mtrl-app
bun run server:start
```

#### CSS/JS Files Not Loading

```bash
# Check if files exist
curl -I http://localhost:4000/dist/mtrl/styles.css
curl -I http://localhost:4000/dist/mtrl-addons/styles/main.css

# If 404, rebuild
bun run build:deps
```

#### Examples Not Updating

If you change examples but don't see updates:

1. **Check file location**: Examples should be in `mtrl-app/public/examples/`
2. **Hard refresh**: `Ctrl+Shift+R` (or `Cmd+Shift+R`)
3. **Server reload**: Kill and restart server

### Server vs Build System

**Remember:**

- **Server**: Serves files (restart when server issues)
- **Build system**: Creates files (rebuild when code changes)
- **Libraries (mtrl/mtrl-addons)**: No servers, only build systems

```bash
# Server commands (mtrl-app only)
bun run serve                    # Start server
kill $(lsof -ti :4000)          # Stop server

# Build commands (any package)
bun run build:deps              # Build both libraries
bun run build:addons:watch      # Watch mtrl-addons
bun run build:mtrl:watch        # Watch mtrl
```

This server management system ensures you can **quickly resolve server issues** and **maintain a smooth development workflow** even when the server needs to be reloaded.

## Package Setup

### 1. Package Linking

First, ensure packages are properly linked for development:

```bash
cd mtrl-app
bun run link:mtrl      # Links ../../mtrl to node_modules/mtrl
bun run link:mtrl-addons # Links ../../mtrl-addons to node_modules/mtrl-addons
```

### 2. Build Dependencies

Build both packages with ultra-fast build system:

```bash
bun run build:deps    # Builds both mtrl (~37ms) and mtrl-addons (~45ms)
```

### 3. Start Server

The server should be running on port 4000. Examples are accessible at:

- http://localhost:4000/examples/list/

### 4. Test Component

Use the automated debug script to verify component functionality:

```bash
bun run node scripts/debug_list_modern.js
```

## Build System

### Ultra-Fast Development Builds

The build system is optimized for development speed:

- **mtrl**: ~37ms builds (ES modules)
- **mtrl-addons**: ~45ms builds (ES + CJS modules)
- **Combined**: ~51ms for both packages
- **Watch mode**: 100ms debounced rebuilds

### Build Commands

```bash
# Individual builds
bun run build:mtrl      # Build mtrl package only
bun run build:addons    # Build mtrl-addons package only
bun run build:deps      # Build both packages

# Watch mode (auto-rebuild on file changes)
bun run build:mtrl:watch    # Watch mtrl source files
bun run build:addons:watch  # Watch mtrl-addons source files
```

### Output Formats

- **mtrl**: ES modules only (`index.mjs`)
- **mtrl-addons**: Both ES modules (`index.mjs`) and CommonJS (`index.js`)
- Examples use ES modules (`.mjs`) for browser compatibility

## Creating Examples

### Example Structure

Each example should be in its own folder under `public/examples/`:

```
public/examples/my-component/
└── index.html              # Main example file
```

### Basic Template

```html
<!doctype html>
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
      /* Component-specific styles */
      .container {
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
      }

      .icon-button {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px;
        border: 1px solid #ccc;
        border-radius: 4px;
        background: white;
        cursor: pointer;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>My Component Example</h1>
      <div id="componentContainer"></div>

      <!-- Example with icons -->
      <div class="controls">
        <button class="icon-button" id="addButton">
          <span class="icon"></span>
          Add Item
        </button>
        <button class="icon-button" id="settingsButton">
          <span class="icon"></span>
          Settings
        </button>
      </div>
    </div>

    <!-- Import Map for ES modules -->
    <script type="importmap">
      {
        "imports": {
          "mtrl/": "/dist/mtrl/",
          "mtrl-addons/": "/dist/mtrl-addons/"
        }
      }
    </script>

    <!-- Component Implementation -->
    <script type="module">
      import { myComponent } from "/dist/mtrl-addons/index.mjs";

      // Method 1: Import icons directly from SVG files
      import addIcon from "/client/icons/add.svg";
      import settingsIcon from "/client/icons/settings.svg";

      // Method 2: Import from centralized exports (recommended)
      import {
        addIcon as addIconExport,
        settingsIcon as settingsIconExport,
      } from "/client/icons/exports.js";

      // Initialize component
      const component = myComponent({
        container: document.getElementById("componentContainer"),
        // ... configuration
      });

      // Add icons to buttons
      document.querySelector("#addButton .icon").innerHTML = addIcon;
      document.querySelector("#settingsButton .icon").innerHTML = settingsIcon;

      // Button event handlers
      document.getElementById("addButton").addEventListener("click", () => {
        console.log("Add button clicked");
        // Add your component logic here
      });

      document
        .getElementById("settingsButton")
        .addEventListener("click", () => {
          console.log("Settings button clicked");
          // Add your settings logic here
        });
    </script>
  </body>
</html>
```

## List Component Example

### Working Configuration

The list example demonstrates the functional composition list manager with virtual scrolling:

```javascript
import { listManager } from "/dist/mtrl-addons/index.mjs";

const listComponent = listManager({
  container: document.getElementById("listContainer"),

  // Collection configuration for data loading
  collection: {
    adapter: {
      read: async (params) => {
        // Return { items: [], meta: { hasNext, total, etc. } }
      },
    },
    pageSize: 20,
    strategy: "page",
  },

  // Template configuration for rendering
  template: {
    template: (item) => {
      const element = document.createElement("div");
      element.className = "list-item";
      element.innerHTML = `<div>${item.name}</div>`;
      return element;
    },
  },

  // Virtual scrolling configuration
  virtual: {
    estimatedItemSize: 60,
    overscan: 5,
  },
});

// Initialize
await listComponent.initialize();
```

### Key Features Demonstrated

- **Virtual Scrolling**: High-performance rendering for large datasets
- **Data Pagination**: Automatic loading of data chunks
- **Performance Monitoring**: Built-in speed tracking and optimization
- **Placeholders**: Intelligent placeholder generation during loading
- **Functional Composition**: Modular enhancer system

## Testing & Debugging

### Automated Testing

Use the Puppeteer-based debug script for automated testing:

```bash
bun run node scripts/debug_list_modern.js
```

**Output Analysis:**

- ✅ **SUCCESS**: Component working correctly
- ⚠️ **PARTIAL**: Component loaded but still initializing
- ❌ **FAILURE**: Component failed to load

### Manual Testing

1. **Browser Access**: http://localhost:4000/examples/list/
2. **Dev Tools**: Check console for component logs
3. **DOM Inspection**: Verify component structure in Elements panel

### Debug Features

The list example includes interactive debugging:

- **Load Data**: Trigger manual data loading
- **Scroll Controls**: Test virtual scrolling behavior
- **Metrics**: Display performance statistics
- **Debug Log**: Real-time component status updates

## Server Configuration

Examples are served via static file serving from `mtrl-app/public/`. The server configuration includes:

- **Static Routes**: `/examples/` maps to `public/examples/`
- **Distribution**: `/dist/` maps to built packages
- **MIME Types**: Proper `.mjs` file serving for ES modules

## Performance Optimization

### Development Mode

- **No Minification**: Faster builds for development
- **Inline Sourcemaps**: Better debugging experience
- **No Code Splitting**: Simpler module resolution

### Production Considerations

- Switch to minified builds for production
- Enable code splitting for larger applications
- Use CDN for static assets

## Troubleshooting

### Common Issues

**Import Errors:**

- Ensure using `.mjs` extension for ES modules
- Check import map configuration
- Verify build output exists in `/dist/`

**Component Not Working:**

- Check browser console for errors
- Verify all dependencies are built
- Test with debug script

**Build Failures:**

- Check TypeScript compilation errors
- Verify source file syntax
- Check dependency versions

**SVG Icon Issues:**

- **MIME Type Errors**: SVG files automatically convert to JavaScript modules when imported
- **Icon Not Found**: Check both SVG file and exports.js contain the icon
- **Import Path Issues**: Use server root paths like `/client/icons/icon.svg`

**API Data Loading Issues:**

- **Empty Data Response**: API returns `{ length: 0 }` - check API endpoint and data format
- **No Pagination**: API should return `{ items: [], meta: { hasNext, total } }` structure
- **Collection Errors**: Verify collection adapter configuration matches API response format

**Example Debug Output for API Issues:**

```
💬 [LOG] 🧪 [COLLECTION-ADDONS] Direct API test result: JSHandle@object
💬 [LOG] 🧪 [COLLECTION-ADDONS] Has data array? false Length: 0
💬 [LOG] 🧪 [COLLECTION-ADDONS] Has pagination? false
```

**Solution**: Check API endpoint returns proper data structure:

```javascript
// Expected API response format
{
  items: [...],           // Array of data items
  meta: {
    hasNext: boolean,     // More pages available
    total: number,        // Total item count
    page: number,         // Current page
    pageSize: number      // Items per page
  }
}
```

### Debug Commands

```bash
# Rebuild everything
bun run build:deps

# Test specific component
bun run node scripts/debug_list_modern.js

# Check server accessibility
curl -I http://localhost:4000/examples/list/

# Verify ES module build
ls -la dist/mtrl-addons/index.mjs
```

## Best Practices

### Example Development

1. **Start Simple**: Begin with basic component instantiation
2. **Add Gradually**: Incrementally add features and configuration
3. **Test Frequently**: Use debug script for validation
4. **Document**: Include clear comments and debug output

### Performance

1. **Use Watch Mode**: Enable auto-rebuild during development
2. **Check Bundle Size**: Monitor build output sizes
3. **Test Loading**: Verify component initialization performance

### Code Quality

1. **TypeScript**: Leverage type checking for configuration
2. **Error Handling**: Implement proper error boundaries
3. **Debugging**: Add comprehensive logging and status updates

## Conclusion

The examples system provides a powerful development environment for mtrl and mtrl-addons components. With ultra-fast builds, automated testing, and comprehensive debugging tools, it enables efficient component development and validation.

The list component example demonstrates the full capabilities of the functional composition system, showcasing virtual scrolling, data management, and performance optimization in a real-world scenario.
