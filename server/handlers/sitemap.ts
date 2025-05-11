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

// Interface for sitemap structure
interface SitemapSection {
  path?: string;
  label?: string;
  lastModified?: string;
  items?: any[];
  [key: string]: any;
}

// Interface to represent a node in the sitemap hierarchy
interface SitemapNode {
  path: string;
  priority: number;
  changefreq: SitemapItem["changefreq"];
  children?: SitemapNode[];
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
 * Extracts last modified date from sitemap item if available
 * @param item Sitemap item or section
 * @returns ISO date string (YYYY-MM-DD) or current date if not available
 */
function getLastModifiedDate(item: any): string {
  // If the item has a lastModified property, use it
  if (item.lastModified) {
    return item.lastModified;
  }
  
  // Otherwise use today's date
  return new Date().toISOString().split('T')[0];
}

/**
 * Creates a sitemap following the hierarchical structure from sitemap.js
 * @returns Array of properly categorized sitemap items in hierarchical order
 */
function getSitemapUrls(): SitemapItem[] {  
  // Create hierarchical structure first
  const rootNode: SitemapNode = {
    path: '/',
    priority: 1.0,
    changefreq: "daily",
    children: []
  };
  
  // Add get-started as a top-level page
  rootNode.children!.push({
    path: '/get-started',
    priority: 1.0,
    changefreq: "daily"
  });
  
  // Build hierarchical structure for main sections
  const mainSections = ['core', 'styles', 'components'];
  
  for (const sectionKey of mainSections) {
    const section = sitemap[sectionKey];
    if (!section || !section.path) continue;
    
    // Create node for the section
    const sectionNode: SitemapNode = {
      path: section.path,
      priority: 0.8,
      changefreq: "weekly",
      children: []
    };
    
    // Add to root's children
    rootNode.children!.push(sectionNode);
    
    // Process section items
    if (section.items && Array.isArray(section.items)) {
      for (const item of section.items) {
        if (!item) continue;
        
        if (item.path) {
          // Direct child of section
          const itemNode: SitemapNode = {
            path: item.path,
            priority: sectionKey === 'components' ? 0.7 : 0.5,
            changefreq: sectionKey === 'components' ? "weekly" : "monthly",
            children: []
          };
          
          sectionNode.children!.push(itemNode);
        }
        
        // Process subitems (third level)
        if (item.items && Array.isArray(item.items)) {
          // Find or create parent node
          let parentNode: SitemapNode;
          
          if (item.path) {
            // Parent already exists in the structure
            parentNode = sectionNode.children!.find(node => node.path === item.path)!;
          } else {
            // Create a virtual parent for organizational purposes
            parentNode = {
              path: '', // Empty path as it's not a real URL
              priority: 0,
              changefreq: "never",
              children: []
            };
            // No need to add this to the structure
          }
          
          // Add all subitems
          for (const subitem of item.items) {
            if (!subitem || !subitem.path) continue;
            
            const subitemNode: SitemapNode = {
              path: subitem.path,
              priority: sectionKey === 'components' ? 0.7 : 0.5,
              changefreq: sectionKey === 'components' ? "weekly" : "monthly"
            };
            
            // Only add to real parents
            if (item.path) {
              parentNode.children!.push(subitemNode);
            } else {
              // If parent was virtual, add directly to section
              sectionNode.children!.push(subitemNode);
            }
          }
        }
      }
    }
  }
  
  // Flatten the hierarchical structure to a list, preserving order
  const result: SitemapItem[] = [];
  const visited = new Set<string>();
  
  // Recursive function to flatten the tree and extract lastModified dates
  function flattenNode(node: SitemapNode) {
    // Skip empty paths (virtual nodes) and already visited paths
    if (!node.path || visited.has(node.path)) return;
    
    // Mark as visited
    visited.add(node.path);
    
    // Find the original item in the sitemap to get lastModified if available
    let lastModified = new Date().toISOString().split('T')[0]; // Default to today
    
    // Look for the item in the sitemap structure to get its lastModified property
    const findItem = (obj: any, path: string): any => {
      if (obj.path === path) return obj;
      
      if (obj.items && Array.isArray(obj.items)) {
        for (const item of obj.items) {
          if (!item) continue;
          
          if (item.path === path) return item;
          
          if (item.items && Array.isArray(item.items)) {
            for (const subitem of item.items) {
              if (subitem && subitem.path === path) return subitem;
            }
          }
        }
      }
      
      return null;
    };
    
    // Special case for home and get-started
    if (node.path === '/') {
      if (sitemap.home?.lastModified) {
        lastModified = sitemap.home.lastModified;
      }
    } else if (node.path === '/get-started') {
      if (sitemap.getstarted?.lastModified) {
        lastModified = sitemap.getstarted.lastModified;
      }
    } else {
      // Check in main sections
      for (const sectionKey of ['core', 'styles', 'components']) {
        const section = sitemap[sectionKey];
        
        if (section.path === node.path) {
          if (section.lastModified) {
            lastModified = section.lastModified;
          }
          break;
        }
        
        const item = findItem(section, node.path);
        if (item && item.lastModified) {
          lastModified = item.lastModified;
          break;
        }
      }
    }
    
    // Add to result
    result.push({
      loc: `${BASE_URL}${node.path}`,
      lastmod: lastModified,
      changefreq: node.changefreq,
      priority: node.priority
    });
    
    // Process children if any
    if (node.children && node.children.length > 0) {
      for (const child of node.children) {
        flattenNode(child);
      }
    }
  }
  
  // Start with the root node
  flattenNode(rootNode);
  
  return result;
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
    // Get sitemap URLs dynamically
    let sitemapItems: SitemapItem[] = [];
    
    try {
      sitemapItems = getSitemapUrls();
    } catch (error) {
      console.error("Sitemap generation failed:", error);
      throw new Error(`Failed to generate sitemap: ${error.message}`);
    }
    
    // Ensure we have at least the root URL
    if (sitemapItems.length === 0) {
      console.warn("Generated sitemap is empty, adding root URL");
      const today = new Date().toISOString().split('T')[0];
      sitemapItems = [{
        loc: `${BASE_URL}/`,
        lastmod: today,
        changefreq: "daily",
        priority: 1.0
      }];
    }
    
    // Log sitemap size for debugging
    console.log(`Generated sitemap with ${sitemapItems.length} URLs`);
    
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