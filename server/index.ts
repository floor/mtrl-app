// server/index.ts
import { logRequest, logResponse, logError } from "./middleware/logger.js";
import { handleStaticRequest, handleFaviconRequest } from "./handlers/static.js";
import { handleRobotsRequest, handleLiveReload, handleHealthCheck, handleManifestRequest } from "./handlers/special.js";
import { handleAppRequest, handleNotFound } from "./handlers/app.js";
import { handleApiRequest } from "./api/index.js";
import { handleMarkdownRequest } from "./handlers/markdown.js";
import { handleSnapshotRequest } from "./handlers/snapshot.js";
import { handleSitemapRequest } from "./handlers/sitemap.js";
import { botDetectionMiddleware } from "./middleware/bot-detection.js"; // Import the bot detection middleware
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
    
    // Try bot detection first - serve static snapshot if it's a bot
    response = await botDetectionMiddleware(req);
    
    // Continue with normal request handling if not handled by bot middleware
    if (!response) {
      // Try API handler
      response = await handleApiRequest(req);
    }
    
    // Try markdown handler
    if (!response) {
      response = await handleMarkdownRequest(req);
    }
    
    // Try sitemap handler
    if (!response) {
      response = await handleSitemapRequest(req);
    }
    
    // Try snapshot handler (for direct snapshot requests)
    if (!response) {
      response = await handleSnapshotRequest(req);
    }

    // Try special handlers if not an API, markdown, or sitemap request
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
🤖 Bot detection: ✅ Enabled (serving snapshots for search engines)
📁 Static file serving enabled
🌐 Web App Manifest support enabled
📝 Markdown documentation support enabled
🔍 API Routes enabled
🗺️ XML/JSON Sitemap support enabled
${!isProduction ? "🔄 Live reload enabled" : ""}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

console.log(startupBanner);

// Export server for potential programmatic use
export default server;