// client/core/router/history.js

/**
 * Creates a history manager
 * @param {Function} onPopState - Handler for popstate events
 * @returns {Object} History manager API
 */
export function createHistoryManager (onPopState) {
  /**
   * Initialize the history manager
   */
  function init () {
    window.addEventListener('popstate', handlePopState)
  }

  /**
   * Handle browser popstate events
   * @param {PopStateEvent} event - Browser popstate event
   * @private
   */
  function handlePopState (event) {
    if (typeof onPopState === 'function') {
      onPopState(event)
    }
  }

  /**
   * Update the browser history
   * @param {Object} route - Route object
   * @param {Object} options - Navigation options
   */
  function updateHistory (route, options = {}) {
    // Ensure we use a relative URL path (starts with /)
    let path = route.path
    if (!path.startsWith('/')) {
      path = '/' + path
    }

    // Store navigation state in history
    const historyData = {
      ...route,
      timestamp: Date.now(),
      popstate: options.popstate
    }

    if (options.replace) {
      window.history.replaceState(historyData, '', path)
    } else {
      window.history.pushState(historyData, '', path)
    }
  }

  /**
   * Go back in browser history
   * @returns {boolean} Success status
   */
  function back () {
    if (window.history.length > 1) {
      window.history.back()
      return true
    }
    return false
  }

  /**
   * Go forward in browser history
   * @returns {boolean} Success status
   */
  function forward () {
    if (window.history.length > 1) {
      window.history.forward()
      return true
    }
    return false
  }

  /**
   * Clean up event listeners
   */
  function destroy () {
    window.removeEventListener('popstate', handlePopState)
  }

  return {
    init,
    updateHistory,
    back,
    forward,
    destroy
  }
}

export default createHistoryManager
