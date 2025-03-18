// src/client/core/navigation/mobile-drawer.js

/**
 * Mobile drawer management module
 * Handles mobile-specific behavior for the navigation drawer
 */
export const setupMobileDrawer = (options = {}) => {
  // Default options
  const config = {
    railSelector: '.mtrl-nav--rail',
    drawerSelector: '.mtrl-nav--drawer',
    drawerHiddenClass: 'mtrl-nav--hidden',
    overlayClass: 'drawer-overlay',
    closeButtonClass: 'drawer-close-btn',
    breakpoint: 960, // Pixel width for mobile breakpoint
    ...options
  }

  // DOM elements
  let railElement = null
  let drawerElement = null
  let overlayElement = null
  let closeButtonElement = null

  // State
  let isMobile = false
  let isInitialized = false

  /**
   * Create and append overlay element
   */
  const createOverlay = () => {
    if (overlayElement) return

    overlayElement = document.createElement('div')
    overlayElement.className = config.overlayClass
    document.body.appendChild(overlayElement)

    // Add click handler to close drawer when overlay is clicked
    overlayElement.addEventListener('click', () => {
      hideDrawer()
    })
  }

  /**
   * Create and append close button
   */
  const createCloseButton = () => {
    if (closeButtonElement || !drawerElement) return

    // Check if button already exists
    closeButtonElement = drawerElement.querySelector(`.${config.closeButtonClass}`)
    if (closeButtonElement) return

    closeButtonElement = document.createElement('button')
    closeButtonElement.className = config.closeButtonClass
    closeButtonElement.setAttribute('aria-label', 'Close navigation')
    closeButtonElement.innerHTML = '&times;' // × symbol

    // Add click handler
    closeButtonElement.addEventListener('click', () => {
      hideDrawer()
    })

    drawerElement.appendChild(closeButtonElement)
  }

  /**
   * Show the drawer and overlay
   */
  const showDrawer = () => {
    if (!drawerElement) return

    drawerElement.classList.remove(config.drawerHiddenClass)
    drawerElement.setAttribute('aria-hidden', 'false')

    // Show overlay on mobile
    if (isMobile && overlayElement) {
      overlayElement.classList.add('active')
    }
  }

  /**
   * Hide the drawer and overlay
   */
  const hideDrawer = () => {
    if (!drawerElement) return

    drawerElement.classList.add(config.drawerHiddenClass)
    drawerElement.setAttribute('aria-hidden', 'true')

    // Hide overlay
    if (overlayElement) {
      overlayElement.classList.remove('active')
    }
  }

  /**
   * Check if we're in mobile view
   */
  const checkMobileState = () => {
    const prevState = isMobile
    isMobile = window.innerWidth <= config.breakpoint

    // If state changed, adjust UI
    if (prevState !== isMobile) {
      if (isMobile) {
        // Switched to mobile - hide drawer initially
        hideDrawer()
      } else {
        // Switched to desktop - remove overlay effect
        if (overlayElement) {
          overlayElement.classList.remove('active')
        }
      }
    }
  }

  /**
   * Set up rail click handling for mobile
   */
  const setupRailClicks = () => {
    if (!railElement) return

    // Add click handler to rail items for mobile mode
    railElement.addEventListener('click', (event) => {
      if (!isMobile) return

      const railItem = event.target.closest('[data-id]')
      if (!railItem) return

      // Show drawer on rail item click on mobile
      showDrawer()
    })
  }

  /**
   * Initialize the mobile drawer management
   */
  const initialize = () => {
    if (isInitialized) return

    // Get elements
    railElement = document.querySelector(config.railSelector)
    drawerElement = document.querySelector(config.drawerSelector)

    if (!railElement || !drawerElement) {
      console.warn('Mobile drawer management: Required elements not found')
      return
    }

    // Create UI elements
    createOverlay()
    createCloseButton()

    // Set up event handlers
    setupRailClicks()

    // Check initial state
    checkMobileState()

    // Add resize listener
    window.addEventListener('resize', checkMobileState)

    isInitialized = true
  }

  /**
   * Clean up event listeners and elements
   */
  const cleanup = () => {
    if (!isInitialized) return

    window.removeEventListener('resize', checkMobileState)

    if (overlayElement) {
      overlayElement.removeEventListener('click', hideDrawer)
      if (overlayElement.parentNode) {
        overlayElement.parentNode.removeChild(overlayElement)
      }
      overlayElement = null
    }

    if (closeButtonElement) {
      closeButtonElement.removeEventListener('click', hideDrawer)
      closeButtonElement = null
    }

    isInitialized = false
  }

  // Return public API
  return {
    initialize,
    cleanup,
    showDrawer,
    hideDrawer,
    get isMobile () {
      return isMobile
    },
    get isInitialized () {
      return isInitialized
    }
  }
}

export default setupMobileDrawer
