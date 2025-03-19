// server/utils/caching.ts
import { extname } from "path";
import config from "../config.js";

const { isProduction, cache } = config;

/**
 * Get cache control header value based on file type and environment
 * @param path File path
 * @returns Cache-Control header value
 */
export function getCacheControl(path: string): string {
  const ext = extname(path);
  
  // CSS files
  if (ext === ".css") {
    const duration = isProduction ? cache.css.production : cache.css.development;
    return duration > 0 ? `public, max-age=${duration}` : "no-cache";
  }
  
  // JavaScript files
  if (ext === ".js" || ext === ".mjs" || ext === ".ts") {
    const duration = isProduction ? cache.js.production : cache.js.development;
    return duration > 0 ? `public, max-age=${duration}` : "no-store, no-cache";
  }
  
  // HTML files - never cache
  if (ext === ".html") {
    return "no-cache";
  }
  
  // Other assets (images, fonts, etc.)
  const duration = isProduction ? cache.assets.production : cache.assets.development;
  return `public, max-age=${duration}`;
}

/**
 * Set no-cache headers for dynamic content
 * @param headers Headers object to modify
 */
export function setNoCacheHeaders(headers: Headers): void {
  headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  headers.set("Pragma", "no-cache");
  headers.set("Expires", "0");
}

/**
 * Generate a cache-busting timestamp parameter
 * @returns Timestamp parameter for URLs
 */
export function getTimestampParam(): string {
  return isProduction ? "" : `?v=${Date.now()}`;
}

export default {
  getCacheControl,
  setNoCacheHeaders,
  getTimestampParam
};