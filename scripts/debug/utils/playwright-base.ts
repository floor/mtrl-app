// scripts/debug/utils/playwright-base.ts
//
// A small harness for looking at a component in a real browser: press keys and
// see where focus went, read computed styles, measure boxes, take a picture,
// and read the accessibility tree. It drives the Chrome already on the machine
// through playwright-core, so there is nothing to download.
//
// It exists because the questions that come up when working on a component are
// nearly always the same ones:
//
//   "where does focus go when I press this?"      -> keys() / focusTrail()
//   "is that padding really 12dp?"                -> styles()
//   "does this actually paint like that?"         -> shot()
//   "what does a screen reader see?"              -> a11y()
//   "did anything throw?"                         -> errors()

import { chromium } from "playwright-core";
import type { Browser, Page, ConsoleMessage } from "playwright-core";
import { mkdir } from "fs/promises";
import { join } from "path";

export interface DebugOptions {
  /** Where the app is served (default http://localhost:4000) */
  baseUrl?: string;
  /** Watch the browser work (default false) */
  headed?: boolean;
  /** Viewport, default 1280x900 */
  width?: number;
  height?: number;
  /** Device pixel ratio. 1 is the honest one; 2 matches a retina screen */
  scale?: number;
  /** 'light' or 'dark'; the app's own toggle is used, not just the media query */
  theme?: "light" | "dark";
  /** Where screenshots go (default .debug/ under the project) */
  outDir?: string;
  /** Slow every action down by this many ms, to watch what happens */
  slowMo?: number;
  /**
   * How long to wait, at minimum, for the page to react to a key or a click
   * before deciding nothing more is going to happen. The default clears the
   * transition-length timers components use to move focus.
   */
  settle?: number;
}

/** Where focus is, in terms a person can read */
export interface FocusInfo {
  /** The element's own description: an item's text, or its class */
  what: string;
  /** Which surface it is in: 'root menu', 'submenu level 2', 'page', ... */
  where: string;
  /** The tag and classes, for when the description is not enough */
  detail: string;
  /** Whether the browser would show a focus ring for it */
  visible: boolean;
}

const DESCRIBE = `(() => {
  const a = document.activeElement;
  if (!a || a === document.body) {
    return { what: 'nothing (body)', where: 'page', detail: 'body', visible: false };
  }
  const text = (a.textContent || '').trim().replace(/\\s+/g, ' ').slice(0, 40);
  const cls = typeof a.className === 'string' ? a.className : '';
  // Name the surface the focused thing sits in
  let where = 'page';
  const menu = a.closest && a.closest('.mtrl-menu');
  const dialog = a.closest && a.closest('.mtrl-dialog');
  if (menu) {
    where = menu.classList.contains('mtrl-menu--submenu')
      ? 'submenu level ' + (menu.getAttribute('data-level') || '?')
      : 'root menu';
  } else if (dialog) {
    where = 'dialog';
  }
  let visible = false;
  try { visible = a.matches(':focus-visible'); } catch (e) { visible = false; }
  return {
    what: text || cls || a.tagName.toLowerCase(),
    where,
    detail: a.tagName.toLowerCase() + (cls ? '.' + cls.split(' ').join('.') : ''),
    visible,
  };
})()`;

/**
 * What the page looks like right now, in one string: where focus is, and which
 * overlay surfaces are open. Comparing this between polls is how the harness
 * tells "nothing is happening" from "something is still happening".
 */
const FINGERPRINT = `(() => {
  const focus = ${DESCRIBE};
  const surfaces = Array.from(
    document.querySelectorAll('.mtrl-menu, .mtrl-dialog, .mtrl-snackbar, .mtrl-tooltip, [role="menu"], [role="dialog"]')
  ).map((el) => {
    const r = el.getBoundingClientRect();
    return el.className + ':' + Math.round(r.width) + 'x' + Math.round(r.height) +
           '@' + Math.round(r.x) + ',' + Math.round(r.y);
  });
  return JSON.stringify({ focus, surfaces });
})()`;

export class ComponentDebugger {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private problems: string[] = [];
  private shots = 0;
  private readonly options: Required<DebugOptions>;

  constructor(options: DebugOptions = {}) {
    this.options = {
      baseUrl: options.baseUrl ?? "http://localhost:4000",
      headed: options.headed ?? false,
      width: options.width ?? 1280,
      height: options.height ?? 900,
      scale: options.scale ?? 1,
      theme: options.theme ?? "dark",
      outDir: options.outDir ?? join(process.cwd(), ".debug"),
      slowMo: options.slowMo ?? 0,
      settle: options.settle ?? 400,
    };
  }

  /**
   * Opens a route and waits for it to settle. `route` is what follows the
   * base URL, with or without a leading slash: 'components/menus'.
   */
  async open(route: string): Promise<this> {
    this.browser = await chromium.launch({
      channel: "chrome",
      headless: !this.options.headed,
      slowMo: this.options.slowMo,
    });

    const context = await this.browser.newContext({
      viewport: { width: this.options.width, height: this.options.height },
      deviceScaleFactor: this.options.scale,
      colorScheme: this.options.theme,
      reducedMotion: "no-preference",
    });

    this.page = await context.newPage();

    // Anything that throws or is logged as an error is worth knowing about
    this.page.on("pageerror", (error) => this.problems.push(`pageerror: ${error.message}`));
    this.page.on("console", (message: ConsoleMessage) => {
      if (message.type() === "error") this.problems.push(`console: ${message.text()}`);
    });

    const url = `${this.options.baseUrl}/${route.replace(/^\//, "")}`;
    await this.page.goto(url, { waitUntil: "networkidle", timeout: 30000 });

    // The app has its own theme switch; the media query alone is not enough
    await this.page.evaluate((theme) => {
      document.documentElement.setAttribute("data-theme-mode", theme);
      document.body.setAttribute("data-theme-mode", theme);
    }, this.options.theme);

    await this.page.waitForTimeout(400);
    return this;
  }

  /** The page, for anything this harness does not cover */
  get raw(): Page {
    if (!this.page) throw new Error("open() first");
    return this.page;
  }

  /**
   * Clicks the thing with this text, preferring something you can actually
   * click.
   *
   * Showcases label a section and its trigger with nearly the same words, so an
   * exact text match happily clicks the heading and then nothing happens. A
   * button, link or anything with a button role wins over plain text, and a
   * containing match wins over nothing, so `click('Basic Dialog')` opens the
   * dialog rather than selecting its title.
   */
  async click(text: string): Promise<this> {
    const clickable = this.raw
      .locator('button, a, [role="button"], [role="menuitem"], [role="tab"], input, label')
      .filter({ hasText: text })
      .first();

    if ((await clickable.count()) > 0) await clickable.click();
    else await this.raw.getByText(text, { exact: false }).first().click();

    await this.settled();
    return this;
  }

  /** Clicks whatever a selector matches */
  async clickSelector(selector: string): Promise<this> {
    await this.raw.locator(selector).first().click();
    await this.settled();
    return this;
  }

  /** Where focus is right now */
  async focus(): Promise<FocusInfo> {
    return (await this.raw.evaluate(DESCRIBE)) as FocusInfo;
  }

  /**
   * Waits for the page to stop reacting, then reports where focus is.
   *
   * Two things make a fixed sleep the wrong tool here. Too short and it reads a
   * half-finished state, so a working component looks broken; too long and
   * every run crawls. Worse, components commonly move focus on a timer matched
   * to their transition, and a sleep set to the same number lands on the
   * boundary and gives a different answer each run.
   *
   * So this polls a fingerprint of focus plus the open surfaces, and calls it
   * settled only once that has held still. `minWait` is the floor, because a
   * reaction that has not started yet looks exactly like one that has finished.
   * Raise it for a component with a slower transition than the default.
   */
  async settled(minWait = this.options.settle, timeout = 3000): Promise<FocusInfo> {
    const started = Date.now();
    let previous = "";
    let same = 0;

    while (Date.now() - started < timeout) {
      await this.raw.waitForTimeout(50);
      const current = (await this.raw.evaluate(FINGERPRINT)) as string;

      if (current === previous) same++;
      else {
        same = 0;
        previous = current;
      }

      // Steady for two polls, and past the floor
      if (same >= 2 && Date.now() - started >= minWait) break;
    }

    return JSON.parse(previous).focus as FocusInfo;
  }

  /** Where focus is once the page has stopped reacting */
  async settledFocus(minWait?: number): Promise<FocusInfo> {
    return this.settled(minWait);
  }

  /**
   * Presses keys one at a time and reports where focus landed after each. This
   * is the thing to reach for when a keyboard journey misbehaves: it prints a
   * trail you can compare against what the spec says should happen.
   */
  async keys(...keys: string[]): Promise<FocusInfo[]> {
    const trail: FocusInfo[] = [];
    for (const key of keys) {
      await this.raw.keyboard.press(key);
      trail.push(await this.settledFocus());
    }
    return trail;
  }

  /** Presses keys and prints the trail as it goes */
  async walk(...keys: string[]): Promise<FocusInfo[]> {
    const start = await this.focus();
    console.log(`  ${"(start)".padEnd(12)} -> ${format(start)}`);
    const trail: FocusInfo[] = [];
    for (const key of keys) {
      await this.raw.keyboard.press(key);
      const info = await this.settledFocus();
      trail.push(info);
      console.log(`  ${key.padEnd(12)} -> ${format(info)}`);
    }
    return trail;
  }

  /** Computed styles of the first match, for the properties asked for */
  async styles(selector: string, properties: string[]): Promise<Record<string, string>> {
    return await this.raw.evaluate(
      ({ selector, properties }) => {
        const element = document.querySelector(selector);
        if (!element) return { error: `no match for ${selector}` };
        const computed = getComputedStyle(element);
        const out: Record<string, string> = {};
        for (const property of properties) out[property] = computed.getPropertyValue(property);
        return out;
      },
      { selector, properties }
    );
  }

  /** Position and size of the first match, rounded to whole pixels */
  async box(selector: string): Promise<Record<string, number> | null> {
    return await this.raw.evaluate((selector) => {
      const element = document.querySelector(selector);
      if (!element) return null;
      const rect = element.getBoundingClientRect();
      return {
        x: Math.round(rect.x),
        y: Math.round(rect.y),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
      };
    }, selector);
  }

  /**
   * The corner radii the browser actually paints.
   *
   * `getComputedStyle` reports what the stylesheet asked for, which is not
   * always what you see. When the radii along any side add up to more than that
   * side, CSS scales *every* corner of the box down by the same factor, so a
   * pill radius next to a small one flattens the small one to nothing. The
   * computed value still cheerfully reports the number you wrote. This does the
   * scaling arithmetic and reports both, so a square corner cannot hide behind
   * a plausible-looking number again.
   */
  async radii(selector: string): Promise<{
    asked: Record<string, string>;
    painted: Record<string, string>;
    scale: number;
  } | null> {
    return await this.raw.evaluate((selector) => {
      const element = document.querySelector(selector);
      if (!element) return null;

      const computed = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      const corners = ["top-left", "top-right", "bottom-right", "bottom-left"];

      // Each corner is a horizontal and a vertical radius
      const pair = (corner: string): [number, number] => {
        const raw = computed.getPropertyValue(`border-${corner}-radius`).trim();
        const parts = raw.split(/\s+/);
        const px = (v: string): number =>
          v.endsWith("%")
            ? (parseFloat(v) / 100) * (corner.includes("left") || corner.includes("right") ? rect.width : rect.height)
            : parseFloat(v) || 0;
        return [px(parts[0] ?? "0"), px(parts[1] ?? parts[0] ?? "0")];
      };

      const [tl, tr, br, bl] = corners.map(pair);

      // CSS scales all corners by the tightest side, never just the one
      const ratios = [
        rect.width / (tl[0] + tr[0]),
        rect.height / (tr[1] + br[1]),
        rect.width / (br[0] + bl[0]),
        rect.height / (bl[1] + tl[1]),
      ].filter((r) => Number.isFinite(r));
      const scale = Math.min(1, ...ratios);

      const asked: Record<string, string> = {};
      const painted: Record<string, string> = {};
      corners.forEach((corner, i) => {
        const [h, v] = [tl, tr, br, bl][i];
        const round = (n: number) => Math.round(n * 100) / 100;
        asked[corner] = h === v ? `${round(h)}px` : `${round(h)}px ${round(v)}px`;
        painted[corner] =
          h === v ? `${round(h * scale)}px` : `${round(h * scale)}px ${round(v * scale)}px`;
      });

      return { asked, painted, scale: Math.round(scale * 10000) / 10000 };
    }, selector);
  }

  /** How many of these are on the page */
  async count(selector: string): Promise<number> {
    return await this.raw.locator(selector).count();
  }

  /**
   * A picture. With a selector it shoots that element, scrolled into view and
   * with a little room around it; without one it shoots the viewport.
   *
   * Playwright waits for the page to stop changing first, which is what makes
   * this trustworthy: a screenshot taken mid-transition can show a stale layer
   * and send you chasing a rendering bug that is not there.
   */
  async shot(name: string, selector?: string, padding = 12): Promise<string> {
    await mkdir(this.options.outDir, { recursive: true });
    const file = join(this.options.outDir, `${String(++this.shots).padStart(2, "0")}-${name}.png`);

    if (selector) {
      const box = await this.box(selector);
      if (!box) throw new Error(`no match for ${selector}`);
      await this.raw.screenshot({
        path: file,
        clip: {
          x: Math.max(0, box.x - padding),
          y: Math.max(0, box.y - padding),
          width: box.width + padding * 2,
          height: box.height + padding * 2,
        },
      });
    } else {
      await this.raw.screenshot({ path: file });
    }
    return file;
  }

  /**
   * What assistive technology sees. Names, roles and states, which is the
   * quickest way to check that a component says what it should.
   */
  async a11y(selector?: string): Promise<unknown> {
    const root = selector ? await this.raw.locator(selector).first().elementHandle() : undefined;
    return await this.raw.accessibility.snapshot({ root: root ?? undefined, interestingOnly: true });
  }

  /** Attributes of the first match, for checking ARIA wiring */
  async attributes(selector: string, names: string[]): Promise<Record<string, string | null>> {
    return await this.raw.evaluate(
      ({ selector, names }) => {
        const element = document.querySelector(selector);
        if (!element) return { error: `no match for ${selector}` } as Record<string, string | null>;
        const out: Record<string, string | null> = {};
        for (const name of names) out[name] = element.getAttribute(name);
        return out;
      },
      { selector, names }
    );
  }

  /** Everything that threw or was logged as an error since the page opened */
  errors(): string[] {
    return [...this.problems];
  }

  /** Prints the errors, or says there were none */
  reportErrors(): void {
    if (this.problems.length === 0) {
      console.log("  no console or page errors");
      return;
    }
    console.log(`  ${this.problems.length} problem(s):`);
    for (const problem of this.problems) console.log(`    ${problem}`);
  }

  async close(): Promise<void> {
    await this.browser?.close();
    this.browser = null;
    this.page = null;
  }
}

/** One line describing where focus is */
export const format = (info: FocusInfo): string =>
  `${info.where.padEnd(18)} ${info.what}${info.visible ? "" : "   (no focus ring)"}`;

/**
 * Opens a route and hands back the debugger, ready to use.
 *
 * ```ts
 * const page = await debugComponent('components/menus');
 * await page.click('Position');
 * await page.walk('ArrowDown', 'ArrowDown', 'ArrowRight');
 * page.reportErrors();
 * await page.close();
 * ```
 */
export const debugComponent = async (
  route: string,
  options: DebugOptions = {}
): Promise<ComponentDebugger> => {
  const instance = new ComponentDebugger(options);
  await instance.open(route);
  return instance;
};
