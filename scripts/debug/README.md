# Component debugging

Look at any mtrl component in a real browser, from the command line.

```bash
bun run debug menus --click Position --keys ArrowDown,ArrowDown,ArrowRight
```

```
/components/menus  (dark)

clicked "Position"

focus:
  (start)      -> root menu          ExecutiveEngineeringMarketing   (no focus ring)
  ArrowDown    -> root menu          Executive
  ArrowDown    -> root menu          Engineering
  ArrowRight   -> submenu level 1    Software

  no console or page errors
```

It drives the Chrome already installed on the machine through `playwright-core`,
so there is no browser to download and nothing to keep in sync. The app must be
running on `http://localhost:4000`.

## Why this exists

The questions that come up while working on a component are nearly always the
same handful, and each one is tedious to answer by hand:

| Question | Flag |
|---|---|
| Where does focus go when I press this? | `--keys` |
| Is that padding really 12dp? | `--styles` |
| What does the corner radius actually paint as? | `--radius` |
| Does it look like that? | `--shot` |
| What does a screen reader see? | `--a11y`, `--attrs` |
| Did anything throw? | reported on every run |

Answering them in a browser means opening devtools, clicking through to the
right state and reading numbers off a panel, which is slow and easy to get
wrong. Answering them here takes one line and leaves a transcript you can paste
into a bug report or a commit message.

## Usage

```bash
bun run debug <component> [options]
bun run debug --list          # every component route
bun run debug --all           # open every component, report anything that throws
bun run debug                 # usage, and the list
```

The component can be a name or a full route. Names are matched against the
app's own sitemap, so the list can never drift from what is actually served:

```bash
bun run debug menus            # -> /components/menus
bun run debug split-button     # -> /components/buttons/split-button
bun run debug progress         # -> /components/loading/progress
```

An ambiguous name is reported rather than guessed at.

### Options

| Option | What it does |
|---|---|
| `--click <text>` | Click something by its text. Repeatable |
| `--keys <a,b,c>` | Press these keys in order and print where focus goes |
| `--styles <selector>` | Computed styles, plus the element's box |
| `--props <a,b,c>` | Which properties `--styles` prints |
| `--radius <selector>` | Corner radii, asked for and painted. Repeatable |
| `--attrs <selector>` | Attributes, ARIA ones by default |
| `--names <a,b,c>` | Which attributes `--attrs` prints |
| `--a11y <selector>` | The accessibility tree for that element |
| `--shot <selector>` | Screenshot, saved under `.debug/`. Repeatable |
| `--theme light\|dark` | Colour scheme, dark by default |
| `--headed` | Watch it happen in a real window |
| `--slow <ms>` | Slow every action down, to follow along |
| `--settle <ms>` | Minimum wait for the page to react, 400 by default |
| `--scale <n>` | Device pixel ratio |
| `--all` | Open every component in turn; a smoke test for the whole library |

### Examples

Keyboard navigation through a menu and its submenus:

```bash
bun run debug menus --click Position \
  --keys ArrowDown,ArrowDown,ArrowRight,ArrowRight,ArrowDown,ArrowLeft,ArrowLeft
```

A dialog's focus trap and its ARIA wiring:

```bash
bun run debug dialogs --click "Basic Dialog" --keys Tab,Tab,Tab --attrs .mtrl-dialog
```

Whether the split button's corners survive the browser:

```bash
bun run debug split-button \
  --radius .mtrl-split-button__leading --radius .mtrl-split-button__trailing
```

Measuring a component against the spec:

```bash
bun run debug menus --click Position --styles .mtrl-menu-item \
  --props min-height,padding,font-size,color
```

## Three things it knows that devtools does not

**A computed radius is not a painted radius.** When the radii along any side of
a box add up to more than that side, CSS scales *every* corner down by the same
factor. A pill radius beside a small one flattens the small one to nothing,
while `getComputedStyle` keeps reporting the number the stylesheet asked for.
This cost a round trip on the split button, where four corners rendered square
and the computed value read a perfectly reasonable `4px`. `--radius` does the
scaling arithmetic and prints both numbers, so the lie cannot survive.

**A fixed wait is a coin flip.** Components move focus on timers matched to
their own transitions; the menu focuses a submenu's first item 300ms after the
key. A harness that waits 300ms lands exactly on that boundary and reports a
different answer each run, and one that waits 200ms reports that the key did
nothing. So nothing here sleeps for a fixed time. After every key and click it
polls a fingerprint of focus plus the open surfaces until that holds still, with
a floor of 400ms because a reaction that has not started yet is
indistinguishable from one that has finished. Raise the floor with `--settle`
for a component with a slower transition.

**A screenshot can be stale.** Headless Chrome can hand back a compositing layer
that no longer matches the DOM, which once sent a menu "truncation" bug on a
long chase that ended with the layout having been correct the whole time. When a
picture and a measurement disagree, the measurement is right. Reach for
`--styles` and `--radius` first, and treat `--shot` as illustration.

## Writing a one-off script

The CLI covers the common questions. For anything else, the harness is a small
class:

```ts
import { ComponentDebugger } from "./utils/playwright-base";

const page = new ComponentDebugger({ theme: "dark" });
await page.open("/components/menus");

await page.click("Position");
await page.walk("ArrowDown", "ArrowRight");   // prints the focus trail

console.log(await page.styles(".mtrl-menu", ["padding", "border-radius"]));
console.log(await page.radii(".mtrl-menu-item"));
console.log(await page.box(".mtrl-menu"));
console.log(await page.count(".mtrl-menu-item"));

await page.shot("menu-open", ".mtrl-menu");
page.reportErrors();
await page.close();
```

| Method | Returns |
|---|---|
| `open(route)` | Loads it and waits for the page to settle |
| `click(text)` / `clickSelector(sel)` | Clicks, preferring something clickable |
| `focus()` / `settledFocus()` | Where focus is, now or once things stop moving |
| `keys(...)` / `walk(...)` | Presses keys; `walk` prints the trail as it goes |
| `styles(sel, props)` | Computed styles |
| `radii(sel)` | Corner radii, asked for and painted |
| `box(sel)` | Position and size, rounded to whole pixels |
| `count(sel)` | How many match |
| `attributes(sel, names)` | Attributes, for checking ARIA wiring |
| `a11y(sel?)` | The accessibility tree |
| `shot(name, sel?)` | A picture, saved under `.debug/` |
| `errors()` / `reportErrors()` | Anything that threw or logged an error |

`page.raw` is the Playwright `Page` for anything not covered here.

Anything thrown on the page, and anything logged as an error, is collected from
the moment it opens and reported at the end of every run. A component that is
quietly failing says so rather than merely looking odd.

## Saving a run

A journey worth repeating goes in `package.json` next to `debug`:

```json
"debug:menu": "bun run scripts/debug/component.ts components/menus --click Position --keys ArrowDown,ArrowDown,ArrowRight,ArrowRight,ArrowDown,ArrowLeft,ArrowLeft"
```

## Files

| File | What it is |
|---|---|
| `component.ts` | The CLI |
| `utils/playwright-base.ts` | The `ComponentDebugger` harness |
| `routes.ts` | Route lookup, read from the app's sitemap |

Screenshots land in `.debug/`, which is not committed.
