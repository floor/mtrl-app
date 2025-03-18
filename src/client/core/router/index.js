// src/client/core/router/index.js

import { createRouter } from './router-service'

/**
 * Router factory that provides consistent router creation with application defaults
 */
export const createAppRouter = (options = {}) => {
  const router = createRouter({
    // Merge app defaults with provided options
    defaultRoute: 'home',
    mode: 'history',
    trailingSlash: false,
    scrollRestoration: true,
    debug: process.env.NODE_ENV !== 'production',
    ...options
  })

  // Set up common hooks and handlers
  router.beforeEach((route, prevRoute) => {
    // Log all navigation for debugging
    if (router.config?.debug) {
      console.debug(`Route change: ${prevRoute?.path || 'initial'} -> ${route.path}`)
    }

    // Handle content clearing
    if (options.ui?.content) {
      options.ui.content.scrollTop = 0
      options.ui.content.innerHTML = ''
    }

    return true // Continue navigation
  })

  // Allow additional hooks without requiring direct router access
  if (options.hooks) {
    if (options.hooks.before && Array.isArray(options.hooks.before)) {
      options.hooks.before.forEach(hook => router.beforeEach(hook))
    }

    if (options.hooks.after && Array.isArray(options.hooks.after)) {
      options.hooks.after.forEach(hook => router.afterEach(hook))
    }
  }

  return router
}

// Re-export the router service for direct access if needed
export { createRouter } from './router-service'

// Export default factory function
export default createAppRouter
