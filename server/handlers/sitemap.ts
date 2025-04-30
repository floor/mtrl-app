// server/handlers/sitemap.ts
import { logError } from "../middleware/logger.js";
import config from "../config.js";
import { sitemap } from "../../client/sitemap.js";

// Interface for sitemap items
interface SitemapItem {
  loc: string;
  lastmod: string;
  changefreq: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority: number;
}

// Get the base URL from config or default to localhost
const BASE_URL = config.baseUrl || `http://localhost:${config.port}`;

/**
 * Generate sitemap in XML format optimized for search engines
 * @param sitemapItems Array of sitemap items
 * @returns XML string
 */
function generateSitemapXml(sitemapItems: SitemapItem[]): string {
  // Add XML declaration and namespace (including image namespace for potential future use)
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" ';
  xml += 'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ';
  xml += 'xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\n';
  
  for (const item of sitemapItems) {
    xml += '<url>\n';
    // Ensure the URL is properly formatted
    xml += `<loc>${item.loc}</loc>\n`;
    xml += `<lastmod>${item.lastmod}</lastmod>\n`;
    xml += `<changefreq>${item.changefreq}</changefreq>\n`;
    xml += `<priority>${item.priority.toFixed(1)}</priority>\n`;
    xml += '</url>\n';
  }
  
  xml += '</urlset>';
  return xml;
}

/**
 * Smart URL categorization for optimal priority and change frequency settings
 * @returns Array of properly categorized sitemap items
 */
function getSitemapUrls(): SitemapItem[] {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const result: SitemapItem[] = [];
  
  // Define URL categories for optimal SEO
  const highPriorityUrls = [];                        // 1.0, daily
  const mediumPriorityUrls = ['/core/composition', '/styles/colors'];    // 0.8, weekly
  const componentUrls: string[] = [];                                    // 0.7, monthly
  const docUrls: string[] = [];                                          // 0.5, monthly
  
  // Extract all paths from the sitemap structure
  extractPathsFromSitemap(sitemap, componentUrls, docUrls);
  
  // Add high priority URLs
  for (const path of highPriorityUrls) {
    result.push({
      loc: `${BASE_URL}${path}`,
      lastmod: today,
      changefreq: "daily",
      priority: 1.0
    });
  }
  
  // Add medium priority URLs (main category pages)
  for (const path of mediumPriorityUrls) {
    result.push({
      loc: `${BASE_URL}${path}`,
      lastmod: today,
      changefreq: "weekly",
      priority: 0.8
    });
  }
  
  // Add components with appropriate priority
  for (const path of componentUrls) {
    // Skip if already added as high/medium priority
    if (highPriorityUrls.includes(path) || mediumPriorityUrls.includes(path)) {
      continue;
    }
    
    result.push({
      loc: `${BASE_URL}${path}`,
      lastmod: today,
      changefreq: "weekly",  // Components change less frequently
      priority: 0.7          // Slightly lower priority than main sections
    });
  }
  
  // Add documentation URLs with appropriate priority
  for (const path of docUrls) {
    // Skip if already added in another category
    if (highPriorityUrls.includes(path) || 
        mediumPriorityUrls.includes(path) || 
        componentUrls.includes(path)) {
      continue;
    }
    
    result.push({
      loc: `${BASE_URL}${path}`,
      lastmod: today,
      changefreq: "monthly", // Documentation changes rarely
      priority: 0.5          // Lower priority
    });
  }
  
  return result;
}

/**
 * Extract paths from the sitemap structure
 */
function extractPathsFromSitemap(
  sitemapObj: any, 
  componentPaths: string[] = [], 
  docPaths: string[] = []
): void {
  // Process home
  if (sitemapObj.home?.path) {
    componentPaths.push(sitemapObj.home.path);
  } else {
    // Explicitly add home path if missing
    componentPaths.push('/');
  }
  
  // Process get-started
  if (sitemapObj.getstarted?.path) {
    componentPaths.push(sitemapObj.getstarted.path);
  }
  
  // Process core section
  processSection(sitemapObj.core, componentPaths, docPaths, 'core');
  
  // Process styles section
  processSection(sitemapObj.styles, componentPaths, docPaths, 'styles');
  
  // Process components section
  processSection(sitemapObj.components, componentPaths, docPaths, 'components');
}

/**
 * Process a section of the sitemap
 */
function processSection(
  section: any, 
  componentPaths: string[], 
  docPaths: string[],
  sectionType: string
): void {
  if (!section || !section.items) return;
  
  // Process each item in the section
  for (const item of section.items) {
    if (item.path) {
      // Categorize based on section type
      if (sectionType === 'components') {
        componentPaths.push(item.path);
      } else {
        docPaths.push(item.path);
      }
    }
    
    // Process subitems if they exist
    if (item.items && Array.isArray(item.items)) {
      for (const subitem of item.items) {
        if (subitem.path) {
          // Categorize based on section type
          if (sectionType === 'components') {
            componentPaths.push(subitem.path);
          } else {
            docPaths.push(subitem.path);
          }
        }
      }
    }
  }
}

/**
 * Build a failsafe sitemap with hardcoded paths as backup
 */
function getFailsafeSitemapUrls(): SitemapItem[] {
  const today = new Date().toISOString().split('T')[0];
  
  // If dynamic extraction fails, use these hardcoded paths
  const paths = [
    '/',
    '/get-started',
    '/core/composition',
    '/core/composition/features',
    '/core/events',
    '/core/state',
    '/core/collection',
    '/core/collection/route',
    '/core/collection/list-manager',
    '/core/layout',
    '/core/gestures',
    '/styles/colors',
    '/styles/typography',
    '/styles/elevation',
    '/components/app-bars/bottom',
    '/components/app-bars/top',
    '/components/badges',
    '/components/buttons/common',
    '/components/buttons/fab',
    '/components/buttons/extended-fab',
    '/components/buttons/segmented-buttons',
    '/components/cards',
    '/components/carousel',
    '/components/checkboxes',
    '/components/chips',
    '/components/datepickers',
    '/components/timepickers',
    '/components/dialogs',
    '/components/lists',
    '/components/menus',
    '/components/progress',
    '/components/radios',
    '/components/search',
    '/components/selects',
    '/components/sliders',
    '/components/snackbars',
    '/components/switches',
    '/components/tabs',
    '/components/textfields'
  ];
  
  return paths.map(path => ({
    loc: `${BASE_URL}${path}`,
    lastmod: today,
    changefreq: (path === '/' || path === '/get-started') ? "daily" : "weekly",
    priority: (path === '/' || path === '/get-started') ? 1.0 : 0.8
  }));
}

/**
 * Handle sitemap requests
 * @param req The request object
 * @returns A response object or null if not a sitemap request
 */
export async function handleSitemapRequest(req: Request): Promise<Response | null> {
  const url = new URL(req.url);
  const path = url.pathname;
  
  // Only handle sitemap.xml or sitemap.json requests
  if (path !== "/sitemap.xml" && path !== "/sitemap.json") {
    return null;
  }
  
  try {
    // Try to get sitemap URLs dynamically
    let sitemapItems: SitemapItem[] = [];
    
    try {
      sitemapItems = getSitemapUrls();
    } catch (error) {
      // If dynamic extraction fails, use failsafe method
      console.warn("Dynamic sitemap generation failed, using failsafe method");
      sitemapItems = getFailsafeSitemapUrls();
    }
    
    // Ensure we have items in the sitemap
    if (sitemapItems.length === 0) {
      sitemapItems = getFailsafeSitemapUrls();
    }
    
    // Return XML or JSON based on request
    if (path === "/sitemap.xml") {
      const xml = generateSitemapXml(sitemapItems);
      
      // Use correct XML content type and appropriate caching
      return new Response(xml, {
        headers: {
          "Content-Type": "application/xml; charset=UTF-8",
          "X-Robots-Tag": "noindex", // The sitemap itself shouldn't be indexed
          "Cache-Control": config.isProduction 
            ? "public, max-age=86400" // Cache for 24 hours in production
            : "no-store, max-age=0"   // No caching in development
        }
      });
    } else {
      const json = JSON.stringify({
        created: new Date().toISOString(),
        baseUrl: BASE_URL,
        urls: sitemapItems
      }, null, 2);
      
      return new Response(json, {
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          "X-Robots-Tag": "noindex",
          "Cache-Control": config.isProduction 
            ? "public, max-age=86400" 
            : "no-store, max-age=0"
        }
      });
    }
  } catch (error: any) {
    logError(path, error);
    return new Response(`Error generating sitemap: ${error.message}`, { 
      status: 500,
      headers: { "Content-Type": "text/plain" }
    });
  }
}

export default {
  handleSitemapRequest
};