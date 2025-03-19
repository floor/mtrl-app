// server/services/template.ts
import ejs from "ejs";
import { existsSync } from "fs";
import { isCompressibleType } from "../utils/mime-types.js";
import { compressContent, setCompressionHeaders } from "../utils/compression.js";
import { getTimestampParam } from "../utils/caching.js";
import config from "../config.js";

const { isProduction } = config;

// Template data interface
export interface TemplateData {
  [key: string]: any;
  timestamp?: string;
}

/**
 * Render an EJS template
 * @param templatePath Path to the template file
 * @param data Data to pass to the template
 * @returns Rendered HTML
 */
export async function renderTemplate(templatePath: string, data: TemplateData = {}): Promise<string> {
  try {
    if (!existsSync(templatePath)) {
      throw new Error(`Template not found: ${templatePath}`);
    }
    
    // Read the template file
    const templateContent = await Bun.file(templatePath).text();
    
    // Default data with timestamp
    const defaultData: TemplateData = {
      timestamp: getTimestampParam()
    };
    
    // Render the template with EJS
    return ejs.render(templateContent, { ...defaultData, ...data }, {
      filename: templatePath, // Important for EJS includes
      async: false
    });
  } catch (error) {
    console.error(`Error rendering template ${templatePath}:`, error);
    throw error;
  }
}

/**
 * Serve a rendered template with appropriate headers
 * @param html Rendered HTML
 * @returns Response object
 */
export async function serveRenderedTemplate(html: string): Promise<Response> {
  const headers = new Headers({
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "no-cache",
    "Access-Control-Allow-Origin": "*"
  });
  
  // Try to compress HTML in production
  if (isProduction) {
    const compressed = await compressContent(html, "text/html");
    setCompressionHeaders(headers, compressed);
    
    if (compressed) {
      return new Response(compressed, { headers });
    }
  }
  
  return new Response(html, { headers });
}

/**
 * Render a generic error page
 * @param error The error object
 * @param status HTTP status code
 * @returns Response object with error page
 */
export function renderErrorPage(error: Error, status: number = 500): Response {
  const errorHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Error ${status}</title>
      <style>
        body { font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; }
        .error { color: #e53e3e; background: #fff5f5; padding: 1rem; border-radius: 0.25rem; }
        pre { overflow-x: auto; padding: 1rem; background: #f7fafc; border-radius: 0.25rem; }
      </style>
    </head>
    <body>
      <h1>Error ${status}</h1>
      <div class="error">
        <p>${error.message}</p>
        ${!isProduction && error.stack ? `<pre>${error.stack}</pre>` : ''}
      </div>
      ${!isProduction ? '<p>This error page is only shown in development mode.</p>' : ''}
    </body>
    </html>
  `;
  
  return new Response(errorHtml, {
    status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-cache"
    }
  });
}

export default {
  renderTemplate,
  serveRenderedTemplate,
  renderErrorPage
};