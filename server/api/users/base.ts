// server/api/user/base.ts
import { createHash } from "crypto";
import { logError } from "../../middleware/logger.js";

// Define user roles for random assignment
import { FIRST_NAMES, LAST_NAMES, USER_ROLES } from '../../data/list'

// Total number of users to generate
export const TOTAL_USERS = 1000000;

// Default page size
export const DEFAULT_LIMIT = 20;

// Secret key for cursor generation (in a real app, store this securely)
export const CURSOR_SECRET = "cursor-secret-key-change-me";

/**
 * Generate a user with the given ID
 * @param id The user ID
 * @returns A user object
 */
export function generateUser(id: number): any {
  const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  const name = `${firstName} ${lastName}`;
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${id}@example.com`;
  const role = USER_ROLES[Math.floor(Math.random() * USER_ROLES.length)];
  const avatar = firstName.charAt(0);
  
  return {
    id: id.toString(),
    name,
    email,
    role,
    avatar
  };
}

/**
 * Get a batch of users for the given range
 * @param startIndex The starting index
 * @param count The number of users to generate
 * @returns An array of user objects
 */
export function getUserBatch(startIndex: number, count: number): any[] {
  const users = [];
  const endIndex = Math.min(startIndex + count, TOTAL_USERS);
  
  for (let i = startIndex; i < endIndex; i++) {
    users.push(generateUser(i + 1)); // IDs start from 1
  }
  
  return users;
}

/**
 * Create an opaque cursor for the given position
 * @param position The position in the dataset
 * @param limit The page size
 * @param searchTerm Optional search term
 * @returns An encoded cursor string
 */
export function createCursor(position: number, limit: number, searchTerm: string = ""): string {
  // Create a payload with position and other metadata
  const payload = {
    p: position,         // Position in the dataset
    l: limit,            // Page size
    s: searchTerm,       // Search term if any
    t: Date.now()        // Timestamp to prevent guessing
  };
  
  // Encode as base64
  const jsonPayload = JSON.stringify(payload);
  const base64Payload = Buffer.from(jsonPayload).toString('base64');
  
  // Add a simple signature to prevent tampering
  // In production, use a proper HMAC
  const hash = createHash('sha256')
    .update(base64Payload + CURSOR_SECRET)
    .digest('hex')
    .substring(0, 8); // Use first 8 characters of hash
    
  return `${base64Payload}.${hash}`;
}

/**
 * Decode a cursor to get the position
 * @param cursor The cursor string
 * @returns The position and metadata, or null if invalid
 */
export function decodeCursor(cursor: string | null): { position: number, limit: number, searchTerm: string } | null {
  if (!cursor) return null;
  
  try {
    // Split the cursor into payload and signature
    const [base64Payload, signature] = cursor.split('.');
    
    // Verify the signature
    const expectedSignature = createHash('sha256')
      .update(base64Payload + CURSOR_SECRET)
      .digest('hex')
      .substring(0, 8);
      
    if (signature !== expectedSignature) {
      console.warn("Invalid cursor signature");
      return null;
    }
    
    // Decode the payload
    const jsonPayload = Buffer.from(base64Payload, 'base64').toString();
    const payload = JSON.parse(jsonPayload);
    
    // Basic validation
    if (typeof payload.p !== 'number' || payload.p < 0 || payload.p >= TOTAL_USERS) {
      return null;
    }
    
    return {
      position: payload.p,
      limit: payload.l || DEFAULT_LIMIT,
      searchTerm: payload.s || ""
    };
  } catch (error) {
    console.warn("Error decoding cursor:", error);
    return null;
  }
}

/**
 * Search users with the given term
 * This uses a more efficient approach for large datasets by generating
 * and filtering users in batches
 * @param term The search term
 * @param startIndex The starting index
 * @param limit The number of users per page
 * @returns An object with filtered users and total count
 */
export function searchUsers(term: string, startIndex: number, limit: number): { users: any[], totalMatches: number } {
  const batchSize = 1000; // Process users in batches to avoid memory issues
  const lowercaseTerm = term.toLowerCase();
  const matchingUsers = [];
  let totalMatches = 0;
  let foundEnough = false;
  
  // Process users in batches until we find enough matches
  for (let batchStart = 0; batchStart < TOTAL_USERS && !foundEnough; batchStart += batchSize) {
    const batchEnd = Math.min(batchStart + batchSize, TOTAL_USERS);
    const userBatch = getUserBatch(batchStart, batchEnd - batchStart);
    
    // Filter users in this batch
    for (const user of userBatch) {
      if (
        user.name.toLowerCase().includes(lowercaseTerm) || 
        user.email.toLowerCase().includes(lowercaseTerm) ||
        user.role.toLowerCase().includes(lowercaseTerm)
      ) {
        totalMatches++;
        
        // Only add users that are within our desired page
        if (totalMatches > startIndex && matchingUsers.length < limit) {
          matchingUsers.push(user);
        }
        
        // If we've found enough users for this page and counted a reasonable
        // number for estimation, we can stop
        if (matchingUsers.length >= limit && totalMatches >= 1000) {
          foundEnough = true;
          break;
        }
      }
    }
  }
  
  // If we didn't process the entire dataset, estimate the total
  if (foundEnough) {
    // We've processed a partial dataset, so estimate the total
    const processedFraction = totalMatches / TOTAL_USERS;
    // Round to avoid fractional users
    totalMatches = Math.round(totalMatches * (1 / processedFraction));
  }
  
  return {
    users: matchingUsers,
    totalMatches
  };
}

/**
 * Handle a single user request by ID
 * @param req The request object
 * @param endpoint The endpoint path
 * @returns A response object
 */
export async function handleSingleUserRequest(req: Request, endpoint: string): Promise<Response> {
  const userId = endpoint.split('/')[1];
  const userIdNum = parseInt(userId, 10);
  
  // Validate user ID is within range
  if (isNaN(userIdNum) || userIdNum < 1 || userIdNum > TOTAL_USERS) {
    return new Response(JSON.stringify({ error: 'User not found' }), {
      status: 404,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store'
      }
    });
  }
  
  // Generate the user with the given ID
  const user = generateUser(userIdNum);
  
  return new Response(JSON.stringify(user), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store'
    }
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
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store'
    }
  });
}

export default {
  generateUser,
  getUserBatch,
  createCursor,
  decodeCursor,
  searchUsers,
  handleSingleUserRequest,
  apiError,
  TOTAL_USERS,
  DEFAULT_LIMIT
};