// client/core/router/hooks.js

/**
 * Creates a hooks manager for navigation hooks
 * @returns {Object} Hooks manager API
 */
export function createHooksManager () {
  const beforeHooks = []
  const afterHooks = []

  /**
   * Register a before navigation hook
   * @param {Function} hook - Hook function
   * @returns {Function} Unregister function
   */
  function registerBeforeHook (hook) {
    if (typeof hook === 'function') {
      beforeHooks.push(hook)

      // Return unregister function
      return () => {
        const index = beforeHooks.indexOf(hook)
        if (index >= 0) {
          beforeHooks.splice(index, 1)
        }
      }
    }
  }

  /**
   * Register an after navigation hook
   * @param {Function} hook - Hook function
   * @returns {Function} Unregister function
   */
  function registerAfterHook (hook) {
    if (typeof hook === 'function') {
      afterHooks.push(hook)

      // Return unregister function
      return () => {
        const index = afterHooks.indexOf(hook)
        if (index >= 0) {
          afterHooks.splice(index, 1)
        }
      }
    }
  }

  /**
   * Run before navigation hooks
   * @param {Object} route - Target route
   * @param {Object} currentRoute - Current route
   * @returns {Promise<Object|boolean>} Modified route or false to cancel
   */
  async function runBeforeHooks (route, currentRoute) {
    let modifiedRoute = { ...route }

    for (const hook of beforeHooks) {
      try {
        const result = await hook(modifiedRoute, currentRoute)

        // If hook returns explicitly false, cancel navigation
        if (result === false) {
          return false
        }

        // Allow hooks to modify the route
        if (result && typeof result === 'object') {
          modifiedRoute = { ...modifiedRoute, ...result }
        }
      } catch (error) {
        console.error('Error in before navigation hook:', error)
        // Don't cancel navigation but log the error
      }
    }

    return modifiedRoute
  }

  /**
   * Run after navigation hooks
   * @param {Object} route - New route
   * @param {Object} previousRoute - Previous route
   * @param {Object} options - Navigation options
   * @returns {Promise<void>}
   */
  async function runAfterHooks (route, previousRoute, options = {}) {
    for (const hook of afterHooks) {
      try {
        await hook(route, previousRoute, options)
      } catch (error) {
        console.error('Error in after navigation hook:', error)
        // Continue running hooks even if one fails
      }
    }
  }

  /**
   * Clear all hooks
   */
  function clear () {
    beforeHooks.length = 0
    afterHooks.length = 0
  }

  return {
    registerBeforeHook,
    registerAfterHook,
    runBeforeHooks,
    runAfterHooks,
    clear
  }
}

export default createHooksManager
