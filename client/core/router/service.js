// client/core/router/service.js

import { createHistoryManager } from './history.js'
import { createHooksManager } from './hooks.js'
import { createNavigationStack } from './navigation.js'
import { createScrollManager } from './scroll.js'
import { parsePath, generatePath, findRouteHandler } from './parser.js'
import {
  defaultErrorHandler,
  clearContentContainer,
  dispatchNavigationEvent,
  updateDocumentTitle,
  normalizeRouteParams
} from './utils.js'

/**
 * Creates an enhanced router service with route caching, lazy loading support,
 * and improved navigation functionality
 *
 * @param {Object} options - Router options
 * @returns {Object} Router service API
 */
export function createRouter (options = {}) {
  // Router public API definition
  let router

  // Internal state
  const routes = new Map()
  const routeCache = new Map()

  // Configuration with defaults
  const config = {
    mode: options.mode || 'history',
    root: options.root || '/',
    trailingSlash: options.trailingSlash || false,
    scrollRestoration: options.scrollRestoration !== false,
    scrollElement: options.scrollElement || null,
    debug: options.debug || false,
    maxStackSize: options.maxStackSize || 20,
    defaultRoute: options.defaultRoute || 'home',
    notFoundHandler: options.notFoundHandler || null,
    ui: options.ui || null
  }

  // Error handler
  const errorHandler = options.onError || ((error, route) => defaultErrorHandler(error, route, config.ui))

  // Create sub-managers
  const navigationStack = createNavigationStack(config.maxStackSize)
  const hooksManager = createHooksManager()
  const scrollManager = createScrollManager(config)

  // Create history manager with popstate handler
  const historyManager = createHistoryManager((event) => {
    const { pathname, search } = window.location
    const fullPath = pathname + search
    const route = parsePath(fullPath, config)

    // Prevent duplicate navigation
    const currentRoute = navigationStack.getCurrent()
    if (currentRoute &&
        currentRoute.path === route.path &&
        currentRoute.query === route.query) {
      return
    }

    navigate(route.section, route.subsection, {
      noHistory: true,
      params: route.params,
      popstate: true
    })
  })

  // Initialize history manager
  historyManager.init()

  /**
   * Register a route handler
   * @param {string} path - Route path
   * @param {Function|Object} handler - Route handler function or config object
   * @returns {Object} Router instance for chaining
   */
  function register (path, handler) {
    if (typeof handler === 'object' && handler !== null) {
      // Handle advanced registration with metadata
      const { handler: handlerFn, title, ...metadata } = handler

      routes.set(path, {
        handler: handlerFn,
        title,
        metadata,
        path
      })
    } else if (typeof handler === 'function') {
      // Simple handler function
      routes.set(path, {
        handler,
        path
      })
    } else {
      console.error('Invalid route handler for path:', path)
      return router
    }

    return router
  }

  /**
   * Register multiple routes at once
   * @param {Object} routesMap - Map of routes and handlers
   * @returns {Object} Router instance for chaining
   */
  function registerRoutes (routesMap) {
    Object.entries(routesMap).forEach(([path, handler]) => {
      register(path, handler)
    })

    return router
  }

  /**
   * Register a handler for routes that don't match any registered path
   * @param {Function} handler - Not found handler function
   * @returns {Object} Router instance for chaining
   */
  function registerNotFound (handler) {
    config.notFoundHandler = handler
    return router
  }

  /**
   * Set the default route
   * @param {string} routeName - Default route name
   * @returns {Object} Router instance for chaining
   */
  function setDefaultRoute (routeName) {
    config.defaultRoute = routeName
    return router
  }

  /**
   * Navigate to a new route
   * @param {string|Object} target - Route section or route object
   * @param {string} subsection - Route subsection
   * @param {Object} options - Navigation options
   * @returns {Promise<boolean>} Navigation result
   */
  async function navigate (target, subsection = '', options = {}) {
    try {
      // Normalize route parameters
      const normalized = normalizeRouteParams(target, subsection, options)

      let route

      // Handle path-based navigation
      if (normalized.isPath) {
        const routeObj = parsePath(normalized.path, config)
        route = {
          section: routeObj.section,
          subsection: routeObj.subsection,
          path: routeObj.path,
          params: routeObj.params,
          timestamp: Date.now(),
          popstate: normalized.options.popstate
        }
      } else {
        // Generate path
        const path = generatePath(
          normalized.section,
          normalized.subsection,
          normalized.params,
          config
        )

        // Create route object
        route = {
          section: normalized.section,
          subsection: normalized.subsection,
          path,
          params: normalized.params,
          timestamp: Date.now(),
          popstate: normalized.options.popstate
        }
      }

      // Run before navigation hooks
      const hookResult = await hooksManager.runBeforeHooks(route, navigationStack.getCurrent())

      // If hooks returned false, cancel navigation
      if (hookResult === false) {
        return false
      }

      // Allow hooks to modify the route
      if (hookResult && typeof hookResult === 'object') {
        route = hookResult
      }

      // Update URL unless specified not to
      if (!normalized.options.noHistory) {
        historyManager.updateHistory(route, normalized.options)
      }

      // Find the appropriate handler
      const matchedRoute = findRouteHandler(route, routes)

      // Execute route handler if found
      let handlerResult = false

      if (matchedRoute) {
        // Handle scroll restoration before rendering
        if (config.scrollRestoration && !normalized.options.noScroll) {
          scrollManager.resetScroll()
        }

        // Clear previous content
        clearContentContainer(config.ui)

        // Execute the handler
        try {
          const handler = matchedRoute.handler
          handlerResult = await handler(route, config.ui)

          // Update document title if provided
          updateDocumentTitle(route, matchedRoute)

          // Add to navigation stack
          navigationStack.push(route)

          // Dispatch navigation event
          dispatchNavigationEvent(route, 'success')
        } catch (error) {
          console.error('Error executing route handler:', error)
          errorHandler(error, route)
          dispatchNavigationEvent(route, 'error', error)
          return false
        }
      } else if (config.notFoundHandler) {
        // Clear previous content
        clearContentContainer(config.ui)

        // Execute not found handler
        try {
          handlerResult = await config.notFoundHandler(route, config.ui)
          navigationStack.push(route)
          dispatchNavigationEvent(route, 'notfound')
        } catch (error) {
          console.error('Error executing notFound handler:', error)
          errorHandler(error, route)
          dispatchNavigationEvent(route, 'error', error)
          return false
        }
      } else {
        console.warn(`No handler found for route: ${route.path}`)
        dispatchNavigationEvent(route, 'notfound')
        return false
      }

      // Run after navigation hooks
      await hooksManager.runAfterHooks(route, navigationStack.getPrevious(), normalized.options)

      // Return handler result or true if successful
      return handlerResult !== false
    } catch (error) {
      console.error('Navigation error:', error)
      errorHandler(error)
      return false
    }
  }

  /**
   * Go back in browser history
   * @returns {boolean} Success status
   */
  function back () {
    return historyManager.back()
  }

  /**
   * Go forward in browser history
   * @returns {boolean} Success status
   */
  function forward () {
    return historyManager.forward()
  }

  /**
   * Refresh the current route
   * @param {Object} options - Refresh options
   * @returns {Promise<boolean>} Success status
   */
  async function refresh (options = {}) {
    const currentRoute = navigationStack.getCurrent()

    if (currentRoute) {
      return navigate(
        currentRoute.section,
        currentRoute.subsection,
        {
          ...options,
          noHistory: true,
          refresh: true
        }
      )
    }

    return false
  }

  /**
   * Process the initial route from the current URL
   * @returns {Promise<boolean>} Navigation result
   */
  async function processInitialRoute () {
    const { pathname, search } = window.location
    const fullPath = pathname + search
    const route = parsePath(fullPath, config)

    // Make sure we pass the initialRoute flag
    return navigate(route.section, route.subsection, {
      noHistory: true,
      params: route.params,
      initialRoute: true
    })
  }

  /**
   * Update router configuration
   * @param {Object} newOptions - New configuration options
   * @returns {Object} Router instance for chaining
   */
  function configure (newOptions) {
    Object.assign(config, newOptions)
    scrollManager.updateConfig(config)
    navigationStack.setMaxSize(config.maxStackSize)
    return router
  }

  /**
   * Clean up router resources
   */
  function destroy () {
    historyManager.destroy()
    hooksManager.clear()
    navigationStack.clear()
    routes.clear()
    routeCache.clear()
  }

  // Create the router API object
  router = {
    // Core routing methods
    parsePath: (path) => parsePath(path, config),
    generatePath: (section, subsection, params) => generatePath(section, subsection, params, config),
    navigate,
    register,
    registerRoutes,
    registerNotFound,

    // Navigation control
    back,
    forward,
    refresh,
    processInitialRoute,

    // Hooks
    beforeEach: hooksManager.registerBeforeHook,
    afterEach: hooksManager.registerAfterHook,

    // State access
    getCurrentRoute: navigationStack.getCurrent,
    getPreviousRoute: navigationStack.getPrevious,
    getNavigationStack: navigationStack.getStack,

    // Configuration
    setDefaultRoute,
    configure,

    // Cleanup
    destroy
  }

  return router
}

export default createRouter
