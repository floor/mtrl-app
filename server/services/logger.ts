// server/middleware/logger.ts
import config from "../config.js";

const { isProduction } = config;

/**
 * Log an incoming request
 * @param req The request object
 * @param url The parsed URL
 */
export function logRequest(req: Request, url: URL): void {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const path = url.pathname;
  
  console.log(`${timestamp} - ${method} ${path}`);
}

/**
 * Log a server response
 * @param path URL path
 * @param status HTTP status code
 * @param time Time taken to process request in ms
 */
export function logResponse(path: string, status: number, time: number): void {
  const color = status >= 500 ? "\x1b[31m" : // Red for server errors
               status >= 400 ? "\x1b[33m" : // Yellow for client errors
               status >= 300 ? "\x1b[36m" : // Cyan for redirects
               status >= 200 ? "\x1b[32m" : // Green for success
               "\x1b[37m"; // White for anything else
  
  const reset = "\x1b[0m";
  
  console.log(`${color}${status}${reset} ${path} ${time}ms`);
}

/**
 * Log an error with request details
 * @param path URL path
 * @param error The error object
 * @param includeStack Whether to include the stack trace
 */
export function logError(path: string, error: Error, includeStack: boolean = !isProduction): void {
  console.error(`\x1b[31mERROR\x1b[0m ${path} - ${error.message}`);
  
  if (includeStack && error.stack) {
    console.error(error.stack);
  }
}

export default {
  logRequest,
  logResponse,
  logError
};