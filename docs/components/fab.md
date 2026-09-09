# FAB Component

A floating action button carries the one action a screen is really for: compose,
add, start. It is a circular button that floats above the content, holds an icon
and no label, and there should be at most one of them in view. If the action
needs a word to be understood, use the [extended FAB](./extended-fab.md)
instead.

## Overview

The FAB is a single `<button>` with an icon inside it. Three things vary:

- **variant** — `primary`, `secondary`, `tertiary` and `surface`, in falling
  order of emphasis. Each takes its container colour and its matching `on-`
  colour from the theme, so a FAB follows whatever palette is loaded.
- **size** — `small` (40dp), `default` (56dp) and `large` (96dp).
- **position** — the four corners. Setting `position` makes the element
  `position: fixed` and pins it 16dp from both edges. Leave it unset to place
  the FAB yourself, which is what you want inside a card, a sheet or a
  [bottom app bar](./bottom-app-bar.md).

A FAB is elevated in every variant and lowers by one level while pressed, which
is also what `lower()` and `raise()` do on demand.

## Import

```javascript
import { createFab } from 'mtrl';
```

## Basic Usage

```javascript
const fab = createFab({
  icon: addIcon,
  ariaLabel: 'Add new item',
  position: 'bottom-right'
});

fab.on('click', () => createItem());
document.body.appendChild(fab.element);
```

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `icon` | `string` | — | Icon as an HTML string, usually an SVG |
| `variant` | `'primary' \| 'secondary' \| 'tertiary' \| 'surface'` | `'primary'` | Colour and emphasis |
| `size` | `'small' \| 'default' \| 'large'` | `'default'` | Diameter and icon size |
| `position` | `'top-right' \| 'top-left' \| 'bottom-right' \| 'bottom-left'` | — | Fixes the FAB to a corner of the viewport |
| `ariaLabel` | `string` | `'action'` when an icon is set | Accessible name. Always set it |
| `disabled` | `boolean` | `false` | Creates it disabled |
| `iconSize` | `string` | — | Adds an `mtrl-icon--<value>` class to the icon element. You supply the rule |
| `animate` | `boolean` | `false` | Scales the FAB in when it is added to the page |
| `ripple` | `boolean` | `true` | Ripple on press |
| `rippleConfig` | `{ duration, timing, opacity }` | — | Ripple tuning |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | The button's `type` attribute |
| `value` | `string` | — | The button's `value` attribute, for form use |
| `class` | `string` | — | Extra classes on the element |
| `prefix` | `string` | `'mtrl'` | Class-name prefix |
| `componentName` | `string` | `'fab'` | Name used in class generation |

`iconSize` is worth reading twice: it does not set a pixel size. It appends
`mtrl-icon--<value>` to the icon span, and the library ships no rules for those
classes, so `iconSize: '32px'` gives you a `mtrl-icon--32px` hook and nothing
else until you write the CSS.

## Component API

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `setIcon(icon)` | `icon: string` | `FabComponent` | Replaces the icon HTML |
| `getIcon()` | — | `string` | The current icon HTML |
| `setPosition(position)` | `position: string` | `FabComponent` | Moves it to another corner |
| `getPosition()` | — | `string \| null` | The current corner, or `null` when unpositioned |
| `lower()` | — | `FabComponent` | Drops it to the pressed elevation |
| `raise()` | — | `FabComponent` | Restores the resting elevation |
| `enable()` | — | `FabComponent` | Makes it interactive again |
| `disable()` | — | `FabComponent` | Disables it |
| `setValue(value)` | `value: string` | `FabComponent` | Sets the `value` attribute |
| `getValue()` | — | `string` | Reads it |
| `addClass(...classes)` | `classes: string[]` | `FabComponent` | Adds classes to the element |
| `getClass(name)` | `name: string` | `string` | Prefixes a name, e.g. `'fab'` → `'mtrl-fab'` |
| `on(event, handler)` | `event: string, handler: Function` | `FabComponent` | Subscribes to a forwarded event (`click`, `focus`, `blur`) |
| `off(event, handler)` | `event: string, handler: Function` | `FabComponent` | Removes one |
| `destroy()` | — | `void` | Removes the element and its listeners |

| Property | Type | Description |
|----------|------|-------------|
| `element` | `HTMLButtonElement` | The button |
| `icon` | `{ setIcon, getIcon, getElement }` | The icon manager, when you need the icon element itself |
| `disabled` | `{ enable, disable, isDisabled }` | The disabled-state manager; `isDisabled()` lives here, not on the component |
| `lifecycle` | `{ destroy }` | The lifecycle manager |

## Events

The FAB forwards exactly three native events to `on()` — `click`, `focus` and
`blur`. Any other name is accepted by `on()` and never fires; reach for
`element.addEventListener` for those.

The handler is not given the DOM event. It receives a wrapper,
`{ event, element, originalEvent }`, in which `event` and `originalEvent` are
both the native event and `element` is the FAB's button.

| Event | Payload | Description |
|-------|---------|-------------|
| `click` | `{ event, element, originalEvent }` | Pressed. Suppressed while the button is disabled |
| `focus` | `{ event, element, originalEvent }` | Took focus |
| `blur` | `{ event, element, originalEvent }` | Lost focus |

## Examples

### The four variants

The showcase renders one FAB per variant, in falling emphasis:

```javascript
for (const variant of ['primary', 'secondary', 'tertiary', 'surface']) {
  const fab = createFab({
    icon: addIcon,
    variant,
    ariaLabel: `${variant} action`
  });
  container.appendChild(fab.element);
}
```

### Sizes, with the icon to match

A large FAB is 96dp and takes a 36dp icon, so pass a bigger SVG for it rather
than scaling the 24dp one up:

```javascript
const small = createFab({ icon: addIcon, size: 'small', ariaLabel: 'Add' });
const medium = createFab({ icon: addIcon, ariaLabel: 'Add' });
const large = createFab({ icon: largeAddIcon, size: 'large', ariaLabel: 'Add' });
```

### Changing it while it is on screen

```javascript
const fab = createFab({ icon: addIcon, ariaLabel: 'Add' });

editMode.on('change', (editing) => {
  fab.setIcon(editing ? editIcon : addIcon);
  fab.element.setAttribute('aria-label', editing ? 'Save changes' : 'Add');
});

save.on('start', () => fab.lower().disable());
save.on('done', () => fab.raise().enable());
```

## Accessibility

- A FAB has no visible text, so `ariaLabel` is doing all the work. It falls back
  to the literal string `"action"` when an icon is set and no label is given —
  useless to a screen reader, so always pass one.
- The element is a real `<button>`: Tab reaches it, Space and Enter activate it,
  and `disabled` removes it from the tab order.
- Focus shows as a 2dp `outline` ring offset 2dp from the edge, so it stays
  visible against the FAB's own colour.
- Update the label whenever you change the icon. The icon and the accessible
  name have to keep saying the same thing.
- A fixed FAB sits above the content, so leave room at the bottom of scrollable
  views for it not to cover the last item.

## Styling

```css
.mtrl-fab { }
.mtrl-fab--primary { }
.mtrl-fab--secondary { }
.mtrl-fab--tertiary { }
.mtrl-fab--surface { }
.mtrl-fab--small { }
.mtrl-fab--default { }
.mtrl-fab--large { }
.mtrl-fab--lowered { }
.mtrl-fab--disabled { }
.mtrl-fab--animate-enter { }

/* the corners */
.mtrl-fab--top-left { }
.mtrl-fab--top-right { }
.mtrl-fab--bottom-left { }
.mtrl-fab--bottom-right { }

/* the icon inside */
.mtrl-fab-icon { }
```

Colours are theme colours, not component properties: `primary-container` on
`on-primary-container` for the primary variant, the equivalent pair for
secondary and tertiary, and `surface` with a `primary` icon for the surface
variant. Restyle the theme and every FAB follows.

## Measurements

Neither `_fab.scss` nor the component's TypeScript names an M3 token for these
values, so the source column points at the declaration instead of at a token.

| Attribute | Value | Source |
|-----------|-------|--------|
| Container, default | 56dp | commented "Default FAB size (56dp)" in `_fab.scss` |
| Container, small | 40dp | `_fab.scss`; `FAB_SIZES.SMALL` documents the same 40px |
| Container, large | 96dp | `_fab.scss`; `FAB_SIZES.LARGE` documents the same 96px |
| Corner, default | `get-shape('large')`, 16dp | `_fab.scss` |
| Corner, small | `get-shape('medium')`, 12dp | `_fab.scss` |
| Corner, large | `get-shape('extra-large')`, 28dp | `_fab.scss` |
| Icon, default and small | 24dp | `_fab.scss` |
| Icon, large | 36dp | `_fab.scss` |
| Resting elevation | level 2 | `elevation(2)` in `_fab.scss` |
| Pressed and lowered elevation | level 1 | `elevation(1)` in `_fab.scss` |
| Offset from the corner | 16dp | the position rules in `_fab.scss` |
| Entrance animation | 0.3s, emphasized decelerate | the `fab-enter` keyframes in `_fab.scss` |

`FAB_ICON_SIZES` in `constants.ts` lists 20, 24 and 36px, but nothing reads it;
the stylesheet is what ships, and it gives the small FAB a 24dp icon.
