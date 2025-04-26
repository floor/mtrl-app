// server/api/users/cursor.ts
import { 
  DEFAULT_LIMIT, 
  TOTAL_USERS, 
  getUserBatch, 
  searchUsers,
  createCursor,
  decodeCursor  
} from "./base.js";

/**
 * Handle cursor-based pagination requests
 * @param req The request object
 * @param url The parsed URL
 * @returns A response object
 */
export async function handleCursorPagination(req: Request, url: URL): Promise<Response> {
  // Parse query parameters
  const limit = parseInt(url.searchParams.get('limit') || String(DEFAULT_LIMIT), 10);
  const searchTerm = url.searchParams.get('search') || '';
  const cursor = url.searchParams.get('cursor');
  
  // Handle cursor-based pagination
  let startIndex = 0;
  let cursorData = null;
  
  if (cursor) {
    cursorData = decodeCursor(cursor);
    if (cursorData) {
      startIndex = cursorData.position;
      // If search term in cursor doesn't match current search, ignore cursor
      if (cursorData.searchTerm !== searchTerm) {
        startIndex = 0;
      }
    }
  }
  
  // Add some artificial delay to simulate network latency
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Handle users list with pagination
  let users: any[];
  let total: number;
  let hasNext: boolean;
  let nextCursor: string | null = null;
  
  if (searchTerm) {
    // Handle search case
    const searchResults = searchUsers(searchTerm, startIndex, limit);
    users = searchResults.users;
    total = searchResults.totalMatches;
    hasNext = startIndex + users.length < total;
    
    if (hasNext) {
      nextCursor = createCursor(startIndex + users.length, limit, searchTerm);
    }
  } else {
    // Handle normal pagination without search
    users = getUserBatch(startIndex, limit);
    total = TOTAL_USERS;
    hasNext = startIndex + users.length < total;
    
    if (hasNext) {
      nextCursor = createCursor(startIndex + users.length, limit);
    }
  }
  
  // Return the paginated result with cursor
  return new Response(JSON.stringify({
    items: users,
    meta: {
      cursor: nextCursor,
      hasNext,
      total
    }
  }), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store'
    }
  });
}

export default {
  handleCursorPagination
};