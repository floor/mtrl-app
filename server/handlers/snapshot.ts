// server/handlers/snapshot.ts
import { join } from 'path';
import { existsSync } from 'fs';
import { serveStaticFile } from '../services/file-service.js';
import { logError } from '../middleware/logger.js';
import config from '../config.js';

// Define path to snapshot directory
const SNAPSHOT_DIR = join(config.paths.root, 'snapshot');

/**
 * Handle requests for snapshot files
 * @param req The request object
 * @returns A response object or null if not a snapshot request
 */
export async function handleSnapshotRequest(req: Request): Promise<Response | null> {
  const url = new URL(req.url);
  const path = url.pathname;
  
  // Determine if this is a direct snapshot request or from bot middleware
  const isDirectSnapshotRequest = path.startsWith('/snapshot');
  const isFromBotMiddleware = req.headers.get('user-agent')?.match(/bot|crawler|spider|google|bing|yandex|baidu|slurp/i);
  
  // Only handle direct snapshot requests or requests from bot middleware
  if (!isDirectSnapshotRequest && !isFromBotMiddleware) {
    return null;
  }
  
  try {
    // Extract the path: either after /snapshot/ or the original path for bots
    let subPath = isDirectSnapshotRequest 
      ? path.replace(/^\/snapshot\/?/, '')
      : path.replace(/^\/?/, '');
    
    // If path is empty, serve the index snapshot
    if (!subPath || subPath === '') {
      subPath = 'index.html';
    }
    
    // If path doesn't end with .html, add it (unless it has another extension)
    if (!subPath.includes('.') && !subPath.endsWith('/')) {
      subPath = `${subPath}.html`;
    }
    
    // If path ends with /, serve the index.html in that directory
    if (subPath.endsWith('/')) {
      subPath = `${subPath}index.html`;
    }
    
    // Construct the full path to the snapshot file
    const snapshotPath = join(SNAPSHOT_DIR, subPath);
    
    // Check if the file exists
    if (!existsSync(snapshotPath)) {
      if (isFromBotMiddleware) {
        console.log(`🤖 Bot snapshot not found: ${subPath}, falling back to SPA`);
        // For bots, if snapshot doesn't exist, let the app handle it
        return null;
      } else {
        return new Response(`Snapshot not found: ${subPath}`, { 
          status: 404,
          headers: { "Content-Type": "text/plain" }
        });
      }
    }
    
    // Extra headers specifically for bots
    const customHeaders: Record<string, string> = {};
    
    if (isFromBotMiddleware) {
      // Set proper headers to indicate this is a pre-rendered version
      customHeaders['X-Robots-Tag'] = 'all';
      customHeaders['X-Pre-Rendered'] = 'true';
      customHeaders['Cache-Control'] = 'public, max-age=3600';
      
      console.log(`🤖 Serving snapshot: ${snapshotPath}`);
    }
    
    // Serve the snapshot file
    return await serveStaticFile(snapshotPath, customHeaders, req);
  } catch (error: any) {
    logError(path, error);
    return new Response(`Error serving snapshot: ${error.message}`, { 
      status: 500,
      headers: { "Content-Type": "text/plain" }
    });
  }
}

export default {
  handleSnapshotRequest
};