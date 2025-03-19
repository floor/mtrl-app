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
    hoverDelay: 300, // Delay before switching drawer content (ms)
    closeDelay: 400, // Delay before closing drawer (ms)
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
  let currentSectionId = null
  let hoverTimer = null
  let closeTimer = null
  let mouseInDrawer = false
  let mouseInRail = false

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

    // Clear any pending close timer
    if (closeTimer) {
      clearTimeout(closeTimer)
      closeTimer = null
    }

    ui.nav.element.classList.remove(config.drawerHiddenClass)
    ui.nav.element.setAttribute('aria-hidden', 'false')
    isDrawerVisible = true

    return api
  }

  /**
   * Hides the drawer with optional delay
   *
   * @param {boolean} withDelay - Whether to apply delay before closing
   * @returns {Object} Drawer behavior manager for chaining
   */
  function hideDrawer (withDelay = false) {
    if (!ui?.nav?.element) return api

    // If we're still hovering over nav elements, don't hide
    if (mouseInDrawer || mouseInRail) {
      return api
    }

    // Clear any existing close timer
    if (closeTimer) {
      clearTimeout(closeTimer)
      closeTimer = null
    }

    const hideAction = () => {
      // Double-check we're still not hovering over nav elements
      if (!mouseInDrawer && !mouseInRail) {
        ui.nav.element.classList.add(config.drawerHiddenClass)
        ui.nav.element.setAttribute('aria-hidden', 'true')
        isDrawerVisible = false
      }
    }

    if (withDelay && !isMobileView()) {
      closeTimer = setTimeout(hideAction, config.closeDelay)
    } else {
      hideAction()
    }

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
      hideDrawer(false)
    }

    // Also handle the case where UI might not be available yet
    // or if DOM isn't fully loaded
    window.addEventListener('DOMContentLoaded', () => {
      if (ui?.nav?.element) {
        hideDrawer(false)
      }
    })

    // Add a final check for when the window fully loads
    window.addEventListener('load', () => {
      if (ui?.nav?.element) {
        hideDrawer(false)
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
    closeButton.addEventListener('click', () => hideDrawer(false))

    ui.nav.element.appendChild(closeButton)
    return closeButton
  }

  /**
   * Handles section change with hover intent
   *
   * @param {string} sectionId - Section ID to change to
   */
  function handleSectionChange (sectionId) {
    // Clear any existing hover timer
    if (hoverTimer) {
      clearTimeout(hoverTimer)
      hoverTimer = null
    }

    // If it's the same section, no need to change
    if (sectionId === currentSectionId) {
      return
    }

    // Set a timer to change the section after delay
    hoverTimer = setTimeout(() => {
      // Update current section
      currentSectionId = sectionId

      // Check if this section has items
      if (hasSectionItems(sectionId)) {
        showDrawer()
      } else {
        // No items for this section, hide the drawer
        hideDrawer(true)
      }
    }, config.hoverDelay)
  }

  /**
   * Event handler for rail mouseover
   *
   * @param {Event} event - Mouseover event
   */
  function handleRailMouseover (event) {
    if (isMobileView() || !ui?.rail?.element) return

    mouseInRail = true

    const railItem = event.target.closest('[data-id]')
    if (!railItem) return

    const sectionId = railItem.getAttribute('data-id')
    if (!sectionId) return

    handleSectionChange(sectionId)
  }

  /**
   * Event handler for rail mouseenter
   *
   * @param {Event} event - Mouseenter event
   */
  function handleRailMouseenter (event) {
    if (isMobileView() || !ui?.rail?.element) return
    mouseInRail = true
  }

  /**
   * Event handler for rail mouseleave
   *
   * @param {Event} event - Mouseleave event
   */
  function handleRailMouseleave (event) {
    if (isMobileView() || !ui?.rail?.element) return
    mouseInRail = false

    // Only hide if not moving to drawer
    const relatedTarget = event.relatedTarget
    if (relatedTarget && relatedTarget.closest('.mtrl-nav--drawer')) {
      return
    }

    hideDrawer(true)
  }

  /**
   * Event handler for drawer mouseenter
   *
   * @param {Event} event - Mouseenter event
   */
  function handleDrawerMouseenter (event) {
    if (isMobileView() || !ui?.nav?.element) return
    mouseInDrawer = true
  }

  /**
   * Event handler for drawer mouseleave
   *
   * @param {Event} event - Mouseleave event
   */
  function handleDrawerMouseleave (event) {
    if (isMobileView() || !ui?.nav?.element) return
    mouseInDrawer = false

    // Only hide if not moving to rail
    const relatedTarget = event.relatedTarget
    if (relatedTarget && relatedTarget.closest('.mtrl-nav--rail')) {
      return
    }

    hideDrawer(true)
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

    // Update current section
    currentSectionId = sectionId

    // Check if this section has items
    if (hasSectionItems(sectionId)) {
      showDrawer()
    } else {
      // No items for this section, hide the drawer
      hideDrawer(false)
    }
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
    setTimeout(() => hideDrawer(false), 150)
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
        railMouseenter: handleRailMouseenter,
        railMouseleave: handleRailMouseleave,
        railClick: handleRailClick,
        drawerMouseenter: handleDrawerMouseenter,
        drawerMouseleave: handleDrawerMouseleave,
        drawerItemClick: handleDrawerItemClick
      }

      // Add event listeners
      ui.rail.element.addEventListener('mouseover', eventHandlers.railMouseover)
      ui.rail.element.addEventListener('mouseenter', eventHandlers.railMouseenter)
      ui.rail.element.addEventListener('mouseleave', eventHandlers.railMouseleave)
      ui.rail.element.addEventListener('click', eventHandlers.railClick)
      ui.nav.element.addEventListener('mouseenter', eventHandlers.drawerMouseenter)
      ui.nav.element.addEventListener('mouseleave', eventHandlers.drawerMouseleave)
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
      // Clear any timers
      if (hoverTimer) {
        clearTimeout(hoverTimer)
        hoverTimer = null
      }

      if (closeTimer) {
        clearTimeout(closeTimer)
        closeTimer = null
      }

      // Remove event listeners if elements exist
      if (ui.rail?.element) {
        ui.rail.element.removeEventListener('mouseover', eventHandlers.railMouseover)
        ui.rail.element.removeEventListener('mouseenter', eventHandlers.railMouseenter)
        ui.rail.element.removeEventListener('mouseleave', eventHandlers.railMouseleave)
        ui.rail.element.removeEventListener('click', eventHandlers.railClick)
      }

      if (ui.nav?.element) {
        ui.nav.element.removeEventListener('mouseenter', eventHandlers.drawerMouseenter)
        ui.nav.element.removeEventListener('mouseleave', eventHandlers.drawerMouseleave)
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
