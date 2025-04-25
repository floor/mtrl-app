// server/index.ts
import { logRequest, logResponse, logError } from "./middleware/logger.js";
import { handleStaticRequest, handleFaviconRequest } from "./handlers/static.js";
import { handleRobotsRequest, handleLiveReload, handleHealthCheck, handleManifestRequest } from "./handlers/special.js";
import { handleAppRequest, handleNotFound } from "./handlers/app.js";
import { handleApiRequest } from "./handlers/api.js"; // Import the API handler
import { initLiveReload } from "./services/live-reload.js";
import { compressionMiddleware } from "./middleware/compression.js";
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
    
    // Define a variable to hold the response
    let response: Response | null = null;
    
    // Try API handler first
    response = await handleApiRequest(req); // Check for API requests first
    
    // Try special handlers if not an API request
    if (!response) {
      response = handleHealthCheck(req) || 
                 handleRobotsRequest(req) || 
                 ((!isProduction) ? handleLiveReload(req) : null) ||
                 await handleManifestRequest(req) ||
                 await handleFaviconRequest(req);
    }
    
    // If no special handler matched, try static files
    if (!response && (url.pathname.startsWith('/dist/') || url.pathname.startsWith('/public/'))) {
      response = await handleStaticRequest(req);
    }
    
    // If still no match, use the app handler
    if (!response) {
      response = await handleAppRequest(req);
    }
    
    // Apply compression if in production mode
    if (isProduction && response) {
      response = await compressionMiddleware(req, response);
    }
    
    // Log the response
    const endTime = performance.now();
    logResponse(url.pathname, response.status, Math.round(endTime - startTime));
    
    return response;
    
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
📦 Compression: ${isProduction ? "✅ Enabled (gzip)" : "❌ Disabled"}
📁 Static file serving enabled
🌐 Web App Manifest support enabled
🔍 API Routes enabled
${!isProduction ? "🔄 Live reload enabled" : ""}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

console.log(startupBanner);

// Export server for potential programmatic use
export default server;