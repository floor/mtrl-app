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

export default {
  handleStaticRequest,
  handleFaviconRequest
};