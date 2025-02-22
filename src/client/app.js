// src/client/app.js
import { createRouter } from './core/router'
import { createLayout } from 'mtrl'
import { createMainView } from './views'
import { navigationConfig } from './config'
import { createEventManager, setupErrorBoundary } from './core/events'
import {
  updateDrawerItems,
  toggleDrawer,
  setupRailNavigation,
  initializeRoutes,
  cleanupDrawer
} from './core/navigation'

window.log = console

// SVG icons remain the same
const darkModeIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
</svg>`

const lightModeIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="5"/>
  <line x1="12" y1="1" x2="12" y2="3"/>
  <line x1="12" y1="21" x2="12" y2="23"/>
  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
  <line x1="1" y1="12" x2="3" y2="12"/>
  <line x1="21" y1="12" x2="23" y2="12"/>
  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
</svg>`

const toggleDarkMode = () => {
  log.info('toggleDarkMode')
  // Get current theme
  const currentTheme = document.body.getAttribute('data-theme')
  const isDarkMode = currentTheme !== 'dark'
  // Toggle theme
  document.body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light')
  // Update icon based on current theme
  const themeButton = document.querySelector('[data-id="theme-toggle"]')
  if (themeButton) {
    themeButton.innerHTML = isDarkMode ? lightModeIcon : darkModeIcon
  }
  return isDarkMode
}

const createApp = (options = {}) => {
  let layoutInstance = null
  let eventManager = null
  let router = null

  const initializeLayout = () => {
    log.info('Starting layout initialization')
    try {
      layoutInstance = createLayout(createMainView(), document.body)
      return layoutInstance
    } catch (error) {
      log.error('Failed to initialize layout:', error)
      throw error
    }
  }

  const setupRouter = (ui) => {
    router = createRouter({
      onError: (error) => {
        log.error('Navigation failed:', error)
      },
      ui
    })

    initializeRoutes(router, ui)
    return router
  }

  const initializeEvents = (ui) => {
    log.info('Initializing events')
    eventManager = createEventManager()

    ui.toggleDarkmode.on('click', () => {
      toggleDarkMode(ui.toggleDarkmode)
    })

    // Setup rail navigation and store cleanup function
    const cleanupRail = setupRailNavigation(ui.rail, ui.nav, router, navigationConfig)
    if (cleanupRail) {
      eventManager.addCleanup(() => {
        cleanupRail()
        cleanupDrawer(ui.nav) // Add drawer cleanup
      })
    }

    // Initially hide drawer
    toggleDrawer(ui.nav, false)
  }

  // Initialize in the correct order
  try {
    log.info('Starting initialization')
    layoutInstance = initializeLayout()
    const ui = layoutInstance.component

    if (!ui) {
      throw new Error('Layout initialization failed - UI component is undefined')
    }

    // Setup router before initializing events
    router = setupRouter(ui)
    initializeEvents(ui)
    setupErrorBoundary()

    // Handle initial route
    const { pathname } = window.location
    const route = router.parsePath(pathname)

    if (route.section !== 'home') {
      // Update rail selection
      ui.rail?.setActive(route.section)

      // Show drawer with section items regardless of subsection
      if (navigationConfig[route.section]) {
        const items = navigationConfig[route.section].map(item => ({
          ...item,
          section: route.section
        }))
        // Clear any existing handlers before updating
        cleanupDrawer(ui.nav)
        updateDrawerItems(ui.nav, items, router)
        toggleDrawer(ui.nav, true)

        // If there's a subsection, set it as active in drawer
        if (route.subsection) {
          ui.nav?.setActive(route.subsection)
        }
      }

      // Navigate to initial route
      router.navigate(route.section, route.subsection, { noHistory: true })
    }

    return {
      destroy: () => {
        eventManager?.cleanup()
        router?.destroy()
        layoutInstance?.destroy()
        layoutInstance = null
        router = null
      },
      getLayout: () => layoutInstance,
      getComponent: (name) => layoutInstance?.get(name),
      getRouter: () => router
    }
  } catch (error) {
    log.error('Initialization failed:', error)
    throw error
  }
}

// Initialize app
try {
  window.app = createApp({
    onError: (error) => {
      log.error('Application error:', error)
    }
  })
} catch (error) {
  log.error('Failed to create app:', error)
}

export default createApp
