// server/services/file-service.ts
import { existsSync, statSync, mkdirSync, writeFileSync } from "fs";
import { dirname } from "path";
import { getContentType } from "../utils/mime-types.js";
import { getCacheControl } from "../utils/caching.js";
import { compressContent, setCompressionHeaders } from "../utils/compression.js";

/**
 * Serve a static file with appropriate headers
 * @param filePath Path to the file
 * @returns Response object or null if file doesn't exist
 */
export async function serveStaticFile(filePath: string): Promise<Response | null> {
  try {
    if (!existsSync(filePath) || !statSync(filePath).isFile()) {
      return null;
    }
    
    // Get content type and cache control based on file extension
    const contentType = getContentType(filePath);
    const cacheControl = getCacheControl(filePath);
    
    // Create headers
    const headers = new Headers({
      "Content-Type": contentType,
      "Cache-Control": cacheControl,
      "Access-Control-Allow-Origin": "*"
    });
    
    // Try to compress the file if appropriate
    const file = Bun.file(filePath);
    const content = await file.arrayBuffer();
    const buffer = Buffer.from(content);
    
    const compressed = await compressContent(buffer, contentType);
    setCompressionHeaders(headers, compressed);
    
    if (compressed) {
      return new Response(compressed, { headers });
    } else {
      return new Response(file, { headers });
    }
  } catch (error) {
    console.error(`Error serving file ${filePath}:`, error);
    return new Response("Error serving file", { status: 500 });
  }
}

/**
 * Ensure a directory exists
 * @param dirPath Directory path
 */
export function ensureDirectoryExists(dirPath: string): void {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Write content to a file, ensuring the directory exists
 * @param filePath File path
 * @param content Content to write
 */
export function writeToFile(filePath: string, content: string | Buffer | Uint8Array): void {
  ensureDirectoryExists(dirname(filePath));
  
  if (typeof content === "string") {
    writeFileSync(filePath, content);
  } else {
    Bun.write(filePath, content);
  }
}

export default {
  serveStaticFile,
  ensureDirectoryExists,
  writeToFile
};