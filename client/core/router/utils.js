// client/core/router/utils.js

/**
 * Default error handler implementation
 * @param {Error} error - Error object
 * @param {Object} route - Route that caused the error
 * @param {Object} ui - UI components
 */
export function defaultErrorHandler (error, route, ui) {
  console.error('Router error:', error)

  if (ui?.snackbar?.show) {
    ui.snackbar.show({
      message: 'An error occurred during navigation. Please try again.',
      type: 'error',
      duration: 5000
    })
  }
}

/**
 * Clear the content container
 * @param {Object} ui - UI components
 */
export function clearContentContainer (ui) {
  if (ui && ui.content) {
    // Remove all content
    ui.content.innerHTML = ''
  }
}

/**
 * Dispatch a navigation event
 * @param {Object} route - Current route
 * @param {string} status - Navigation status
 * @param {Error} error - Optional error object
 */
export function dispatchNavigationEvent (route, status, error = null) {
  window.dispatchEvent(new CustomEvent('navigation', {
    detail: {
      ...route,
      status,
      error,
      timestamp: Date.now()
    }
  }))
}

/**
 * Update document title based on route
 * @param {Object} route - Current route
 * @param {Object} routeHandler - Route handler with title
 */
export function updateDocumentTitle (route, routeHandler) {
  if (!routeHandler || !routeHandler.title) return

  document.title = typeof routeHandler.title === 'function'
    ? routeHandler.title(route)
    : routeHandler.title
}

/**
 * Normalize route parameters for handling different navigation styles
 * @param {string|Object} target - Route section or route object
 * @param {string} subsection - Route subsection
 * @param {Object} options - Navigation options
 * @returns {Object} Normalized route parameters
 */
export function normalizeRouteParams (target, subsection = '', options = {}) {
  let section
  let params = {}
  let normalizedOptions = options

  // Special case for path-based navigation (from drawer menu items)
  if (typeof target === 'string' && target.startsWith('/')) {
    // This is a direct path (e.g. "/components/chips")
    // Defer to the router's parsePath function
    return { isPath: true, path: target, options: normalizedOptions }
  } else if (typeof target === 'object' && target !== null) {
    section = target.section
    subsection = target.subsection || ''
    params = target.params || {}
    normalizedOptions = { ...normalizedOptions, ...target.options }
  } else {
    section = target
  }

  return {
    isPath: false,
    section,
    subsection,
    params,
    options: normalizedOptions
  }
}
