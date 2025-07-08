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
  // Debug logging for dist requests
  if (urlPath.startsWith("/dist/")) {
    console.log(`🔍 [DEBUG] Resolving dist path: ${urlPath}`);
  }

  // Helper function to try directory index files
  const tryDirectoryIndex = (basePath: string): string | null => {
    const indexFiles = ["index.html", "index.htm", "index.js"];
    for (const indexFile of indexFiles) {
      const indexPath = join(basePath, indexFile);
      if (isValidFile(indexPath)) {
        return indexPath;
      }
    }
    return null;
  };

  // Check direct path in dist directory
  if (urlPath.startsWith("/dist/")) {
    const distPath = join(paths.dist, urlPath.substring(5));
    console.log(`🔍 [DEBUG] Checking dist path: ${distPath}`);
    console.log(`🔍 [DEBUG] File exists: ${isValidFile(distPath)}`);
    if (isValidFile(distPath)) return distPath;

    // Try directory index in dist
    const distIndexPath = tryDirectoryIndex(distPath);
    if (distIndexPath) return distIndexPath;

    // Fallback to src/dist
    const srcDistPath = join(paths.srcDist, urlPath.substring(5));
    console.log(`🔍 [DEBUG] Fallback srcDist path: ${srcDistPath}`);
    console.log(`🔍 [DEBUG] SrcDist file exists: ${isValidFile(srcDistPath)}`);
    if (isValidFile(srcDistPath)) return srcDistPath;

    // Try directory index in srcDist
    const srcDistIndexPath = tryDirectoryIndex(srcDistPath);
    if (srcDistIndexPath) return srcDistIndexPath;
  }

  // Check client directory
  if (urlPath.startsWith("/client/")) {
    const clientPath = join(process.cwd(), urlPath);
    if (isValidFile(clientPath)) return clientPath;

    // Try with .js extension for ES module imports
    const clientPathWithJs = clientPath + ".js";
    if (isValidFile(clientPathWithJs)) return clientPathWithJs;

    // Special case for SVG files - check in icons subdirectory
    if (
      urlPath.endsWith(".svg") &&
      urlPath.startsWith("/client/") &&
      !urlPath.includes("/icons/")
    ) {
      const svgFileName = urlPath.substring("/client/".length);
      const iconsPath = join(process.cwd(), "client", "icons", svgFileName);
      if (isValidFile(iconsPath)) return iconsPath;
    }

    // Try directory index in client
    const clientIndexPath = tryDirectoryIndex(clientPath);
    if (clientIndexPath) return clientIndexPath;
  }

  // Check public directory
  if (urlPath.startsWith("/public/")) {
    const publicPath = join(paths.public, urlPath.substring(8));
    if (isValidFile(publicPath)) return publicPath;

    // Try directory index in public
    const publicIndexPath = tryDirectoryIndex(publicPath);
    if (publicIndexPath) return publicIndexPath;
  }

  // Check examples directory (maps to public/examples)
  if (urlPath.startsWith("/examples/")) {
    const examplesPath = join(paths.public, urlPath);
    if (isValidFile(examplesPath)) return examplesPath;

    // Try directory index in examples - this enables /examples/list/ to serve /examples/list/index.html
    const examplesIndexPath = tryDirectoryIndex(examplesPath);
    if (examplesIndexPath) return examplesIndexPath;
  }

  // Handle root-level requests to public directory
  const publicRootPath = join(paths.public, urlPath);
  if (isValidFile(publicRootPath)) return publicRootPath;

  // Try directory index for root-level public requests
  const publicRootIndexPath = tryDirectoryIndex(publicRootPath);
  if (publicRootIndexPath) return publicRootIndexPath;

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
  getTemplateFile,
};
