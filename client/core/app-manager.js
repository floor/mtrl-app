// src/client/core/app-manager.js

import { createEventManager, setupErrorBoundary } from './events'
import { createStructure } from 'mtrl/src/core/structure'
import { createAppRouter } from './router'
import themeManager from './theme/theme-manager'
import { createNavigationSystem } from 'mtrl/src/components/navigation/system'
import { createStructureManager } from './structure/structure-manager'
import { appStructure, navigationStructure } from '../config'

/**
 * Creates an application manager responsible for core initialization,
 * lifecycle management, and coordinating between various subsystems
 *
 * @param {Object} options - Application configuration options
 * @returns {Object} Application manager API
 */
export const createApp = (options = {}) => {
  // Internal state
  let isInitialized = false
  let readyCallbacks = []
  let processingRouteChange = false
  let processingNavChange = false
  let handlingDrawerItemClick = false // Flag to track drawer item clicks

  // Core subsystems
  let structureResult = null // Updated to use StructureResult
  let components = null
  let structureManager = null
  let router = null
  let eventManager = null
  let navigationSystem = null

  // Private methods

  /**
   * Initialize the application
   * @private
   */
  const initializeApp = () => {
    if (isInitialized) return

    try {
      // Set up global error boundary
      setupErrorBoundary()

      // Initialize structure
      structureResult = initializeStructure()

      // Get all components from the structure
      components = structureResult.getAll()

      // Get UI components
      const ui = components
      if (!ui) {
        throw new Error('UI component is undefined')
      }

      // Initialize core subsystems
      router = initializeRouter(ui)
      eventManager = initializeEvents(ui)
      initializeTheme(ui)
      navigationSystem = initializeNavigation(ui)

      // Execute ready callbacks
      executeReadyCallbacks()

      // Mark as initialized
      isInitialized = true
    } catch (error) {
      isInitialized = false

      // Call error handler if provided
      if (typeof options.onError === 'function') {
        options.onError(error)
      }
    }
  }

  /**
   * Initialize the application structure
   * @private
   */
  const initializeStructure = () => {
    // Get structure configuration
    if (!appStructure) {
      throw new Error('Structure configuration is required')
    }

    // Initialize structure with the container
    const container = options.container || document.body
    const structureResult = createStructure(appStructure, container)

    // Create structure manager
    structureManager = createStructureManager({
      structure: structureResult.structure,
      structureAPI: structureResult, // Pass the full API
      options: options.layoutOptions
    })

    return structureResult
  }

  /**
   * Initialize the router
   * @param {Object} ui - UI component reference
   * @private
   */
  const initializeRouter = (ui) => {
    // Create router with UI reference
    const routerInstance = createAppRouter({
      ui,
      onError: (error) => {
        if (typeof options.onNavigationError === 'function') {
          options.onNavigationError(error)
        }
      },
      hooks: options.routerHooks,
      ...options.routerOptions
    })

    // Register routes if provided
    if (options.routes) {
      routerInstance.registerRoutes(options.routes)
    }

    // Register notFoundHandler if provided
    if (options.notFoundHandler) {
      routerInstance.registerNotFound(options.notFoundHandler)
    }

    return routerInstance
  }

  /**
   * Initialize event management
   * @param {Object} ui - UI component reference
   * @private
   */
  const initializeEvents = (ui) => {
    // Create event manager
    const events = createEventManager(ui)

    // Register app cleanup
    events.addCleanup(() => {
      cleanupApp()
    })

    return events
  }

  /**
   * Initialize theme management
   * @param {Object} ui - UI component reference
   * @private
   */
  const initializeTheme = (ui) => {
    // Configure the theme manager
    themeManager.configure({
      ui,
      themesMenu: options.themesMenu,
      ...options.themeOptions
    })

    // Initialize theme system
    themeManager.initialize()

    // Set up an important CSS class for app styling
    document.body.classList.add('mtrl-app')

    // Register cleanup
    if (eventManager) {
      eventManager.addCleanup(() => {
        themeManager.cleanup()
      })
    }

    return themeManager
  }

  /**
   * Initialize navigation with the new navigation system
   * @param {Object} ui - UI component reference
   * @private
   */
  const initializeNavigation = (ui) => {
    // Use the navigation structure from config
    const items = navigationStructure || {}

    // Create navigation system
    const navSystem = createNavigationSystem({
      items,
      expanded: false,
      railOptions: {
        componentName: 'rail',
        position: 'left',
        showLabels: true
      },
      drawerOptions: {
        componentName: 'nav',
        position: 'left'
      },
      ...options.navigationOptions
    })

    // Initialize navigation system
    navSystem.initialize()

    // Force drawer to be hidden after initialization
    if (navSystem.hideDrawer) {
      navSystem.hideDrawer()
    }

    // Store references in UI
    if (navSystem.getRail()) ui.rail = navSystem.getRail()
    if (navSystem.getDrawer()) ui.nav = navSystem.getDrawer()

    // Set up router integration
    if (router) {
      /**
       * Handle section change events (rail item clicks)
       */
      navSystem.onSectionChange = (section, eventData) => {
        // Skip if we're already processing a navigation change
        // if (navSystem.isProcessingChange()) {
        //   return
        // }

        // Set processing flag using the navigation system API
        navSystem.setProcessingChange(true)

        // Set processing flag
        processingNavChange = true

        // Get the section data
        const sectionData = items[section]
        if (!sectionData) {
          processingNavChange = false
          return
        }

        // Navigate to section directly
        router.navigate(section, null, { replace: true })

        // Clear flag after a delay
        setTimeout(() => {
          processingNavChange = false
        }, 50)
      }

      /**
       * Handle item selection events (drawer item clicks)
       */
      navSystem.onItemSelect = (event) => {
        // Skip if we're already processing a route change
        if (processingRouteChange) {
          return
        }

        // Set handlingDrawerItemClick flag to prevent drawer content refresh
        handlingDrawerItemClick = true

        // Get path from the event
        let path = null

        // Check different possible locations for path
        if (event.item?.config?.path) {
          path = event.item.config.path
        } else if (event.item?.config?.data?.path) {
          path = event.item.config.data.path
        }

        if (path) {
          // Set processing flag
          processingRouteChange = true

          // Parse the path to get route components
          const route = router.parsePath(path)

          // Determine if this is a drawer item with nested items
          const hasNestedItems = event.item?.config?.items?.length > 0

          // Only navigate if this isn't an expandable drawer item
          if (!hasNestedItems) {
            // Navigate using router - but preserve the drawer's expanded state
            router.navigate(route.section, route.subsection, {
              replace: true,
              preserveDrawerState: true // Add a hint to preserve drawer state
            })
          }

          // Clear flags after a delay
          setTimeout(() => {
            processingRouteChange = false
            handlingDrawerItemClick = false
          }, 50)
        } else {
          // If no path, reset the flag immediately
          handlingDrawerItemClick = false
        }
      }

      // Process initial route if needed
      if (options.processInitialRoute !== false) {
        const { pathname } = window.location
        const route = router.parsePath(pathname)

        if (route.section) {
          // Set processing flag
          processingNavChange = true

          // This will update both rail and drawer via the navigation system
          navSystem.navigateTo(route.section, route.subsection)

          // Make sure drawer stays hidden initially
          navSystem.hideDrawer()

          // Clear flag after a delay
          setTimeout(() => {
            processingNavChange = false
          }, 50)
        }
      }

      // Keep navigation in sync with router
      router.afterEach((route, options = {}) => {
        // Skip if we're already processing a navigation change
        if (processingNavChange) {
          return
        }

        // Skip drawer content update if handling drawer item click
        if (handlingDrawerItemClick || options.preserveDrawerState) {
          // Update the subsection in the state
          if (route.subsection) {
            navSystem.getActiveSubsection = () => route.subsection
          }

          return
        }

        if (route.section) {
          // Set processing flag
          processingRouteChange = true

          // This ensures navigation state stays in sync with URL changes
          // The navigation system will handle updating the drawer content
          navSystem.navigateTo(route.section, route.subsection)

          // Clear flag after a delay
          setTimeout(() => {
            processingRouteChange = false
          }, 50)
        }
      })
    }

    // Register cleanup
    if (eventManager) {
      eventManager.addCleanup(() => navSystem.cleanup())
    }

    return navSystem
  }

  /**
   * Execute registered ready callbacks
   * @private
   */
  const executeReadyCallbacks = () => {
    const callbackData = {
      structure: structureResult.structure,
      structureAPI: structureResult,
      router,
      ui: components,
      themeManager,
      navigationSystem
    }

    readyCallbacks.forEach(callback => {
      try {
        callback(callbackData)
      } catch (error) {
        // Silent error in callback
      }
    })

    // Clear callbacks after execution
    readyCallbacks = []
  }

  /**
   * Clean up application resources
   * @private
   */
  const cleanupApp = () => {
    // Clean up subsystems
    if (navigationSystem) {
      navigationSystem.cleanup()
    }

    if (themeManager) {
      themeManager.cleanup()
    }

    if (router) {
      router.destroy()
    }

    if (structureResult) {
      structureResult.destroy() // Use the destroy method on structureResult
    }

    // Reset state
    structureResult = null
    router = null
    navigationSystem = null
    isInitialized = false
  }

  // Initialize immediately if not deferred
  if (!options.deferInit) {
    initializeApp()
  }

  // Public API

  /**
   * Register a callback to be executed when the app is ready
   * @param {Function} callback - Callback function
   * @returns {Object} App instance for chaining
   */
  const onReady = (callback) => {
    if (typeof callback !== 'function') return app

    if (isInitialized && components) {
      // If already initialized, execute immediately
      callback({
        structure: structureResult.structure,
        structureAPI: structureResult,
        router,
        ui: components,
        themeManager,
        navigationSystem
      })
    } else {
      // Queue for later execution
      readyCallbacks.push(callback)
    }

    return app
  }

  /**
   * Initialize the application (if deferred)
   * @returns {Object} App instance for chaining
   */
  const initialize = () => {
    if (!isInitialized) {
      initializeApp()
    }
    return app
  }

  /**
   * Clean up and destroy the application
   */
  const destroy = () => {
    if (eventManager) {
      eventManager.cleanup()
    } else {
      cleanupApp()
    }
  }

  /**
   * Check if the app is initialized
   * @returns {boolean} Initialization status
   */
  const getIsInitialized = () => {
    return isInitialized
  }

  /**
   * Get the structure instance
   * @returns {Object} Structure instance
   */
  const getStructure = () => {
    return structureResult ? structureResult.structure : null
  }

  /**
   * Get the structure API
   * @returns {Object} Structure API with utility methods
   */
  const getStructureAPI = () => {
    return structureResult
  }

  /**
   * Get a UI component by name
   * @param {string} name - Component name
   * @returns {Object} UI component
   */
  const getComponent = (name) => {
    return structureResult ? structureResult.get(name) : null
  }

  /**
   * Get the router instance
   * @returns {Object} Router instance
   */
  const getRouter = () => {
    return router
  }

  /**
   * Get the theme manager
   * @returns {Object} Theme manager
   */
  const getThemeManager = () => {
    return themeManager
  }

  /**
   * Get the navigation system
   * @returns {Object} Navigation system
   */
  const getNavigationSystem = () => {
    return navigationSystem
  }

  // Create the API object
  const app = {
    onReady,
    initialize,
    destroy,
    isInitialized: getIsInitialized,
    getStructure,
    getStructureAPI,
    getComponent,
    getRouter,
    getThemeManager,
    getNavigationSystem
  }

  return app
}

// Create a singleton instance for direct use
const appInstance = createApp({
  deferInit: true // Don't initialize immediately
})

export default createApp
export { appInstance as app }
