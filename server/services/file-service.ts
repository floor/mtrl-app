// server/services/file-service.ts

import { readFile, stat, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { extname, dirname } from 'path';

// MIME type mapping for static files
const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json', // Specific MIME type for web manifests
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.ttf': 'font/ttf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mp3': 'audio/mpeg',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain'
};

/**
 * Get the MIME type for a file based on its extension
 * @param filePath Path to the file
 * @returns The MIME type or a default
 */
function getMimeType(filePath: string): string {
  const ext = extname(filePath).toLowerCase();
  return MIME_TYPES[ext] || 'application/octet-stream';
}

/**
 * Serve a static file with proper headers
 * @param filePath Absolute path to the file
 * @param customHeaders Additional headers to add
 * @param request Optional request object for future enhancements
 * @returns Response object with the file content
 */
export async function serveStaticFile(
  filePath: string, 
  customHeaders: Record<string, string> = {},
  request?: Request
): Promise<Response> {
  try {
    // Special case for webmanifest files to ensure proper content type
    if (filePath.endsWith('.webmanifest') || filePath.endsWith('manifest.json')) {
      const content = await readFile(filePath, 'utf-8');
      
      try {
        // Parse and stringify to validate JSON and clean any potential issues
        const parsedContent = JSON.parse(content);
        const jsonString = JSON.stringify(parsedContent, null, 2);
        
        return new Response(jsonString, {
          status: 200,
          headers: {
            'Content-Type': 'application/manifest+json',
            'Cache-Control': 'max-age=3600',
            ...customHeaders
          }
        });
      } catch (jsonError) {
        console.error(`Invalid JSON in manifest file: ${filePath}`, jsonError);
        // Return the raw content if parsing fails
        return new Response(content, {
          status: 200,
          headers: {
            'Content-Type': 'application/manifest+json',
            ...customHeaders
          }
        });
      }
    }

    // For all other files
    const fileContent = await readFile(filePath);
    const fileStats = await stat(filePath);
    const lastModified = new Date(fileStats.mtime).toUTCString();
    
    // Get proper MIME type based on file extension
    const contentType = getMimeType(filePath);
    
    // Base headers
    const headers = {
      'Content-Type': contentType,
      'Content-Length': fileStats.size.toString(),
      'Last-Modified': lastModified,
      'Cache-Control': 'max-age=3600',
      ...customHeaders
    };

    return new Response(fileContent, { status: 200, headers });
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return new Response('File not found', { status: 404 });
    }
    
    console.error(`Error serving file ${filePath}:`, error);
    return new Response('Error serving file', { status: 500 });
  }
}

/**
 * Write content to a file, creating directories if needed
 * @param filePath Path to write the file to
 * @param content Content to write (string or Buffer)
 * @returns Promise that resolves when file is written
 */
export async function writeToFile(filePath: string, content: string | Buffer): Promise<void> {
  try {
    // Ensure the directory exists
    const dirPath = dirname(filePath);
    if (!existsSync(dirPath)) {
      await mkdir(dirPath, { recursive: true });
    }
    
    // Write the file
    await writeFile(filePath, content);
  } catch (error) {
    console.error(`Error writing to file ${filePath}:`, error);
    throw error;
  }
}