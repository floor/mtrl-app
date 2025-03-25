// client/core/router/parser.js

/**
 * Parse a path into route components
 * @param {string} path - URL path to parse
 * @param {Object} config - Router configuration
 * @returns {Object} Parsed route object
 */
export function parsePath (path, config) {
  // Normalize the path
  let cleanPath = path || ''

  // Remove trailing slash if configured
  if (!config.trailingSlash && cleanPath.endsWith('/') && cleanPath !== '/') {
    cleanPath = cleanPath.slice(0, -1)
  }

  // Remove leading slashes and split into segments
  cleanPath = cleanPath.replace(/^\/+/, '')
  const segments = cleanPath.split('/').filter(Boolean)

  // Extract route parts
  const section = segments[0] || config.defaultRoute
  const subsection = segments.slice(1).join('/') || ''
  const params = {}

  // Extract query parameters if present
  const queryIndex = path.indexOf('?')
  let query = ''

  if (queryIndex !== -1) {
    query = path.substring(queryIndex + 1)
    const searchParams = new URLSearchParams(query)
    searchParams.forEach((value, key) => {
      params[key] = value
    })
  }

  return {
    section,
    subsection,
    path: cleanPath ? `/${cleanPath}` : '/',
    originalPath: path,
    params,
    query
  }
}

/**
 * Generate a path from route parts
 * @param {string} section - Main route section
 * @param {string} subsection - Route subsection
 * @param {Object} params - Query parameters
 * @param {Object} config - Router configuration
 * @returns {string} Generated path
 */
export function generatePath (section, subsection = '', params = {}, config) {
  if (section === config.defaultRoute && !subsection) {
    return '/'
  }

  let path = subsection ? `/${section}/${subsection}` : `/${section}`

  // Add trailing slash if configured
  if (config.trailingSlash && !path.endsWith('/')) {
    path += '/'
  }

  // Add query parameters if present
  if (Object.keys(params).length > 0) {
    const queryParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value)
      }
    })

    const queryString = queryParams.toString()
    if (queryString) {
      path += `?${queryString}`
    }
  }

  return path
}

/**
 * Find a matching route handler
 * @param {Object} route - Route object to match
 * @param {Map} routes - Map of registered routes
 * @returns {Object|null} Matched route handler or null
 */
export function findRouteHandler (route, routes) {
  // First check for exact match with section and subsection
  const fullPath = route.subsection ? `${route.section}/${route.subsection}` : route.section
  if (routes.has(fullPath)) {
    return routes.get(fullPath)
  }

  // Then check for section-only match
  if (routes.has(route.section)) {
    return routes.get(route.section)
  }

  // Finally check for wildcard matches
  for (const [path, handler] of routes.entries()) {
    // Simple wildcard with * at end
    if (path.endsWith('*')) {
      const prefix = path.slice(0, -1)
      if (fullPath.startsWith(prefix)) {
        return handler
      }
    }

    // Path parameter matching with :param syntax
    if (path.includes(':')) {
      const isMatch = matchPathWithParams(path, fullPath, route)
      if (isMatch) {
        return handler
      }
    }
  }

  return null
}

/**
 * Match a path with parameters
 * @param {string} pattern - Route pattern with params
 * @param {string} path - Actual path to match
 * @param {Object} route - Route object to update with params
 * @returns {boolean} Whether the path matches
 */
export function matchPathWithParams (pattern, path, route) {
  const patternParts = pattern.split('/')
  const pathParts = path.split('/')

  if (patternParts.length !== pathParts.length) {
    return false
  }

  for (let i = 0; i < patternParts.length; i++) {
    const patternPart = patternParts[i]
    const pathPart = pathParts[i]

    // Skip exact matches
    if (patternPart === pathPart) {
      continue
    }

    // Handle parameters
    if (patternPart.startsWith(':')) {
      const paramName = patternPart.substring(1)
      route.params[paramName] = pathPart
    } else {
      return false
    }
  }

  return true
}
