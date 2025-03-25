// client/core/router/scroll.js

/**
 * Creates a scroll position manager using the window for scrolling
 * @param {Object} config - Scroll manager configuration
 * @returns {Object} Scroll manager API
 */
export function createScrollManager (config = {}) {
  // Save scroll positions by route path
  const scrollPositions = new Map()

  /**
   * Save the current scroll position for a route
   * @param {Object} route - Route to save position for
   */
  function saveScrollPosition (route) {
    if (!route || !route.path) return

    // Always use window scrollY for consistency
    const scrollPosition = window.scrollY || window.pageYOffset || 0

    // console.log(`[SCROLL] Saving position for "${route.path}": ${scrollPosition}px`)

    if (scrollPosition > 0) {
      scrollPositions.set(route.path, {
        position: scrollPosition,
        timestamp: Date.now()
      })
    }
  }

  /**
   * Restore scroll position for a route
   * @param {Object} route - Route to restore position for
   * @param {boolean} resetIfNotFound - Reset scroll if no saved position
   * @returns {boolean} Whether position was restored
   */
  function restoreScrollPosition (route, resetIfNotFound = true) {
    if (!route || !route.path) return false

    // console.log(`[SCROLL] Attempting to restore position for "${route.path}"`)

    if (scrollPositions.has(route.path)) {
      const saved = scrollPositions.get(route.path)
      // console.log(`[SCROLL] Found saved position: ${saved.position}px`)

      // Ensure DOM is ready before scrolling
      setTimeout(() => {
        console.log(`[SCROLL] Applying scroll to: ${saved.position}px`)
        window.scrollTo(0, saved.position)

        // Double-check after a delay to make sure it applied
        setTimeout(() => {
          if (window.scrollY !== saved.position) {
            console.log(`[SCROLL] Position check failed. Re-applying: ${saved.position}px`)
            window.scrollTo(0, saved.position)
          }
        }, 100)
      }, 50)

      return true
    } else {
      console.log(`[SCROLL] No saved position found for "${route.path}"`)

      if (resetIfNotFound) {
        resetScroll()
      }
      return false
    }
  }

  /**
   * Reset scroll position to top
   */
  function resetScroll () {
    // console.log('[SCROLL] Resetting scroll to top')
    window.scrollTo(0, 0)
  }

  /**
   * Handle popstate events for scroll restoration
   * @param {Object} route - Current route after popstate
   * @param {Object} previousRoute - Previous route before popstate
   * @returns {boolean} Whether scroll was handled
   */
  function handlePopStateScroll (route, previousRoute) {
    // console.log(`[SCROLL] Handling popstate for "${route.path}"`)
    return restoreScrollPosition(route, true)
  }

  /**
   * Update scroll manager configuration
   * @param {Object} newConfig - New configuration
   */
  function updateConfig (newConfig) {
    Object.assign(config, newConfig)
  }

  /**
   * Clear all saved scroll positions
   */
  function clear () {
    scrollPositions.clear()
  }

  // console.log(`[SCROLL] Scroll manager initialized with scrollRestoration=${config.scrollRestoration}`)

  // For manual saving during scroll
  if (typeof window !== 'undefined') {
    window.saveCurrentScroll = (path) => {
      const currentPath = path || (window.app && window.app.getRouter)
        ? window.app.getRouter().getCurrentRoute().path
        : 'unknown-path'
      console.log(`[SCROLL] Manual save for ${currentPath}: ${window.scrollY}px`)
      scrollPositions.set(currentPath, {
        position: window.scrollY || 0,
        timestamp: Date.now()
      })
    }
  }

  return {
    saveScrollPosition,
    restoreScrollPosition,
    resetScroll,
    handlePopStateScroll,
    updateConfig,
    clear
  }
}

export default createScrollManager
