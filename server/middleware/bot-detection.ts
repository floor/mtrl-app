// server/middleware/bot-detection.ts
import { join } from "path";
import { existsSync } from "fs";
import { handleSnapshotRequest } from "../handlers/snapshot.js";
import { logRequest } from "./logger.js";
import config from "../config.js";

// More comprehensive regex pattern for search engine and social media bots
const BOT_USER_AGENT_PATTERN = /googlebot|bingbot|yandex|baiduspider|twitterbot|facebookexternalhit|rogerbot|linkedinbot|embedly|quora link preview|showyoubot|outbrain|pinterest|slackbot|vkShare|W3C_Validator|whatsapp|tiktok|slurp|duckduckbot|ahrefsbot|semrushbot|applebot|bingpreview|discordbot|telegrambot|petalbot|ia_archiver|facebot|feedfetcher/i;

// List of file extensions that should always be served normally, not from snapshots
const BYPASS_EXTENSIONS = [
  '.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', 
  '.json', '.woff', '.woff2', '.ttf', '.eot', '.ico'
];

// Cache bot detection results to avoid repeated regex checks (simple in-memory LRU)
const botDetectionCache = new Map<string, boolean>();
const MAX_CACHE_SIZE = 1000;

/**
 * Check if a request is from a search engine bot
 * @param request The request object
 * @returns Whether the request is from a bot
 */
export function isBot(request: Request): boolean {
  const userAgent = request.headers.get('user-agent') || '';
  
  // Check cache first
  if (botDetectionCache.has(userAgent)) {
    return botDetectionCache.get(userAgent) as boolean;
  }
  
  // Perform regex check
  const isUserAgentBot = BOT_USER_AGENT_PATTERN.test(userAgent);
  
  // Check for explicit bot headers (many crawlers self-identify with these)
  const isBotByHeaders = 
    request.headers.get('x-moz') === 'prefetch' || 
    request.headers.get('purpose') === 'prefetch' ||
    request.headers.get('sec-purpose') === 'prefetch' ||
    request.headers.get('x-purpose') === 'preview';
  
  const result = isUserAgentBot || isBotByHeaders;
  
  // Cache the result
  if (botDetectionCache.size >= MAX_CACHE_SIZE) {
    // If cache is full, remove oldest entry (first key)
    const firstKey = botDetectionCache.keys().next().value;
    botDetectionCache.delete(firstKey);
  }
  botDetectionCache.set(userAgent, result);
  
  return result;
}

/**
 * Check if a path should bypass bot detection
 * @param path The URL path
 * @returns Whether the path should bypass bot detection
 */
export function shouldBypassBotDetection(path: string): boolean {
  // Always bypass for API requests, static assets, and health checks
  if (path.startsWith('/api/') || 
      path.startsWith('/dist/') || 
      path.startsWith('/public/') ||
      path === '/health' ||
      path === '/healthz') {
    return true;
  }
  
  // Bypass for specific file extensions
  const extension = path.split('.').pop()?.toLowerCase();
  if (extension && BYPASS_EXTENSIONS.includes(`.${extension}`)) {
    return true;
  }
  
  // Explicitly bypass bot detection for robots.txt and sitemap.xml
  if (path === '/robots.txt' || path === '/sitemap.xml') {
    return true;
  }
  
  return false;
}

/**
 * Middleware to handle bot requests and serve static snapshots
 * @param request The request object
 * @returns A response if bot was detected, null otherwise
 */
export async function botDetectionMiddleware(request: Request): Promise<Response | null> {
  const url = new URL(request.url);
  const path = url.pathname;
  
  // Skip bot detection for certain paths
  if (shouldBypassBotDetection(path)) {
    return null;
  }
  
  // Check if request is from a bot
  if (isBot(request)) {
    const userAgent = request.headers.get('user-agent') || '';
    // Use a shorter line for more readability in logs
    const shortUserAgent = userAgent.length > 50 
      ? userAgent.substring(0, 47) + '...' 
      : userAgent;
      
    console.log(`🤖 Bot detected: ${shortUserAgent}`);
    
    // Create a new request to the snapshot handler
    // We're keeping the original URL but redirecting it internally to the snapshot handler
    const snapshotPath = path === '/' ? '/snapshot/' : `/snapshot${path}`;
    const snapshotUrl = new URL(snapshotPath, url.origin);
    
    // Create a new request for the snapshot
    const snapshotRequest = new Request(snapshotUrl.toString(), {
      headers: request.headers,
      method: request.method
    });
    
    // Try to serve the snapshot
    const snapshotResponse = await handleSnapshotRequest(snapshotRequest);
    
    // If a snapshot was found, serve it with bot-friendly headers
    if (snapshotResponse) {
      // Create a new response with additional headers for bots
      const headers = new Headers(snapshotResponse.headers);
      
      // Add bot-friendly headers
      headers.set('X-Robots-Tag', 'all'); // Allow indexing
      headers.set('X-Pre-Rendered', 'true'); // Indicate pre-rendered content
      
      // Ensure caching is appropriate for bots
      headers.set('Cache-Control', 'public, max-age=3600'); // 1 hour cache
      
      return new Response(snapshotResponse.body, {
        status: snapshotResponse.status,
        statusText: snapshotResponse.statusText,
        headers
      });
    }
    
    // If no snapshot was found, log and continue to normal handling
    console.log(`🤖 Bot snapshot not found for ${path}, falling back to SPA`);
  }
  
  // Not a bot or no snapshot found, continue with normal handling
  return null;
}

export default {
  isBot,
  shouldBypassBotDetection,
  botDetectionMiddleware
};