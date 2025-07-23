// server/api/user/base.ts
import { createHash } from "crypto";
import { logError } from "../../middleware/logger.js";
import { getUserService } from "../../data/user-service.js";

// Get user service instance
let userService: any = null;
async function getUserServiceInstance() {
  if (!userService) {
    userService = await getUserService();
  }
  return userService;
}

// Total number of users (dynamic based on data source)
export async function getTotalUsers() {
  const service = await getUserServiceInstance();
  return await service.getTotalUsers();
}

// Maintain backward compatibility
export const TOTAL_USERS = 1000000; // Default fallback for synchronous calls

// Default page size
export const DEFAULT_LIMIT = 20;

// Secret key for cursor generation (in a real app, store this securely)
export const CURSOR_SECRET = "cursor-secret-key-change-me";

/**
 * Get a user by ID from the data source
 * @param id The user ID (1-based)
 * @returns A user object or null if not found
 */
export async function getUserById(id: number): Promise<any> {
  const service = await getUserServiceInstance();
  return await service.getUserById(id);
}

/**
 * Get a batch of users for the given range from data source
 * @param startIndex The starting index (0-based)
 * @param count The number of users to return
 * @returns An array of user objects
 */
export async function getUserBatch(
  startIndex: number,
  count: number
): Promise<any[]> {
  const service = await getUserServiceInstance();
  return await service.getUserBatch(startIndex, count);
}

/**
 * Create an opaque cursor for the given position
 * @param position The position in the dataset
 * @param limit The page size
 * @param searchTerm Optional search term
 * @returns An encoded cursor string
 */
export function createCursor(
  position: number,
  limit: number,
  searchTerm: string = ""
): string {
  // Create a payload with position and other metadata
  const payload = {
    p: position, // Position in the dataset
    l: limit, // Page size
    s: searchTerm, // Search term if any
    t: Date.now(), // Timestamp to prevent guessing
  };

  // Encode as base64
  const jsonPayload = JSON.stringify(payload);
  const base64Payload = Buffer.from(jsonPayload).toString("base64");

  // Add a simple signature to prevent tampering
  // In production, use a proper HMAC
  const hash = createHash("sha256")
    .update(base64Payload + CURSOR_SECRET)
    .digest("hex")
    .substring(0, 8); // Use first 8 characters of hash

  return `${base64Payload}.${hash}`;
}

/**
 * Decode a cursor to get the position
 * @param cursor The cursor string
 * @returns The position and metadata, or null if invalid
 */
export function decodeCursor(
  cursor: string | null
): { position: number; limit: number; searchTerm: string } | null {
  if (!cursor) return null;

  try {
    // Split the cursor into payload and signature
    const [base64Payload, signature] = cursor.split(".");

    // Verify the signature
    const expectedSignature = createHash("sha256")
      .update(base64Payload + CURSOR_SECRET)
      .digest("hex")
      .substring(0, 8);

    if (signature !== expectedSignature) {
      console.warn("Invalid cursor signature");
      return null;
    }

    // Decode the payload
    const jsonPayload = Buffer.from(base64Payload, "base64").toString();
    const payload = JSON.parse(jsonPayload);

    // Basic validation
    if (
      typeof payload.p !== "number" ||
      payload.p < 0 ||
      payload.p >= TOTAL_USERS
    ) {
      return null;
    }

    return {
      position: payload.p,
      limit: payload.l || DEFAULT_LIMIT,
      searchTerm: payload.s || "",
    };
  } catch (error) {
    console.warn("Error decoding cursor:", error);
    return null;
  }
}

/**
 * Search users with the given term
 * @param term The search term
 * @param startIndex The starting index
 * @param limit The number of users per page
 * @returns An object with filtered users and total count
 */
export async function searchUsers(
  term: string,
  startIndex: number,
  limit: number
): Promise<{ users: any[]; totalMatches: number }> {
  const service = await getUserServiceInstance();
  return await service.searchUsers(term, startIndex, limit);
}

/**
 * Handle a single user request by ID
 * @param req The request object
 * @param endpoint The endpoint path
 * @returns A response object
 */
export async function handleSingleUserRequest(
  req: Request,
  endpoint: string
): Promise<Response> {
  const userId = endpoint.split("/")[1];
  const userIdNum = parseInt(userId, 10);

  // Get total users for validation
  const totalUsers = await getTotalUsers();

  // Validate user ID is within range
  if (isNaN(userIdNum) || userIdNum < 1 || userIdNum > totalUsers) {
    return new Response(JSON.stringify({ error: "User not found" }), {
      status: 404,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    });
  }

  // Get the user with the given ID
  const user = await getUserById(userIdNum);

  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), {
      status: 404,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    });
  }

  return new Response(JSON.stringify(user), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}

/**
 * Create standardized API error response
 * @param message Error message
 * @param status HTTP status code
 * @returns Response object
 */
export function apiError(message: string, status: number = 404): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}

export default {
  getUserById,
  getUserBatch,
  createCursor,
  decodeCursor,
  searchUsers,
  handleSingleUserRequest,
  apiError,
  TOTAL_USERS,
  DEFAULT_LIMIT,
};
