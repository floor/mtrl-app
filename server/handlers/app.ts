// server/handlers/app.ts
import { getTemplateFile } from "../utils/paths.js";
import { renderTemplate, serveRenderedTemplate, renderErrorPage, TemplateData } from "../services/template.js";
import { getLiveReloadScript } from "../services/live-reload.js";
import { logError } from "../middleware/logger.js";
import { isBot } from "../middleware/bot-detection.js";
import { sitemap } from "../../client/sitemap.js"; // Import the sitemap
import config from "../config.js";

/**
 * Handle main app requests
 * @param req The request object
 * @returns A response object
 */
export async function handleAppRequest(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const path = url.pathname;
  const requestIsFromBot = isBot(req);
  
  try {
    const templatePath = getTemplateFile("app.ejs");
    
    // Get page-specific metadata based on the path and sitemap
    const pageMetadata = getPageMetadataFromSitemap(path);
    
    // Build template data
    const templateData: TemplateData = {
      // Set path for canonical URL generation
      path,
      
      // Page-specific metadata
      ...pageMetadata,
      
      // Add live reload script in development
      liveReloadScript: !config.isProduction ? getLiveReloadScript() : "",
      
      // Mark if this is being rendered for a bot
      isSnapshot: requestIsFromBot,
      
      // Cache-busting timestamp for assets in development
      timestamp: config.isProduction ? "" : `?v=${Date.now()}`
    };
    
    // Render the template
    const html = await renderTemplate(templatePath, templateData);
    
    // Serve the rendered template with bot awareness
    return await serveRenderedTemplate(html, requestIsFromBot);
  } catch (error: any) {
    logError(url.pathname, error);
    return renderErrorPage(error);
  }
}

/**
 * Find a page in the sitemap by its path
 * @param path URL path to search for
 * @returns The page object from the sitemap or undefined
 */
function findPageInSitemap(path: string): any {
  // Normalize path by ensuring no trailing slash
  const normalizedPath = path.endsWith('/') && path !== '/' ? path.slice(0, -1) : path;
  
  // Check top-level sections
  for (const sectionKey of Object.keys(sitemap)) {
    const section = sitemap[sectionKey];
    
    // Check if this is the section's main page
    if (section.path === normalizedPath || (normalizedPath === '/' && sectionKey === 'home')) {
      return section;
    }
    
    // Check section items if they exist
    if (section.items && Array.isArray(section.items)) {
      // First check direct children
      const directMatch = section.items.find(item => item.path === normalizedPath);
      if (directMatch) return directMatch;
      
      // Then check nested items
      for (const item of section.items) {
        if (item.items && Array.isArray(item.items)) {
          const nestedMatch = item.items.find(subItem => subItem.path === normalizedPath);
          if (nestedMatch) return nestedMatch;
        }
      }
    }
  }
  
  return undefined;
}

/**
 * Get metadata for specific pages based on sitemap
 * @param path URL path
 * @returns Page-specific metadata
 */
function getPageMetadataFromSitemap(path: string): TemplateData {
  // Base URL for canonical links and images
  const baseUrl = process.env.BASE_URL || "https://mtrl.app";
  
  // Find page in sitemap
  const page = findPageInSitemap(path);
  
  // Default Page Title/Description if not found in sitemap
  let title = "mtrl UI Framework";
  let description = "A lightweight, composable TypeScript/JavaScript component library inspired by Material Design principles.";
  let sectionTitle = "";
  
  if (page) {
    // Use sitemap data if available
    title = page.label ? `${page.label} - mtrl UI Framework` : title;
    description = page.description || description;
    
    // Try to determine section for breadcrumbs & structured data
    if (path !== '/') {
      for (const sectionKey of Object.keys(sitemap)) {
        const section = sitemap[sectionKey];
        if (section.path && path.startsWith(section.path) && section.label) {
          sectionTitle = section.label;
          break;
        }
      }
    }
  }
  
  // Build structured data based on the page type
  let jsonLd: any = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": title,
    "description": description,
    "url": `${baseUrl}${path === "/" ? "" : path}`,
    "isPartOf": {
      "@type": "WebSite",
      "name": "mtrl UI Framework",
      "url": baseUrl
    }
  };
  
  // Add breadcrumbs for structured data if we have section info
  if (sectionTitle && path !== '/') {
    jsonLd.breadcrumb = {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": baseUrl
        }
      ]
    };
    
    // Add section to breadcrumbs if we have one
    if (sectionTitle) {
      const sectionPath = path.split('/')[1]; // Get first segment of path
      jsonLd.breadcrumb.itemListElement.push({
        "@type": "ListItem",
        "position": 2,
        "name": sectionTitle,
        "item": `${baseUrl}/${sectionPath}`
      });
      
      // If this is a nested page, add the current page
      if (path.split('/').length > 2 && page && page.label) {
        jsonLd.breadcrumb.itemListElement.push({
          "@type": "ListItem",
          "position": 3,
          "name": page.label,
          "item": `${baseUrl}${path}`
        });
      }
    }
  }
  
  // Special treatment for component pages - add code examples schema
  if (path.startsWith('/components/')) {
    jsonLd["@type"] = "TechArticle";
    jsonLd.headline = title;
    jsonLd.abstract = description;
    jsonLd.articleSection = "Components";
    jsonLd.codeRepository = "https://github.com/floor/mtrl";
  }
  
  // Special treatment for core pages - add technical article schema
  if (path.startsWith('/core/')) {
    jsonLd["@type"] = "TechArticle";
    jsonLd.headline = title;
    jsonLd.abstract = description;
    jsonLd.articleSection = "Core Concepts";
    jsonLd.programmingLanguage = "TypeScript";
  }
  
  return {
    title,
    description,
    jsonLd,
    // Generate canonical URL
    canonicalUrl: `${baseUrl}${path === "/" ? "" : path}`,
    // Path to OpenGraph image - could be customized per section if desired
    ogImage: `${baseUrl}/og-image${path.startsWith('/components/') ? '-components' : 
               path.startsWith('/core/') ? '-core' : 
               path.startsWith('/styles/') ? '-styles' : 
               path.startsWith('/get-started/') ? '-getstarted' : ''}.png`
  };
}

/**
 * Handle 404 (not found) responses
 * @param req The request object
 * @returns A 404 response
 */
export function handleNotFound(req: Request): Response {
  const url = new URL(req.url);
  const error = new Error(`Not Found: ${url.pathname}`);
  logError(url.pathname, error, false);
  
  return renderErrorPage(error, 404);
}

export default {
  handleAppRequest,
  handleNotFound
};