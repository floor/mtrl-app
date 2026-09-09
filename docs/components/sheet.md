# Sheet Component

> **Deprecated since 0.8.0.** Use [bottom sheet](bottom-sheet.md) for a sheet
> anchored to the bottom edge, or [side sheet](side-sheet.md) for one docked to
> a vertical edge. Those two follow the M3 bottom sheet and side sheet
> specifications, which this component predates and does not match, and they
> work. This one does not: see Status below. It is kept only so existing
> imports keep resolving, and it will be removed.

A sheet is a surface that slides in from an edge of the screen and holds content that supplements the page — a set of filters, a share list, the details of a row, a short form. It sits between a [dialog](dialog.md), which blocks until it is answered, and a panel in the layout, which is always there. Reach for it when the content is secondary but substantial, and when the page behind it should stay visible.

## Status

**The sheet does not open in the current build.** `open()`, `close()` and the drag gestures all reach `component.events.emit(...)`, but the sheet is composed with the event feature that provides `emit` directly and no `events` object, so the call throws `TypeError: undefined is not an object (evaluating 'component.events.emit')`. The `--open` class is added first, so a sheet that is opened inside a `try` does appear — but the `open` and `close` events never fire, `onOpen` and `onClose` are never called, and any code after `sheet.open()` is skipped.

Two consequences follow, and both are described in place below: the scrim is never inserted into the page, and `maxHeight` is accepted but never applied. Everything on this page is written against the build as it is, not as it was meant to be.

None of this will be fixed here. The replacements were written against the specification rather than patched onto this one, so the migration is a rename plus a look at the configuration table in the new page: `createBottomSheet` keeps `title`, `content`, `variant` and the close-behaviour options, and adds a drag handle and the partial and expanded heights. `createSideSheet` keeps the same names and adds `position`, which is logical rather than physical, so a sheet docked to the end follows the writing direction.

## Overview

A sheet is defined by two choices:

- **Where it comes from** — `bottom` (the usual one, and the default), `top`, `left` or `right`.
- **How much it takes** — `standard` sits over the page with light elevation, `modal` puts a scrim behind it and blocks what is underneath, `expanded` fills the screen.

A sheet is draggable from any of the four edges, not only the bottom: the gesture tracks the axis its position implies, and a drag past 30% of the sheet's height or width dismisses it. It gets a handle above its title, and when there is no handle the whole surface is the drag target.

Escape and the animation the component does for itself. The scrim it does not: see the note under Basic Usage.

## Import

```javascript
import { createSheet } from 'mtrl';
```

## Basic Usage

```javascript
const sheet = createSheet({
  title: 'Share',
  content: '<ul class="share-targets">…</ul>',
  variant: 'modal',
  position: 'bottom'
});

document.body.appendChild(sheet.element);
sheet.open(); // throws; see Status
```

**The scrim is never in the page.** The sheet builds a scrim element and tries to insert it as its own next sibling, but it does that while the sheet element is still detached, so there is nowhere to insert it; the `initialize()` pass that is meant to catch this compares two nulls and finds nothing to do. A `modal` sheet therefore has no overlay, and nothing dismisses it by a click outside. Supply your own overlay, or keep a close control inside the sheet.

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `variant` | `'standard' \| 'modal' \| 'expanded'` | `'standard'` | How much of the page it takes |
| `position` | `'bottom' \| 'top' \| 'left' \| 'right'` | `'bottom'` | The edge it comes from |
| `open` | `boolean` | `false` | Whether it starts open |
| `dismissible` | `boolean` | `true` | Whether Escape closes it. It also gates the scrim click, but the scrim is never in the page |
| `dragHandle` | `boolean` | `true` | Show the grab handle above the title |
| `enableGestures` | `boolean` | `true` | Drag and swipe-to-dismiss |
| `title` | `string` | `undefined` | Title line at the top of the sheet |
| `content` | `string` | `undefined` | Body, as an HTML string |
| `elevation` | `number` | `3` | Elevation level, 1 to 5 |
| `maxHeight` | `string` | `undefined` | **Accepted but not applied.** Nothing reads it at creation; call `setMaxHeight('80%')` after creating the sheet |
| `class` | `string` | `undefined` | Extra CSS classes |
| `prefix` | `string` | `'mtrl'` | Class-name prefix |
| `componentName` | `string` | `'sheet'` | Component name used in class generation |
| `onOpen` | `() => void` | `undefined` | Meant to be called when it opens; never reached, because `open()` throws first |
| `onClose` | `() => void` | `undefined` | Meant to be called when it closes; never reached, because `close()` throws first |

The drag handle is only built when there is a `title` or `dragHandle` is on, because the handle is inserted ahead of the title in the same header area.

## Component API

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `open()` | — | `SheetComponent` | Adds `--open`, then throws before it can emit; see Status |
| `close()` | — | `SheetComponent` | Removes `--open`, then throws before it can emit; see Status |
| `setContent(html)` | `html: string` | `SheetComponent` | Replaces the body |
| `getContent()` | — | `string` | The body's HTML |
| `setTitle(text)` | `text: string` | `SheetComponent` | Replaces the title |
| `getTitle()` | — | `string` | The current title |
| `setDragHandle(enabled)` | `enabled: boolean` | `SheetComponent` | Shows or hides the handle |
| `setMaxHeight(height)` | `height: string` | `SheetComponent` | Caps the container's height. The only way to apply a max height — the config option is inert |
| `on(event, handler)` | `event: string, handler` | `SheetComponent` | Adds a listener |
| `off(event, handler)` | `event: string, handler` | `SheetComponent` | Removes one |
| `addClass(...classes)` | `classes: string[]` | `SheetComponent` | Adds classes to the root |
| `getClass(name)` | `name: string` | `string` | A class name with the component prefix |
| `destroy()` | — | `void` | Tears it down and releases its listeners |

| Property | Type | Description |
|----------|------|-------------|
| `element` | `HTMLElement` | The sheet surface |
| `container` | `HTMLElement` | The inner container holding handle, title and content |
| `content` | `ContentAPI` | `setContent` / `getContent` / `getElement` |
| `title` | `TitleAPI` | `setTitle` / `getTitle` / `getElement` |
| `state` | `{ open, close, isOpen }` | The open state, including `isOpen()` |
| `lifecycle` | `{ destroy() }` | Lifecycle handle |

`isOpen()` lives on `state`, not on the component: read it as `sheet.state.isOpen()`.

## Events

**None of these are emitted in the current build.** Each is raised through `component.events.emit`, which is the call that throws — so the event is not delivered and the code that would have raised it does not finish. `on()` and `off()` themselves work; there is simply nothing to hear. They are listed because they are what the component intends to emit.

| Event | Payload | Description |
|-------|---------|-------------|
| `open` | — | The sheet opened |
| `close` | — | The sheet closed, however it was dismissed |
| `dragstart` | — | A drag gesture began |
| `dragend` | — | A drag gesture ended, whether or not it dismissed the sheet |

```javascript
sheet.on('close', () => resetFilters()); // never called; see Status
```

## Examples

### A modal bottom sheet

The common case: a scrim behind, a drag handle above the title, dismissed by the scrim, Escape or a swipe down.

```javascript
const filters = createSheet({
  variant: 'modal',
  position: 'bottom',
  title: 'Filters',
  content: renderFilters()
});

document.body.appendChild(filters.element);
filters.setMaxHeight('80%'); // the config option is not applied

filterButton.addEventListener('click', () => filters.open());
```

`filters.on('close', …)` is what you would reach for to apply the filters as the sheet goes; it never fires today, so do the work in whatever closes the sheet instead.

### A side sheet that stays put

A `standard` sheet from the `right` edge, with the gestures off, behaves like a detail panel: it does not block the page and it is not swiped away. `enableGestures: false` is one of the options that does work — without it a right-edge sheet is draggable too.

```javascript
const details = createSheet({
  variant: 'standard',
  position: 'right',
  dismissible: false,
  enableGestures: false,
  dragHandle: false,
  title: 'Details'
});

document.body.appendChild(details.element);

table.addEventListener('click', (event) => {
  const row = event.target.closest('tr[data-id]');
  if (!row) return;
  details.setContent(renderRow(row.dataset.id)).open();
});
```

### Filling the screen

```javascript
const editor = createSheet({
  variant: 'expanded',
  position: 'bottom',
  title: 'Edit photo',
  content: renderEditor()
});
```

## Accessibility

- The element is `role="dialog"`, with `aria-modal="true"` for the `modal` variant and `"false"` otherwise.
- Escape closes the sheet while it is open and `dismissible` is on. The listener is on `document`, so it works wherever focus happens to be.
- Clicking the scrim does **not** close a `dismissible` sheet, because there is no scrim in the page. Escape is the only dismissal the component provides.
- The component does not label the sheet, move focus into it, or trap focus. A sheet with a `title` should be pointed at it — set `aria-labelledby` on `sheet.element` against the title element from `sheet.title.getElement()`, or give the element an `aria-label`. For a `modal` sheet, move focus in on `open` and back out on `close` yourself.
- The drag handle is decorative and not reachable by keyboard, so a sheet that can only be dismissed by dragging is not dismissible at all. Keep `dismissible` on, or give the sheet a close button of your own.

## Styling

```css
.mtrl-sheet { /* the surface */ }
.mtrl-sheet--open { /* while open */ }
.mtrl-sheet--standard,
.mtrl-sheet--modal,
.mtrl-sheet--expanded { /* variants */ }
.mtrl-sheet--bottom,
.mtrl-sheet--top,
.mtrl-sheet--left,
.mtrl-sheet--right { /* the edge it comes from */ }
.mtrl-sheet--elevation-1 … .mtrl-sheet--elevation-5 { /* elevation levels */ }
.mtrl-sheet--dismissible { /* set when the scrim closes it */ }

.mtrl-sheet-scrim { /* the overlay behind a modal sheet */ }
.mtrl-sheet-container { /* handle, title and content */ }
.mtrl-sheet-handle { /* the grab handle */ }
.mtrl-sheet-title { /* the title line */ }
.mtrl-sheet-content { /* the body */ }
```

## Best Practices

- Use `modal` when the sheet needs an answer before the page is useful again, and `standard` when it merely accompanies it.
- Cap the height. A bottom sheet that reaches the top of the window should have been `expanded`, or a page.
- Keep a way out that is not a gesture: Escape, or a button of your own. Dragging is an accelerator, never the only route, and the scrim is not available to you.
- One sheet at a time, and not on top of a dialog. Two stacked scrims tell the user nothing about which layer they are on.
- Put the primary action inside the sheet's content, at the bottom, where a thumb reaches it.

## TypeScript Support

```typescript
import { createSheet, SheetConfig, SheetComponent } from 'mtrl';

const config: SheetConfig = {
  variant: 'modal',
  position: 'bottom',
  title: 'Filters'
};

const sheet: SheetComponent = createSheet(config);
document.body.appendChild(sheet.element);
sheet.setMaxHeight('80%');

// `sheet.open()` throws before it emits; read the state directly instead
console.log(sheet.state.isOpen());
```
