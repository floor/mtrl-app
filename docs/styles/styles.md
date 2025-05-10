# Styles system

The mtrl library implements a comprehensive styling system based on Material Design 3 principles, using pure SCSS with no external dependencies. This document outlines the structure, design tokens, and usage patterns of the styling system.

## Table of Contents

- [Base Directory](#base-directory)
- [Abstract Directory](#abstract-directory)
- [Themes Directory](#themes-directory)
- [Components Directory](#components-directory)
- [Utilities Directory](#utilities-directory)
- [Integration](#integration)

The mtrl styling system is built with a focus on:

- **Modularity**: All styles are organized in a modular way to enable tree-shaking
- **Performance**: Compiled CSS is optimized for minimal size and maximum performance
- **Consistency**: Design tokens ensure consistent styling across all components
- **Flexibility**: Theming system allows easy customization of colors, typography, and more
- **Accessibility**: Built-in considerations for contrast, reduced motion, and high-contrast modes

## Base Directory

The base directory contains fundamental styling that gets applied to the document or raw HTML elements.

### _reset.scss

This file provides a modern CSS reset to normalize styling across different browsers:

```scss
// src/styles/base/_reset.scss

// Modern CSS Reset
// Adapted and simplified for Material Design

// Use border-box by default
*, 
*::before, 
*::after {
  box-sizing: border-box;
}

// Remove default margin and padding
html, 
body, 
h1, h2, h3, h4, h5, h6, 
p, figure, blockquote, dl, dd {
  margin: 0;
  padding: 0;
}

// Additional resets for elements like buttons, images, tables, etc.
```

### _typography.scss

Defines typography classes based on Material Design type scales:

```scss
// src/styles/base/_typography.scss
@use '../abstract/base' as base;
@use '../abstract/variables' as v;
@use '../abstract/mixins' as m;

// Typography scale classes
$prefix: base.$prefix;

// Display typography
.#{$prefix}-display-large {
  @include m.typography('display-large');
}

// ...other typography styles
```

## Abstract Directory

The abstract directory contains the foundational styling system—variables, mixins, functions, and configuration that power the entire framework.

### _base.scss

Contains the core prefix variable that's used throughout the system:

```scss
// src/styles/abstract/_base.scss
$prefix: 'mtrl';
```

### _variables.scss

Colors follow the Material Design 3 token system:

```scss
// Light theme example (defined in _baseline.scss and theme files)
--mtrl-sys-color-primary: #6750A4;
--mtrl-sys-color-on-primary: #FFFFFF;
--mtrl-sys-color-primary-container: #EADDFF;
--mtrl-sys-color-on-primary-container: #21005D;
// ...and many more color tokens
```

### _functions.scss

Provides utility functions for working with design tokens:

```scss
// src/styles/abstract/_functions.scss
@use 'sass:map';
@use 'sass:math';
@use 'sass:color';
@use 'variables' as v;

// Get nested map value
@function map-deep-get($map, $keys...) {
  @each $key in $keys {
    $map: map.get($map, $key);
  }
  @return $map;
}

// Get value from design tokens
@function get-token($category, $token) {
  $token-map: null;
  
  @if $category == 'state' {
    $token-map: v.$state;
  } @else if $category == 'motion' {
    $token-map: v.$motion;
  }
  // ...other token categories
  
  $value: map.get($token-map, $token);
  @return $value;
}

// State Layer
@function get-state-opacity($state) {
  @return get-token('state', '#{$state}-state-layer-opacity');
}

// Motion
@function get-motion-duration($duration) {
  @return get-token('motion', 'duration-#{$duration}');
}

// ...other utility functions
```

### _mixins.scss

Border radius values for different element shapes:

```scss
$shape: (
  'none': 0,
  'extra-small': 4px,
  'small': 8px,
  'medium': 12px,
  'large': 16px,
  'extra-large': 28px,
  'full': 9999px,
  'pill': 100px
);
```

### State Tokens

Opacity values for different interaction states:

```scss
$state: (
  'hover-state-layer-opacity': 0.08,
  'focus-state-layer-opacity': 0.12,
  'pressed-state-layer-opacity': 0.12,
  'dragged-state-layer-opacity': 0.16
);
```

### Motion Tokens

Animation duration and easing functions:

```scss
$motion: (
  'duration-short1': 100ms,
  'duration-short2': 200ms,
  // ...other duration values
  'easing-standard': cubic-bezier(0.2, 0.0, 0.0, 1.0),
  'easing-emphasized': cubic-bezier(0.2, 0.0, 0.0, 1.0),
  // ...other easing functions
);
```

## Themes Directory

The themes directory contains definitions for all available color themes.

### _base-theme.scss

Provides the foundation for creating themes:

```scss
// src/styles/themes/_base-theme.scss
@use '../abstract/base' as *;

// Base theme definition with common properties and structure
@mixin create-theme($name) {
  [data-theme="#{$name}"] {
    @content;
  }
}

// Common status colors that should be available in all themes
@mixin status-colors-light() {
  // Error colors
  --#{$prefix}-sys-color-error: #B3261E;
  --#{$prefix}-sys-color-error-rgb: 179, 38, 30;
  // ...other status colors
}

@mixin status-colors-dark() {
  // Error colors
  --#{$prefix}-sys-color-error: #F2B8B5;
  --#{$prefix}-sys-color-error-rgb: 242, 184, 181;
  // ...other status colors
}

%theme-base {
  // Common properties for all themes
  --#{$prefix}-sys-typescale-label-large-font-family-name: "Roboto";
  // ...other common theme properties
}
```

### _baseline.scss

Defines the default Material Design colors:

```scss
// src/styles/themes/_baseline.scss
@use '../abstract/base' as *;
@use 'base-theme' as *;

// Variables for light theme (default)
@mixin baseline-light-variables {
  // Key colors
  --#{$prefix}-sys-color-primary: #6750A4;
  --#{$prefix}-sys-color-primary-rgb: 103, 80, 164;
  --#{$prefix}-sys-color-on-primary: #FFFFFF;
  // ...many more color definitions
}

// Variables for dark theme
@mixin baseline-dark-variables {
  // Key colors
  --#{$prefix}-sys-color-primary: #D0BCFF;
  --#{$prefix}-sys-color-primary-rgb: 208, 188, 255;
  --#{$prefix}-sys-color-on-primary: #381E72;
  // ...many more color definitions
}

// Apply baseline light theme to :root by default
:root {
  @include baseline-light-variables;
  
  // Apply dark theme based on system preference
  @media (prefers-color-scheme: dark) {
    @include baseline-dark-variables;
  }
}

// Dark theme class for manual switching
.dark-theme {
  @include baseline-dark-variables;
}

// Make it available as a selectable theme
@include create-theme('baseline') {
  @include baseline-light-variables;

  &[data-theme-mode="dark"] {
    @include baseline-dark-variables;
  }
}
```

### Theme variants (_ocean.scss, _forest.scss, etc.)

Each theme file defines a unique color palette:

```scss
// src/styles/themes/_ocean.scss
@use '../abstract/base' as *;
@use 'base-theme' as *;

@include create-theme('ocean') {
  // Key colors generated from seed color #006C9C
  --#{$prefix}-sys-color-primary: #006493;
  --#{$prefix}-sys-color-on-primary: #FFFFFF;
  --#{$prefix}-sys-color-primary-container: #CCE5FF;
  // ...other color definitions
  
  // Include status colors for light theme
  @include status-colors-light();

  &[data-theme-mode="dark"] {
    // Key colors
    --#{$prefix}-sys-color-primary: #8DCDFF;
    --#{$prefix}-sys-color-on-primary: #003351;
    // ...other dark mode colors
    
    // Include status colors for dark theme
    @include status-colors-dark();
  }
}
```

### _index.scss

Exports all themes:

```scss
// src/styles/themes/_index.scss
@forward 'base-theme';
@forward 'baseline';
@forward 'ocean';
@forward 'forest';
@forward 'sunset';
```

## Components Directory

mtrl provides a rich set of mixins and functions to ensure consistent styling.

### Typography Mixins

Apply typography styles consistently:

```scss
@mixin typography($scale) {
  $styles: f.get-typography($scale);
  font-family: map.get($styles, 'font-family');
  font-size: map.get($styles, 'font-size');
  line-height: map.get($styles, 'line-height');
  letter-spacing: map.get($styles, 'letter-spacing');
  font-weight: map.get($styles, 'font-weight');
}

// Usage
.my-element {
  @include m.typography('body-medium');
}
```

### Elevation Mixins

Apply consistent shadow styles:

```scss
@mixin elevation($level) {
  box-shadow: f.get-elevation($level);
}

// Usage
.my-card {
  @include m.elevation(1);
  
  &:hover {
    @include m.elevation(2);
  }
}
```

### State Layer Mixins

Apply consistent interaction state styles:

```scss
@mixin state-layer($color, $state: 'hover', $selector: false) {
  // Implementation...
}

// Usage
.my-button {
  &:hover {
    @include m.state-layer(t.color('primary'), 'hover');
  }
}
```

### Motion Mixins

Apply consistent animations:

```scss
@mixin motion-transition($properties...) {
  // Implementation...
}

// Usage
.my-element {
  @include m.motion-transition(
    background-color, 
    color, 
    box-shadow
  );
}
```

### Focus Ring Mixin

Apply consistent focus styling:

```scss
@mixin focus-ring($color: var(--mtrl-sys-color-primary), $width: 2px, $offset: 2px) {
  // Implementation...
}

// Usage
.my-interactive-element {
  @include m.focus-ring;
}
```

### Theme Functions

Access theme values easily:

```scss
// Access color tokens
background-color: t.color('primary');
color: t.color('on-primary');

// Create colors with opacity
background-color: t.alpha('primary', 0.08);
```

## Utilities Directory

The utilities directory contains helper classes for common styling patterns that can be applied directly in HTML.

### _colors.scss

Provides color-related utility classes:

```scss
// src/styles/utilities/_colors.scss
@use '../abstract/base' as base;
@use '../abstract/theme' as t;

$prefix: base.$prefix;

// Text colors
.#{$prefix}-text-primary {
  color: t.color('primary');
}

.#{$prefix}-text-on-primary {
  color: t.color('on-primary');
}

// ...more text color utilities

// Background colors
.#{$prefix}-bg-primary {
  background-color: t.color('primary');
}

.#{$prefix}-bg-surface {
  background-color: t.color('surface');
}

// ...more background color utilities

// Opacity variants
@for $i from 1 through 9 {
  $opacity: $i * 0.1;
  
  .#{$prefix}-bg-primary-opacity-#{$i} {
    background-color: t.alpha('primary', $opacity);
  }
}

// Border colors and utilities
.#{$prefix}-border {
  border: 1px solid t.color('outline-variant');
}

// ...more border utilities
```

### _flexbox.scss

Provides flexbox layout utilities:

```scss
// src/styles/utilities/_flexbox.scss
@use '../abstract/base' as base;

$prefix: base.$prefix;

// Display flex
.#{$prefix}-flex {
  display: flex;
}

.#{$prefix}-inline-flex {
  display: inline-flex;
}

// Flex direction
.#{$prefix}-flex-row {
  flex-direction: row;
}

.#{$prefix}-flex-col {
  flex-direction: column;
}

// Justify content
.#{$prefix}-justify-start {
  justify-content: flex-start;
}

.#{$prefix}-justify-center {
  justify-content: center;
}

// ...more justify utilities

// Align items
.#{$prefix}-items-center {
  align-items: center;
}

// ...more alignment utilities

// Common flex layouts
.#{$prefix}-flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
```

### _spacing.scss

Provides margin, padding, and gap utilities:

```scss
// src/styles/utilities/_spacing.scss
@use '../abstract/base' as base;
@use 'sass:map';

$prefix: base.$prefix;

// Spacing scale
$spacing-scale: (
  '0': 0,
  '1': 4px,
  '2': 8px,
  '3': 12px,
  '4': 16px,
  // ...more spacing values
);

// Generate spacing utilities
@each $key, $value in $spacing-scale {
  // Margin utilities
  .#{$prefix}-m-#{$key} {
    margin: $value;
  }
  
  .#{$prefix}-mx-#{$key} {
    margin-left: $value;
    margin-right: $value;
  }
  
  // ...more margin directions
  
  // Padding utilities
  .#{$prefix}-p-#{$key} {
    padding: $value;
  }
  
  // ...more padding directions
  
  // Gap utilities
  .#{$prefix}-gap-#{$key} {
    gap: $value;
  }
}

// Responsive margin utilities
@each $breakpoint in (sm, md, lg, xl) {
  @media (min-width: map.get((
    sm: 600px,
    md: 960px,
    lg: 1280px,
    xl: 1920px
  ), $breakpoint)) {
    // Responsive utilities...
  }
}
```

### _typography.scss

Provides text-related utilities:

```scss
// src/styles/utilities/_typography.scss
@use '../abstract/base' as base;
@use '../abstract/mixins' as m;

$prefix: base.$prefix;

// Font style utilities
.#{$prefix}-italic {
  font-style: italic;
}

// Letter spacing
.#{$prefix}-tracking-tight {
  letter-spacing: -0.025em;
}

// ...more tracking utilities

// Line height
.#{$prefix}-leading-none {
  line-height: 1;
}

// ...more line height utilities

// Text transform
.#{$prefix}-uppercase {
  text-transform: uppercase;
}

// ...more text transform utilities

// Text decoration
.#{$prefix}-underline {
  text-decoration: underline;
}

// ...more text decoration utilities

// Text overflow
.#{$prefix}-truncate {
  @include m.truncate;
}
```

### _visibility.scss

Provides display and visibility utilities:

```scss
// src/styles/utilities/_visibility.scss
@use '../abstract/base' as base;
@use '../abstract/mixins' as m;
@use 'sass:map';

$prefix: base.$prefix;

// Hide element but keep it accessible to screen readers
.#{$prefix}-sr-only {
  @include m.visually-hidden;
}

// Standard display utilities
.#{$prefix}-block {
  display: block;
}

// ...more display utilities

// Responsive visibility
$breakpoints: (
  'sm': 600px,
  'md': 960px,
  'lg': 1280px,
  'xl': 1920px
);

@each $breakpoint, $value in $breakpoints {
  // Hide on and above a breakpoint
  .#{$prefix}-hide-#{$breakpoint}-up {
    @media (min-width: $value) {
      display: none !important;
    }
  }
  
  // ...more responsive utilities
}

// Elevation utilities
@for $i from 0 through 5 {
  .#{$prefix}-elevation-#{$i} {
    @include m.elevation($i);
  }
}
```

### _layout.scss

Provides layout system utilities:

```scss
// src/styles/utilities/_layout.scss
@use '../abstract/base' as base;
@use '../abstract/variables' as v;
@use '../abstract/mixins' as m;
@use 'sass:map';
@use 'sass:list';
@use 'sass:math';

$prefix: base.$prefix;
$layout: '#{$prefix}-layout';

// Container layout
.#{$layout} {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  // ...container styles
  
  // Different container sizes
  &--sm {
    max-width: 600px;
  }
  
  // ...more container sizes
}

// Stack layout (vertical)
.#{$layout}--stack {
  display: flex;
  flex-direction: column;
  width: 100%;
  // ...stack styles
}

// Row layout (horizontal)
.#{$layout}--row {
  display: flex;
  width: 100%;
  // ...row styles
}

// Grid layout
.#{$layout}--grid {
  display: grid;
  gap: map.get($defaults, 'grid-gap');
  width: 100%;
  // ...grid styles
}

// ...more layout utilities
```

### _ripple.scss

Provides ripple effect utilities:

```scss
// src/components/ripple/_ripple.scss
@use '../../styles/abstract/base' as base;
@use '../../styles/abstract/variables' as v;
@use '../../styles/abstract/functions' as f;
@use '../../styles/abstract/mixins' as m;
@use '../../styles/abstract/theme' as t;

$component: '#{base.$prefix}-ripple';

.#{$component} {
  // Ripple container styles
  
  &-wave {
    // Ripple animation styles
  }
}

// Standalone utility
[data-ripple] {
  position: relative;
  overflow: hidden;
  // ...more ripple styles
}
```

## Integration

Components follow a consistent BEM-like naming convention:

```scss
.mtrl-button {
  // Base styles
  
  &-icon {
    // Button icon styles
  }
  
  &-text {
    // Button text styles
  }
  
  &--filled {
    // Filled button variant
  }
  
  &--outlined {
    // Outlined button variant
  }
  
  &--disabled {
    // Disabled state
  }
}
```

### Design Patterns

Common component styling patterns:

1. **Base styles**: Core styling applied to all variants
2. **Sub-elements**: Child elements with `-element` naming
3. **Variants**: Style variations with `--variant` naming
4. **States**: Interactive states like `--disabled`, `--active`
5. **Theming**: Using CSS variables for theme-dependent styles

## Responsive Design

mtrl supports responsive design through breakpoint mixins:

```scss
@mixin breakpoint-up($size) {
  @media (min-width: f.get-breakpoint($size)) {
    @content;
  }
}

@mixin breakpoint-down($size) {
  @media (max-width: f.get-breakpoint($size) - 1) {
    @content;
  }
}

// Usage
.my-element {
  padding: 16px;
  
  @include m.breakpoint-up('md') {
    padding: 24px;
  }
}
```

Standard breakpoints are defined as:

```scss
$breakpoints: (
  'xs': 0,
  'sm': 600px,
  'md': 960px,
  'lg': 1280px,
  'xl': 1920px
);
```