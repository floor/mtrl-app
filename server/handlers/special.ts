// server/handlers/special.ts
import { handleReloadRequest } from "../services/live-reload.js";
import { logError } from "../middleware/logger.js";
import config from "../config.js";

/**
 * Handle robots.txt requests
 * @param url The request URL object
 * @returns A response object or null if not a robots.txt request
 */
export function handleRobotsRequest(url: URL): Response | null {
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
 * @param url The request URL object
 * @returns A response object or null if not a reload request
 */
export function handleLiveReload(url: URL): Response | null {
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
 * @param url The request URL object
 * @returns A response object or null if not a health check request
 */
export function handleHealthCheck(url: URL): Response | null {
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

export default {
  handleRobotsRequest,
  handleLiveReload,
  handleHealthCheck
};