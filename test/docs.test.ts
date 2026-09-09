// test/docs.test.ts
//
// Keeps the component documentation honest.
//
// The docs are hand-written prose in docs/components/*.md, and the library they
// describe moves every week. Nothing connected the two, so the docs drifted
// silently: methods that no longer exist, options never written down, and a
// menu doc that denied a feature the showcase on the same page demonstrated.
//
// These tests read each doc, pull out the API names it claims exist, and check
// them against the component's TypeScript source. They also check that a doc
// which exists is actually reachable, because several were written and then
// never wired to a page.
import { describe, test, expect } from 'bun:test';
import { readdirSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

const DOCS = join(import.meta.dir, '..', 'docs', 'components');
const MTRL = join(import.meta.dir, '..', '..', 'mtrl', 'src', 'components');
const CLIENT = join(import.meta.dir, '..', 'client');

/** Docs that describe mtrl-addons components, not mtrl; out of scope here */
const NOT_MTRL = new Set(['colorpicker', 'form', 'vlist', 'list-pagination', 'components']);

/** Doc file name to component directory, where they differ */
const DIRECTORY: Record<string, string> = {};

const docNames = readdirSync(DOCS)
  .filter((f) => f.endsWith('.md') && !f.startsWith('_')) // _template.md is not a doc
  .map((f) => f.replace(/\.md$/, ''))
  .filter((n) => !NOT_MTRL.has(n));

const componentDir = (doc: string): string => join(MTRL, DIRECTORY[doc] ?? doc);
const read = (path: string): string => (existsSync(path) ? readFileSync(path, 'utf8') : '');
const docText = (doc: string): string => readFileSync(join(DOCS, `${doc}.md`), 'utf8');

/**
 * Everything the component's own source declares, as one haystack.
 *
 * This reads nested directories too. It used to read only the top level, which
 * meant a component whose types live in a subdirectory (navigation/system)
 * could not be checked at all, and the doc had to rename its tables to slip
 * past the check rather than be verified by it.
 */
const sourceOf = (doc: string): string => {
  const root = componentDir(doc);
  if (!existsSync(root)) return '';

  const files: string[] = [];
  const stack = [root];
  while (stack.length > 0) {
    const dir = stack.pop() as string;
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) stack.push(path);
      else if (entry.name.endsWith('.ts')) files.push(read(path));
    }
  }
  return files.join('\n');
};

/** The identifier in the first cell of each row of a table with this header */
const firstColumn = (markdown: string, header: string): string[] => {
  const names: string[] = [];
  let inTable = false;
  for (const line of markdown.split('\n')) {
    if (line.startsWith(`| ${header}`)) { inTable = true; continue; }
    if (inTable) {
      if (!line.startsWith('|')) { inTable = false; continue; }
      if (/^\|[\s|:-]+\|$/.test(line)) continue;          // the ---- row
      const cell = line.split(/(?<!\\)\|/)[1]?.trim() ?? '';
      const name = cell.match(/`([A-Za-z_$][\w$]*)/)?.[1];  // strip (args) and backticks
      if (name) names.push(name);
    }
  }
  return [...new Set(names)];
};

/**
 * Every `OBJECT.KEY = literal` a component's constants declare, so that a
 * default written as `ICON_BUTTON_VARIANTS.STANDARD` can be compared with the
 * `'standard'` a doc prints.
 */
const constantValues = (doc: string): Map<string, string> => {
  const values = new Map<string, string>();
  const source = sourceOf(doc);
  const objects = source.matchAll(
    /export const ([A-Z][A-Z0-9_]*)\s*(?::[^=]+)?=\s*\{([\s\S]*?)\n\}/g
  );
  for (const single of source.matchAll(
    /export const ([A-Z][A-Z0-9_]*)\s*(?::[^=]+)?=\s*(['"][^'"]*['"]|\d+)\s*;/g
  )) {
    values.set(single[1], single[2]);
  }

  // enums hold defaults too: TIME_FORMAT.AMPM is '12h'
  for (const block of source.matchAll(/export enum ([A-Za-z_$][\w$]*)\s*\{([\s\S]*?)\n\}/g)) {
    for (const entry of block[2].matchAll(/^\s*([A-Za-z_$][\w$]*)\s*=\s*(.+?),?\s*(?:\/\/.*)?$/gm)) {
      values.set(`${block[1]}.${entry[1]}`, entry[2].replace(/,$/, ''));
    }
  }

  for (const object of objects) {
    for (const entry of object[2].matchAll(/^\s*([A-Za-z_$][\w$]*)\s*:\s*(.+?),?\s*(?:\/\/.*)?$/gm)) {
      values.set(`${object[1]}.${entry[1]}`, entry[2].replace(/,$/, ''));
    }
  }
  return values;
};

/**
 * The defaults the code actually applies, read from the `defaultConfig` object
 * a component's config.ts exports. This is the authority: the `@default`
 * annotations in types.ts have been found to disagree with it.
 */
const appliedDefaults = (doc: string): Map<string, string> => {
  const found = new Map<string, string>();
  const constants = constantValues(doc);
  const file = join(componentDir(doc), 'config.ts');
  const source = read(file);
  const start = source.search(/export const defaultConfig[^=]*=\s*\{/);
  if (start === -1) return found;

  // walk the braces so a nested object does not end the scan early
  let depth = 0;
  let body = '';
  for (let i = source.indexOf('{', start); i < source.length; i++) {
    const character = source[i];
    if (character === '{') depth++;
    if (depth > 0) body += character;
    if (character === '}') {
      depth--;
      if (depth === 0) break;
    }
  }

  for (const line of body.split('\n')) {
    const match = line.match(/^\s*([A-Za-z_$][\w$]*)\s*:\s*(.+?)\s*,?\s*(?:\/\/.*)?$/);
    if (!match) continue;
    // Constants point at constants: MENU_DEFAULTS.POSITION holds
    // MENU_POSITION.BOTTOM_START, which holds 'bottom-start'. Follow the chain
    // to the literal, with a bound so a cycle cannot hang the run.
    let value = match[2].replace(/,$/, '');
    for (let hop = 0; hop < 5 && constants.has(value); hop++) {
      value = constants.get(value) as string;
    }
    found.set(match[1], value);
  }
  return found;
};

/** Defaults the source annotates with `@default`, by member name */
const declaredDefaults = (doc: string): Map<string, string> => {
  const found = new Map<string, string>();
  const source = sourceOf(doc);
  // The `;` guard matters: without it the pattern hops over a finished
  // declaration and pairs a default with the member after it, which had menu's
  // `variant` accused of defaulting to `position`'s 'bottom-start'.
  const pattern = /@default\s+([^\n*]+?)\s*\n[^;]{0,400}?\*\/\s*\n\s*(?:readonly\s+)?([A-Za-z_$][\w$]*)\??\s*[:?]/g;
  const constants = constantValues(doc);
  for (const match of source.matchAll(pattern)) {
    // an annotation may name a constant, just as an applied default may
    let value = match[1];
    for (let hop = 0; hop < 5 && constants.has(value); hop++) {
      value = constants.get(value) as string;
    }
    if (!found.has(match[2])) found.set(match[2], value);
  }
  return found;
};

/** The Default cell of each row of the Configuration tables */
const documentedDefaults = (doc: string): Array<[string, string]> => {
  const rows: Array<[string, string]> = [];
  let inTable = false;
  let defaultColumn = -1;
  for (const line of docText(doc).split('\n')) {
    if (line.startsWith('| Option')) {
      inTable = true;
      // some tables are Option | Type | Description, with no default at all
      defaultColumn = line.split(/(?<!\\)\|/).map((c) => c.trim().toLowerCase()).indexOf('default');
      continue;
    }
    if (!inTable) continue;
    if (!line.startsWith('|')) { inTable = false; continue; }
    if (/^\|[\s|:-]+\|$/.test(line)) continue;
    const cells = line.split(/(?<!\\)\|/).map((c) => c.trim());
    const name = cells[1]?.match(/`([A-Za-z_$][\w$]*)/)?.[1];
    const value = defaultColumn > 0 ? cells[defaultColumn] : undefined;
    if (name && value) rows.push([name, value]);
  }
  return rows;
};

/**
 * Values that cannot be compared as a single token: an object literal, an
 * inline SVG, or a phrase describing several cases. Skipped rather than
 * reported, so the check stays about defaults it can actually judge.
 */
const comparable = (value: string): boolean => {
  const text = value.trim();
  if (text.startsWith('{') || text.includes('<svg') || text.includes('http')) return false;
  return text.replace(/[`'"]/g, '').split(/\s+/).length <= 3;
};

/** So that `'top'`, `top` and `\`'top'\`` all compare equal */
const normalise = (value: string): string =>
  value
    .trim()
    .replace(/\\$/, '')
    .replace(/[`'"]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

const documentedOptions = (doc: string): string[] => firstColumn(docText(doc), 'Option');
const documentedMethods = (doc: string): string[] => firstColumn(docText(doc), 'Method');

describe('component documentation', () => {
  test('there is a doc to check', () => {
    expect(docNames.length).toBeGreaterThan(0);
  });

  for (const doc of docNames) {
    describe(doc, () => {
      test('describes a component that exists', () => {
        expect(existsSync(componentDir(doc))).toBe(true);
      });

      test('documents the configuration, not just prose', () => {
        // A doc with no tables passes every check below by saying nothing.
        // Every component takes options, so every doc lists them.
        expect(documentedOptions(doc).length).toBeGreaterThan(0);
      });

      test('every documented option exists in the source', () => {
        const source = sourceOf(doc);
        const missing = documentedOptions(doc).filter(
          (option) => !new RegExp(`\\b${option}\\??\\s*[:?]`).test(source)
        );
        // named, so a failure says which ones rather than printing the source
        expect(missing.join(', ')).toBe('');
      });

      test('the defaults it states match the ones the source declares', () => {
        // The source annotates defaults with `@default`. A table saying
        // otherwise is a lie a name-matching check cannot see, and defaults are
        // what a reader copies without thinking.
        const applied = appliedDefaults(doc);
        const annotated = declaredDefaults(doc);
        const declared = new Map([...annotated, ...applied]); // code wins
        const wrong: string[] = [];

        // A doc has several Option tables: the component's own config, and the
        // nested types it accepts. A dialog's buttons have their own `size`
        // and `autofocus`, and a tab has its own `variant`. When a name is
        // documented more than once with different defaults there is no way to
        // tell which type a row belongs to, so leave it alone.
        const rows = documentedDefaults(doc);
        const ambiguous = new Set(
          rows
            .filter(([name, value]) =>
              rows.some(([other, otherValue]) => other === name && normalise(otherValue) !== normalise(value))
            )
            .map(([name]) => name)
        );

        for (const [option, stated] of rows) {
          if (ambiguous.has(option)) continue;
          const actual = declared.get(option);
          if (actual === undefined) continue;            // source states none
          if (!comparable(actual) || !comparable(stated)) continue;
          const want = normalise(actual);
          const got = normalise(stated);
          const enumTail = want.includes('.') ? want.split('.').pop() ?? want : want;
          const agrees =
            got === want ||
            got.includes(want) ||                       // '16 for the inset variants'
            got.replace(/[-_]/g, '') === enumTail.replace(/[-_]/g, '');
          if (!agrees) {
            wrong.push(`${option}: doc says ${stated}, source says ${actual}`);
          }
        }
        expect(wrong.join(' | ')).toBe('');
      });

      test('its own @default annotations match the defaults it applies', () => {
        // Not a documentation problem, a source one, but it is what makes the
        // check above trustworthy: progress annotates thickness as 'default'
        // while config.ts applies 'thin'.
        const applied = appliedDefaults(doc);
        const annotated = declaredDefaults(doc);
        const disagreements: string[] = [];

        for (const [name, value] of applied) {
          const claim = annotated.get(name);
          if (claim === undefined) continue;
          if (!comparable(claim) || !comparable(value)) continue;
          if (normalise(claim) !== normalise(value)) {
            disagreements.push(`${name}: @default ${claim}, config applies ${value}`);
          }
        }
        expect(disagreements.join(' | ')).toBe('');
      });

      test('every documented method exists in the source', () => {
        const source = sourceOf(doc);
        const missing = documentedMethods(doc).filter(
          // the `?` of an optional member sits between the name and the colon
          (method) => !new RegExp(`\\b${method}\\??\\s*[(:<]`).test(source)
        );
        expect(missing.join(', ')).toBe('');
      });
    });
  }
});

describe('the examples', () => {
  const transpiler = new Bun.Transpiler({ loader: 'ts' });

  /** Every fenced JavaScript or TypeScript block in a doc */
  const blocks = (doc: string): string[] =>
    Array.from(
      docText(doc).matchAll(/```(?:javascript|js|typescript|ts)\n([\s\S]*?)```/g),
      (match) => match[1]
    );

  /** Names the package root exports, for checking what an example imports */
  const exported = (() => {
    const names = new Set<string>();
    // the package root, the components barrel, and each component's own
    // barrel, since the root re-exports them with `export *`
    let index = read(join(MTRL, 'index.ts')) + read(join(MTRL, '..', 'index.ts'));
    for (const entry of readdirSync(MTRL, { withFileTypes: true })) {
      if (entry.isDirectory()) index += read(join(MTRL, entry.name, 'index.ts'));
    }
    // `export type { ... }` counts: a doc may legitimately import a type
    for (const match of index.matchAll(/export\s+(?:type\s+)?\{([^}]*)\}/g)) {
      for (const part of match[1].split(',')) {
        const name = part.trim().split(/\s+as\s+/).pop()?.trim();
        if (name) names.add(name);
      }
    }
    for (const match of index.matchAll(/export\s+(?:declare\s+)?(?:const|function|class|type|interface)\s+([\w$]+)/g)) {
      names.add(match[1]);
    }
    return names;
  })();

  for (const doc of docNames) {
    test(`${doc} examples parse`, () => {
      const broken: string[] = [];

      for (const code of blocks(doc)) {
        // a snippet may be a statement list, a function body or a bare object,
        // so try it each way before calling it broken
        const attempts = [code, `async function _example() {\n${code}\n}`, `const _value = ${code}`];
        const parses = attempts.some((attempt) => {
          try {
            transpiler.transformSync(attempt);
            return true;
          } catch {
            return false;
          }
        });
        if (!parses) broken.push(code.split('\n')[0].slice(0, 60));
      }

      expect(broken.join(' | ')).toBe('');
    });

    test(`${doc} examples import names the package exports`, () => {
      const unknown: string[] = [];

      for (const code of blocks(doc)) {
        for (const statement of code.matchAll(/import\s*\{([^}]*)\}\s*from\s*['"]mtrl['"]/g)) {
          for (const part of statement[1].split(',')) {
            const name = part.trim().split(/\s+as\s+/)[0]?.trim();
            if (name && exported.size > 0 && !exported.has(name)) unknown.push(name);
          }
        }
      }

      expect([...new Set(unknown)].join(', ')).toBe('');
    });
  }
});

describe('documentation reachability', () => {
  // A doc nobody links to is a doc nobody reads. Six were in this state.
  const clientSource = (function walk(dir: string): string {
    return readdirSync(dir, { withFileTypes: true })
      .map((entry) => {
        const path = join(dir, entry.name);
        if (entry.isDirectory()) return walk(path);
        if (!entry.name.endsWith('.js') && !entry.name.endsWith('.ts')) return '';
        // a commented-out call renders nothing, so it does not count as wired
        return read(path).replace(/^\s*\/\/.*$/gm, '');
      })
      .join('\n');
  })(CLIENT);

  // the docs each page actually asks for
  const referenced = new Set(
    Array.from(clientSource.matchAll(/components\/([\w-]+)\.md/g), (m) => m[1])
  );

  /**
   * Components with no showcase page at all, so there is nothing to wire the
   * doc to yet. Writing the page is the fix; until then the doc is reachable
   * only at /docs/components/<name>.
   *
   * This list is asserted to be exact below, so it cannot quietly grow, and
   * building one of these showcases will fail the test until the doc is wired.
   */
  const NO_SHOWCASE = ['divider', 'drawer', 'sheet', 'tooltip'];

  /*
   * Known gap, not enforced here: bottom-app-bar, icon-button and top-app-bar
   * are written and wired, but their routes are commented out of
   * client/sitemap.js, so nothing links to those pages. The showcases behind
   * them are half-built, which is why the routes are off. Switching a route
   * back on makes its doc reachable.
   *
   * A static check for this proved worse than useless: page directories and
   * route paths do not correspond (menus serves /components/menus, progress
   * serves /components/loading/progress), so it flagged five pages that render
   * perfectly well. The browser sweep in scripts/debug covers it instead.
   */

  test('every doc is loaded by a page, except those with no page to load it', () => {
    const unwired = docNames.filter((doc) => !referenced.has(doc)).sort();
    expect(unwired).toEqual([...NO_SHOWCASE].sort());
  });
});
