# mtrl Tree-Shaking Architecture Plan

## Problem Statement

When bundling an application that imports only `createButton` and `createSlider` from mtrl, the resulting bundle was **130KB** instead of the expected smaller size. This indicated that mtrl's architecture did not support proper tree-shaking.

### Original Evidence

```bash
# Before optimization
bun build examples/velocity-loading/script.js --outdir=examples/dist --minify --format=esm
# Bundled 319 modules in 20ms
# script.js  130.73 KB
```

The bundled output contained constants and code for **all components** even though only Button and Slider were used.

---

## Implementation Status: ✅ COMPLETED

### Results Achieved

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| vlist example bundle | 130.75 KB | 118.78 KB | **9% reduction** |
| Modules bundled | 319 | 92 | **71% fewer modules** |
| Button-only (direct import) | ~55 KB | 43.23 KB | **22% reduction** |
| Network transfer (gzipped) | ~45 KB | 37.9 KB | **16% reduction** |

### Changes Implemented

#### 1. Deleted Constants Barrel (`src/constants.ts`)

The root cause was `src/constants.ts` which imported ALL component constants:

```typescript
// DELETED: src/constants.ts
// This file imported from every component's constants file,
// forcing the bundler to include everything
import { BADGE_VARIANTS, ... } from "./components/badge/constants";
import { BUTTON_VARIANTS, ... } from "./components/button/constants";
import { CAROUSEL_LAYOUTS, ... } from "./components/carousel/constants";
// ... 30+ component imports
```

#### 2. Rewrote Components Index (`src/components/index.ts`)

Replaced `export *` with explicit named exports:

```typescript
// BEFORE: Barrel exports (tree-shaking killer)
export * from "./badge";
export * from "./button";
export * from "./carousel";
// ... all components

// AFTER: Explicit exports only
export { default as createBadge } from "./badge";
export { default as createButton } from "./button";
export { createDivider } from "./divider";
// ... explicit exports

// Type exports (zero bundle impact)
export type { BadgeConfig, BadgeComponent } from "./badge/types";
export type { ButtonConfig, ButtonComponent } from "./button/types";
// ...
```

#### 4. Added `sideEffects: false` to package.json

```json
{
  "sideEffects": false
}
```

This tells bundlers that unused imports can be safely dropped.

#### 5. Added Subpath Exports to package.json

```json
{
  "exports": {
    ".": {
      "development": "./src/index.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    },
    "./styles": "./dist/styles.css",
    "./components/*": {
      "development": "./src/components/*/index.ts",
      "import": "./dist/components/*/index.js",
      "types": "./dist/components/*/index.d.ts"
    },
    "./components/*/constants": {
      "development": "./src/components/*/constants.ts",
      "import": "./dist/components/*/constants.js",
      "types": "./dist/components/*/constants.d.ts"
    },
    "./core": {
      "development": "./src/core/index.ts",
      "import": "./dist/core/index.js",
      "types": "./dist/core/index.d.ts"
    },
    "./core/*": {
      "development": "./src/core/*/index.ts",
      "import": "./dist/core/*/index.js",
      "types": "./dist/core/*/index.d.ts"
    }
  }
}
```

**Key insight:** The `./components/*/constants` export allows direct imports from constants files, avoiding the duplicate export issue that occurs when both the main entry and component index export the same constants.

#### 5. Updated Main Index (`src/index.ts`)

Removed constants re-exports:

```typescript
// BEFORE
export { BUTTON_VARIANTS, SLIDER_SIZES, ... } from "./constants";

// AFTER
// Constants removed - import from component constants files:
//   import { BUTTON_VARIANTS } from 'mtrl/components/button/constants'
```

#### 6. Updated Component Index Files

Component index files (`src/components/*/index.ts`) no longer re-export constants to prevent duplicate export errors during code splitting:

```typescript
// src/components/button/index.ts
export { default } from "./button";
export type { ButtonConfig, ButtonComponent, ButtonVariant } from "./types";
// NOTE: Constants NOT exported here - import from './constants' directly
```

---

## Usage Guide

### Recommended: Direct Imports (Best Tree-Shaking)

```typescript
// Optimal bundle size
import createButton from "mtrl/components/button";
import createSlider from "mtrl/components/slider";
import { addClass, removeClass } from "mtrl/core/dom";
```

### Alternative: Main Entry (Convenience)

```typescript
// Still works, slightly larger bundle
import { createButton, createSlider, addClass, removeClass } from "mtrl";
```

### Constants Import

```typescript
// Constants must be imported from the constants file directly
import { BUTTON_VARIANTS, BUTTON_SIZES } from "mtrl/components/button/constants";
import { SLIDER_COLORS } from "mtrl/components/slider/constants";
```

### Feature Imports (Card only)

```typescript
// Card features are exported from the component index
import { withLoading, withExpandable, withSwipeable } from "mtrl/components/card";
// But card constants come from constants file
import { CARD_VARIANTS } from "mtrl/components/card/constants";
```

---

## Bundle Size Breakdown

For the vlist velocity-loading example:

| Component | Size | Modules |
|-----------|------|---------|
| vlist only | 29.88 KB | 2 |
| vlist + createLayout | 37.19 KB | 6 |
| Button only | 43.23 KB | 73 |
| Slider only | 43.75 KB | 67 |
| Button + Slider | 75.29 KB | 87 |
| Full example | 118.78 KB | 92 |

**Network transfer (gzipped): 37.9 KB**

---

## Why Bundle Size Can't Go Lower

The ~75 KB for Button + Slider represents the actual code needed:

1. **Core utilities (~30 KB shared)**
   - Ripple effect
   - Event system
   - DOM manipulation
   - Component composition (pipe, features)

2. **Slider-specific (~15 KB)**
   - Canvas rendering
   - Animation system
   - Track/handle logic

3. **Button-specific (~10 KB)**
   - Progress integration (lazy-loaded)
   - State management

4. **Shared features (~20 KB)**
   - withText, withIcon, withVariant
   - withDisabled, withLifecycle
   - withRipple

### Considered but Rejected: Lazy-Loading Ripple

Making ripple lazy-loaded was considered but rejected because:
- Ripple is core visual feedback
- Delay would hurt user experience
- Size savings (~5 KB) not worth the UX tradeoff

---

## Remaining Work

### mtrl-app Updates ✅ COMPLETED

All component files updated to use correct import paths:

```typescript
// BEFORE
import { createButton, BUTTON_VARIANTS } from 'mtrl'

// AFTER
import { createButton } from 'mtrl'
import { BUTTON_VARIANTS } from 'mtrl/components/button/constants'
```

Updated files:
- `client/content/components/badges/*.js` - All badge constants imports
- `client/content/components/buttons/**/*.js` - All button constants imports
- `client/content/components/progress/*.js` - All progress constants imports
- `client/content/components/cards/*.js` - Card constants and features
- `client/content/components/dialogs/*.js` - Dialog constants
- `client/content/components/search/*.js` - Search constants
- `client/content/components/sliders/*.js` - Slider constants
- `client/content/components/snackbars/*.js` - Snackbar constants
- `client/content/components/textfields/*.js` - Textfield constants
- `client/content/components/datepickers/*.js` - Datepicker constants

### Import Pattern Summary

| Import Type | Path |
|-------------|------|
| Component creators | `import { createButton } from 'mtrl'` |
| Constants | `import { BUTTON_VARIANTS } from 'mtrl/components/button/constants'` |
| Card features | `import { withLoading } from 'mtrl/components/card'` |
| Types (enums) | `import { SelectionMode } from 'mtrl/components/segmented-button'` |

**Important:** Component index files do NOT re-export constants to avoid duplicate export issues with code splitting. Constants are only exported from their respective `constants.ts` files.

---

## Commits

### mtrl (feat/tree-shaking branch)

```
feat(core): improve tree-shaking with explicit exports and subpaths

- Delete src/constants.ts barrel file that pulled in all components
- Rewrite src/components/index.ts with explicit exports (no export *)
- Add sideEffects: false to package.json
- Add subpath exports: mtrl/components/*, mtrl/core/*
- Fix type exports to match actual type names

Bundle size improvement: 130KB -> 118KB (9% reduction)
Modules bundled: 319 -> 92 (71% fewer)
```

### vlist (main branch)

```
refactor(examples): use direct mtrl imports for tree-shaking

- Update velocity-loading to use mtrl/components/* imports
- Add build:examples script for bundled output
- Use bundled script in HTML instead of import maps

Bundle size: 118KB uncompressed, 38KB gzipped
```

---

## Original Plan Phases (For Reference)

### Phase 1: Isolate Core Features ✅ DONE
- Moved constants to individual feature files
- Removed barrel exports from features index

### Phase 2: Component Isolation ✅ DONE
- Components now use explicit imports
- No more `export *` in components index

### Phase 3: Entry Point Restructuring ✅ DONE
- Main entry preserved for convenience
- Granular entry points via package.json exports

### Phase 4: Build System ⏸️ DEFERRED
- Code splitting works with current setup
- Individual component bundles not needed yet

---

## References

- [Webpack Tree Shaking Guide](https://webpack.js.org/guides/tree-shaking/)
- [Rollup Tree Shaking](https://rollupjs.org/guide/en/#tree-shaking)
- [Package.json exports](https://nodejs.org/api/packages.html#package-entry-points)
- [SideEffects in package.json](https://webpack.js.org/guides/tree-shaking/#mark-the-file-as-side-effect-free)

---

*Created: February 2026*
*Status: ✅ Implemented*
*Last Updated: February 2026*
