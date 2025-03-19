// server/utils/mime-types.js
import { extname } from 'path'

// MIME types map for content-type headers
export const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.ts': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'font/otf'
}

/**
 * Get the content type based on file extension
 * @param {string} path File path
 * @returns {string} Content type
 */
export function getContentType (path) {
  const ext = extname(path)
  return MIME_TYPES[ext] || 'application/octet-stream'
}

/**
 * Check if a content type is compressible
 * @param {string} contentType The content type
 * @returns {boolean} Whether the content type is compressible
 */
export function isCompressibleType (contentType) {
  return /javascript|typescript|text\/css|text\/html|application\/json|text\/plain/.test(contentType)
}

/**
 * Check if a file is a text-based file that can be compressed
 * @param {string} path File path
 * @returns {boolean} Whether the file is compressible
 */
export function isCompressibleFile (path) {
  const contentType = getContentType(path)
  return isCompressibleType(contentType)
}

export default {
  MIME_TYPES,
  getContentType,
  isCompressibleType,
  isCompressibleFile
}
