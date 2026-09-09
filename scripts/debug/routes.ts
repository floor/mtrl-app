// scripts/debug/routes.ts
//
// Every showcase route the app serves, read from its own sitemap so this list
// can never drift from what is actually there.
//
// The point is that you should not have to remember a path to look at a
// component: `debug split-button` finds /components/buttons/split-button.

import { sitemap } from "../../client/sitemap.js";

/** Every route in the app, in the order the sitemap lists them */
export const allRoutes = (): string[] => {
  const found: string[] = [];

  const walk = (node: unknown): void => {
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    const record = node as Record<string, unknown>;
    if (typeof record.path === "string") found.push(record.path);
    for (const [key, value] of Object.entries(record)) {
      // icons are SVG strings and children of their own; nothing to walk
      if (key !== "icon" && typeof value === "object") walk(value);
    }
  };

  walk(sitemap);
  return [...new Set(found)].sort();
};

/** Just the component showcases, which is what this tool is usually pointed at */
export const componentRoutes = (): string[] =>
  allRoutes().filter((route) => route.startsWith("/components/"));

/**
 * Turns whatever was typed into a route.
 *
 * A full path is taken as given. Anything else is matched against the known
 * routes: first an exact last segment ('menus'), then a substring. Ambiguity
 * is reported rather than guessed at, because silently debugging the wrong
 * component wastes more time than a second of typing saves.
 */
export const resolveRoute = (input: string): string => {
  const wanted = input.replace(/^\/+|\/+$/g, "").toLowerCase();
  if (!wanted) throw new Error("no route given");

  const routes = allRoutes();
  const path = `/${wanted}`;

  // Taken as given when it is already a real route
  if (routes.includes(path)) return path;

  const segment = routes.filter((r) => r.split("/").pop()?.toLowerCase() === wanted);
  const partial = routes.filter((r) => r.toLowerCase().includes(wanted));
  const matches = segment.length > 0 ? segment : partial;

  if (matches.length === 1) return matches[0];
  if (matches.length === 0) {
    throw new Error(
      `no route matches "${input}".\nTry one of:\n${componentRoutes().map((r) => `  ${r}`).join("\n")}`
    );
  }
  throw new Error(
    `"${input}" matches several routes; say which:\n${matches.map((r) => `  ${r}`).join("\n")}`
  );
};
