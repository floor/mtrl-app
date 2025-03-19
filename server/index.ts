// server/index.ts
import { logRequest, logResponse, logError } from "./middleware/logger.js";
import { handleStaticRequest, handleFaviconRequest, handleManifestRequest } from "./handlers/static.js";
import { handleRobotsRequest, handleLiveReload, handleHealthCheck } from "./handlers/special.js";
import { handleAppRequest, handleNotFound } from "./handlers/app.js";
import { initLiveReload } from "./services/live-reload.js";
import config from "./config.js";

const { port, isProduction } = config;

// Initialize live reload for development
if (!isProduction) {
  initLiveReload();
}

/**
 * Main request handler
 * @param req The request object
 * @returns The response object
 */
async function handleRequest(req: Request): Promise<Response> {
  const startTime = performance.now();
  const url = new URL(req.url);
  
  try {
    // Log the incoming request
    logRequest(req, url);
    
    // Handle special routes
    // Order matters here - check special routes before static files
    
    // 1. Health check
    const healthResponse = handleHealthCheck(url);
    if (healthResponse) {
      const endTime = performance.now();
      logResponse(url.pathname, healthResponse.status, Math.round(endTime - startTime));
      return healthResponse;
    }
    
    // 2. Robots.txt
    const robotsResponse = handleRobotsRequest(url);
    if (robotsResponse) {
      const endTime = performance.now();
      logResponse(url.pathname, robotsResponse.status, Math.round(endTime - startTime));
      return robotsResponse;
    }
    
    // 3. Live reload (development only)
    const reloadResponse = handleLiveReload(url);
    if (reloadResponse) {
      const endTime = performance.now();
      logResponse(url.pathname, reloadResponse.status, Math.round(endTime - startTime));
      return reloadResponse;
    }
    
    // 4. Web App Manifest (new addition)
    const manifestResponse = await handleManifestRequest(req);
    if (manifestResponse) {
      const endTime = performance.now();
      logResponse(url.pathname, manifestResponse.status, Math.round(endTime - startTime));
      return manifestResponse;
    }
    
    // 5. Favicon
    const faviconResponse = await handleFaviconRequest(req);
    if (faviconResponse) {
      const endTime = performance.now();
      logResponse(url.pathname, faviconResponse.status, Math.round(endTime - startTime));
      return faviconResponse;
    }
    
    // 6. Static files
    const staticResponse = await handleStaticRequest(req);
    if (staticResponse) {
      const endTime = performance.now();
      logResponse(url.pathname, staticResponse.status, Math.round(endTime - startTime));
      return staticResponse;
    }
    
    // 7. Main app (default route)
    const appResponse = await handleAppRequest(url);
    const endTime = performance.now();
    logResponse(url.pathname, appResponse.status, Math.round(endTime - startTime));
    return appResponse;
    
  } catch (error: any) {
    // Handle unexpected errors
    logError(url.pathname, error);
    
    return new Response(`Server Error: ${error.message}`, { 
      status: 500,
      headers: { "Content-Type": "text/plain" }
    });
  }
}

// Start the server
const server = Bun.serve({
  port,
  fetch: handleRequest,
  development: !isProduction
});

// Log server start
const startupBanner = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 Bun HTTP server running on http://localhost:${server.port}
🔧 Mode: ${isProduction ? "🏭 Production" : "🔨 Development"}
📦 Compression: ${isProduction ? "Enabled (gzip)" : "Disabled"}
📁 Static file serving enabled
🌐 Web App Manifest support enabled
${!isProduction ? "🔄 Live reload enabled" : ""}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

console.log(startupBanner);

// Export server for potential programmatic use
export default server;