// server/handlers/special.ts
import { handleReloadRequest } from "../services/live-reload.js";
import { logError } from "../middleware/logger.js";
import { resolveStaticFile, isValidFile } from "../utils/paths.js";
import { serveStaticFile } from "../services/file-service.js";
import config from "../config.js";

/**
 * Handle robots.txt requests
 * @param req The request object
 * @returns A response object or null if not a robots.txt request
 */
export function handleRobotsRequest(req: Request): Response | null {
  const url = new URL(req.url);
  if (url.pathname !== "/robots.txt") {
    return null;
  }
  
  try {
    const headers = new Headers({
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400"
    });
    
    return new Response("User-agent: *\nDisallow:", { headers });
  } catch (error: any) {
    logError("/robots.txt", error);
    return new Response(`Error serving robots.txt: ${error.message}`, { 
      status: 500,
      headers: { "Content-Type": "text/plain" }
    });
  }
}

/**
 * Handle live reload requests
 * @param req The request object
 * @returns A response object or null if not a reload request
 */
export function handleLiveReload(req: Request): Response | null {
  const url = new URL(req.url);
  if (url.pathname !== "/dist/reload") {
    return null;
  }
  
  try {
    return handleReloadRequest();
  } catch (error: any) {
    logError("/dist/reload", error);
    return new Response(`Error handling reload: ${error.message}`, { 
      status: 500,
      headers: { "Content-Type": "text/plain" }
    });
  }
}

/**
 * Handle health check requests
 * @param req The request object
 * @returns A response object or null if not a health check request
 */
export function handleHealthCheck(req: Request): Response | null {
  const url = new URL(req.url);
  if (url.pathname !== "/health" && url.pathname !== "/healthz") {
    return null;
  }
  
  try {
    const health = {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: config.isProduction ? "production" : "development"
    };
    
    return new Response(JSON.stringify(health), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache"
      }
    });
  } catch (error: any) {
    logError("/health", error);
    return new Response(`Error checking health: ${error.message}`, { 
      status: 500,
      headers: { "Content-Type": "text/plain" }
    });
  }
}

/**
 * Handle web app manifest requests
 * @param req The request object 
 * @returns A response object or null if not a manifest request
 */
export async function handleManifestRequest(req: Request): Promise<Response | null> {
  const url = new URL(req.url);
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
        }, req);
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
    
    const jsonString = JSON.stringify(defaultManifest, null, 2);
    
    // Set basic headers
    const headers = {
      "Content-Type": "application/manifest+json",
      "Cache-Control": "max-age=3600"
    };
    
    return new Response(jsonString, { status: 200, headers });
  } catch (error: any) {
    logError(path, error);
    return new Response(`Error serving manifest: ${error.message}`, { 
      status: 500,
      headers: { "Content-Type": "text/plain" }
    });
  }
}

export default {
  handleRobotsRequest,
  handleLiveReload,
  handleHealthCheck,
  handleManifestRequest
};