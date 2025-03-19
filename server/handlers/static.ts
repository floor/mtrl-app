// server/handlers/static.ts
import { resolveStaticFile, isValidFile } from "../utils/paths.js";
import { serveStaticFile } from "../services/file-service.js";
import { logError } from "../middleware/logger.js";

/**
 * Handle static file requests
 * @param url The request URL object
 * @returns A response object or null if not a static file
 */
export async function handleStaticRequest(url: URL): Promise<Response | null> {
  const path = url.pathname;
  
  try {
    // Skip if not a potential static file path
    if (!path.startsWith("/dist/") && !path.startsWith("/public/")) {
      return null;
    }
    
    // Try to resolve the file path
    const filePath = resolveStaticFile(path);
    if (!filePath) {
      return null;
    }
    
    // Serve the file
    return await serveStaticFile(filePath);
  } catch (error: any) {
    logError(path, error);
    return new Response(`Error serving static file: ${error.message}`, { 
      status: 500,
      headers: { "Content-Type": "text/plain" }
    });
  }
}

/**
 * Handle favicon requests
 * @param url The request URL object
 * @returns A response object or null if not a favicon request
 */
export async function handleFaviconRequest(url: URL): Promise<Response | null> {
  const path = url.pathname;
  
  if (path !== "/favicon.ico") {
    return null;
  }
  
  try {
    // Check multiple potential favicon locations
    const possiblePaths = [
      resolveStaticFile("/favicon.ico"),
      resolveStaticFile("/public/favicon.ico"),
      resolveStaticFile("/dist/favicon.ico")
    ].filter(Boolean) as string[];
    
    for (const faviconPath of possiblePaths) {
      if (isValidFile(faviconPath)) {
        return await serveStaticFile(faviconPath);
      }
    }
    
    // If no favicon found, return a 404
    return new Response("Favicon not found", { status: 404 });
  } catch (error: any) {
    logError(path, error);
    return new Response(`Error serving favicon: ${error.message}`, { 
      status: 500,
      headers: { "Content-Type": "text/plain" }
    });
  }
}

/**
 * Handle web app manifest requests
 * @param url The request URL object
 * @returns A response object or null if not a manifest request
 */
export async function handleManifestRequest(url: URL): Promise<Response | null> {
  const path = url.pathname;
  
  // Check for both naming conventions
  if (path !== "/manifest.json" && path !== "/site.webmanifest") {
    return null;
  }
  
  try {
    // Check multiple potential manifest locations with both naming conventions
    const possiblePaths = [
      // First check for site.webmanifest (the standard)
      resolveStaticFile("/site.webmanifest"),
      resolveStaticFile("/public/site.webmanifest"),
      resolveStaticFile("/dist/site.webmanifest"),
      // Then check for manifest.json (alternative)
      resolveStaticFile("/manifest.json"),
      resolveStaticFile("/public/manifest.json"),
      resolveStaticFile("/dist/manifest.json")
    ].filter(Boolean) as string[];
    
    for (const manifestPath of possiblePaths) {
      if (isValidFile(manifestPath)) {
        return await serveStaticFile(manifestPath, {
          "Content-Type": "application/manifest+json"
        });
      }
    }
    
    // If manifest not found, return the default manifest
    const defaultManifest = {
      "name": "mtrl app",
      "short_name": "mtrl",
      "icons": [
        {
          "src": "/favicon/web-app-manifest-192x192.png",
          "sizes": "192x192",
          "type": "image/png",
          "purpose": "maskable"
        },
        {
          "src": "/favicon/web-app-manifest-512x512.png",
          "sizes": "512x512",
          "type": "image/png",
          "purpose": "maskable"
        }
      ],
      "theme_color": "#ffffff",
      "background_color": "#ffffff",
      "display": "standalone"
    };
    
    return new Response(JSON.stringify(defaultManifest, null, 2), {
      status: 200,
      headers: { "Content-Type": "application/manifest+json" }
    });
  } catch (error: any) {
    logError(path, error);
    return new Response(`Error serving manifest: ${error.message}`, { 
      status: 500,
      headers: { "Content-Type": "text/plain" }
    });
  }
}

export default {
  handleStaticRequest,
  handleFaviconRequest,
  handleManifestRequest
};