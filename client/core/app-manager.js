// src/client/core/app-manager.js

import { createEventManager, setupErrorBoundary } from './events'
import { createLayout } from 'mtrl'
import { createAppRouter } from './router'
import themeManager from './theme/theme-manager'
import { createNavigationManager } from './navigation/navigation-manager'
import { createLayoutManager } from './layout/layout-manager'
import drawerBehavior from './navigation/drawer-behavior'
import railBehavior from './navigation/rail'

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

  // Core subsystems
  let layout = null
  let layoutManager = null
  let router = null
  let eventManager = null
  let navigationManager = null

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

      // Initialize layout
      layout = initializeLayout()

      // Get UI components
      const ui = layout?.component
      if (!ui) {
        throw new Error('UI component is undefined')
      }

      // Initialize core subsystems
      router = initializeRouter(ui)
      eventManager = initializeEvents(ui)
      initializeTheme(ui)
      navigationManager = initializeNavigation(ui)

      // Execute ready callbacks
      executeReadyCallbacks()

      // Mark as initialized
      isInitialized = true

      // Log successful initialization
      // console.info('Application initialized successfully')
    } catch (error) {
      console.error('App initialization failed:', error)
      isInitialized = false

      // Call error handler if provided
      if (typeof options.onError === 'function') {
        options.onError(error)
      }
    }
  }

  /**
   * Initialize the application layout
   * @private
   */
  const initializeLayout = () => {
    try {
      // Get layout configuration
      const layoutConfig = options.layout
      if (!layoutConfig) {
        throw new Error('Layout configuration is required')
      }

      // Initialize layout with the container
      const container = options.container || document.body
      const layoutInstance = createLayout(layoutConfig, container)

      // Create layout manager
      layoutManager = createLayoutManager({
        layout: layoutInstance,
        options: options.layoutOptions
      })

      return layoutInstance
    } catch (error) {
      console.error('Failed to initialize layout:', error)
      throw error
    }
  }

  /**
   * Initialize the router
   * @param {Object} ui - UI component reference
   * @private
   */
  const initializeRouter = (ui) => {
    try {
      // Create router with UI reference
      const routerInstance = createAppRouter({
        ui,
        onError: (error) => {
          console.error('Navigation error:', error)
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
    } catch (error) {
      console.error('Failed to initialize router:', error)
      throw error
    }
  }

  /**
   * Initialize event management
   * @param {Object} ui - UI component reference
   * @private
   */
  const initializeEvents = (ui) => {
    try {
      // Create event manager
      const events = createEventManager(ui)

      // Register app cleanup
      events.addCleanup(() => {
        cleanupApp()
      })

      return events
    } catch (error) {
      console.error('Failed to initialize events:', error)
      throw error
    }
  }

  /**
   * Initialize theme management
   * @param {Object} ui - UI component reference
   * @private
   */
  const initializeTheme = (ui) => {
    try {
      // Check if there's existing themeManager instance from singleton

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
    } catch (error) {
      console.error('Failed to initialize theme:', error)
      throw error
    }
  }

  /**
   * Initialize navigation
   * @param {Object} ui - UI component reference
   * @private
   */
  const initializeNavigation = (ui) => {
    try {
      // Create navigation manager for content management
      const navigation = createNavigationManager({
        ui,
        router,
        navigation: options.navigation,
        ...options.navigationOptions
      })

      // Initialize navigation manager
      navigation.initialize()

      // Configure drawer behavior - Only handle drawer-specific behavior
      drawerBehavior.configure({
        ui,
        navigation: options.navigation
      })
      drawerBehavior.initialize()

      // First configure rail behavior
      railBehavior.configure({
        rail: ui.rail,
        router,
        navigationConfig: options.navigation
      })

      // Then initialize it after configuration
      railBehavior.initialize()

      // Register cleanup
      if (eventManager) {
        eventManager.addCleanup(() => {
          navigation.cleanup()
          drawerBehavior.cleanup()
          railBehavior.cleanup()
        })
      }

      // Process initial route
      if (router && options.processInitialRoute !== false) {
        navigation.handleInitialRoute()
      }

      return navigation
    } catch (error) {
      console.error('Failed to initialize navigation:', error)
      throw error
    }
  }

  /**
   * Execute registered ready callbacks
   * @private
   */
  const executeReadyCallbacks = () => {
    const callbackData = {
      layout,
      router,
      ui: layout?.component,
      themeManager,
      navigationManager
    }

    readyCallbacks.forEach(callback => {
      try {
        callback(callbackData)
      } catch (error) {
        console.error('Error in ready callback:', error)
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
    if (navigationManager) {
      navigationManager.cleanup()
    }

    if (themeManager) {
      themeManager.cleanup()
    }

    if (router) {
      router.destroy()
    }

    if (layout) {
      layout.destroy()
    }

    // Reset state
    layout = null
    router = null
    navigationManager = null
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

    if (isInitialized && layout?.component) {
      // If already initialized, execute immediately
      callback({
        layout,
        router,
        ui: layout.component,
        themeManager,
        navigationManager
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
   * Get the layout instance
   * @returns {Object} Layout instance
   */
  const getLayout = () => {
    return layout
  }

  /**
   * Get a UI component by name
   * @param {string} name - Component name
   * @returns {Object} UI component
   */
  const getComponent = (name) => {
    return layout?.get(name)
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
   * Get the navigation manager
   * @returns {Object} Navigation manager
   */
  const getNavigationManager = () => {
    return navigationManager
  }

  // Create the API object
  const app = {
    onReady,
    initialize,
    destroy,
    isInitialized: getIsInitialized,
    getLayout,
    getComponent,
    getRouter,
    getThemeManager,
    getNavigationManager
  }

  return app
}

// Create a singleton instance for direct use
const appInstance = createApp({
  deferInit: true // Don't initialize immediately
})

export default createApp
export { appInstance as app }
