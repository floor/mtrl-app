// server/services/template.ts
import ejs from "ejs";
import { existsSync } from "fs";
import { isCompressibleType } from "../utils/mime-types.js";
import { compressContent, setCompressionHeaders } from "../utils/compression.js";
import { getTimestampParam } from "../utils/caching.js";
import config from "../config.js";

const { isProduction } = config;

// Enhanced template data interface with SEO-related properties
export interface TemplateData {
  [key: string]: any;
  title?: string;
  description?: string;
  path?: string;                // Current URL path
  canonicalUrl?: string;        // Full canonical URL
  ogImage?: string;             // Open Graph image URL
  jsonLd?: Record<string, any>; // Structured data
  timestamp?: string;           // Cache-busting timestamp
  isSnapshot?: boolean;         // Whether this is being rendered for a snapshot
}

/**
 * Generate a default template data object with sensible defaults
 * @param path Current URL path
 * @returns Default template data
 */
export function getDefaultTemplateData(path: string = "/"): TemplateData {
  const baseUrl = process.env.BASE_URL || "https://mtrl.app";
  const canonicalUrl = `${baseUrl}${path === "/" ? "" : path}`;
  
  return {
    title: "mtrl UI Framework",
    description: "A lightweight, composable TypeScript/JavaScript component library inspired by Material Design principles",
    path,
    canonicalUrl,
    ogImage: `${baseUrl}/og-image.png`,
    timestamp: getTimestampParam(),
    isSnapshot: false,
    isProduction
  };
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
    
    // Get path from data or default to "/"
    const path = data.path || "/";
    
    // Get default data first
    const defaultData = getDefaultTemplateData(path);
    
    // Merge with passed data, ensuring all required fields exist
    const templateData: TemplateData = {
      ...defaultData,
      ...data,
      // Explicitly ensure these critical fields are never undefined
      title: data.title || defaultData.title,
      description: data.description || defaultData.description,
      path: data.path || defaultData.path,
      canonicalUrl: data.canonicalUrl || defaultData.canonicalUrl,
      ogImage: data.ogImage || defaultData.ogImage,
      timestamp: data.timestamp || defaultData.timestamp,
      isSnapshot: data.isSnapshot || defaultData.isSnapshot
    };
    
    // Debug log in development to see what data is being passed
    if (!isProduction) {
      console.log('Template data being passed to EJS:', {
        title: templateData.title,
        description: templateData.description,
        path: templateData.path,
        canonicalUrl: templateData.canonicalUrl
      });
    }
    
    // Render the template with EJS
    return ejs.render(templateContent, templateData, {
      filename: templatePath, // Important for EJS includes
      async: false
    });
  } catch (error) {
    console.error(`Error rendering template ${templatePath}:`, error);
    console.error('Template data that caused the error:', data);
    throw error;
  }
}

/**
 * Serve a rendered template with appropriate headers
 * @param html Rendered HTML
 * @param isBot Whether the request is from a bot
 * @returns Response object
 */
export async function serveRenderedTemplate(html: string, isBot: boolean = false): Promise<Response> {
  const headers = new Headers({
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": isBot ? "public, max-age=3600" : "no-cache", // Higher cache for bots
    "Vary": "User-Agent" // Important for caching different versions based on user agent
  });
  
  // Add bot-specific headers
  if (isBot) {
    headers.set("X-Robots-Tag", "all");
    headers.set("X-Pre-Rendered", "true");
  }
  
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
  renderErrorPage,
  getDefaultTemplateData
};