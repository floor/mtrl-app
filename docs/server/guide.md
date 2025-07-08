# Server Management Guide

## Overview

The mtrl-app server system provides **enterprise-grade process management** and **automated debugging capabilities** for local development. This guide covers the complete server ecosystem including PM2 process management, Puppeteer-based testing, and development workflow integration.

## Architecture

### Core Components

```
mtrl-app/
├── server.ts                    # Main server entry point
├── ecosystem.config.js          # PM2 process configuration
├── scripts/
│   └── debug_list_modern.js    # Puppeteer debugging system
├── server/                     # Server source code
│   ├── index.ts               # Server implementation
│   ├── config.ts              # Server configuration
│   └── handlers/              # Request handlers
└── docs/server/               # This documentation
    └── guide.md
```

### Technology Stack

- **🚀 Bun**: JavaScript runtime and server engine
- **⚡ PM2**: Process manager for graceful restarts and monitoring
- **🎭 Puppeteer**: Automated browser testing and debugging
- **🔧 TypeScript**: Type-safe server development

## PM2 Server Management

### Quick Start

```bash
# Start the server with PM2
bun run server:start

# Check server status
bun run server:status

# Reload server gracefully
bun run server:reload

# Stop the server
bun run server:stop
```

### Complete Command Reference

#### Core Management

```bash
# Start server with PM2 process management
bun run server:start

# Graceful restart (zero-downtime)
bun run server:reload

# Stop server gracefully
bun run server:stop
```

#### Monitoring & Debugging

```bash
# View process status table
bun run server:status

# View real-time logs
bun run server:logs

# Launch interactive monitoring dashboard
bun run server:monitor
```

### PM2 Process Configuration

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
      watch: false,
      max_memory_restart: "200M",
      env: {
        NODE_ENV: "production",
        PORT: 4000,
        COMPRESSION_ENABLED: "true",
        COMPRESSION_LEVEL: "6",
      },
      env_development: {
        NODE_ENV: "development",
        PORT: 4000,
      },
    },
  ],
};
```

**Key Features:**

- **Bun Interpreter**: Native Bun runtime for maximum performance
- **Fork Mode**: Single instance for development simplicity
- **Memory Management**: Auto-restart at 200MB limit
- **Environment Config**: Separate development and production settings

### PM2 Status Output

```
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ mtrl-app           │ fork     │ 4    │ online    │ 0%       │ 3.1mb    │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘
```

**Column Explanations:**

- **id**: Process identifier (0)
- **name**: Application name (mtrl-app)
- **mode**: Execution mode (fork)
- **↺**: Restart count (increases with each reload)
- **status**: Current state (online/stopped/errored)
- **cpu**: CPU usage percentage
- **memory**: Current memory consumption

### Benefits of PM2

#### ✅ **Graceful Process Management**

```bash
# Before: Crude kill commands
kill -9 $(lsof -ti :4000)
error: script "server:start" was terminated by signal SIGKILL (Forced quit)

# After: Elegant PM2 restart
bun run server:reload
[PM2] [mtrl-app](0) ✓
```

#### ✅ **Professional Monitoring**

- Real-time CPU and memory tracking
- Restart count monitoring
- Centralized log management
- Process health status

#### ✅ **Zero-Downtime Deployment**

- Graceful restart with proper signal handling
- No connection drops during reload
- Automatic crash recovery

#### ✅ **Development Productivity**

- One-command server management
- Consistent behavior across environments
- Easy integration with build tools

## Puppeteer Debugging System

### What is Puppeteer?

**Puppeteer** is a Node.js library that provides programmatic control over Chrome/Chromium browsers. We use it for **automated testing and debugging** of mtrl components without manual browser interaction.

### Debug Script Overview

**Location**: `scripts/puppeteer.ts`

**Purpose**: General-purpose automated testing of any mtrl component or example with real browser environment simulation.

### Using the Debug System

#### Basic Usage

```bash
# Test any example with command line arguments
bun run puppeteer examples/list
bun run puppeteer examples/grid
bun run puppeteer examples/form

# Or use the full script path
bun run scripts/puppeteer.ts examples/list
```

#### Usage Help

```bash
# Show usage instructions
bun run puppeteer

# Output:
❌ [PUPPETEER] Usage: bun run puppeteer <example_path>
📋 [PUPPETEER] Examples:
   bun run puppeteer examples/list
   bun run puppeteer examples/grid
   bun run puppeteer examples/form
```

#### What It Does

1. **🚀 Launches Chrome** in headless mode
2. **📄 Navigates** to any example page you specify
3. **⏱️ Waits** for component initialization
4. **📋 Captures** console messages and errors
5. **🔍 Analyzes** DOM structure and component health
6. **📊 Reports** detailed findings

### Debug Output Breakdown

#### 1. Initialization

```
🚀 [PUPPETEER] Starting automated testing session...
📄 [PUPPETEER] Loading http://localhost:4000/examples/list...
```

#### 2. Component Console Messages

```
💬 [LOG] 🚀 [LIST-EXAMPLE] Starting list component example
💬 [LOG] 📄 Page loaded, waiting for DOMContentLoaded...
💬 [LOG] 🔧 Initializing list component...
💬 [LOG] ✅ List component created successfully
💬 [LOG] 🎉 List component initialized
```

#### 3. Page Analysis

```
=== 📊 DETAILED PAGE ANALYSIS ===
📄 Page title: mtrl-addons List Component Example
📄 Body content length: 9218 characters
📊 Total divs with classes: 7
📊 Script tags: 2 (1 ES modules)
📊 Import maps: 1
```

#### 4. Component Detection

```
=== 🎯 COMPONENT DETECTION ===
🎯 Component container: ✅ Found
🎯 mtrl elements: ✅ Found 3
🎯 Error elements: ✅ None found
```

#### 5. DOM Structure Analysis

```
📋 Container content preview:
<h1>mtrl-addons List Component Example</h1>
<p>This is a standalone example of the mtrl-addons list component.</p>

<div class="controls">
  <button id="loadData">Load Data</button>
```

#### 6. Error Detection

```
=== ❌ JAVASCRIPT ERRORS SUMMARY ===
✅ No JavaScript errors detected
```

#### 7. Final Assessment

```
=== 🎯 FINAL ASSESSMENT ===
🎉 SUCCESS: Component appears to be working correctly!
```

### Puppeteer Advantages

#### ✅ **Real Browser Environment**

- Uses actual Chrome/Chromium engine
- True JavaScript execution context
- Accurate DOM manipulation and rendering
- Real CSS styling and layout computation

#### ✅ **Automated Testing**

- No manual browser interaction required
- Consistent testing environment
- Scriptable and repeatable
- CI/CD integration ready

#### ✅ **Comprehensive Analysis**

- Console message capture
- JavaScript error detection
- DOM structure analysis
- Component health assessment

#### ✅ **Development Integration**

- Works with live server
- Integrates with build watch mode
- Supports multiple examples
- Customizable for different components

## Integrated Development Workflow

### Complete Development Setup

#### Terminal 1: Server Management

```bash
# Start PM2-managed server
cd mtrl-app
bun run server:start

# Monitor server status
bun run server:status
```

#### Terminal 2: Build System

```bash
# Start watch mode for live rebuilds
cd mtrl-app
bun run build:addons:watch
```

#### Terminal 3: Automated Testing

```bash
# Run automated debugging
cd mtrl-app
bun run puppeteer examples/list
```

### Development Cycle

#### 1. **Code Changes**

Edit files in `mtrl-addons/src/`:

- TypeScript: `core/list-manager/`, `components/list/`
- SCSS: `styles/components/_list.scss`

#### 2. **Automatic Rebuild**

Watch mode detects changes:

```
📁 [BUILD-ADDONS] File changed: list-manager.ts
✅ [BUILD-ADDONS] Built in 52ms
  ES: 1958.1KB | CJS: 1960.4KB | CSS: 3.3KB
```

#### 3. **Server Reload** (if needed)

```bash
bun run server:reload
```

#### 4. **Automated Testing**

```bash
bun run puppeteer examples/list
```

### Real-Time Development Example

#### 1. Make a Change

```typescript
// mtrl-addons/src/core/list-manager/list-manager.ts
console.log("🔍 [DEBUG] Custom debug message:", someVariable);
```

#### 2. Watch Auto-Rebuild

```
📁 [BUILD-ADDONS] File changed: list-manager.ts
✅ [BUILD-ADDONS] Built in 45ms
```

#### 3. Debug Verification

```bash
bun run puppeteer examples/list
```

#### 4. See Changes

```
💬 [LOG] 🔍 [DEBUG] Custom debug message: {...}
```

## Server Configuration

### Environment Variables

#### Development

```bash
NODE_ENV=development
PORT=4000
COMPRESSION_ENABLED=false
```

#### Production

```bash
NODE_ENV=production
PORT=4000
COMPRESSION_ENABLED=true
COMPRESSION_LEVEL=6
```

### Server Features

#### Static File Serving

- **Examples**: `/examples/` directory
- **Built assets**: `/dist/` directory
- **Public files**: `/public/` directory

#### Development Features

- **Live reload**: File change detection
- **Hot module replacement**: Instant updates
- **Source maps**: Debug support
- **Error reporting**: Comprehensive logging

#### Production Features

- **Compression**: Gzip/Brotli support
- **Caching**: Static asset optimization
- **Bot detection**: SEO-friendly snapshots
- **Security headers**: Production hardening

## Troubleshooting

### Server Issues

#### Server Won't Start

```bash
error: Script not found "server:start"
```

**Solution**: Make sure you're in mtrl-app directory

```bash
cd mtrl-app
bun run server:start
```

#### Port Already in Use

```bash
Error: listen EADDRINUSE: address already in use :::4000
```

**Solution**: Stop existing process

```bash
bun run server:stop
# or if needed:
npx pm2 kill
```

#### PM2 Not Found

```bash
error: pm2: command not found
```

**Solution**: Install PM2 locally

```bash
bun add --dev pm2
```

### Puppeteer Issues

#### Debug Script Fails

```bash
❌ [PUPPETEER] Navigation failed: net::ERR_CONNECTION_REFUSED
```

**Solution**: Ensure server is running

```bash
# Check server status
bun run server:status

# Start if not running
bun run server:start
```

#### Component Not Found

```bash
❌ [PUPPETEER] Component does not appear to be working
```

**Solution**: Check build process

```bash
# Rebuild dependencies
bun run build:deps

# Verify files exist
ls -la dist/mtrl-addons/
```

#### JavaScript Errors

```bash
❌ ReferenceError: createListManager is not defined
```

**Solution**: Check imports and builds

```bash
# Verify file exists
ls -la dist/mtrl-addons/index.mjs

# Check exports
grep -n "createListManager" dist/mtrl-addons/index.mjs
```

### Network Issues

#### Examples Not Loading

```bash
curl -I http://localhost:4000/examples/list/index.html
HTTP/1.1 404 Not Found
```

**Solution**: Check file location

```bash
# Ensure file exists
ls -la public/examples/list/index.html

# Reload server
bun run server:reload
```

#### CSS/JS Files 404

```bash
curl -I http://localhost:4000/dist/mtrl/styles.css
HTTP/1.1 404 Not Found
```

**Solution**: Rebuild dependencies

```bash
bun run build:deps
```

## Best Practices

### Server Management

#### ✅ **Use PM2 for Process Management**

```bash
# Good: Professional process management
bun run server:reload

# Avoid: Manual kill commands
kill -9 $(lsof -ti :4000)
```

#### ✅ **Monitor Server Health**

```bash
# Regular health checks
bun run server:status

# Watch logs for issues
bun run server:logs
```

#### ✅ **Graceful Restarts**

```bash
# Always use graceful restart
bun run server:reload

# Never force kill unless absolutely necessary
```

### Development Workflow

#### ✅ **Use Watch Mode**

```bash
# Automatic rebuilds
bun run build:addons:watch

# Better than manual builds
bun run build:addons
```

#### ✅ **Automated Testing**

```bash
# Regular automated testing
bun run puppeteer examples/list

# Better than manual browser testing
```

#### ✅ **Multiple Terminals**

```bash
Terminal 1: Server (PM2)
Terminal 2: Build Watch
Terminal 3: Testing/Debugging
```

### Debugging Strategy

#### ✅ **Start with Automated Testing**

1. Run Puppeteer debug script
2. Analyze console messages
3. Check component detection
4. Review DOM structure

#### ✅ **Progressive Debugging**

1. **Server level**: Check PM2 status and logs
2. **Build level**: Verify file generation
3. **Component level**: Use Puppeteer analysis
4. **Browser level**: Manual verification if needed

#### ✅ **Custom Debug Messages**

```typescript
// Add specific debug points
console.log("🔍 [DEBUG] Component state:", state);
```

### Performance Optimization

#### ✅ **Monitor Resource Usage**

```bash
# Check memory usage
bun run server:status

# Monitor real-time performance
bun run server:monitor
```

#### ✅ **Optimize Build Process**

```bash
# Use watch mode for development
bun run build:addons:watch

# Only full builds for production
bun run build:deps
```

## Security Considerations

### Development Environment

#### ✅ **Local Network Only**

- Server binds to localhost:4000
- Not accessible from external networks
- Safe for development use

#### ✅ **Process Isolation**

- PM2 manages process boundaries
- Automatic restart on crashes
- Memory limits prevent system impact

### Production Deployment

#### ✅ **Environment Variables**

- Use production environment settings
- Enable compression and caching
- Configure proper security headers

#### ✅ **Process Management**

- Use PM2 ecosystem for deployment
- Configure monitoring and logging
- Set up automatic startup scripts

## Advanced Usage

### Custom Debug Scripts

#### Creating New Debug Scripts

```bash
# Copy existing script
cp scripts/debug_list_modern.js scripts/debug_custom.js

# Modify for your component
# Update URL and selectors
# Customize analysis logic
```

#### Multi-Component Testing

```javascript
// Test multiple examples
const examples = [
  "http://localhost:4000/examples/list/",
  "http://localhost:4000/examples/grid/",
  "http://localhost:4000/examples/form/",
];

for (const url of examples) {
  await testComponent(url);
}
```

### PM2 Advanced Configuration

#### Development vs Production

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: "mtrl-app",
      script: "./server.ts",
      interpreter: "bun",
      instances: process.env.NODE_ENV === "production" ? "max" : 1,
      exec_mode: process.env.NODE_ENV === "production" ? "cluster" : "fork",
      watch: process.env.NODE_ENV === "development",
      ignore_watch: ["node_modules", "dist"],
    },
  ],
};
```

#### Custom Environment Variables

```bash
# Add to ecosystem.config.js
env_development: {
  NODE_ENV: 'development',
  PORT: 4000,
  DEBUG: 'mtrl:*',
  LOG_LEVEL: 'debug'
}
```

### Integration with CI/CD

#### Automated Testing Pipeline

```bash
# In CI/CD script
bun install
bun run build:deps
bun run server:start
bun run puppeteer examples/list
bun run server:stop
```

#### Health Check Endpoints

```typescript
// Add to server
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version,
  });
});
```

This comprehensive server management system provides **enterprise-grade development capabilities** with **elegant process management**, **automated testing**, and **professional monitoring** for the mtrl-app ecosystem.
