// server/api/users/standard.ts
import { 
  DEFAULT_LIMIT, 
  TOTAL_USERS, 
  getUserBatch, 
  searchUsers 
} from "./base.js";

/**
 * Handle standard pagination requests
 * @param req The request object
 * @param url The parsed URL
 * @returns A response object
 */
export async function handleStandardPagination(req: Request, url: URL): Promise<Response> {
  // Parse query parameters
  const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
  const limit = parseInt(url.searchParams.get('limit') || String(DEFAULT_LIMIT), 10);
  const searchTerm = url.searchParams.get('search') || '';
  
  // Calculate start index based on page number
  const startIndex = (page - 1) * limit;
  
  // Add some artificial delay to simulate network latency
  // await new Promise(resolve => setTimeout(resolve, 300));
  
  // Handle users list with pagination
  let users: any[];
  let total: number;
  
  if (searchTerm) {
    // Handle search case
    const searchResults = searchUsers(searchTerm, startIndex, limit);
    users = searchResults.users;
    total = searchResults.totalMatches;
  } else {
    // Handle normal pagination without search
    users = getUserBatch(startIndex, limit);
    total = TOTAL_USERS;
  }
  
  // Calculate pagination metadata
  const totalPages = Math.ceil(total / limit);
  const hasNext = page < totalPages;
  const hasPrev = page > 1;
  
  // Return the paginated result with standard pagination metadata
  return new Response(JSON.stringify({
    items: users,
    meta: {
      page,
      limit,
      totalPages,
      total,
      hasNext,
      hasPrev,
      nextPage: hasNext ? page + 1 : null,
      prevPage: hasPrev ? page - 1 : null
    }
  }), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store'
    }
  });
}

export default {
  handleStandardPagination
};