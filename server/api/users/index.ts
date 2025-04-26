// server/api/users/index.ts
import { handleSingleUserRequest } from "./base.js";
import { handleStandardPagination } from "./standard.js";
import { handleCursorPagination } from "./cursor.js";

/**
 * Route users-related API requests to the appropriate handler
 * @param req The request object
 * @param endpoint The endpoint path (without /api/ prefix)
 * @returns A response object
 */
export async function handleUserRequest(req: Request, endpoint: string): Promise<Response> {
  const url = new URL(req.url);
  
  // Check if it's a request for a single user
  if (endpoint.match(/^users\/\d+$/)) {
    return await handleSingleUserRequest(req, endpoint);
  }
  
  // Check if it's a cursor-based pagination request
  if (endpoint === 'users/cursor' || endpoint === 'users/cursor/') {
    return await handleCursorPagination(req, url);
  }
  
  // Default to standard pagination
  if (endpoint === 'users' || endpoint === 'users/') {
    return await handleStandardPagination(req, url);
  }
  
  // If no handler matches, return 404
  return new Response(JSON.stringify({ error: 'User API endpoint not found' }), {
    status: 404,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store'
    }
  });
}

export default {
  handleUserRequest
};