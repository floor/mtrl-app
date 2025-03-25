// src/client/core/app-manager.js

import { createEventManager, setupErrorBoundary } from './events'
import { createStructure } from 'mtrl'
import { createRouter } from './router/service'
import themeManager from './theme/theme-manager'
import { createNavigationSystem } from 'mtrl/src/components/navigation/system'
import { createStructureManager } from './structure/structure-manager'
import { appStructure, navigationStructure } from '../config'
import { generateDynamicRoutes } from './router/dynamic-loader'

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

  // Navigation synchronization state
  const syncState = {
    isNavigating: false,
    source: null, // 'router' or 'navigation'
    ignoreNextNavSync: false
  }

  // Core subsystems
  let structureResult = null
  let components = null
  let structureManager = null
  let router = null
  let eventManager = null
  let navigationSystem = null

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
      structureAPI: structureResult,
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
    const routerInstance = createRouter({
      ui,
      onError: (error) => {
        if (typeof options.onNavigationError === 'function') {
          options.onNavigationError(error)
        }
      },
      scrollRestoration: options.routerOptions?.scrollRestoration !== false,
      debug: options.routerOptions?.debug || false
    })

    // Register routes if provided
    if (options.routes) {
      routerInstance.registerRoutes(options.routes)
    }

    // Register dynamic routes
    routerInstance.registerRoutes(generateDynamicRoutes())

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
   * Initialize navigation with the navigation system
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
    navSystem.hideDrawer()

    // Store references in UI
    if (navSystem.getRail()) ui.rail = navSystem.getRail()
    if (navSystem.getDrawer()) ui.nav = navSystem.getDrawer()

    // Set up router integration
    if (router) {
      /**
       * Handle section change events (rail item clicks)
       */
      navSystem.onSectionChange = (section, eventData) => {
        // Skip if currently navigating from another source
        if (syncState.isNavigating && syncState.source !== 'navigation') {
          return
        }

        // Set sync state
        syncState.isNavigating = true
        syncState.source = 'navigation'

        // Get the section data
        const sectionData = items[section]
        if (!sectionData) {
          syncState.isNavigating = false
          return
        }

        // Update drawer content without showing the drawer
        if (sectionData.items?.length) {
          // Update drawer content but don't open it
          navSystem.navigateTo(section, null, true)
        }

        // Navigate to section directly
        router.navigate(section)

        // Reset sync state after a short delay
        setTimeout(() => {
          syncState.isNavigating = false
          syncState.source = null
        }, 50)
      }

      /**
       * Handle item selection events (drawer item clicks)
       */
      navSystem.onItemSelect = (event) => {
        // Skip if already processing a route change
        if (syncState.isNavigating && syncState.source !== 'navigation') {
          return
        }

        // Get path from the event
        let path = null

        // Check different possible locations for path
        if (event.item?.config?.path) {
          path = event.item.config.path
        } else if (event.item?.config?.data?.path) {
          path = event.item.config.data.path
        }

        if (path) {
          // Set sync state
          syncState.isNavigating = true
          syncState.source = 'navigation'
          syncState.ignoreNextNavSync = true

          // Determine if this is a drawer item with nested items
          const hasNestedItems = event.item?.config?.items?.length > 0

          // Only navigate if this isn't an expandable drawer item
          if (!hasNestedItems) {
            // For drawer navigation, make sure we have a leading slash for path-based navigation
            if (!path.startsWith('/')) {
              path = '/' + path
            }

            // Navigate using the path
            router.navigate(path)

            // Always hide the drawer after navigation
            navSystem.hideDrawer()
          }

          // Reset sync state after a short delay
          setTimeout(() => {
            syncState.isNavigating = false
            syncState.source = null
            syncState.ignoreNextNavSync = false
          }, 50)
        }
      }

      // Register router hook to keep navigation in sync with routing
      router.afterEach((route, prevRoute, options = {}) => {
        // Skip if we're already processing a navigation from the navigation system
        if (syncState.isNavigating && syncState.source === 'navigation') {
          return
        }

        // Skip drawer content update if handling drawer item click
        if (syncState.ignoreNextNavSync) {
          return
        }

        // Set sync state
        syncState.isNavigating = true
        syncState.source = 'router'

        // Update navigation system with section and subsection
        if (route.section) {
          // Update rail selection and drawer content, but don't open drawer
          navSystem.navigateTo(route.section, route.subsection, true)

          // Always ensure drawer is closed by default after navigation
          navSystem.hideDrawer()
        }

        // Reset sync state after a short delay
        setTimeout(() => {
          syncState.isNavigating = false
          syncState.source = null
        }, 50)
      })

      // Process initial route if needed
      if (options.processInitialRoute !== false) {
        // Use router's built-in initial route processing
        router.processInitialRoute().then(success => {
          if (success) {
            // Update navigation to match initial route
            const currentRoute = router.getCurrentRoute()
            if (currentRoute) {
              // Update navigation without triggering another navigation
              syncState.isNavigating = true
              syncState.source = 'router'
              navSystem.navigateTo(currentRoute.section, currentRoute.subsection, true)
              navSystem.hideDrawer()
              setTimeout(() => {
                syncState.isNavigating = false
                syncState.source = null
              }, 50)
            }
          }
        })
      }
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
      structureResult.destroy()
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
  const app = {
    // Register callback to be executed when app is ready
    onReady (callback) {
      if (typeof callback !== 'function') return this

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

      return this
    },

    // Initialize the application (if deferred)
    initialize () {
      if (!isInitialized) {
        initializeApp()
      }
      return this
    },

    // Clean up and destroy the application
    destroy () {
      if (eventManager) {
        eventManager.cleanup()
      } else {
        cleanupApp()
      }
    },

    // Getter methods
    isInitialized: () => isInitialized,
    getStructure: () => structureResult ? structureResult.structure : null,
    getStructureAPI: () => structureResult,
    getComponent: (name) => structureResult ? structureResult.get(name) : null,
    getRouter: () => router,
    getThemeManager: () => themeManager,
    getNavigationSystem: () => navigationSystem
  }

  return app
}

// Create a singleton instance for direct use
const appInstance = createApp({
  deferInit: true // Don't initialize immediately
})

export default createApp
export { appInstance as app }
