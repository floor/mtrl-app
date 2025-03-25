// client/core/router/index.js

import createRouter from './service.js'

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

  // Set up scroll tracking to continuously update the current route's scroll position
  if (typeof window !== 'undefined' && router.config.scrollRestoration) {
    let scrollTimer
    window.addEventListener('scroll', () => {
      if (scrollTimer) clearTimeout(scrollTimer)

      scrollTimer = setTimeout(() => {
        const currentRoute = router.getCurrentRoute()
        if (currentRoute) {
          const scrollPosition = window.scrollY || window.pageYOffset || 0
          if (scrollPosition > 0 && router.config.debug) {
            console.log(`[ROUTER] Saving scroll position for ${currentRoute.path}: ${scrollPosition}px`)
          }
          if (options.scrollManager) {
            options.scrollManager.saveScrollPosition(currentRoute)
          }
        }
      }, 200) // Debounce to avoid excessive saves
    }, { passive: true })
  }

  // Set up common hooks and handlers
  router.beforeEach((route, prevRoute) => {
    // Log all navigation for debugging
    if (router.config?.debug) {
      console.debug(`Route change: ${prevRoute?.path || 'initial'} -> ${route.path}`)
    }

    // If we're navigating between routes (not initial) and not from popstate
    // action, we should clear the content but not handle scrolling here
    if (prevRoute && !route.popstate && options.ui?.content) {
      // We don't reset scroll here - let the scroll manager handle that
      // Just clear the content for the new route
      options.ui.content.innerHTML = ''
    }

    return true // Continue navigation
  })

  // Add default after hook to save scroll position after content renders
  router.afterEach((to, from) => {
    // After navigation completes and content renders, track the new route for scroll
    if (router.config.scrollRestoration) {
      // Wait a short delay for content to fully render
      setTimeout(() => {
        if (from && from.path) {
          router.config.debug && console.debug(`AfterEach saving scroll for: ${from.path}`)
          // Additional logging if needed
        }
      }, 50)
    }
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
export { createRouter }

// Export default factory function
export default createAppRouter
