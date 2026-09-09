# Navigation Component

The Navigation component renders the top-level destinations of an application:
the rail down the side of a desktop layout, the drawer that expands out of it,
and the bar across the bottom of a phone screen. Reach for it when the user is
moving between parts of the app. For switching between sibling views inside one
part, use [tabs](./tabs.md) instead.

The component handles one navigation surface. `createNavigationSystem`, described
at the end, wires a rail and a drawer together and keeps them in sync.

## Import

```javascript
import { createNavigation, createNavigationSystem } from 'mtrl';

import {
  NAV_VARIANTS,
  NAV_POSITIONS,
  NAV_BEHAVIORS,
  NAV_EVENTS
} from 'mtrl/components/navigation';
```

## Basic Usage

```javascript
const nav = createNavigation({
  variant: 'rail',
  position: 'left',
  items: [
    { id: 'home', icon: homeIcon, label: 'Home', active: true },
    { id: 'search', icon: searchIcon, label: 'Search' },
    { id: 'library', icon: libraryIcon, label: 'Library' }
  ]
});

document.body.appendChild(nav.element);

nav.on('change', (event) => {
  router.go(event.id);
});
```

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `variant` | `'rail' \| 'drawer' \| 'bar' \| 'modal' \| 'standard'` | `'standard'` | Which navigation surface to render |
| `position` | `'left' \| 'right' \| 'top' \| 'bottom'` | `'left'` | Adds a `mtrl-nav--pos-<position>` class. That class currently carries no styles: `_navigation.scss` writes its position rules as `mtrl-nav--left` and so on, which the component never emits. Position the surface yourself until the two agree |
| `behavior` | `'fixed' \| 'dismissible' \| 'modal'` | `'fixed'` | Read once, at creation, and only to decide whether a drawer starts hidden: `'dismissible'` on a `drawer` collapses it. It emits no class and no other behaviour |
| `items` | `NavItemConfig[]` | `[]` | Items, in order, nested to any depth |
| `groups` | `NavGroupConfig[]` | `undefined` | **Accepted and not applied.** No group container, heading or divider is rendered; every item is appended straight to the root. Group items with separate navigation surfaces instead |
| `expanded` | `boolean` | `false` | Whether a drawer starts expanded |
| `showLabels` | `boolean` | `true` (inert) | **Accepted and not applied.** `nav-item.ts` renders a label whenever the item config has one. For an icon-only item, omit the item's `label` — and then name it yourself, see Accessibility |
| `scrimEnabled` | `boolean` | `true` (inert) | **Accepted and not applied.** No scrim element is created for any variant. Dim the content behind a modal drawer yourself |
| `disabled` | `boolean` | `false` | Whether the navigation starts disabled |
| `ariaLabel` | `string` | `'Main Navigation'` | Accessible name for the `nav` landmark |
| `class` | `string` | `undefined` | Additional CSS classes |
| `prefix` | `string` | `'mtrl'` | Prefix for CSS class names |

### Item configuration

| Option | Type | Description |
|--------|------|-------------|
| `id` | `string` | Identifier, required. Reported by `change` and accepted by `setActive` |
| `label` | `string` | Text label |
| `icon` | `string` | Icon HTML, typically an inline SVG |
| `badge` | `string` | Badge text on the item |
| `subtitle` | `string` | **Accepted and not applied.** No subtitle element is rendered for any variant |
| `active` | `boolean` | Whether the item starts selected |
| `disabled` | `boolean` | Whether the item is not interactive |
| `expanded` | `boolean` | Whether the item's nested list starts open |
| `groupId` | `string` | **Accepted and not applied**, along with `groups` |
| `items` | `NavItemConfig[]` | Nested items |

### Group configuration

Listed because `NavGroupConfig` is exported and a reader will find it in the
types. Nothing reads it: see the `groups` row above.

| Option | Type | Description |
|--------|------|-------------|
| `id` | `string` | Identifier referenced by an item's `groupId` |
| `title` | `string` | Heading shown above the group |
| `expanded` | `boolean` | Whether the group starts open |

## Component API

### Items

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `addItem(config)` | `config: NavItemConfig` | `NavigationComponent` | Appends an item and registers it, including any nested items |
| `removeItem(id)` | `id: string` | `NavigationComponent` | Removes an item and its element |
| `getItem(id)` | `id: string` | `NavItemData \| undefined` | The item's element and config |
| `getAllItems()` | none | `NavItemData[]` | Every registered item, nested ones included |
| `getItemPath(id)` | `id: string` | `string[]` | The IDs of an item's ancestors, ending with the item |

### Selection

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `getActive()` | none | `NavItemData \| null` | The selected item, or `null` |
| `setActive(id)` | `id: string` | `NavigationComponent` | Selects an item and emits `change`. It routes through the same controller a click does, so the event is identical to a click's, `source: 'userAction'` included |

### State

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `enable()` | none | `NavigationComponent` | Enables the navigation |
| `disable()` | none | `NavigationComponent` | Disables the navigation |
| `expand()` | none | `NavigationComponent` | Expands a drawer and emits `expanded` |
| `collapse()` | none | `NavigationComponent` | Collapses a drawer and emits `collapsed` |
| `isExpanded()` | none | `boolean` | Whether the drawer is expanded |
| `toggle()` | none | `NavigationComponent` | Expands or collapses, whichever applies |

### Events and lifecycle

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `on(event, handler)` | `event: string, handler: Function` | `NavigationComponent` | Adds an event listener |
| `off(event, handler)` | `event: string, handler: Function` | `NavigationComponent` | Removes an event listener |
| `destroy()` | none | `void` | Tears down the navigation and its listeners |

The component also exposes `items`, a `Map` from ID to `{ element, config }`, for
the cases the methods above do not cover.

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `change` | `{ id, item, previousItem, path, source }` | The selected item changed. `source` is `'userAction'` for a click *and* for `setActive`, so a handler cannot tell the two apart; `previousItem` is reconstructed from the DOM and carries only `{ element, config: { id } }` |
| `expanded` | `{ source: 'api' }` | `expand()` opened the drawer |
| `collapsed` | `{ source: 'api' }` | `collapse()` closed the drawer |
| `expandToggle` | `{ id, expanded }` | An item with nested children was expanded or collapsed |
| `itemAdded` | `{ id, item }` | `addItem` registered a new item |
| `itemRemoved` | `{ id, item }` | `removeItem` removed an item |
| `mouseenter` | `{ id, clientX, clientY }` | The pointer entered the navigation. `id` names the surface, not an item |
| `mouseleave` | `{ id, relatedTargetId, clientX, clientY }` | The pointer left the navigation |
| `mouseover` | `{ id, item, target, clientX, clientY }` | The pointer moved onto an item |

The pointer events are what a rail-and-drawer pairing uses to open the drawer on
hover; most applications only need `change`.

## Examples

### A bottom bar

```javascript
const bar = createNavigation({
  variant: 'bar',
  position: 'bottom',
  items: [
    { id: 'home', icon: homeIcon, label: 'Home', active: true },
    { id: 'browse', icon: browseIcon, label: 'Browse' },
    { id: 'saved', icon: savedIcon, label: 'Saved', badge: '3' }
  ]
});
```

A bar whose items have no children is announced as a `tablist`; give the items
nested `items` and it becomes a `menubar` instead. Only the root's role changes:
nested `items` are rendered for the `drawer` variant alone, so a bar's children
never appear in the DOM.

### A drawer with nested items

```javascript
const drawer = createNavigation({
  variant: 'drawer',
  behavior: 'dismissible',
  expanded: false,
  items: [
    {
      id: 'components',
      label: 'Components',
      expanded: true,
      items: [
        { id: 'buttons', label: 'Buttons' },
        { id: 'cards', label: 'Cards' }
      ]
    },
    { id: 'styles', label: 'Styles' }
  ]
});

drawer.on('change', (event) => {
  // ['components', 'cards'] for a nested destination
  router.go(event.path);
});
```

A dismissible or modal drawer that starts collapsed gets the `mtrl-nav--hidden`
class at creation, so it is out of the way until `expand()` is called.

### An icon-only rail

`showLabels: false` does nothing, so an icon-only rail is one whose items carry
no `label`. Each item then has no accessible name, which you have to supply.

```javascript
const rail = createNavigation({
  variant: 'rail',
  ariaLabel: 'Sections',
  items: sections.map(({ label, ...rest }) => rest)
});

sections.forEach(({ id, label }) => {
  rail.getItem(id)?.element.setAttribute('aria-label', label);
});
```

## The navigation system

`createNavigationSystem` builds a rail and a drawer, keeps the drawer showing the
subsections of whichever rail item is active, and swaps to a mobile arrangement
below a breakpoint.

```javascript
const system = createNavigationSystem({
  items: {
    components: {
      label: 'Components',
      icon: componentsIcon,
      items: [
        { id: 'buttons', label: 'Buttons' },
        { id: 'cards', label: 'Cards' }
      ]
    },
    styles: { label: 'Styles', icon: stylesIcon }
  },
  activeSection: 'components'
});

system.initialize();
system.onItemSelect = (event) => router.go(event.id);
```

The system takes its own configuration, separate from `NavigationConfig`. Both
tables below describe `NavigationSystemConfig` and `NavigationSystem`, declared
in `navigation/system/types.ts`.

| Option | Type | Default | Description |
|---------------|------|---------|-------------|
| `items` | `Record<string, NavigationSection>` | `undefined` | Sections keyed by ID, each with a `label`, an optional `icon` and its subsection `items` |
| `activeSection` | `string` | `undefined` | Section selected at startup |
| `activeSubsection` | `string` | `undefined` | Subsection selected at startup |
| `breakpoint` | `number` | `960` | Width in pixels below which the system switches to mobile mode |
| `expanded` | `boolean` | `false` | Start with the drawer open |
| `showLabelsOnRail` | `boolean` | `true` | Forwarded to the rail as `showLabels`, which is itself not applied, so this has no effect either |
| `hideDrawerOnClick` | `boolean` | `false` | Close the drawer when an item is chosen |
| `hoverDelay` | `number` | `200` | Milliseconds before hover opens the drawer |
| `closeDelay` | `number` | `100` | Milliseconds before the drawer closes after the pointer leaves |
| `animateDrawer` | `boolean` | `true` | Animate the drawer's transitions |
| `lockBodyScroll` | `boolean` | `true` | Prevent body scrolling while the mobile drawer is open |
| `hideOnClickOutside` | `boolean` | `true` | Close the mobile drawer on an outside click |
| `enableSwipeGestures` | `boolean` | `true` | Enable swipe gestures in mobile mode |
| `optimizeForTouch` | `boolean` | `true` | Enlarge touch targets on touch devices |
| `overlayClass` | `string` | `'mtrl-nav-overlay'` | Class for the mobile overlay element |
| `closeButtonClass` | `string` | `'mtrl-nav-close-btn'` | Class for the mobile close button |
| `bodyLockClass` | `string` | `'mtrl-body-drawer-open'` | Class added to `body` while the drawer is open |
| `railOptions` | `object` | `undefined` | Extra options forwarded to the rail |
| `drawerOptions` | `object` | `undefined` | Extra options forwarded to the drawer |

| Method | Parameters | Returns | Description |
|---------------|------------|---------|-------------|
| `initialize()` | none | `NavigationSystem` | Builds the rail and drawer and attaches their listeners |
| `cleanup()` | none | `void` | Removes the components, listeners and observers |
| `navigateTo(section, subsection?, silent?)` | `section: string, subsection?: string, silent?: boolean` | `void` | Moves the selection; `silent` suppresses the change handlers |
| `getRail()` | none | `NavigationComponent` | The rail component |
| `getDrawer()` | none | `NavigationComponent` | The drawer component |
| `getActiveSection()` | none | `string \| null` | Active section ID |
| `getActiveSubsection()` | none | `string \| null` | Active subsection ID |
| `showDrawer()` | none | `void` | Opens the drawer |
| `hideDrawer()` | none | `void` | Closes the drawer |
| `isDrawerVisible()` | none | `boolean` | Whether the drawer is showing |
| `isMobile()` | none | `boolean` | Whether the system is in mobile mode |
| `checkMobileState()` | none | `void` | Re-evaluates the breakpoint and switches modes if needed |
| `configure(config)` | `config: Partial<NavigationSystemConfig>` | `NavigationSystem` | Updates the configuration in place |
| `isProcessingChange()` | none | `boolean` | Whether a change is mid-flight, to guard against re-entrant navigation |
| `setProcessingChange(state)` | `state: boolean` | `void` | Sets that flag |

The system reports through three assignable handlers rather than an event bus:
`onSectionChange(sectionId, eventData)`, `onItemSelect(event)`, and
`onViewChange({ mobile, previousMobile, width })`.

## Accessibility

- The root element is a `nav` with `role="navigation"` and the `ariaLabel` as its
  accessible name. Name every navigation surface on the page distinctly.
- A `bar` variant is announced differently depending on its contents: as a
  `tablist` when its items are flat, and as a `menubar` when any item has
  children. Both get `aria-orientation="horizontal"`.
- The active item gets `aria-current="page"`. The `role="tab"` and
  `aria-selected` branch in `nav-item.ts` never runs: the `tablist` role is put
  on the root *after* the items are built, so an item never sees it. A `bar`
  therefore announces itself as a tablist whose children are plain buttons, and
  no item is ever `aria-selected`. An expandable drawer item carries
  `aria-haspopup="menu"` instead and is not marked current.
- An item's `label` becomes both the visible text and the button's `aria-label`.
  An item with only an `icon` has no accessible name at all, so set one on the
  element yourself.
- Enter and Space activate the focused item, and Home and End move focus to the
  first and last. The arrow keys are wired but do nothing: the handler picks its
  axis from a `component.variant` that no feature ever sets, so neither the
  vertical nor the horizontal branch matches. Tab reaches every item regardless,
  since each one is a real `<button>`.
- A modal drawer's scrim is decorative. The drawer itself is what should receive
  focus when it opens, and returning focus to the trigger on close is left to the
  application.

## Styling

Classes the component actually puts on the DOM:

```css
.mtrl-nav { }
.mtrl-nav--rail { }
.mtrl-nav--drawer { }
.mtrl-nav--bar { }
.mtrl-nav--modal { }
.mtrl-nav--standard { }
.mtrl-nav--hidden { }        /* added by collapse(), removed by expand() */
.mtrl-nav--disabled { }
.mtrl-nav--pos-left { }      /* emitted, but unstyled: see the position row */
.mtrl-nav--pos-bottom { }

.mtrl-nav-item { }
.mtrl-nav-item--active { }
.mtrl-nav-item-container { }
.mtrl-nav-item-icon { }
.mtrl-nav-item-label { }
.mtrl-nav-item-badge { }
.mtrl-nav-nested-container { }
.mtrl-nav-expand-icon { }
```

Six more are declared in `NAV_CLASSES` but never reach an element, and no
stylesheet defines them, so a rule written against one of these will never
match: `.mtrl-nav--expanded` (expanding only removes `--hidden`),
`.mtrl-nav-item--disabled` (a disabled item gets the `disabled` attribute and
`aria-disabled` instead), `.mtrl-nav-group`, `.mtrl-nav-group-title`,
`.mtrl-nav-divider` and `.mtrl-nav-scrim`.

The root element also carries `data-component-type="navigation"` and
`data-variant`, which are handy hooks for end-to-end tests.
