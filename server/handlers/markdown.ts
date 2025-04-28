// server/handlers/markdown.ts
import { join, basename } from "path";
import { existsSync } from "fs";
import { renderTemplate, serveRenderedTemplate } from "../services/template.js";
import { logError } from "../middleware/logger.js";
import { getTemplateFile } from "../utils/paths.js";
import config from "../config.js";

// Markdown files directory
const MARKDOWN_DIR = join(config.paths.root, "docs");

/**
 * Improved markdown to HTML converter
 * @param markdown Markdown content to convert
 * @returns HTML representation of the markdown
 */
function convertMarkdownToHtml(markdown: string): string {
  // Preserve code blocks before other processing
  const codeBlocks: string[] = [];
  let processedMarkdown = markdown.replace(/\`\`\`([\s\S]*?)\`\`\`/gm, (match) => {
    const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
    codeBlocks.push(match);
    return placeholder;
  });

  // Process headings
  processedMarkdown = processedMarkdown
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^#### (.*$)/gm, '<h4>$1</h4>')
    .replace(/^##### (.*$)/gm, '<h5>$1</h5>')
    .replace(/^###### (.*$)/gm, '<h6>$1</h6>');

  // Process blockquotes
  processedMarkdown = processedMarkdown.replace(/^\> (.*$)/gm, '<blockquote>$1</blockquote>');

  // Process inline styles
  processedMarkdown = processedMarkdown
    .replace(/\*\*(.*)\*\*/gm, '<strong>$1</strong>')
    .replace(/\*(.*)\*/gm, '<em>$1</em>')
    .replace(/\`(.*?)\`/gm, '<code>$1</code>');

  // Process links and images
  processedMarkdown = processedMarkdown
    .replace(/!\[(.*?)\]\((.*?)\)/gm, '<img alt="$1" src="$2" />')
    .replace(/\[(.*?)\]\((.*?)\)/gm, '<a href="$2">$1</a>');

  // Properly handle paragraphs
  // Split by double line breaks to identify paragraphs
  const paragraphs = processedMarkdown.split(/\n\s*\n/);
  processedMarkdown = paragraphs
    .map(p => {
      // Trim the paragraph
      p = p.trim();
      
      // Skip if it's empty or already an HTML element
      if (p === '' || p.startsWith('<')) {
        return p;
      }
      
      // Check if it contains a placeholder
      if (p.includes('__CODE_BLOCK_')) {
        return p;
      }
      
      // Otherwise, wrap in paragraph tags
      return `<p>${p}</p>`;
    })
    .join('\n\n');

  // Restore code blocks with proper HTML
  codeBlocks.forEach((block, index) => {
    const code = block.replace(/```(?:\w+)?\n([\s\S]*?)```/m, '$1');
    processedMarkdown = processedMarkdown.replace(
      `__CODE_BLOCK_${index}__`,
      `<pre><code>${code}</code></pre>`
    );
  });

  return processedMarkdown;
}

/**
 * Handle markdown file requests
 * @param req The request object
 * @returns A response object or null if not a markdown request
 */
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
    
    // Try to find the markdown file
    const filePath = join(MARKDOWN_DIR, mdPath);
    
    // Check if file exists
    if (!existsSync(filePath)) {
      return new Response(`Markdown file not found: ${mdPath}`, { 
        status: 404,
        headers: { "Content-Type": "text/plain" }
      });
    }
    
    // Read the markdown file
    const markdown = await Bun.file(filePath).text();
    
    // Determine format based on accept header or path
    const acceptHeader = req.headers.get('Accept') || '';
    const requestingHtml = acceptHeader.includes('text/html') || 
                          path.startsWith('/docs/');
    
    if (requestingHtml) {
      // Convert markdown to HTML
      const htmlContent = convertMarkdownToHtml(markdown);
      
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
    } else {
      // Serve raw markdown
      return new Response(markdown, {
        headers: {
          "Content-Type": "text/markdown",
          "Cache-Control": "max-age=3600"
        }
      });
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