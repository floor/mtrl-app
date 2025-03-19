// server/services/live-reload.ts
import { existsSync, readFileSync } from "fs";
import { setNoCacheHeaders } from "../utils/caching.js";
import { writeToFile } from "./file-service.js";
import config from "../config.js";

const { isProduction, paths } = config;

/**
 * Initialize the live reload system
 */
export function initLiveReload(): void {
  if (isProduction) return;
  
  try {
    const timestamp = Date.now().toString();
    writeToFile(paths.reloadFile, timestamp);
    console.log("✓ Live reload initialized");
  } catch (error) {
    console.error("✗ Error initializing live reload:", error);
  }
}

/**
 * Handle a request for the reload timestamp
 * @returns Response with the current timestamp
 */
export function handleReloadRequest(): Response {
  if (isProduction) {
    return new Response("Not available in production", { status: 404 });
  }
  
  const headers = new Headers();
  setNoCacheHeaders(headers);
  headers.set("Content-Type", "text/plain");
  headers.set("Access-Control-Allow-Origin", "*");
  
  try {
    const timestamp = Date.now().toString();
    writeToFile(paths.reloadFile, timestamp);
    return new Response(timestamp, { headers });
  } catch (error) {
    console.error("Error handling reload request:", error);
    return new Response("Error", { status: 500, headers });
  }
}

/**
 * Update the reload timestamp to trigger a page refresh
 */
export function triggerReload(): void {
  if (isProduction) return;
  
  try {
    const timestamp = Date.now().toString();
    writeToFile(paths.reloadFile, timestamp);
  } catch (error) {
    console.error("Error triggering reload:", error);
  }
}

/**
 * Get the live reload script for injection into templates
 * @returns The live reload script
 */
export function getLiveReloadScript(): string {
  if (isProduction) return '';
  
  return `
    <script>
      // Live reload script
      (function() {
        let lastTimestamp = null;
        const RELOAD_CHECK_INTERVAL = 1000; // Check every second
        
        function checkForChanges() {
          fetch('/dist/reload?' + Date.now())
            .then(response => response.text())
            .then(timestamp => {
              // First run, just store the timestamp
              if (lastTimestamp === null) {
                lastTimestamp = timestamp;
                return;
              }
              
              // If timestamp has changed, reload the page
              if (timestamp !== lastTimestamp) {
                console.log('[LiveReload] Changes detected, reloading page...');
                window.location.reload();
              }
            })
            .catch(error => {
              console.warn('[LiveReload] Error checking for changes:', error);
            });
        }
        
        // Start checking for changes
        console.log('[LiveReload] Monitoring for changes...');
        setInterval(checkForChanges, RELOAD_CHECK_INTERVAL);
      })();
    </script>
  `;
}

export default {
  initLiveReload,
  handleReloadRequest,
  triggerReload,
  getLiveReloadScript
};