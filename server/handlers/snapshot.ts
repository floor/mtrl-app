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
  
  // Only handle paths starting with /snapshot/
  if (!path.startsWith('/snapshot')) {
    return null;
  }
  
  try {
    // Extract the path after /snapshot/
    let subPath = path.replace(/^\/snapshot\/?/, '');
    
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
      return new Response(`Snapshot not found: ${subPath}`, { 
        status: 404,
        headers: { "Content-Type": "text/plain" }
      });
    }
    
    // Serve the snapshot file
    return await serveStaticFile(snapshotPath, {}, req);
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