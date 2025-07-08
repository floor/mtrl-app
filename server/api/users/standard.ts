// server/api/users/standard.ts
import {
  DEFAULT_LIMIT,
  TOTAL_USERS,
  getUserBatch,
  searchUsers,
} from "./base.js";

/**
 * Find the page number and position for a given user ID
 * @param userId The user ID (1-based)
 * @param limit Items per page
 * @returns Object with page number, index, and existence info
 */
export function findUserPosition(
  userId: number,
  limit: number = DEFAULT_LIMIT
): {
  exists: boolean;
  pageNumber?: number;
  index?: number;
  totalPages?: number;
} {
  // Validate user ID
  if (userId < 1 || userId > TOTAL_USERS) {
    return { exists: false };
  }

  // Convert 1-based ID to 0-based index
  const index = userId - 1;

  // Calculate which page this index falls on
  const pageNumber = Math.floor(index / limit) + 1;
  const totalPages = Math.ceil(TOTAL_USERS / limit);

  return {
    exists: true,
    pageNumber,
    index,
    totalPages,
  };
}

/**
 * Handle finding position by user ID
 * @param req The request object
 * @param url The parsed URL
 * @returns A response object
 */
export async function handleFindPosition(
  req: Request,
  url: URL
): Promise<Response> {
  // Extract user ID from the URL path
  const pathParts = url.pathname.split("/");
  const userIdString = pathParts[pathParts.length - 1]; // Get the last part
  const userId = parseInt(userIdString, 10);

  if (isNaN(userId)) {
    return new Response(
      JSON.stringify({
        error: "Invalid user ID",
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
      }
    );
  }

  // Get page size from query params
  const limit = parseInt(
    url.searchParams.get("limit") || String(DEFAULT_LIMIT),
    10
  );

  // Find the position
  const position = findUserPosition(userId, limit);

  if (!position.exists) {
    return new Response(
      JSON.stringify({
        error: "User not found",
        exists: false,
      }),
      {
        status: 404,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
      }
    );
  }

  return new Response(JSON.stringify(position), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}

/**
 * Handle offset-based pagination requests
 * @param req The request object
 * @param url The parsed URL
 * @returns A response object
 */
export async function handleOffsetPagination(
  req: Request,
  url: URL
): Promise<Response> {
  // Parse query parameters for offset-based pagination
  const offset = Math.max(
    0,
    parseInt(url.searchParams.get("offset") || "0", 10)
  );
  const limit = parseInt(
    url.searchParams.get("limit") || String(DEFAULT_LIMIT),
    10
  );
  const searchTerm = url.searchParams.get("search") || "";

  console.log(
    `🎯 [OFFSET-API] Request: offset=${offset}, limit=${limit}, search="${searchTerm}"`
  );

  // Handle users list with offset pagination
  let users: any[];
  let total: number;

  if (searchTerm) {
    // Handle search case
    const searchResults = searchUsers(searchTerm, offset, limit);
    users = searchResults.users;
    total = searchResults.totalMatches;
  } else {
    // Handle normal offset pagination without search
    users = getUserBatch(offset, limit);
    total = TOTAL_USERS;
  }

  // Calculate pagination metadata for offset-based
  const hasNext = offset + limit < total;
  const hasPrev = offset > 0;
  const nextOffset = hasNext ? offset + limit : null;
  const prevOffset = hasPrev ? Math.max(0, offset - limit) : null;

  console.log(
    `✅ [OFFSET-API] Response: ${users.length} items, hasNext=${hasNext}, hasPrev=${hasPrev}`
  );

  // Return the paginated result with offset pagination metadata
  return new Response(
    JSON.stringify({
      items: users,
      meta: {
        offset,
        limit,
        total,
        hasNext,
        hasPrev,
        nextOffset,
        prevOffset,
      },
    }),
    {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    }
  );
}

/**
 * Handle standard pagination requests (both page-based and offset-based)
 * @param req The request object
 * @param url The parsed URL
 * @returns A response object
 */
export async function handleStandardPagination(
  req: Request,
  url: URL
): Promise<Response> {
  // Check if request uses offset-based pagination
  const hasOffset = url.searchParams.has("offset");

  if (hasOffset) {
    console.log(`🎯 [API] Using offset-based pagination`);
    return handleOffsetPagination(req, url);
  }

  // Fall back to page-based pagination
  console.log(`📄 [API] Using page-based pagination`);

  // Parse query parameters for page-based pagination
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
  const limit = parseInt(
    url.searchParams.get("limit") || String(DEFAULT_LIMIT),
    10
  );
  const searchTerm = url.searchParams.get("search") || "";

  // Calculate start index based on page number
  const startIndex = (page - 1) * limit;

  console.log(
    `📄 [PAGE-API] Request: page=${page}, limit=${limit}, search="${searchTerm}"`
  );

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

  console.log(
    `✅ [PAGE-API] Response: ${users.length} items, page ${page}/${totalPages}, hasNext=${hasNext}`
  );

  // Return the paginated result with standard pagination metadata
  return new Response(
    JSON.stringify({
      items: users,
      meta: {
        page,
        limit,
        totalPages,
        total,
        hasNext,
        hasPrev,
        nextPage: hasNext ? page + 1 : null,
        prevPage: hasPrev ? page - 1 : null,
      },
    }),
    {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    }
  );
}

export default {
  handleStandardPagination,
  handleOffsetPagination,
  handleFindPosition,
  findUserPosition,
};
