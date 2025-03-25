// client/core/router/scroll.js

/**
 * Creates a scroll position manager
 * @param {Object} config - Scroll manager configuration
 * @returns {Object} Scroll manager API
 */
export function createScrollManager (config = {}) {
  // Save scroll positions by route path
  const scrollPositions = new Map()

  /**
   * Get the appropriate scroll element
   * @returns {HTMLElement} Scroll element
   */
  function getScrollElement () {
    return config.scrollElement ||
           (config.ui?.content) ||
           document.documentElement
  }

  /**
   * Save the current scroll position for a route
   * @param {Object} route - Route to save position for
   */
  function saveScrollPosition (route) {
    if (!route || !route.path) return

    const scrollElement = getScrollElement()
    scrollPositions.set(route.path, {
      top: scrollElement.scrollTop,
      left: scrollElement.scrollLeft
    })
  }

  /**
   * Restore scroll position for a route
   * @param {Object} route - Route to restore position for
   * @param {boolean} resetIfNotFound - Reset scroll if no saved position
   */
  function restoreScrollPosition (route, resetIfNotFound = true) {
    if (!route || !route.path) return

    const scrollElement = getScrollElement()

    if (scrollPositions.has(route.path)) {
      const position = scrollPositions.get(route.path)
      scrollElement.scrollTop = position.top
      scrollElement.scrollLeft = position.left
    } else if (resetIfNotFound) {
      // Reset to top by default
      scrollElement.scrollTop = 0
      scrollElement.scrollLeft = 0
    }
  }

  /**
   * Reset scroll position for current view
   */
  function resetScroll () {
    const scrollElement = getScrollElement()
    scrollElement.scrollTop = 0
    scrollElement.scrollLeft = 0
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

  return {
    saveScrollPosition,
    restoreScrollPosition,
    resetScroll,
    updateConfig,
    clear
  }
}

export default createScrollManager
