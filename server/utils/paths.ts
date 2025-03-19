// server/utils/paths.ts
import { join } from "path";
import { existsSync, statSync } from "fs";
import config from "../config.js";

const { paths } = config;

/**
 * Resolve a path to a static file
 * @param urlPath The URL path from the request
 * @returns The resolved file path or null if not found
 */
export function resolveStaticFile(urlPath: string): string | null {
  // Check direct path in dist directory
  if (urlPath.startsWith("/dist/")) {
    const distPath = join(paths.dist, urlPath.substring(5));
    if (isValidFile(distPath)) return distPath;
    
    // Fallback to src/dist
    const srcDistPath = join(paths.srcDist, urlPath.substring(5));
    if (isValidFile(srcDistPath)) return srcDistPath;
  }
  
  // Check public directory
  if (urlPath.startsWith("/public/")) {
    const publicPath = join(paths.public, urlPath.substring(8));
    if (isValidFile(publicPath)) return publicPath;
  }
  
  // Handle root-level requests to public directory
  const publicRootPath = join(paths.public, urlPath);
  if (isValidFile(publicRootPath)) return publicRootPath;
  
  return null;
}

/**
 * Check if a path points to a valid file
 * @param path File path to check
 * @returns Whether the path points to a valid file
 */
export function isValidFile(path: string): boolean {
  try {
    return existsSync(path) && statSync(path).isFile();
  } catch (error) {
    return false;
  }
}

/**
 * Get the path to the main template
 * @param templateName Optional template name, defaults to app.ejs
 * @returns Path to the template file
 */
export function getTemplateFile(templateName: string = "app.ejs"): string {
  return join(paths.templates, templateName);
}

export default {
  resolveStaticFile,
  isValidFile,
  getTemplateFile
};