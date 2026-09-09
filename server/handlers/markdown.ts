// server/handlers/markdown.ts
import { join, basename, resolve, sep } from "path";
import { existsSync } from "fs";
import { renderTemplate, serveRenderedTemplate } from "../services/template.js";
import { logError } from "../middleware/logger.js";
import { getTemplateFile } from "../utils/paths.js";
import config from "../config.js";
import { renderMarkdown } from "../services/markdown.js";

// Markdown files directory
const MARKDOWN_DIR = join(config.paths.root, "docs");

export async function handleMarkdownRequest(req: Request): Promise<Response | null> {
  const url = new URL(req.url);
  const path = url.pathname;
  
  // Check if this is a markdown request
  if (!path.startsWith('/docs/') && !path.startsWith('/md/')) {
    return null;
  }
  
  try {
    // Extract markdown file path from the request
    let mdPath = path.replace(/^\/docs\/|^\/md\//, '');
    
    // Default to README.md if no specific file is requested
    if (!mdPath || mdPath.endsWith('/')) {
      mdPath = 'README.md';
    }
    
    // Ensure .md extension
    if (!mdPath.endsWith('.md')) {
      mdPath += '.md';
    }
    
    // The path comes from the URL, so keep it inside the docs directory: a
    // request for ../../something.md must not escape
    const filePath = resolve(MARKDOWN_DIR, mdPath);
    if (!filePath.startsWith(resolve(MARKDOWN_DIR) + sep)) {
      return new Response("Not found", {
        status: 404,
        headers: { "Content-Type": "text/plain" },
      });
    }
    
    // Check if file exists
    if (!existsSync(filePath)) {
      return new Response(`Markdown file not found: ${mdPath}`, { 
        status: 404,
        headers: { "Content-Type": "text/plain" }
      });
    }
    
    // Read the markdown file
    const markdown = await Bun.file(filePath).text();
    
    // /md/ is for the showcase pages, which insert the result into a section,
    // so it gets the fragment. /docs/ is a page in its own right and gets the
    // template around it.
    if (path.startsWith('/md/')) {
      return new Response(renderMarkdown(markdown), {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "max-age=3600",
        },
      });
    }

    {
      // Convert markdown to HTML
      const htmlContent = renderMarkdown(markdown);
      
      // Try to use a dedicated markdown template if available
      let templatePath = getTemplateFile("markdown.ejs");
      
      // Fall back to app template if markdown template doesn't exist
      if (!existsSync(templatePath)) {
        templatePath = getTemplateFile("app.ejs");
      }
      
      // Get file title from the first heading or filename
      const title = markdown.match(/^# (.*$)/m)?.[1] || 
                    basename(mdPath, '.md');
      
      // Render the template with markdown content
      const html = await renderTemplate(templatePath, {
        title: `${title} - mtrl docs`,
        content: htmlContent,
        markdown: true
      });
      
      // Serve the rendered HTML
      return await serveRenderedTemplate(html);
    }
  } catch (error: any) {
    logError(path, error);
    return new Response(`Error serving markdown: ${error.message}`, { 
      status: 500,
      headers: { "Content-Type": "text/plain" }
    });
  }
}

export default {
  handleMarkdownRequest
};