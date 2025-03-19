// server/middleware/compression.ts
import { Readable } from 'stream';
import { gzip, createGzip } from 'zlib';
import { promisify } from 'util';

// Define compressible MIME types
const COMPRESSIBLE_TYPES = [
  'text/html',
  'text/css',
  'text/javascript',
  'application/javascript',
  'text/plain',
  'text/xml',
  'application/json',
  'application/manifest+json',
  'image/svg+xml',
  'application/xml',
  'application/vnd.api+json'
];

// Minimum size to compress (don't bother with tiny files)
const MIN_SIZE_TO_COMPRESS = 1024; // 1KB

// Promisify gzip for easier async usage
const gzipAsync = promisify(gzip);

/**
 * Check if a content type is compressible
 * @param contentType MIME type to check
 * @returns True if the content type is compressible
 */
export function isCompressible(contentType: string): boolean {
  if (!contentType) return false;
  return COMPRESSIBLE_TYPES.some(type => contentType.startsWith(type));
}

/**
 * Check if client accepts compressed responses
 * @param request The request object
 * @returns True if client accepts gzip encoding
 */
export function clientAcceptsGzip(request: Request): boolean {
  const acceptEncoding = request.headers.get('accept-encoding') || '';
  return acceptEncoding.includes('gzip');
}

/**
 * Compress response data using gzip
 * @param responseData Response data to compress
 * @returns Compressed data as Buffer
 */
export async function compressData(responseData: Uint8Array | string): Promise<Buffer> {
  // Convert to Buffer if it's a string
  const dataBuffer = typeof responseData === 'string' 
    ? Buffer.from(responseData) 
    : Buffer.from(responseData);
  
  // Compress the data
  return await gzipAsync(dataBuffer);
}

/**
 * Apply compression to a Response object if appropriate
 * @param response Original Response
 * @param request Original Request (to check accept-encoding)
 * @returns New Response with compression applied if appropriate
 */
export async function compressResponse(response: Response, request: Request): Promise<Response> {
  // Don't compress if client doesn't accept gzip
  if (!clientAcceptsGzip(request)) {
    return response;
  }
  
  // Get content type and check if it's compressible
  const contentType = response.headers.get('content-type') || '';
  if (!isCompressible(contentType)) {
    return response;
  }
  
  // Clone the response to avoid consuming the original
  const clone = response.clone();
  
  // Get the response body
  const bodyBuffer = await clone.arrayBuffer();
  
  // Skip compression for small responses
  if (bodyBuffer.byteLength < MIN_SIZE_TO_COMPRESS) {
    return response;
  }
  
  try {
    // Compress the response body
    const compressedBody = await compressData(new Uint8Array(bodyBuffer));
    
    // Create new headers, copying all from original response
    const newHeaders = new Headers(response.headers);
    
    // Add compression-related headers
    newHeaders.set('content-encoding', 'gzip');
    newHeaders.set('content-length', compressedBody.length.toString());
    newHeaders.set('vary', 'accept-encoding');
    
    // Return new compressed response
    return new Response(compressedBody, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders
    });
  } catch (error) {
    console.error('Compression error:', error);
    // Fall back to uncompressed response on error
    return response;
  }
}

/**
 * Middleware to compress responses
 * @param request Original request
 * @param response Original response
 * @returns Compressed response if appropriate
 */
export async function compressionMiddleware(request: Request, response: Response): Promise<Response> {
  return await compressResponse(response, request);
}

export default compressionMiddleware;