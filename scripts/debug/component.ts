// scripts/debug/component.ts
//
// Look at a component in a real browser from the command line.
//
//   bun run debug menus --click Position --keys ArrowDown,ArrowRight
//   bun run debug split-button --shot .mtrl-split-button
//   bun run debug dialogs --click "Basic Dialog" --a11y .mtrl-dialog
//
// The route can be a component name; it is matched against the app's sitemap.
//
// Every run reports console and page errors at the end, so a broken showcase
// says so rather than looking merely odd.

import { ComponentDebugger, format } from "./utils/playwright-base";
import { componentRoutes, resolveRoute } from "./routes";

interface Args {
  route: string;
  click: string[];
  keys: string[];
  shot: string[];
  styles: string | null;
  properties: string[];
  attributes: string | null;
  names: string[];
  a11y: string | null;
  radius: string[];
  theme: "light" | "dark";
  headed: boolean;
  scale: number;
  slowMo: number;
  settle: number;
  list: boolean;
  all: boolean;
}

const usage = `
Look at a component in a real browser.

  bun run debug <component> [options]

The component can be a name ('menus', 'split-button') or a full route; names
are matched against the app's own sitemap.

Options
  --list                List every component route and stop
  --all                 Open every component in turn and report anything that
                        throws; a smoke test for the whole library
  --click <text>        Click something by its visible text; repeatable
  --keys <a,b,c>        Press these keys in order and print where focus goes
  --shot <selector>     Screenshot that element (or the page if no selector);
                        repeatable, saved under .debug/
  --styles <selector>   Print computed styles
  --props <a,b,c>       Which properties to print (default the layout ones)
  --attrs <selector>    Print attributes
  --names <a,b,c>       Which attributes (default the ARIA ones)
  --a11y <selector>     Print the accessibility tree for that element
  --radius <selector>   Corner radii, as asked for and as actually painted;
                        repeatable
  --theme light|dark    Colour scheme (default dark)
  --headed              Watch it happen
  --scale <n>           Device pixel ratio (default 1)
  --slow <ms>           Slow every action down, to follow along
  --settle <ms>         Minimum wait for the page to react (default 400)

Examples
  bun run debug menus --click Position --keys ArrowDown,ArrowDown,ArrowRight
  bun run debug split-button --shot .mtrl-split-button --styles .mtrl-split-button
  bun run debug dialogs --click "Basic Dialog" --a11y .mtrl-dialog
`;

const DEFAULT_PROPERTIES = [
  "width",
  "height",
  "padding",
  "margin",
  "border-radius",
  "background-color",
  "color",
  "font-size",
  "box-shadow",
];

const DEFAULT_ATTRIBUTES = [
  "role",
  "aria-label",
  "aria-labelledby",
  "aria-describedby",
  "aria-expanded",
  "aria-haspopup",
  "aria-modal",
  "aria-selected",
  "aria-disabled",
  "tabindex",
];

const parse = (argv: string[]): Args => {
  const args: Args = {
    route: "",
    click: [],
    keys: [],
    shot: [],
    styles: null,
    properties: DEFAULT_PROPERTIES,
    attributes: null,
    names: DEFAULT_ATTRIBUTES,
    a11y: null,
    radius: [],
    theme: "dark",
    headed: false,
    scale: 1,
    slowMo: 0,
    settle: 400,
    list: false,
    all: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    const next = () => argv[++i] ?? "";
    switch (arg) {
      case "--click": args.click.push(next()); break;
      case "--keys": args.keys = next().split(",").map((k) => k.trim()).filter(Boolean); break;
      case "--shot": args.shot.push(next()); break;
      case "--styles": args.styles = next(); break;
      case "--props": args.properties = next().split(",").map((p) => p.trim()); break;
      case "--attrs": args.attributes = next(); break;
      case "--names": args.names = next().split(",").map((n) => n.trim()); break;
      case "--a11y": args.a11y = next(); break;
      case "--radius": args.radius.push(next()); break;
      case "--theme": args.theme = next() === "light" ? "light" : "dark"; break;
      case "--headed": args.headed = true; break;
      case "--scale": args.scale = Number(next()) || 1; break;
      case "--slow": args.slowMo = Number(next()) || 0; break;
      case "--settle": args.settle = Number(next()) || 400; break;
      case "--list": args.list = true; break;
      case "--all": args.all = true; break;
      default:
        if (!arg.startsWith("--") && !args.route) args.route = arg;
    }
  }
  return args;
};

const main = async (): Promise<void> => {
  const args = parse(process.argv.slice(2));

  if (args.list) {
    console.log("\ncomponent routes:\n");
    for (const route of componentRoutes()) console.log(`  ${route}`);
    console.log("");
    return;
  }

  if (args.all) {
    // A smoke test: a component that throws on load should not need finding
    console.log("");
    let broken = 0;
    for (const route of componentRoutes()) {
      const sweep = new ComponentDebugger({ theme: args.theme });
      try {
        await sweep.open(route);
        const errors = sweep.errors();
        if (errors.length > 0) broken++;
        console.log(
          `  ${errors.length === 0 ? "ok  " : "FAIL"} ${route}` +
            (errors.length > 0 ? `\n         ${errors.join("\n         ")}` : "")
        );
      } catch (error) {
        broken++;
        console.log(`  ERR  ${route}  ${error instanceof Error ? error.message.split("\n")[0] : error}`);
      } finally {
        await sweep.close();
      }
    }
    console.log(`\n  ${broken === 0 ? "all clean" : `${broken} with problems`}\n`);
    return;
  }

  if (!args.route) {
    console.log(usage);
    console.log("Components\n");
    for (const route of componentRoutes()) console.log(`  ${route.replace("/components/", "")}`);
    console.log("");
    process.exit(1);
  }

  // A name is enough; the sitemap says what it means
  const route = resolveRoute(args.route);

  const page = new ComponentDebugger({
    theme: args.theme,
    headed: args.headed,
    scale: args.scale,
    slowMo: args.slowMo,
    settle: args.settle,
  });

  console.log(`\n${route}  (${args.theme})\n`);
  await page.open(route);

  for (const text of args.click) {
    await page.click(text);
    console.log(`clicked "${text}"`);
  }

  if (args.keys.length > 0) {
    console.log("\nfocus:");
    await page.walk(...args.keys);
  }

  if (args.styles) {
    const styles = await page.styles(args.styles, args.properties);
    console.log(`\nstyles of ${args.styles}:`);
    for (const [property, value] of Object.entries(styles)) {
      console.log(`  ${property.padEnd(18)} ${value}`);
    }
    const box = await page.box(args.styles);
    if (box) console.log(`  ${"box".padEnd(18)} ${box.width} x ${box.height} at ${box.x}, ${box.y}`);
  }

  if (args.attributes) {
    const attributes = await page.attributes(args.attributes, args.names);
    console.log(`\nattributes of ${args.attributes}:`);
    if ("error" in attributes) console.log(`  ${attributes.error}`);
    else
      for (const [name, value] of Object.entries(attributes)) {
        if (value !== null) console.log(`  ${name.padEnd(18)} ${value}`);
      }
  }

  for (const selector of args.radius) {
    const radii = await page.radii(selector);
    console.log(`\ncorner radii of ${selector}:`);
    if (!radii) {
      console.log("  no match");
      continue;
    }
    for (const corner of Object.keys(radii.asked)) {
      const same = radii.asked[corner] === radii.painted[corner];
      console.log(
        `  ${corner.padEnd(14)} ${radii.asked[corner].padEnd(14)}` +
          (same ? "" : `painted ${radii.painted[corner]}`)
      );
    }
    if (radii.scale < 1) {
      console.log(`  CSS scaled every corner by ${radii.scale} to fit the box`);
    }
  }

  if (args.a11y) {
    console.log(`\naccessibility tree of ${args.a11y}:`);
    console.log(JSON.stringify(await page.a11y(args.a11y), null, 2));
  }

  for (const selector of args.shot) {
    // One missing selector should not throw away the rest of the run
    try {
      const file = await page.shot(
        selector.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") || "page",
        selector || undefined
      );
      console.log(`\nsaved ${file}`);
    } catch (error) {
      console.log(`\ncould not shoot ${selector}: ${error instanceof Error ? error.message : error}`);
    }
  }

  console.log("");
  page.reportErrors();
  console.log("");

  await page.close();
};

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});

export { format };
