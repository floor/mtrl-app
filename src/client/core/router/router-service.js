// src/client/core/router/router-service.js

/**
 * Creates an enhanced router service with route caching, lazy loading support,
 * and improved navigation functionality
 *
 * @param {Object} options - Router options
 * @returns {Object} Router service API
 */
export const createRouter = (options = {}) => {
  // Internal state
  const routes = new Map()
  const routeCache = new Map()
  const beforeHooks = []
  const afterHooks = []

  let currentRoute = null
  let lastRoute = null
  let navigationStack = []

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

  // Default error handler
  const errorHandler = options.onError || defaultErrorHandler

  /**
   * Default error handler implementation
   * @param {Error} error - Error object
   * @param {Object} route - Route that caused the error
   * @private
   */
  function defaultErrorHandler (error, route) {
    console.error('Router error:', error)

    if (config.ui?.snackbar?.show) {
      config.ui.snackbar.show({
        message: 'An error occurred during navigation. Please try again.',
        type: 'error',
        duration: 5000
      })
    }
  }

  // Private methods

  /**
   * Handle browser popstate events
   * @param {PopStateEvent} event - Browser popstate event
   * @private
   */
  const handlePopState = (event) => {
    const { pathname, search } = window.location
    const fullPath = pathname + search
    const route = parsePath(fullPath)

    // Prevent duplicate navigation
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
  }

  /**
   * Update the browser history
   * @param {Object} route - Route object
   * @param {Object} options - Navigation options
   * @private
   */
  const updateBrowserHistory = (route, options = {}) => {
    const historyData = {
      ...route,
      timestamp: Date.now()
    }

    if (options.replace) {
      window.history.replaceState(historyData, '', route.path)
    } else {
      window.history.pushState(historyData, '', route.path)
    }
  }

  /**
   * Find a matching route handler
   * @param {Object} route - Route object to match
   * @returns {Object|null} Matched route handler or null
   * @private
   */
  const findRouteHandler = (route) => {
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
   * @private
   */
  const matchPathWithParams = (pattern, path, route) => {
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

  /**
   * Add a route to the navigation stack
   * @param {Object} route - Route to add
   * @private
   */
  const addToNavigationStack = (route) => {
    // Add to navigation stack with length limit
    navigationStack.push({
      ...route,
      timestamp: Date.now()
    })

    // Maintain maximum stack size
    if (navigationStack.length > config.maxStackSize) {
      navigationStack.shift()
    }
  }

  /**
   * Handle scroll restoration
   * @param {Object} route - Current route
   * @private
   */
  const handleScrollRestoration = (route) => {
    // Get scroll element (content area or custom element)
    const scrollElement = config.scrollElement ||
                        (config.ui?.content) ||
                        document.documentElement

    // Reset scroll position
    if (scrollElement) {
      scrollElement.scrollTop = 0
    }
  }

  /**
   * Dispatch a navigation event
   * @param {Object} route - Current route
   * @param {string} status - Navigation status
   * @param {Error} error - Optional error object
   * @private
   */
  const dispatchNavigationEvent = (route, status, error = null) => {
    window.dispatchEvent(new CustomEvent('navigation', {
      detail: {
        ...route,
        status,
        error,
        timestamp: Date.now()
      }
    }))
  }

  // Public API methods

  /**
   * Parse a path into route components
   * @param {string} path - URL path to parse
   * @returns {Object} Parsed route object
   */
  function parsePath (path) {
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
   * @returns {string} Generated path
   */
  function generatePath (section, subsection = '', params = {}) {
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

    if (config.debug) {
      // console.info(`Route registered: ${path}`)
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
      // Handle direct object navigation
      let section; let params = {}

      if (typeof target === 'object' && target !== null) {
        section = target.section
        subsection = target.subsection || ''
        params = target.params || {}
        options = { ...options, ...target.options }
      } else {
        section = target
      }

      // Log navigation intent
      if (config.debug) {
        console.debug('Navigation requested:', { section, subsection, params, options })
      }

      // Generate path
      const path = generatePath(section, subsection, params)

      // Create route object
      const route = {
        section,
        subsection,
        path,
        params,
        timestamp: Date.now()
      }

      // Run before navigation hooks
      for (const hook of beforeHooks) {
        const result = await hook(route, currentRoute)

        // If hook returns explicitly false, cancel navigation
        if (result === false) {
          if (config.debug) {
            console.debug('Navigation cancelled by hook')
          }
          return false
        }

        // Allow hooks to modify the route
        if (result && typeof result === 'object') {
          Object.assign(route, result)
        }
      }

      // Save last route before changing
      lastRoute = currentRoute

      // Update URL unless specified not to
      if (!options.noHistory) {
        updateBrowserHistory(route, options)
      }

      // Find the appropriate handler
      const matchedRoute = findRouteHandler(route)

      // Execute route handler if found
      let handlerResult = false

      if (matchedRoute) {
        // Handle scroll restoration before rendering
        if (config.scrollRestoration && !options.noScroll) {
          handleScrollRestoration(route)
        }

        // Execute the handler
        try {
          const handler = matchedRoute.handler
          handlerResult = await handler(route, config.ui)

          // Update document title if provided
          if (matchedRoute.title) {
            document.title = typeof matchedRoute.title === 'function'
              ? matchedRoute.title(route)
              : matchedRoute.title
          }

          // Cache successful navigation
          addToNavigationStack(route)

          // Update current route reference
          currentRoute = route

          // Dispatch navigation event
          dispatchNavigationEvent(route, 'success')
        } catch (error) {
          console.error('Error executing route handler:', error)
          errorHandler(error, route)
          dispatchNavigationEvent(route, 'error', error)
          return false
        }
      } else if (config.notFoundHandler) {
        // Execute not found handler
        try {
          handlerResult = await config.notFoundHandler(route, config.ui)
          currentRoute = route
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
      for (const hook of afterHooks) {
        await hook(route, lastRoute)
      }

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
   * Refresh the current route
   * @param {Object} options - Refresh options
   * @returns {Promise<boolean>} Success status
   */
  async function refresh (options = {}) {
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
   * Add a before navigation hook
   * @param {Function} hook - Hook function
   * @returns {Object} Router instance for chaining
   */
  function beforeEach (hook) {
    if (typeof hook === 'function') {
      beforeHooks.push(hook)
    }
    return router
  }

  /**
   * Add an after navigation hook
   * @param {Function} hook - Hook function
   * @returns {Object} Router instance for chaining
   */
  function afterEach (hook) {
    if (typeof hook === 'function') {
      afterHooks.push(hook)
    }
    return router
  }

  /**
   * Get the current route information
   * @returns {Object} Current route
   */
  function getCurrentRoute () {
    return currentRoute
  }

  /**
   * Get the previous route information
   * @returns {Object} Previous route
   */
  function getPreviousRoute () {
    return lastRoute
  }

  /**
   * Get the navigation history stack
   * @returns {Array} Navigation history
   */
  function getNavigationStack () {
    return [...navigationStack]
  }

  /**
   * Clean up router resources
   */
  function destroy () {
    window.removeEventListener('popstate', handlePopState)
    routes.clear()
    routeCache.clear()
    beforeHooks.length = 0
    afterHooks.length = 0
    currentRoute = null
    navigationStack = []

    if (config.debug) {
      console.info('Router destroyed')
    }
  }

  /**
   * Process the initial route from the current URL
   * @returns {Promise<boolean>} Navigation result
   */
  async function processInitialRoute () {
    const { pathname, search } = window.location
    const fullPath = pathname + search
    const route = parsePath(fullPath)

    return navigate(route.section, route.subsection, {
      noHistory: true,
      params: route.params
    })
  }

  /**
   * Update router configuration
   * @param {Object} newOptions - New configuration options
   * @returns {Object} Router instance for chaining
   */
  function configure (newOptions) {
    Object.assign(config, newOptions)
    return router
  }

  // Set up browser history listeners
  window.addEventListener('popstate', handlePopState)

  // Create the router API object
  const router = {
    // Core routing methods
    parsePath,
    generatePath,
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
    beforeEach,
    afterEach,

    // State access
    getCurrentRoute,
    getPreviousRoute,
    getNavigationStack,

    // Configuration
    setDefaultRoute,
    configure,

    // Cleanup
    destroy
  }

  return router
}

export default createRouter
