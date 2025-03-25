// client/core/router/navigation.js

/**
 * Creates a navigation stack manager
 * @param {number} maxSize - Maximum size of the navigation stack
 * @returns {Object} Navigation stack manager API
 */
export function createNavigationStack (maxSize = 20) {
  let navigationStack = []
  let currentRoute = null
  let previousRoute = null

  /**
   * Add a route to the navigation stack
   * @param {Object} route - Route to add
   */
  function push (route) {
    // Make a copy to avoid reference issues
    const routeCopy = { ...route, timestamp: Date.now() }

    // Update previous route
    previousRoute = currentRoute

    // Update current route
    currentRoute = routeCopy

    // Add to navigation stack
    navigationStack.push(routeCopy)

    // Maintain maximum stack size
    if (navigationStack.length > maxSize) {
      navigationStack.shift()
    }
  }

  /**
   * Get the current route
   * @returns {Object|null} Current route
   */
  function getCurrent () {
    return currentRoute
  }

  /**
   * Get the previous route
   * @returns {Object|null} Previous route
   */
  function getPrevious () {
    return previousRoute
  }

  /**
   * Get the entire navigation stack
   * @returns {Array} Navigation stack
   */
  function getStack () {
    return [...navigationStack]
  }

  /**
   * Set the maximum stack size
   * @param {number} size - New maximum size
   */
  function setMaxSize (size) {
    if (typeof size === 'number' && size > 0) {
      maxSize = size

      // Trim stack if needed
      if (navigationStack.length > maxSize) {
        navigationStack = navigationStack.slice(-maxSize)
      }
    }
  }

  /**
   * Clear the navigation stack
   */
  function clear () {
    navigationStack = []
    currentRoute = null
    previousRoute = null
  }

  return {
    push,
    getCurrent,
    getPrevious,
    getStack,
    setMaxSize,
    clear
  }
}

export default createNavigationStack
