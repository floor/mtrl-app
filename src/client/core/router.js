// src/client/core/router.js

export const createRouter = (options = {}) => {
  const routes = new Map()
  const beforeHooks = []
  const afterHooks = []
  let currentRoute = null

  // Default error handler
  const defaultErrorHandler = (error) => {
    log.error('Router error:', error)
    if (options.ui?.snackbar?.show) {
      options.ui.snackbar.show({
        message: 'An error occurred during navigation. Please try again.',
        type: 'error',
        duration: 5000
      })
    }
  }

  const errorHandler = options.onError || defaultErrorHandler

  // Parse route from path
  const parsePath = (path) => {
    const cleanPath = path.replace(/^\/+|\/+$/g, '')
    const parts = cleanPath.split('/')

    return {
      section: parts[0] || 'home',
      subsection: parts[1] || '',
      path: cleanPath ? `/${cleanPath}` : '/'
    }
  }

  // Generate path from parts
  const generatePath = (section, subsection = '') => {
    if (section === 'home') return '/'
    return subsection ? `/${section}/${subsection}` : `/${section}`
  }

  // Navigation handler
  const navigate = async (section, subsection = '', options = {}) => {
    try {
      const path = generatePath(section, subsection)
      log.debug('Router navigating to:', { section, subsection, path })

      const route = { section, subsection, path }

      // Run before hooks
      for (const hook of beforeHooks) {
        const result = await hook(route)
        if (result === false) {
          log.debug('Navigation cancelled by hook')
          return
        }
      }

      // Update URL first
      if (!options.noHistory) {
        const newPath = route.path
        log.debug('Updating URL to:', newPath)
        window.history.pushState(route, '', newPath)
      }

      // Find and execute route handler
      let handler = routes.get(`${section}/${subsection}`)
      if (!handler) {
        handler = routes.get(section)
      }

      if (handler) {
        log.debug('Executing handler for route:', route)
        await handler(route)
      }

      // Update current route
      currentRoute = route

      // Emit navigation event
      // window.dispatchEvent(new CustomEvent('navigationComplete', {
      //   detail: {
      //     ...route,
      //     timestamp: Date.now()
      //   }
      // }))

      // Run after hooks
      for (const hook of afterHooks) {
        await hook(route)
      }

      log.debug('Navigation completed:', route)
    } catch (error) {
      log.error('Navigation error:', error)
      errorHandler(error)
    }
  }

  // Handle browser back/forward
  const handlePopState = (event) => {
    const { pathname } = window.location
    const route = parsePath(pathname)
    navigate(route.section, route.subsection, { noHistory: true })
  }

  // Setup popstate listener
  window.addEventListener('popstate', handlePopState)

  const router = {
    // Route registration
    register: (path, handler) => {
      routes.set(path, handler)
      return router // Return router instance for chaining
    },

    // Navigation guards
    beforeEach: (hook) => {
      beforeHooks.push(hook)
      return router
    },

    afterEach: (hook) => {
      afterHooks.push(hook)
      return router
    },

    // Navigation
    navigate,

    // Route parsing
    parsePath,
    generatePath,

    // Current route info
    getCurrentRoute: () => currentRoute,

    // Cleanup
    destroy: () => {
      window.removeEventListener('popstate', handlePopState)
      routes.clear()
      beforeHooks.length = 0
      afterHooks.length = 0
    }
  }

  return router
}

export default createRouter
