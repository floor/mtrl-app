// src/client/app.js

import { createApp } from './core/app-manager'
import { mainLayout } from './layout'
import { navigation, themesMenu } from './config'
import { setupErrorBoundary } from './core/events'
import { routes, notFoundHandler } from './routes'
import themeManager from './core/theme/theme-manager'
import drawerBehavior from './core/navigation/drawer-behavior'

// Ensure console.log is available even if window.log isn't
window.log = window.log || console

// Create the application
let app
try {
  app = createApp({
    // Layout setup
    layout: mainLayout,
    container: document.body,

    // Navigation configuration
    navigation,

    // Theme configuration
    themesMenu,

    // Register routes
    routes,

    // Global error handling
    onError: (error) => console.error('Application error:', error),
    onNavigationError: (error) => console.error('Navigation failed:', error),

    // Router configuration
    routerOptions: {
      debug: process.env.NODE_ENV !== 'production',
      scrollRestoration: true
    },

    // Register 404 handler
    notFoundHandler
  })

  app.onReady(({ ui, navigationManager }) => {
    // Configure drawer behavior with UI components and navigation config
    drawerBehavior.configure({
      ui,
      navigation // Use the navigation config from your app
    })

    // Initialize the behavior
    drawerBehavior.initialize()

    // Log successful initialization
    // console.info('Drawer behavior enhancement initialized')
  })

  // Make app accessible globally
  window.app = app

  // Ensure theme manager is accessible directly
  window.themeManager = themeManager

  // Add a convenience method to toggle dark mode directly from console
  window.toggleDarkMode = () => {
    if (themeManager) {
      return themeManager.toggleDarkMode()
    }
  }

  // Log successful initialization
  // console.info('Application initialized successfully')
} catch (error) {
  console.error('Failed to create app:', error)
  setupErrorBoundary()
}

export default createApp
