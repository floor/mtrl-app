// server/services/markdown.ts
//
// The one place markdown becomes HTML.
//
// There used to be two hand-rolled regex parsers, one here and one in the
// browser, with different feature sets. Neither supported tables on the server
// path, and a component doc is mostly tables: options, methods, events. The
// most important part of every page silently vanished depending on the route
// that served it.
//
// Rendering happens here, once, and the browser inserts the result.

import { marked } from "marked";

marked.setOptions({
  gfm: true, // tables, strikethrough, autolinks
  breaks: false, // a single newline is not a line break, as in CommonMark
});

/**
 * Renders markdown to HTML.
 *
 * Code fences come out as `<pre><code class="language-x">`, which is what the
 * Prism stylesheet on the page expects.
 */
export function renderMarkdown(markdown: string): string {
  return marked.parse(markdown, { async: false }) as string;
}

export default renderMarkdown;
