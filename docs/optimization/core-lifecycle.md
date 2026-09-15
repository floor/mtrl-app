# Core lifecycle and setup optimization

## Status and scope

This records the first core optimization pass, merged into `mtrl` main on 13 September 2026 and released in `0.8.0-next.44`.

- Baseline: `d71b671`, release `0.8.0-next.43`.
- Implementation: `31d9184` — `fix(core): own component cleanup and reduce setup overhead`.
- Merge: `62793a0` — `Merge core lifecycle fixes and setup optimizations`.
- Released in `0.8.0-next.44`, published to npm under `next`. `0.8.0-next.43` and earlier do not include them.
- No DatePicker component files were changed. Shared core changes still require regression testing across consumers.

The primary result is reliable destruction of shared resources. Bundle savings are modest, and the measurements do not establish a general runtime speedup.

## Why the shared core matters

Most components use a pipeline of configuration, base creation, events, element creation, feature enhancers, lifecycle, and a public API. The audit found imports of `createBase` across 37 component directories and `withElement` across 36. Improvements to this path affect many components, but extra machinery in the same path also has a broad cost.

The emitter, store, and `pipe` were not rewritten. They are small, and the audit did not establish them as the main performance bottlenecks.

## Lifecycle and event fixes

### Shared resource ownership

`src/core/compose/cleanup.ts` introduces a cleanup scope shared by composition stages through `component.resources`. It is created when a participating feature first needs it, rather than for every bare base object.

A scope runs its registered cleanup callbacks once, drops those callbacks, and immediately cleans up resources registered after destruction. It continues draining callbacks if one throws, then rethrows the first failure. Custom bases with an existing lifecycle can also be integrated.

The participating element, event, ripple, debounce, throttle, and lifecycle features use this ownership mechanism. It removes their dependency on whether lifecycle was installed before or after the feature. It does not automatically manage arbitrary listeners or timers created elsewhere: their owner must still register cleanup.

The scope is an internal composition mechanism, not a new documented package-root API. Application code should continue to call the component's public `destroy()` method.

### Ripple retention and animation

Before the fix, pressing and destroying five real buttons left five document `mouseup` listeners and five `mouseleave` listeners. A later mouse-up released them. The button pipeline installed ripple before lifecycle existed, so ripple's conditional lifecycle hook was never connected.

The shared ripple controller now:

- Owns each mounted element's waves, release listeners, and removal timers independently.
- Ignores repeated mounts and cleans up safely on repeated unmounts.
- Removes document listeners and cancels pending removal timers during destruction.
- Uses a CSS growth animation instead of an `offsetHeight` read followed by `requestAnimationFrame`.
- Respects reduced motion through CSS.

This removes the forced-layout animation start, not every geometry or style read. Ripple still reads the element's bounds to position a wave and checks positioning when mounted. Release cleanup retains a tracked timeout.

### Event managers and delayed handlers

`src/core/dom/events.ts` now identifies registrations by function identity, event type, and capture mode. Previously, stringifying a callback could make distinct closures collide. Capture listeners are also removed correctly. `off(event, handler)` removes both capture variants.

`src/core/state/events.ts` now tracks every event registered with the same callback, so destruction no longer loses earlier registrations. Its legacy `getHandlers()` snapshot still has the original map shape; it cannot represent multiple events for one callback.

Component event subscribers are cleared on destruction, including components that never mounted. The enhanced DOM-event feature also joins the cleanup scope.

`debounce` and `throttle` return callable functions with an additional `cancel()` method. Their composition features cancel pending work when a handler is removed or the component is destroyed. Debounce also clears an existing timer before replacing it during `maxWait` rescheduling.

For manually attached delayed handlers, remove the listener and cancel its pending call:

```ts
import { debounce } from 'mtrl/core/utils';

const handleInput = debounce(() => {
  // Update application state.
}, 100);
input.addEventListener('input', handleInput);

// During the owning view's teardown:
input.removeEventListener('input', handleInput);
handleInput.cancel();
```

This example requires `0.8.0-next.44` or later.

## Setup optimizations

- Element pooling is initialized only when `createElementPooled` or `releaseElement` is called. Ordinary element consumers do not construct the pool.
- Element options are classified using a shared lookup rather than repeatedly scanning a reserved-key array.
- Touch handlers are allocated only for interactive elements on touch-capable devices. Existing tap/swipe behavior and the gesture API remain intact.
- The two prefix-independent class-name helpers are shared between instances.
- Disabled controls initialize synchronously rather than scheduling another animation frame.

A larger opt-in gesture API and a redesign of feature-object copying remain follow-up candidates. They were not implemented in this pass because they need compatibility decisions and stronger runtime measurements.

## Measured package impact

The following measurements compare production builds of the unchanged baseline and the merged implementation, using the packed-consumer checks in `scripts/check-package-size.ts`, Bun 1.4.2, and gzip level 9. Values are **bytes**, excluding CSS unless stated. A negative difference is a reduction.

| Consumer | Baseline | After | Difference |
| --- | ---: | ---: | ---: |
| `addClass` | 750 | 750 | 0 |
| Button, initial JS | 7,421 | 7,258 | -163 |
| Button, complete JS bundle | 13,657 | 13,492 | -165 |
| Textfield | 7,609 | 7,671 | +62 |
| Slider | 10,878 | 10,934 | +56 |
| NavigationRail | 6,345 | 6,381 | +36 |
| Form: button, checkbox, textfield | 18,384 | 18,238 | -146 |
| All JS exports | 113,170 | 113,205 | +35 |
| Full CSS | 47,117 | 47,137 | +20 |

These bundles overlap and must not be summed. The initial-button measurement accounts for lazy loading separately from the complete bundle.

The npm tarball increased from 684,004 to 684,835 bytes, while file count increased from 999 to 1,001. Smaller selected consumers do not imply a smaller complete package.

The existing full-CSS budget was 47,000 bytes, already below the unchanged `.43` baseline. It was adjusted to 47,500 bytes, with the baseline documented in the check. The core ripple change itself accounts for only 20 additional bytes in full CSS.

Exploratory Chromium timings showed slightly cheaper basic element creation but more expensive button creation/destruction after cleanup was corrected. These short local measurements are not evidence of a general speed improvement. Follow-up profiling should measure creation and destruction separately, interaction frame costs, and retained heap in a real application.

## Validation and remaining issue

Completed validation:

- Full suite: 1,238 passing tests, 72 skipped benchmark tests, no failures.
- Sixteen new lifecycle regression cases, run in an isolated fixture through a wrapper test. The wrapper counts as one test in the full-suite total.
- Type checking, production build, tooling types, packed imports, declarations, and size budgets.
- 128 full/selective consumer screenshot and computed-style comparisons, interactions, and lazy-loading checks.
- Chromium ripple animation, reduced motion, absence of the explicit `offsetHeight` read, and 40 pressed-button teardown cycles.
- Slider and drawer browser checks.

When this pass was validated, the NavigationRail browser check failed on a nine-pixel screenshot difference at a badge edge. The same mismatch reproduced on the unchanged `.43` baseline, and computed styles and element bounds matched. It was antialiasing, not a regression: `0.8.0-next.44` changed the check to render the full and selective stylesheets in one page and compare with a small tolerance, and it passes in CI.

The targeted resource tests establish listener and timer cleanup for the tested paths. They are not a replacement for the application's repeated mount/destroy heap reproduction.

Run validation from the `mtrl` repository:

```sh
bun test
bun run ts:check
bun run build
bun run tooling:check
bun run size:check
bun run consumer:check
bun run core:check
bun run slider:check
bun run drawer:check
bun run navigation-rail:check
```

All of these run in CI. `core:check` writes its screenshot artifact under `analysis/core`.

See also the [core overview](../core/core.md) and [composition guide](../core/composition/composition.md).
