// src/client/app.js

import { createApp } from './core/app-manager'
import { themesMenu, appLayout } from './config'
import { setupErrorBoundary } from './core/events'
import { routes, notFoundHandler } from './routes'
import themeManager from './core/theme/theme-manager'

// Ensure console.log is available even if window.log isn't
window.log = window.log || console

// Create the application
let app
try {
  app = createApp({
    // Layout setup
    layout: appLayout,
    container: document.body,

    // Theme configuration
    themesMenu,

    // Register routes
    routes,

    contentPagination: true,

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
    // Log successful initialization
    // console.info('Application initialized successfully')
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
} catch (error) {
  console.error('Failed to create app:', error)
  setupErrorBoundary()
}

// Test the fix by navigating to a section
// navFix.navigate('components');

export default createApp
