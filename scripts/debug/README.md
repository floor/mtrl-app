# Debug Scripts Structure

This directory contains organized Puppeteer test scripts for debugging mtrl components.

## Directory Structure

```
debug/
├── vlist.ts                    # Main VList test runner (121 lines)
├── tests/
│   ├── scroll-tests.ts         # Scroll-related tests
│   ├── api-tests.ts           # API and data loading tests
│   ├── performance-tests.ts   # Performance and stress tests
│   └── debug-helpers.ts       # Debug utility functions
└── utils/
    └── puppeteer-base.ts      # Base PuppeteerTester class
```

## Usage

### Basic Testing

```bash
bun run debug:vlist
```

### Interactive Testing

```bash
bun run debug:vlist:interactive
```

### Performance Testing

```bash
PERF_TEST=true bun run debug:vlist
```

## Test Categories

### Scroll Tests (`tests/scroll-tests.ts`)

- `testMouseWheelScrollingWithContentCheck` - Verifies content during scrolling
- `testMouseWheelScrolling` - Basic mouse wheel scrolling
- `testBackwardScrolling` - Tests for overlapping items
- `testScrollFunctions` - Tests scrollToPage and scrollToIndex
- `testFastScrolling` - Fast scrolling behavior (disabled)
- `testFastMouseWheelScrolling` - Fast mouse wheel scrolling (disabled)

### API Tests (`tests/api-tests.ts`)

- `testScrollToPageAPI` - API request behavior
- `testServerStopStartScenario` - Failed range loading recovery
- `testGapIssue` - Gap detection in loaded items
- `debugLoadedRanges` - Debug collection ranges

### Debug Helpers (`tests/debug-helpers.ts`)

- `debugViewportStructure` - Examine DOM structure
- `debugDeferredCleanup` - Debug cleanup behavior

### Performance Tests (`tests/performance-tests.ts`)

- `testRequestQueueing` - Request queue behavior
- `testMemoryPerformance` - Memory usage under stress
- `testRenderingPerformance` - FPS and frame timing
- `testElementRecycling` - Element pool efficiency

## Adding New Tests

1. Create your test function in the appropriate test file
2. Export it from the test module
3. Import and call it in `vlist.ts`

## Notes

- Fast scrolling tests are currently disabled to focus on other issues
- Server stop/start tests are disabled as they manipulate the server
- Performance tests are optional and controlled by `PERF_TEST` env var
