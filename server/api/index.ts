// server/api/index.ts
import { logError } from "../middleware/logger.js";
import { handleUserRequest } from "./users/index.js";

/**
 * Handle API requests
 * @param req The request object
 * @returns A response object or null if not an API request
 */
export async function handleApiRequest(req: Request): Promise<Response | null> {
  const url = new URL(req.url);
  
  // Check if this is an API request
  if (!url.pathname.startsWith('/api/')) {
    return null;
  }
  
  // Get API endpoint (remove /api/ prefix)
  const endpoint = url.pathname.substring(5);
  
  try {
    // Handle user-related endpoints
    if (endpoint.startsWith('users')) {
      return await handleUserRequest(req, endpoint);
    }
    
    // Return 404 for unknown endpoints
    return new Response(JSON.stringify({ error: 'API endpoint not found' }), {
      status: 404,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store'
      }
    });
  } catch (error: any) {
    logError(url.pathname, error);
    
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store'
      }
    });
  }
}

export default {
  handleApiRequest
};