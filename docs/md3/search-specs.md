# Material Design 3 - Search Component Specifications

## Overview

Search bars and views enable users to navigate a product through search queries. They can display suggested keywords or phrases as the user types, with results always shown in a search view.

## Component Types

| Type | Description |
|------|-------------|
| **Search Bar** | Persistent input field for initiating search |
| **Search View** | Expanded container displaying results (full-screen or docked) |

---

## Search Bar

### Anatomy

1. **Container** - The pill-shaped background
2. **Leading icon button** - Search icon (magnifying glass)
3. **Supporting text** - Placeholder/hint text
4. **Avatar or trailing icon** - Optional action icons

### Measurements

| Element | Attribute | Value |
|---------|-----------|-------|
| Container | Width | Min: 360dp, Max: 720dp |
| Container | Height | 56dp |
| Container | Label alignment | Start-aligned |
| Container | Left padding | 16dp |
| Container | Right padding | 16dp |
| Leading icon | Icon ↔ label spacing | 16dp |
| Trailing icon | Label ↔ icon spacing | 16dp |
| Avatar | Size | 30dp |

### Color Tokens

| Element | Token | Role |
|---------|-------|------|
| Container | `md.sys.color.surface-container-high` | Background |
| Leading icon | `md.sys.color.on-surface-variant` | Icon color |
| Supporting text | `md.sys.color.on-surface-variant` | Placeholder color |

### States

| State | Description |
|-------|-------------|
| Enabled | Default interactive state |
| Hovered | Mouse hover state |
| Pressed | Active press with ripple effect |
| Focused | Keyboard/input focus state |

### Configurations

- Default (leading icon + supporting text)
- With avatar
- With one trailing icon button
- With two trailing icon buttons
- With avatar and trailing icon button

---

## Search View

### Anatomy

1. **Container** - Full-screen or docked panel
2. **Header** - Top section containing input
3. **Leading icon button** - Back/close navigation
4. **Supporting text** - Placeholder text
5. **Input text** - User-entered query
6. **Trailing icon button** - Clear/action buttons
7. **Divider** - Separates header from results

### Measurements

#### Full-screen

| Element | Attribute | Value |
|---------|-----------|-------|
| Container | Width | Full width |
| Container | Height | Full height |
| Header | Height | 72dp |
| Header | Label alignment | Left-aligned |
| Header | Left padding | 16dp |
| Header | Right padding | 16dp |
| Leading icon | Icon ↔ label spacing | 16dp |
| Trailing icon | Label ↔ icon spacing | 16dp |

#### Docked

| Element | Attribute | Value |
|---------|-----------|-------|
| Container | Width | Min: 360dp, Max: 720dp |
| Container | Height | Min: 240dp, Max: 2/3 screen height |
| Header | Height | 56dp |
| Header | Label alignment | Left-aligned |
| Header | Left padding | 16dp |
| Header | Right padding | 16dp |
| Leading icon | Icon ↔ label spacing | 16dp |
| Trailing icon | Label ↔ icon spacing | 16dp |

### Color Tokens

| Element | Token | Role |
|---------|-------|------|
| Container | `md.sys.color.surface-container-high` | Background |
| Leading icon | `md.sys.color.on-surface-variant` | Icon color |
| Supporting text | `md.sys.color.on-surface-variant` | Placeholder color |
| Input text | `md.sys.color.on-surface` | User input color |
| Divider | `md.sys.color.outline` | Separator line |

---

## Design Tokens

### Search Bar Tokens

```
md.comp.search-bar.container.color: md.sys.color.surface-container-high
md.comp.search-bar.container.height: 56dp
md.comp.search-bar.container.shape: md.sys.shape.corner.full
md.comp.search-bar.container.min-width: 360dp
md.comp.search-bar.container.max-width: 720dp

md.comp.search-bar.leading-icon.color: md.sys.color.on-surface-variant
md.comp.search-bar.leading-icon.size: 24dp

md.comp.search-bar.supporting-text.color: md.sys.color.on-surface-variant
md.comp.search-bar.supporting-text.font: md.sys.typescale.body-large

md.comp.search-bar.trailing-icon.color: md.sys.color.on-surface-variant
md.comp.search-bar.trailing-icon.size: 24dp

md.comp.search-bar.avatar.size: 30dp

md.comp.search-bar.container.padding-left: 16dp
md.comp.search-bar.container.padding-right: 16dp
md.comp.search-bar.leading-icon.padding-right: 16dp
md.comp.search-bar.trailing-icon.padding-left: 16dp
```

### Search View Tokens

```
md.comp.search-view.container.color: md.sys.color.surface-container-high

md.comp.search-view.full-screen.header.height: 72dp
md.comp.search-view.docked.header.height: 56dp
md.comp.search-view.docked.container.min-width: 360dp
md.comp.search-view.docked.container.max-width: 720dp
md.comp.search-view.docked.container.min-height: 240dp

md.comp.search-view.leading-icon.color: md.sys.color.on-surface-variant
md.comp.search-view.supporting-text.color: md.sys.color.on-surface-variant
md.comp.search-view.input-text.color: md.sys.color.on-surface
md.comp.search-view.trailing-icon.color: md.sys.color.on-surface-variant
md.comp.search-view.divider.color: md.sys.color.outline

md.comp.search-view.header.padding-left: 16dp
md.comp.search-view.header.padding-right: 16dp
md.comp.search-view.leading-icon.padding-right: 16dp
md.comp.search-view.trailing-icon.padding-left: 16dp
```

---

## Interaction Behavior

### Search Bar

1. User taps/clicks the search bar
2. Search bar expands to search view
3. Keyboard appears (mobile) or input receives focus (desktop)
4. Leading icon transitions from search to back arrow

### Search View

1. User enters query text
2. Suggestions/results appear below header
3. Clear button appears when text is present
4. User can tap suggestion or press Enter to search
5. Back button collapses view to search bar

### Keyboard Support

| Key | Action |
|-----|--------|
| Enter | Submit search query |
| Escape | Collapse search view / clear input |
| Arrow Down | Navigate to suggestions |
| Arrow Up | Navigate suggestions / return to input |

---

## Accessibility

- Provide `aria-label` for search input
- Use `role="search"` on container
- Provide `aria-label` for icon buttons
- Announce suggestion count to screen readers
- Support keyboard navigation through suggestions
- Minimum touch target: 48x48dp

---

## Differences from Material Design 2

| Aspect | M2 | M3 |
|--------|----|----|
| Color | Fixed colors | Dynamic color support |
| Elevation | Shadow elevation | Tonal elevation (no shadow) |
| Name | Open search bar | Search bar / Search view |
| Types | Single component | Two distinct components |
| Shape | Rounded rectangle | Full rounded (pill) |

---

## Platform Availability

| Platform | Status |
|----------|--------|
| Figma Design Kit | ✅ Available |
| Flutter | ✅ Available |
| Jetpack Compose | ✅ Available |
| MDC-Android | ✅ Available |
| Web | ❌ Unavailable |

---

## References

- [Material Design 3 - Search Guidelines](https://m3.material.io/components/search/guidelines)
- [Material Design 3 - Search Specs](https://m3.material.io/components/search/specs)
- [Material Design 3 - Search Accessibility](https://m3.material.io/components/search/accessibility)
