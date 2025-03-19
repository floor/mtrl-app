// src/client/core/navigation/drawer-behavior.js

/**
 * Creates a drawer behavior manager that enhances navigation drawer behavior
 * with optimized interaction on mobile and desktop
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
  let closeTimer = null
  let mouseInDrawer = false

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

    // Only if not already visible
    if (!isDrawerVisible) {
      console.log('Showing drawer')
      ui.nav.element.classList.remove(config.drawerHiddenClass)
      ui.nav.element.setAttribute('aria-hidden', 'false')
      isDrawerVisible = true
    }

    return api
  }

  /**
   * Hides the drawer with optional delay
   *
   * @param {boolean} withDelay - Whether to apply delay before closing
   * @param {boolean} force - Whether to force hiding even if mouse is over drawer
   * @returns {Object} Drawer behavior manager for chaining
   */
  function hideDrawer (withDelay = false, force = false) {
    if (!ui?.nav?.element) return api

    // If we're still hovering over drawer and not forcing, don't hide
    if (!force && mouseInDrawer) {
      console.log('Not hiding drawer because mouse is over it (and not forcing)')
      return api
    }

    // Clear any existing close timer
    if (closeTimer) {
      clearTimeout(closeTimer)
      closeTimer = null
    }

    const hideAction = () => {
      // Double-check we're still not hovering over drawer (unless forcing)
      if (force || !mouseInDrawer) {
        console.log('Hiding drawer', force ? '(forced)' : '')
        ui.nav.element.classList.add(config.drawerHiddenClass)
        ui.nav.element.setAttribute('aria-hidden', 'true')
        isDrawerVisible = false
      } else {
        console.log('Cancelled drawer hiding - mouse entered drawer')
      }
    }

    if (withDelay && !isMobileView()) {
      console.log(`Setting drawer hide timer with ${config.closeDelay}ms delay`)
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
   * Update the drawer content for a specific section
   * This is the main public method called by the rail component
   *
   * @param {string} sectionId - The section ID to display
   * @returns {boolean} - True if the section has items and drawer was shown
   */
  function updateSection (sectionId) {
    if (!sectionId || !ui) return false

    // Update current section
    currentSectionId = sectionId

    // Check if this section has items
    if (hasSectionItems(sectionId)) {
      showDrawer()
      return true
    } else {
      // No items for this section, hide the drawer
      hideDrawer(false, true)
      return false
    }
  }

  /**
   * Handler for drawer mouseenter events
   * Now uses component event format
   *
   * @param {Object} event - Component mouseenter event
   */
  function handleDrawerMouseenter (event) {
    if (isMobileView()) return
    console.log('Mouse entered drawer')
    mouseInDrawer = true
  }

  /**
   * Handler for drawer mouseleave events
   * Now uses component event format
   *
   * @param {Object} event - Component mouseleave event
   */
  function handleDrawerMouseleave (event) {
    if (isMobileView()) return
    console.log('Mouse left drawer')
    mouseInDrawer = false

    // Check if moving to rail using enhanced relatedTargetId property
    const isMovingToRail = event.relatedTargetId === 'rail'

    if (isMovingToRail) {
      console.log('Moving to rail, not hiding drawer')
      return
    }

    console.log('Mouse left drawer (not to rail), hiding with delay')
    hideDrawer(true)
  }

  /**
   * Handler for drawer item click events
   *
   * @param {Object} event - Component change event
   */
  function handleDrawerItemClick (event) {
    if (!isMobileView()) return

    // Skip if this is an expandable item (with nested items)
    // We can determine this from the component event data
    const isExpandable = event.item?.config?.items && event.item.config.items.length > 0

    if (isExpandable) {
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
      if (!ui.nav?.element) {
        throw new Error('Required UI components not available')
      }

      // Store handlers for cleanup
      eventHandlers = {
        drawerMouseenter: handleDrawerMouseenter,
        drawerMouseleave: handleDrawerMouseleave,
        drawerItemClick: handleDrawerItemClick
      }

      // Add event listeners using our enhanced component event system
      if (ui.nav.on) {
        ui.nav.on('mouseenter', eventHandlers.drawerMouseenter)
        ui.nav.on('mouseleave', eventHandlers.drawerMouseleave)
        ui.nav.on('change', eventHandlers.drawerItemClick)
      }

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
      if (closeTimer) {
        clearTimeout(closeTimer)
        closeTimer = null
      }

      // Remove event listeners using component event system
      if (ui.nav?.off) {
        ui.nav.off('mouseenter', eventHandlers.drawerMouseenter)
        ui.nav.off('mouseleave', eventHandlers.drawerMouseleave)
        ui.nav.off('change', eventHandlers.drawerItemClick)
      }

      // Remove close button if it exists
      const closeButton = ui.nav.element?.querySelector(`.${config.closeButtonClass}`)
      if (closeButton) {
        closeButton.remove()
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
    updateSection,
    hasSectionItems,
    setNavigation,
    isInitialized: () => isInitialized,
    isVisible: () => isDrawerVisible
  }

  return api
}

// Create a singleton instance
const drawerBehavior = createDrawerBehavior()

export default drawerBehavior
