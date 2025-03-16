// src/client/app.js

import { createRouter } from './core/router'
import { createLayout, createMenu } from 'mtrl'
import { navigation, themesMenu } from './config'
import { mainLayout } from './layout'
import { createEventManager, setupErrorBoundary } from './core/events'
import themeService from './core/theme'
import {
  updateDrawerItems,
  toggleDrawer,
  setupRailNavigation,
  initializeRoutes,
  cleanupDrawer
} from './core/navigation'

// Ensure console.log is available even if window.log isn't
window.log = window.log || console

/**
 * Creates the application with proper lifecycle management
 * @param {Object} options - Application configuration options
 * @returns {Object} Application instance with lifecycle methods
 */
const createApp = (options = {}) => {
  let layoutInstance = null
  let eventManager = null
  let router = null
  let themeMenu = null
  let isInitialized = false
  let readyCallbacks = []

  // Initialize layout and return component
  const initializeLayout = () => {
    try {
      layoutInstance = createLayout(mainLayout, document.body)
      return layoutInstance
    } catch (error) {
      console.error('Failed to initialize layout:', error)
      throw error
    }
  }

  // Set up router with component
  const setupRouter = (ui) => {
    if (!ui) return null

    router = createRouter({
      onError: (error) => console.error('Navigation failed:', error),
      ui
    })

    initializeRoutes(router, ui)
    return router
  }

  // Initialize interface with theme support
  const initInterface = (ui) => {
    if (!ui) return

    document.body.classList.add('mtrl-app')

    // Initialize theme service (should be very fast)
    themeService.init()

    // Theme toggle button setup
    if (ui.toggleDarkmode?.on) {
      ui.toggleDarkmode.setIcon(themeService.getThemeModeIcon())
      ui.toggleDarkmode.on('click', () => {
        themeService.toggleDarkMode(ui.toggleDarkmode)
      })
    }

    // Theme menu setup (defer this to improve initial load)
    if (ui.moreMenu?.on) {
      // Defer menu creation to improve initial load time
      setTimeout(() => {
        themeMenu = createMenu({
          items: themesMenu,
          openingButton: ui.moreMenu
        })

        document.body.appendChild(themeMenu.element)

        ui.moreMenu.on('click', () => {
          themeMenu.show()
          if (ui.moreMenu.element) {
            themeMenu.position(ui.moreMenu.element)
          }
        })

        themeMenu.on('select', ({ name }) => {
          themeService.setTheme(name)
          themeMenu.hide()
        })

        // Set the currently selected theme if possible
        const { themeName } = themeService.getSettings()
        if (themeMenu.setSelected && themeName) {
          themeMenu.setSelected(themeName)
        }
      }, 100) // Short delay to prioritize critical path rendering
    }
  }

  // Event initialization and cleanup registration
  const initializeEvents = (ui) => {
    if (!ui) return

    eventManager = createEventManager(ui)

    // Setup rail navigation if components exist
    if (ui.rail && ui.nav) {
      const cleanupRail = setupRailNavigation(ui.rail, ui.nav, router, navigation)
      if (cleanupRail) {
        eventManager.addCleanup(() => {
          cleanupRail()
          cleanupDrawer(ui.nav)
        })
      }
    }

    // Register theme menu cleanup
    eventManager.addCleanup(() => {
      if (themeMenu) {
        themeMenu.destroy()
        themeMenu = null
      }
    })

    // Initially hide drawer if it exists
    if (ui.nav) {
      toggleDrawer(ui.nav, false)
    }

    initInterface(ui)
  }

  // Handle initial navigation based on URL
  const handleInitialRoute = (ui) => {
    if (!ui || !router) return

    const { pathname } = window.location
    const route = router.parsePath(pathname)

    try {
      if (route.section !== 'home') {
        // Update rail selection if it exists
        if (ui.rail?.setActive) {
          ui.rail.setActive(route.section)
        }

        // Show drawer with section items
        if (ui.nav && navigation[route.section]) {
          const items = navigation[route.section].map(item => ({
            ...item,
            section: route.section
          }))
          cleanupDrawer(ui.nav)
          updateDrawerItems(ui.nav, items, router)
          toggleDrawer(ui.nav, true)

          // Set active subsection
          if (route.subsection && ui.nav.setActive) {
            ui.nav.setActive(route.subsection)
          }
        }

        // Navigate to initial route
        router.navigate(route.section, route.subsection, { noHistory: true })
      }
    } catch (error) {
      console.error('Error handling initial route:', error)
    }
  }

  // Main initialization function
  const initialize = () => {
    if (isInitialized) return

    try {
      // Critical path initialization - keep this minimal and fast
      layoutInstance = initializeLayout()
      if (!layoutInstance) {
        throw new Error('Layout initialization failed')
      }

      const ui = layoutInstance.component
      if (!ui) {
        throw new Error('UI component is undefined')
      }

      // Router setup
      router = setupRouter(ui)
      if (!router) {
        throw new Error('Router initialization failed')
      }

      // Setup error boundary early
      setupErrorBoundary()

      // Initialize events and handle initial route
      initializeEvents(ui)

      // Defer route handling slightly to allow UI to render first
      requestAnimationFrame(() => {
        handleInitialRoute(ui)

        // Execute ready callbacks in next frame for better rendering performance
        requestAnimationFrame(() => {
          readyCallbacks.forEach(callback => {
            try {
              callback({ layout: layoutInstance, router, ui })
            } catch (error) {
              console.error('Error in ready callback:', error)
            }
          })
          readyCallbacks = []
        })
      })

      isInitialized = true
    } catch (error) {
      console.error('Initialization failed:', error)
      isInitialized = false
    }
  }

  // Start initialization when DOM is ready
  const initWhenReady = () => {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      // Use requestIdleCallback if available, otherwise setTimeout
      if (window.requestIdleCallback) {
        window.requestIdleCallback(() => initialize(), { timeout: 1000 })
      } else {
        setTimeout(initialize, 10)
      }
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        // Use requestIdleCallback if available
        if (window.requestIdleCallback) {
          window.requestIdleCallback(() => initialize(), { timeout: 1000 })
        } else {
          setTimeout(initialize, 10)
        }
      })

      // Fallback for older browsers
      window.addEventListener('load', () => {
        if (!isInitialized) {
          initialize()
        }
      })
    }
  }

  // Start the initialization process
  initWhenReady()

  // Return the app interface
  return {
    onReady (callback) {
      if (typeof callback !== 'function') return

      if (isInitialized && layoutInstance?.component) {
        // If already initialized, execute immediately
        callback({
          layout: layoutInstance,
          router,
          ui: layoutInstance.component
        })
      } else {
        // Queue for later execution
        readyCallbacks.push(callback)
      }
    },

    destroy: () => {
      if (eventManager) eventManager.cleanup()
      if (router) router.destroy()
      if (layoutInstance) layoutInstance.destroy()
      layoutInstance = null
      router = null
      isInitialized = false
    },

    isInitialized: () => isInitialized,
    getLayout: () => layoutInstance,
    getComponent: (name) => layoutInstance?.get(name),
    getRouter: () => router,
    getThemeService: () => themeService
  }
}

// Initialize app safely and efficiently
let app
try {
  app = createApp({
    onError: (error) => console.error('Application error:', error)
  })
} catch (error) {
  console.error('Failed to create app:', error)
}

export default createApp
