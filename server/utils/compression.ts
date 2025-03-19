// server/utils/compression.ts
import config from "../config.js";
import { isCompressibleType } from "./mime-types.js";

const { isProduction, compression } = config;

/**
 * Compress response content if appropriate
 * @param content Content to compress
 * @param contentType MIME type of the content
 * @returns Compressed content or null if compression isn't appropriate
 */
export async function compressContent(
  content: string | Buffer | Uint8Array, 
  contentType: string
): Promise<Uint8Array | null> {
  // Only compress in production
  if (!isProduction) return null;
  
  // Only compress compressible content types
  if (!isCompressibleType(contentType)) return null;
  
  // Convert content to Buffer if it's a string
  const buffer = typeof content === "string" ? Buffer.from(content) : Buffer.from(content);
  
  // Only compress content larger than threshold
  if (buffer.length < compression.threshold) return null;
  
  try {
    // Use Bun's built-in compression
    return new Uint8Array(await Bun.deflate(buffer, { level: compression.level }));
  } catch (error) {
    console.error("Compression error:", error);
    return null;
  }
}

/**
 * Set compression-related headers if content was compressed
 * @param headers Headers object to modify
 * @param compressed Compressed content or null if not compressed
 */
export function setCompressionHeaders(headers: Headers, compressed: Uint8Array | null): void {
  if (compressed) {
    headers.set("Content-Encoding", "gzip");
  }
  
  // Always set Vary header to indicate content varies based on Accept-Encoding
  headers.set("Vary", "Accept-Encoding");
}

export default {
  compressContent,
  setCompressionHeaders
};