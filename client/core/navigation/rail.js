// src/client/core/navigation/rail.js
import drawerBehavior from './drawer-behavior'

/**
 * Sets up rail navigation with enhanced hover behavior and drawer integration
 *
 * @param {Object} options - Configuration options
 * @returns {Object} Rail behavior manager API
 */
export const setupRailNavigation = (options = {}) => {
  // Configuration
  const config = {
    rail: null,
    router: null,
    navigationConfig: null,
    hoverDelay: 50, // Quick response time for initial hover
    ...options
  }

  // State
  let isInitialized = false
  let currentSection = null
  let hoverTimer = null
  let lastMouseX = 0
  let lastMouseY = 0
  let drawerPosition = null // Will store the drawer position for movement calculation
  let eventHandlers = {}

  /**
   * Get the current drawer position
   * This helps determine if the user is trying to move toward the drawer
   */
  const updateDrawerPosition = () => {
    const drawerElement = document.querySelector('.mtrl-nav--drawer')
    if (drawerElement) {
      drawerPosition = drawerElement.getBoundingClientRect()
    }
  }

  /**
   * Detect if the mouse is moving toward the drawer
   *
   * @param {number} currentX - Current mouse X position
   * @param {number} currentY - Current mouse Y position
   * @returns {boolean} - True if the mouse appears to be moving toward the drawer
   */
  const isMovingTowardDrawer = (currentX, currentY) => {
    if (!drawerPosition) {
      updateDrawerPosition()
      return false
    }

    // If drawer is visible and user is moving horizontally toward it
    if (drawerBehavior.isVisible()) {
      // For left-positioned drawer
      const movingRight = currentX > lastMouseX
      // Check if mouse is at a height that could be moving toward drawer
      const isAtDrawerHeight = currentY >= drawerPosition.top &&
                              currentY <= drawerPosition.bottom

      // If moving right (toward drawer) and cursor is within drawer height range
      if (movingRight && isAtDrawerHeight && currentX < drawerPosition.left) {
        return true
      }
    }

    return false
  }

  /**
   * Handler for change events from the rail component
   *
   * @param {Object} event - Component change event with id property
   */
  const handleRailChange = (event) => {
    console.log('Rail change event received:', event)

    // Validate the event has an id
    if (!event || !event.id) {
      console.warn('Invalid rail change event - missing id')
      return
    }

    const id = event.id

    // Navigate to section
    if (config.router) {
      config.router.navigate(id, '', { replace: true })
    }

    // Update current section
    currentSection = id

    // Check if section has items
    const hasItems = drawerBehavior.hasSectionItems(id)
    if (hasItems) {
      // Call updateSection to populate and show the drawer
      drawerBehavior.updateSection(id)
    } else {
      // Explicitly hide the drawer for sections with no items
      // force=true ensures it hides even if mouse is over drawer
      drawerBehavior.hideDrawer(false, true)
    }
  }

  /**
   * Handler for mouseover events
   * Used for drawer interaction
   *
   * @param {Object} event - Component mouseover event
   */
  const handleRailMouseover = (event) => {
    // Updated to work with component events which now include:
    // id, clientX, clientY, item
    const id = event.id
    const currentMouseX = event.clientX
    const currentMouseY = event.clientY

    // Skip if we don't have an id or position data
    if (!id || currentMouseX === undefined || currentMouseY === undefined) {
      return
    }

    // If drawer is open and mouse appears to be moving toward it,
    // don't change the drawer content
    if (drawerBehavior.isVisible() && isMovingTowardDrawer(currentMouseX, currentMouseY)) {
      // Skip processing - user is likely trying to reach the drawer
      lastMouseX = currentMouseX
      lastMouseY = currentMouseY
      return
    }

    // Update last position
    lastMouseX = currentMouseX
    lastMouseY = currentMouseY

    // Skip if it's the same section
    if (id === currentSection && drawerBehavior.isVisible()) {
      return
    }

    // Clear any existing hover timer
    if (hoverTimer) {
      clearTimeout(hoverTimer)
      hoverTimer = null
    }

    // Set timer to update drawer after a short delay
    hoverTimer = setTimeout(() => {
      // Check if section has items directly
      const hasItems = drawerBehavior.hasSectionItems(id)
      console.log(`Rail mouseover: ${id} - Has items: ${hasItems}`)

      if (hasItems) {
        // Has items - update section
        drawerBehavior.updateSection(id)

        // Update drawer position after changing content
        setTimeout(updateDrawerPosition, 50)
      } else {
        // No items for this section - explicitly hide drawer
        console.log(`No items for ${id}, hiding drawer`)
        drawerBehavior.hideDrawer(false, true)
      }
    }, config.hoverDelay)
  }

  /**
   * Handler for mouseenter events
   *
   * @param {Object} event - Component mouseenter event
   */
  const handleRailMouseenter = (event) => {
    // Not currently using this, but kept for potential future needs
  }

  /**
   * Handler for mouseleave events
   *
   * @param {Object} event - Component mouseleave event
   */
  const handleRailMouseleave = (event) => {
    // Check if moving to drawer using the relatedTargetId property
    // from our enhanced component event
    const isMovingToDrawer = event.relatedTargetId === 'drawer'

    if (isMovingToDrawer) {
      return
    }

    // Hide the drawer with a delay
    drawerBehavior.hideDrawer(true)
  }

  /**
   * Initialize the rail behavior
   *
   * @returns {Object} Rail behavior API for chaining
   */
  const initialize = () => {
    if (isInitialized) return api

    try {
      // Check if rail component is available
      if (!config.rail) {
        console.warn('Rail component not provided to rail behavior')
        return api
      }

      // Set up event handlers
      eventHandlers = {
        railChange: handleRailChange,
        railMouseover: handleRailMouseover,
        railMouseenter: handleRailMouseenter,
        railMouseleave: handleRailMouseleave
      }

      // Get initial drawer position
      updateDrawerPosition()

      // Attach event listeners using the component's event system
      if (config.rail.on) {
        // Standard navigation events
        config.rail.on('change', eventHandlers.railChange)

        // Mouse events - now supported by our enhanced navigation component
        config.rail.on('mouseover', eventHandlers.railMouseover)
        config.rail.on('mouseenter', eventHandlers.railMouseenter)
        config.rail.on('mouseleave', eventHandlers.railMouseleave)
      } else {
        console.warn('Rail component does not have event system')
      }

      isInitialized = true
      console.log('Rail behavior initialized successfully')
    } catch (error) {
      console.error('Failed to initialize rail behavior:', error)
    }

    return api
  }

  /**
   * Clean up event listeners and resources
   */
  const cleanup = () => {
    if (!isInitialized) return

    try {
      // Clear timers
      if (hoverTimer) {
        clearTimeout(hoverTimer)
        hoverTimer = null
      }

      // Remove all event listeners using the component's event system
      if (config.rail?.off) {
        config.rail.off('change', eventHandlers.railChange)
        config.rail.off('mouseover', eventHandlers.railMouseover)
        config.rail.off('mouseenter', eventHandlers.railMouseenter)
        config.rail.off('mouseleave', eventHandlers.railMouseleave)
      }

      isInitialized = false
    } catch (error) {
      console.error('Error during rail behavior cleanup:', error)
    }
  }

  /**
   * Configure the rail behavior
   *
   * @param {Object} options - Configuration options
   * @returns {Object} Rail behavior API for chaining
   */
  const configure = (options = {}) => {
    Object.assign(config, options)
    return api
  }

  // Create API
  const api = {
    initialize,
    cleanup,
    configure,
    setNavigation: (nav) => {
      config.navigationConfig = nav
      return api
    },
    isInitialized: () => isInitialized
  }

  return api
}

// Create a singleton instance for direct use
const railBehavior = setupRailNavigation()

export default railBehavior
