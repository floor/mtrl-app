# Material Design 3 - Icon Button Specifications

## Overview

Icon buttons display actions in a compact form using icons. They must use a system icon with a clear meaning.

### Key Points

- Icon buttons must use a system icon with a clear meaning
- Two types: default and toggle
- Many configurations: color, size, width, and shape
- On web, display a tooltip describing the action while hovering
- In toggle buttons, use the outlined style of an icon for the unselected state, and the filled style for the selected state

---

## Component Types

| Type | Description |
|------|-------------|
| **Default** | Opens other elements such as a menu or search |
| **Toggle** | Represents binary actions that can be toggled on and off (favorite, bookmark) |

---

## Configurations

### Color Styles

Four built-in color styles, in order of emphasis:

| Style | Emphasis | Use Case |
|-------|----------|----------|
| **Filled** | Highest | Key actions requiring high emphasis |
| **Tonal** | High | Secondary actions paired with high emphasis actions |
| **Outlined** | Medium | When button isn't the main focus |
| **Standard** | Lowest | Low-emphasis or on colorful surfaces |

### Sizes

| Size | Dimensions |
|------|------------|
| Extra Small (XS) | 32dp |
| Small (S) | 40dp (default) |
| Medium (M) | 56dp |
| Large (L) | 96dp |
| Extra Large (XL) | 136dp |

### Widths

- **Narrow**
- **Default**
- **Wide**

### Shapes

- **Round** (default) - Full corner radius
- **Square** - Fixed corner radius per size

---

## Anatomy

1. **Icon** - Visually communicates the button's action
2. **Container** - Provides contrast and hierarchy

---

## Specifications

### Measurements

| Size | Icon Size | Default Width | Narrow Width | Wide Width |
|------|-----------|---------------|--------------|------------|
| XS | 18dp | 32dp | 28dp | 36dp |
| S | 24dp | 40dp | 32dp | 48dp |
| M | 24dp | 56dp | 48dp | 64dp |
| L | 36dp | 96dp | 80dp | 112dp |
| XL | 48dp | 136dp | 112dp | 160dp |

### Target Sizes

Extra small and small icon buttons must have a target size of **48x48dp** or larger to be accessible.

### Corner Radius

| Size | Round | Square | Pressed |
|------|-------|--------|---------|
| XS | Full | 12dp | 8dp |
| S | Full | 12dp | 8dp |
| M | Full | 16dp | 12dp |
| L | Full | 28dp | 16dp |
| XL | Full | 28dp | 16dp |

---

## Color Tokens

### Default Icon Button

| Style | Container | Icon |
|-------|-----------|------|
| Filled | `primary` | `on-primary` |
| Tonal | `secondary-container` | `on-secondary-container` |
| Outlined | `outline-variant` (border) | `on-surface-variant` |
| Standard | transparent | `on-surface-variant` |

### Toggle Icon Button - Unselected

| Style | Container | Icon |
|-------|-----------|------|
| Filled | `surface-container-highest` | `primary` |
| Tonal | `surface-container-highest` | `on-surface-variant` |
| Outlined | `outline-variant` (border) | `on-surface-variant` |
| Standard | transparent | `on-surface-variant` |

### Toggle Icon Button - Selected

| Style | Container | Icon |
|-------|-----------|------|
| Filled | `primary` | `on-primary` |
| Tonal | `secondary-container` | `on-secondary-container` |
| Outlined | `inverse-surface` | `inverse-on-surface` |
| Standard | transparent | `primary` |

---

## States

### State Layer Opacity

| State | Opacity |
|-------|---------|
| Enabled | 0% |
| Disabled | 10% (38% content opacity) |
| Hovered | 8% |
| Focused | 10% |
| Pressed | 10% |

### Visual States

All four color styles (filled, tonal, outlined, standard) support:

1. **Enabled** - Default interactive state
2. **Disabled** - Non-interactive with reduced opacity
3. **Hovered** - Mouse hover with state layer
4. **Focused** - Keyboard focus with state layer
5. **Pressed** - Active press with ripple effect

---

## Behavior

### Shape Morph

#### On Press

While pressed, icon buttons can morph to become more square. Both round and square icon buttons should have the same pressed shape radius.

#### On Selection (Toggle)

Toggle icon buttons change resting shape:
- **Round unselected** → **Square selected**
- **Square unselected** → **Round selected**

### Hover

On hover, the icon button displays a tooltip describing its action (not the name of the icon).

### Selection

Toggle icon buttons allow a single choice to be selected or deselected:
- **Unselected**: Outlined icon style
- **Selected**: Filled icon style

If a filled version doesn't exist, use semibold weight instead.

---

## Design Tokens

### Common Tokens

```
md.comp.icon-button.state-layer.shape: md.sys.shape.corner.full

md.comp.icon-button.icon.size.xs: 18dp
md.comp.icon-button.icon.size.s: 24dp
md.comp.icon-button.icon.size.m: 24dp
md.comp.icon-button.icon.size.l: 36dp
md.comp.icon-button.icon.size.xl: 48dp

md.comp.icon-button.container.size.xs: 32dp
md.comp.icon-button.container.size.s: 40dp
md.comp.icon-button.container.size.m: 56dp
md.comp.icon-button.container.size.l: 96dp
md.comp.icon-button.container.size.xl: 136dp
```

### Filled Icon Button Tokens

```
md.comp.filled-icon-button.container.color: md.sys.color.primary
md.comp.filled-icon-button.icon.color: md.sys.color.on-primary
md.comp.filled-icon-button.container.shape: md.sys.shape.corner.full

md.comp.filled-icon-button.disabled.container.color: md.sys.color.on-surface
md.comp.filled-icon-button.disabled.container.opacity: 0.12
md.comp.filled-icon-button.disabled.icon.color: md.sys.color.on-surface
md.comp.filled-icon-button.disabled.icon.opacity: 0.38

md.comp.filled-icon-button.hover.state-layer.color: md.sys.color.on-primary
md.comp.filled-icon-button.hover.state-layer.opacity: 0.08

md.comp.filled-icon-button.focus.state-layer.color: md.sys.color.on-primary
md.comp.filled-icon-button.focus.state-layer.opacity: 0.10

md.comp.filled-icon-button.pressed.state-layer.color: md.sys.color.on-primary
md.comp.filled-icon-button.pressed.state-layer.opacity: 0.10
```

### Tonal Icon Button Tokens

```
md.comp.filled-tonal-icon-button.container.color: md.sys.color.secondary-container
md.comp.filled-tonal-icon-button.icon.color: md.sys.color.on-secondary-container
md.comp.filled-tonal-icon-button.container.shape: md.sys.shape.corner.full

md.comp.filled-tonal-icon-button.disabled.container.color: md.sys.color.on-surface
md.comp.filled-tonal-icon-button.disabled.container.opacity: 0.12
md.comp.filled-tonal-icon-button.disabled.icon.color: md.sys.color.on-surface
md.comp.filled-tonal-icon-button.disabled.icon.opacity: 0.38

md.comp.filled-tonal-icon-button.hover.state-layer.color: md.sys.color.on-secondary-container
md.comp.filled-tonal-icon-button.hover.state-layer.opacity: 0.08

md.comp.filled-tonal-icon-button.focus.state-layer.color: md.sys.color.on-secondary-container
md.comp.filled-tonal-icon-button.focus.state-layer.opacity: 0.10

md.comp.filled-tonal-icon-button.pressed.state-layer.color: md.sys.color.on-secondary-container
md.comp.filled-tonal-icon-button.pressed.state-layer.opacity: 0.10
```

### Outlined Icon Button Tokens

```
md.comp.outlined-icon-button.container.shape: md.sys.shape.corner.full
md.comp.outlined-icon-button.outline.color: md.sys.color.outline-variant
md.comp.outlined-icon-button.outline.width: 1dp
md.comp.outlined-icon-button.icon.color: md.sys.color.on-surface-variant

md.comp.outlined-icon-button.disabled.outline.color: md.sys.color.on-surface
md.comp.outlined-icon-button.disabled.outline.opacity: 0.12
md.comp.outlined-icon-button.disabled.icon.color: md.sys.color.on-surface
md.comp.outlined-icon-button.disabled.icon.opacity: 0.38

md.comp.outlined-icon-button.hover.state-layer.color: md.sys.color.on-surface-variant
md.comp.outlined-icon-button.hover.state-layer.opacity: 0.08

md.comp.outlined-icon-button.focus.state-layer.color: md.sys.color.on-surface-variant
md.comp.outlined-icon-button.focus.state-layer.opacity: 0.10

md.comp.outlined-icon-button.pressed.state-layer.color: md.sys.color.on-surface-variant
md.comp.outlined-icon-button.pressed.state-layer.opacity: 0.10
```

### Standard Icon Button Tokens

```
md.comp.standard-icon-button.container.shape: md.sys.shape.corner.full
md.comp.standard-icon-button.icon.color: md.sys.color.on-surface-variant

md.comp.standard-icon-button.disabled.icon.color: md.sys.color.on-surface
md.comp.standard-icon-button.disabled.icon.opacity: 0.38

md.comp.standard-icon-button.hover.state-layer.color: md.sys.color.on-surface-variant
md.comp.standard-icon-button.hover.state-layer.opacity: 0.08

md.comp.standard-icon-button.focus.state-layer.color: md.sys.color.on-surface-variant
md.comp.standard-icon-button.focus.state-layer.opacity: 0.10

md.comp.standard-icon-button.pressed.state-layer.color: md.sys.color.on-surface-variant
md.comp.standard-icon-button.pressed.state-layer.opacity: 0.10
```

---

## Guidelines

### Usage

- Use icon buttons to display actions
- Default buttons can open other elements (menu, search)
- Toggle buttons represent binary actions (favorite, bookmark)
- Can be placed on background or in containers (cards, app bars, toolbars)

### Color Selection

| Need | Recommended Style |
|------|-------------------|
| Highest emphasis / key actions | Filled |
| Secondary actions with high emphasis pair | Tonal |
| Medium emphasis / not main focus | Outlined |
| Low emphasis / colorful surface | Standard |

### Icon Requirements

- **Default buttons**: Use filled icons
- **Toggle unselected**: Use outlined icon style
- **Toggle selected**: Use filled icon style
- If filled version doesn't exist, use semibold weight

### Placement

- Commonly used in app bars and cards
- Use for common, easily understandable actions
- Only use a few icon buttons at once
- In dense layouts, group in toolbars or button groups

### Do's and Don'ts

✅ **Do:**
- Use icons with a background to make them easy to see on any surface
- Use color styles to make the primary action clear when mixing button types
- Use toggle icon buttons when the icon can be selected
- Ensure icons have 3:1 contrast ratio with background

❌ **Don't:**
- Don't overuse filled style on a screen
- Don't use toggle buttons for actions without a selected state (e.g., overflow menu)
- Don't use colors with contrast below 3:1

---

## Accessibility

### Use Cases

People should be able to do the following using assistive technology:
- Understand meaning of the icon
- Navigate to and activate an icon button
- Access tooltip to help describe the icon button's purpose

### Contrast Requirements

Ensure the icon has contrast of at least **3:1** with the surface or background.

### Keyboard Navigation

| Key | Action |
|-----|--------|
| Tab | Focus lands on (non-disabled) icon button |
| Space | Activates the (non-disabled) icon button |
| Enter | Activates the (non-disabled) icon button |

### Labeling

The accessibility label describes the action the button executes:
- ✅ "Add to favorites" (for heart icon)
- ✅ "Bookmark"
- ✅ "Send message"

### Target Size

- Minimum target size: **48x48dp**
- Applies even when nested in other components
- Extra small and small buttons must maintain 48x48dp touch target

### Density

- Don't apply density to icon buttons by default
- Provide density options that allow users to choose higher density
- Controls for adjusting density must maintain 48x48 CSS pixels minimum

### Hover Tooltip

On web, icon buttons should display a tooltip with an accessibility label. The tooltip text should be clear and concise.

---

## M3 Expressive Update (May 2025)

Icon buttons now have a wider variety of shapes and sizes, changing shape when selected. When placed in button groups, icon buttons interact with each other when pressed.

### Changes

| Category | Update |
|----------|--------|
| Types | Default and toggle (selection) |
| Color styles | Now configurations (filled, tonal, outlined, standard) |
| Shapes | Round and square options, morphs on press/select |
| Sizes | XS, S (default), M, L, XL |
| Widths | Narrow, default, wide |

---

## Differences from M2

| Aspect | M2 | M3 |
|--------|----|----|
| Color | Fixed colors | Dynamic color support |
| Types | Toggle buttons | Default and toggle icon buttons |
| Naming | Toggle buttons | Icon buttons |

---

## Platform Availability

| Platform | Status |
|----------|--------|
| Figma Design Kit | ✅ Available |
| Flutter | ✅ Available |
| Jetpack Compose | ✅ Available |
| Jetpack Compose: Expressive | ✅ Available |
| MDC-Android | ✅ Available |
| MDC-Android: Expressive | ✅ Available |
| Web | ✅ Available |
| Web: Expressive | ❌ Unavailable |

---

## References

- [Material Design 3 - Icon Buttons Overview](https://m3.material.io/components/icon-buttons/overview)
- [Material Design 3 - Icon Buttons Specs](https://m3.material.io/components/icon-buttons/specs)
- [Material Design 3 - Icon Buttons Guidelines](https://m3.material.io/components/icon-buttons/guidelines)
- [Material Design 3 - Icon Buttons Accessibility](https://m3.material.io/components/icon-buttons/accessibility)
