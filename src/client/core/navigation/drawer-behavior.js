// src/client/core/navigation/drawer-behavior.js

/**
 * Creates a drawer behavior manager that enhances navigation with mouseover
 * behavior on desktop and optimized interaction on mobile
 *
 * @param {Object} options - Configuration options
 * @returns {Object} Drawer behavior manager API
 */
export function createDrawerBehavior (options = {}) {
  // Configuration with defaults
  const config = {
    drawerHiddenClass: 'mtrl-nav--hidden',
    closeButtonClass: 'drawer-close-btn',
    mobileBreakpoint: 960,
    // Allow for no UI passed initially, will be set in configure
    ui: null,
    navigation: null, // Navigation configuration data
    ...options
  }

  // State
  let isInitialized = false
  let isDrawerVisible = false
  let eventHandlers = {}
  let currentNavigation = null

  // Core references
  let ui = config.ui

  /**
   * Configures the drawer behavior with UI components and options
   *
   * @param {Object} options - Configuration options including UI components
   * @returns {Object} Drawer behavior manager for chaining
   */
  function configure (options = {}) {
    // Update config
    Object.assign(config, options)

    // Store UI reference
    if (options.ui) {
      ui = options.ui
    }

    // Store navigation reference
    if (options.navigation) {
      currentNavigation = options.navigation
    }

    return api
  }

  /**
   * Checks if current viewport is mobile
   *
   * @returns {boolean} True if viewport is mobile size
   */
  function isMobileView () {
    return window.innerWidth <= config.mobileBreakpoint
  }

  /**
   * Checks if a section has drawer items
   *
   * @param {string} sectionId - The section ID to check
   * @returns {boolean} True if the section has items
   */
  function hasSectionItems (sectionId) {
    if (!currentNavigation || !sectionId) {
      return false
    }

    // Check if the section exists in navigation and has items
    const sectionItems = currentNavigation[sectionId]
    return !!(sectionItems && Array.isArray(sectionItems) && sectionItems.length > 0)
  }

  /**
   * Shows the drawer
   *
   * @returns {Object} Drawer behavior manager for chaining
   */
  function showDrawer () {
    if (!ui?.nav?.element) return api

    ui.nav.element.classList.remove(config.drawerHiddenClass)
    ui.nav.element.setAttribute('aria-hidden', 'false')
    isDrawerVisible = true

    return api
  }

  /**
   * Hides the drawer
   *
   * @returns {Object} Drawer behavior manager for chaining
   */
  function hideDrawer () {
    if (!ui?.nav?.element) return api

    ui.nav.element.classList.add(config.drawerHiddenClass)
    ui.nav.element.setAttribute('aria-hidden', 'true')
    isDrawerVisible = false

    return api
  }

  /**
   * Ensures the drawer is closed on page load
   *
   * @returns {Object} Drawer behavior manager for chaining
   */
  function ensureClosedOnLoad () {
    // Make sure this executes immediately when the function is called
    if (ui?.nav?.element) {
      hideDrawer()
    }

    // Also handle the case where UI might not be available yet
    // or if DOM isn't fully loaded
    window.addEventListener('DOMContentLoaded', () => {
      if (ui?.nav?.element) {
        hideDrawer()
      }
    })

    // Add a final check for when the window fully loads
    window.addEventListener('load', () => {
      if (ui?.nav?.element) {
        hideDrawer()
      }
    })

    return api
  }

  /**
   * Adds close button for mobile view
   *
   * @returns {HTMLElement|null} The created button or null
   */
  function addCloseButton () {
    if (!ui?.nav?.element) return null

    // Check if button already exists
    if (ui.nav.element.querySelector(`.${config.closeButtonClass}`)) {
      return null
    }

    const closeButton = document.createElement('button')
    closeButton.className = config.closeButtonClass
    closeButton.setAttribute('aria-label', 'Close navigation')
    closeButton.innerHTML = '&times;'
    closeButton.addEventListener('click', () => hideDrawer())

    ui.nav.element.appendChild(closeButton)
    return closeButton
  }

  /**
   * Event handler for rail mouseover
   *
   * @param {Event} event - Mouseover event
   */
  function handleRailMouseover (event) {
    if (isMobileView() || !ui?.rail?.element) return

    const railItem = event.target.closest('[data-id]')
    if (!railItem) return

    const sectionId = railItem.getAttribute('data-id')
    if (!sectionId) return

    // Check if this section has items
    if (hasSectionItems(sectionId)) {
      showDrawer()
    } else {
      // No items for this section, hide the drawer
      hideDrawer()
    }
  }

  /**
   * Event handler for rail clicks on mobile
   *
   * @param {Event} event - Click event
   */
  function handleRailClick (event) {
    if (!isMobileView() || !ui?.rail?.element) return

    const railItem = event.target.closest('[data-id]')
    if (!railItem) return

    const sectionId = railItem.getAttribute('data-id')
    if (!sectionId) return

    // Check if this section has items
    if (hasSectionItems(sectionId)) {
      showDrawer()
    } else {
      // No items for this section, hide the drawer
      hideDrawer()
    }
  }

  /**
   * Event handler for rail mouseout
   *
   * @param {Event} event - Mouseout event
   */
  function handleRailMouseout (event) {
    if (isMobileView() || !ui?.rail?.element || !ui?.nav?.element) return

    // Only hide if not moving to drawer
    const relatedTarget = event.relatedTarget
    if (relatedTarget && (
      relatedTarget.closest('.mtrl-nav--drawer') ||
        relatedTarget.closest('.mtrl-nav--rail'))) {
      return
    }

    hideDrawer()
  }

  /**
   * Event handler for drawer mouseout
   *
   * @param {Event} event - Mouseout event
   */
  function handleDrawerMouseout (event) {
    if (isMobileView() || !ui?.nav?.element || !ui?.rail?.element) return

    // Only hide if not moving to rail
    const relatedTarget = event.relatedTarget
    if (relatedTarget && (
      relatedTarget.closest('.mtrl-nav--drawer') ||
        relatedTarget.closest('.mtrl-nav--rail'))) {
      return
    }

    hideDrawer()
  }

  /**
   * Event handler for drawer item clicks on mobile
   *
   * @param {Event} event - Click event
   */
  function handleDrawerItemClick (event) {
    if (!isMobileView() || !ui?.nav?.element) return

    const navItem = event.target.closest('.mtrl-nav-item')
    if (!navItem) return

    // Don't close if it's an expandable item with children
    if (navItem.getAttribute('aria-expanded') !== null) {
      return
    }

    // Small delay to allow the navigation to process the selection
    setTimeout(() => hideDrawer(), 150)
  }

  /**
   * Initializes the drawer behavior
   *
   * @returns {Object} Drawer behavior manager for chaining
   */
  function initialize () {
    if (isInitialized || !ui) return api

    try {
      // Ensure UI components exist
      if (!ui.rail?.element || !ui.nav?.element) {
        throw new Error('Required UI components not available')
      }

      // Store handlers for cleanup
      eventHandlers = {
        railMouseover: handleRailMouseover,
        railClick: handleRailClick,
        railMouseout: handleRailMouseout,
        drawerMouseout: handleDrawerMouseout,
        drawerItemClick: handleDrawerItemClick
      }

      // Add event listeners
      ui.rail.element.addEventListener('mouseover', eventHandlers.railMouseover)
      ui.rail.element.addEventListener('click', eventHandlers.railClick)
      ui.rail.element.addEventListener('mouseout', eventHandlers.railMouseout)
      ui.nav.element.addEventListener('mouseout', eventHandlers.drawerMouseout)
      ui.nav.element.addEventListener('click', eventHandlers.drawerItemClick)

      // Add close button
      addCloseButton()

      // Ensure drawer is hidden on load - important for page reloads
      ensureClosedOnLoad()

      isInitialized = true
    } catch (error) {
      console.error('Failed to initialize drawer behavior:', error)
    }

    return api
  }

  /**
   * Sets the navigation configuration to check for section items
   *
   * @param {Object} navigation - Navigation configuration object
   * @returns {Object} Drawer behavior manager for chaining
   */
  function setNavigation (navigation) {
    currentNavigation = navigation
    return api
  }

  /**
   * Cleans up event listeners and resources
   */
  function cleanup () {
    if (!isInitialized || !ui) return

    try {
      // Remove event listeners if elements exist
      if (ui.rail?.element) {
        ui.rail.element.removeEventListener('mouseover', eventHandlers.railMouseover)
        ui.rail.element.removeEventListener('click', eventHandlers.railClick)
        ui.rail.element.removeEventListener('mouseout', eventHandlers.railMouseout)
      }

      if (ui.nav?.element) {
        ui.nav.element.removeEventListener('mouseout', eventHandlers.drawerMouseout)
        ui.nav.element.removeEventListener('click', eventHandlers.drawerItemClick)

        // Remove close button if it exists
        const closeButton = ui.nav.element.querySelector(`.${config.closeButtonClass}`)
        if (closeButton) {
          closeButton.remove()
        }
      }

      // Reset state
      eventHandlers = {}
      isInitialized = false
    } catch (error) {
      console.error('Error during drawer behavior cleanup:', error)
    }
  }

  // Create the public API
  const api = {
    configure,
    initialize,
    cleanup,
    showDrawer,
    hideDrawer,
    setNavigation,
    isInitialized: () => isInitialized,
    isVisible: () => isDrawerVisible
  }

  return api
}

// Create a singleton instance
const drawerBehavior = createDrawerBehavior()

export default drawerBehavior
