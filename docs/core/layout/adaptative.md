# Adaptive Layout System

The adaptive layout system provides responsive, Material Design 3-compliant layouts that automatically adjust based on screen size. It's a powerful pattern for creating apps that gracefully adapt from mobile to desktop viewports.

## Overview

The adaptive layout system supports several Material Design 3 patterns:
- **List-Detail Pattern** - For content browsing
- **Feed Pattern** - For content consumption
- **Supporting Panel Pattern** - For task-focused apps  
- **Canvas Pattern** - For creation and editing apps

## Basic Usage

```typescript
import { createAdaptiveLayout } from 'mtrl';

const adaptiveLayout = createAdaptiveLayout({
  defaultMode: 'list',
  items: [
    {
      id: 'email1',
      title: 'Project Update',
      subtitle: 'Meeting notes from yesterday',
      icon: '<svg>...</svg>'
    }
  ],
  renderDetail: (item) => {
    const div = document.createElement('div');
    div.innerHTML = `<h2>${item.title}</h2><p>${item.subtitle}</p>`;
    return div;
  }
});

adaptiveLayout.mount(document.body);
```

## Configuration Options

### `AdaptiveLayoutConfig`

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `defaultMode` | `'list' \| 'detail' \| 'split'` | `'list'` | Initial layout mode |
| `breakpoints` | `AdaptiveBreakpoints` | See below | Responsive breakpoints |
| `items` | `Array<ListItem>` | `[]` | Items for list view |
| `renderDetail` | `(item: any) => HTMLElement` | Default renderer | Custom detail view renderer |
| `renderList` | `(items: any[]) => HTMLElement` | Navigation system | Custom list view renderer |
| `class` | `string` | `''` | Additional CSS classes |
| `layout` | `LayoutConfig` | Auto-generated | Custom layout configuration |
| `navigation` | `NavigationConfig` | `{ enabled: true }` | Navigation system options |

### Default Breakpoints

```typescript
{
  compact: 600,   // Mobile: < 600px
  medium: 839,    // Tablet: 600px - 839px
  expanded: 1200  // Desktop: >= 840px
}
```

## Layout Modes

### List Mode (Mobile)
- Shows only the list view
- Perfect for mobile devices
- Navigation drawer appears on demand

### Detail Mode (Mobile)
- Shows only the detail view when an item is selected
- Automatically switches back to list when no item is selected

### Split Mode (Tablet/Desktop)
- Shows both list and detail views side by side
- List panel takes 4/12 width on desktop, 5/12 on tablet
- Detail panel takes 8/12 width on desktop, 7/12 on tablet

## API Methods

### `mount(container: HTMLElement)`
Mounts the layout to a container element.

```typescript
adaptiveLayout.mount(document.getElementById('app'));
```

### `setSelectedItem(item: any)`
Programmatically select an item and update the detail view.

```typescript
adaptiveLayout.setSelectedItem({ id: 'email1', title: 'Selected Email' });
```

### `setItems(items: any[])`
Update the list of items and refresh the navigation.

```typescript
adaptiveLayout.setItems([
  { id: 'new1', title: 'New Item 1' },
  { id: 'new2', title: 'New Item 2' }
]);
```

### `getState()`
Get the current state of the adaptive layout.

```typescript
const state = adaptiveLayout.getState();
console.log(state.mode, state.selectedItem);
```

### `destroy()`
Clean up the layout and remove event listeners.

```typescript
adaptiveLayout.destroy();
```

## Advanced Examples

### Custom List Renderer

```typescript
const adaptiveLayout = createAdaptiveLayout({
  items: emails,
  renderList: (items) => {
    const list = document.createElement('ul');
    list.className = 'custom-email-list';
    
    items.forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = `
        <div class="email-preview">
          <h3>${item.title}</h3>
          <p>${item.subtitle}</p>
          <time>${item.date}</time>
        </div>
      `;
      li.onclick = () => adaptiveLayout.setSelectedItem(item);
      list.appendChild(li);
    });
    
    return list;
  }
});
```

### Custom Layout Configuration

```typescript
const adaptiveLayout = createAdaptiveLayout({
  layout: {
    type: 'grid',
    columns: 12,
    gap: 24,
    align: 'start'
  },
  // ... other options
});
```

### Without Navigation System

```typescript
const adaptiveLayout = createAdaptiveLayout({
  navigation: {
    enabled: false  // Provide your own list rendering
  },
  renderList: (items) => {
    // Custom list implementation
    return createCustomList(items);
  }
});
```

## Integration with Navigation System

When navigation is enabled (default), the adaptive layout automatically integrates with the navigation system:

```typescript
const adaptiveLayout = createAdaptiveLayout({
  items: navItems,
  navigation: {
    enabled: true,
    options: {
      hideDrawerOnClick: true,
      showLabelsOnRail: false,
      railOptions: {
        variant: 'drawer'
      }
    }
  }
});
```

## Responsive Behavior

The layout automatically responds to viewport changes:

1. **Mobile (< 600px)**
   - Single-panel view
   - Toggle between list and detail
   - Drawer navigation

2. **Tablet (600px - 839px)**
   - Split view with both panels
   - Balanced proportions (5/7 split)
   - Drawer always visible

3. **Desktop (>= 840px)**
   - Split view with wider detail panel
   - Optimal proportions (4/8 split)
   - Full navigation accessibility

## CSS Classes

The system automatically applies these classes:

- `mtrl-adaptive-layout` - Root container
- `mtrl-adaptive-layout--list` - List mode
- `mtrl-adaptive-layout--detail` - Detail mode  
- `mtrl-adaptive-layout--split` - Split mode
- `mtrl-adaptive-layout-content` - Main content area
- `mtrl-adaptive-layout-list` - List panel
- `mtrl-adaptive-layout-detail` - Detail panel

## SCSS Styling

```scss
.mtrl-adaptive-layout {
  height: 100vh;
  
  &-content {
    display: flex;
    height: 100%;
  }
  
  &-list {
    overflow-y: auto;
    background: var(--mtrl-surface);
    
    @media (min-width: 600px) {
      border-right: 1px solid var(--mtrl-outline-variant);
    }
  }
  
  &-detail {
    flex: 1;
    overflow-y: auto;
    padding: var(--mtrl-spacing-2);
    background: var(--mtrl-surface-container);
  }
}
```

## Best Practices

1. **Performance**
   - Use virtual scrolling for large lists
   - Implement lazy loading for detail views
   - Optimize custom renderers

2. **Accessibility**
   - Ensure keyboard navigation works
   - Provide proper ARIA attributes
   - Test with screen readers

3. **Mobile-First**
   - Design for mobile constraints first
   - Progressive enhancement for larger screens
   - Touch-friendly targets

4. **Content Priority**
   - Show most important content in mobile view
   - Use split view to enhance, not clutter
   - Consider reading patterns

## Troubleshooting

### Navigation Not Showing
- Ensure `navigation.enabled` is `true`
- Check that items array is not empty
- Verify container has proper dimensions

### Layout Not Responsive  
- Confirm breakpoints are configured correctly
- Check for CSS conflicts
- Ensure viewport meta tag is set

### Detail View Empty
- Verify `renderDetail` function is provided
- Check if `selectedItem` has expected properties
- Look for JavaScript errors in console