// src/client/core/initializers/highlight-initializer.js

import codeHighlighter from './highlight'

/**
 * Initializes code highlighting for the MTRL application
 * @param {Object} app - The app instance
 */
export function initializeCodeHighlighting (app) {
  if (!app) return

  // Get the router from the app
  const router = app.getRouter ? app.getRouter() : null

  if (router) {
    // Register with the router to handle highlighting after navigation
    codeHighlighter.registerWithRouter(router)
  }

  // Make code highlighting available globally
  codeHighlighter.exposeGlobally()

  // Do an initial highlight of the current page
  codeHighlighter.highlight(document.body, { delay: 300 })

  return {
    // Return a cleanup function if needed
    cleanup: () => {
      // Any cleanup tasks would go here
    }
  }
}

export default initializeCodeHighlighting
