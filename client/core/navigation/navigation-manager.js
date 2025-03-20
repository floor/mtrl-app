// src/client/core/navigation/navigation-manager.js

/**
 * Creates a navigation manager that handles synchronized navigation
 * between rail, drawer and routes with dynamic content loading
 *
 * @param {Object} options - Configuration options
 * @returns {Object} Navigation manager API
 */
export const createNavigationManager = (options = {}) => {
  // Core dependencies
  const ui = options.ui || null
  const router = options.router || null

  // Navigation configuration
  const navigation = options.navigation || {}

  // State tracking
  let currentSection = null
  let currentSubsection = null
  let preventDrawerHiding = false

  // Event handlers
  let railHandler = null
  let drawerHandler = null

  // Enhanced hover behavior state
  let lastHoveredSection = null
  const lastMouseX = 0 // Changed from const to let
  const lastMouseY = 0 // Changed from const to let
  let drawerPosition = null
  let mouseInDrawer = false
  let hoverTimer = null
  let drawerChangeTimer = null
  let preventContentChange = false

  // Options with defaults
  const config = {
    drawerClasses: {
      hidden: 'mtrl-nav--hidden'
    },
    autoOpenDrawer: true,
    persistDrawerState: true,
    hoverDelay: 200, // Initial hover delay
    drawerDelay: 500, // Delay for changing drawer content when already open
    closeDelay: 600, // Delay before closing drawer when mouse leaves
    pathPredictionThreshold: 15, // Threshold in pixels to detect movement toward drawer
    mobileBreakpoint: 960, // Pixel width for mobile breakpoint
    ...options
  }

  // Debug logging
  const debug = {
    enabled: true, // Set to false to disable debug logs
    log: function (...args) {
      if (this.enabled) {
        console.log('[NavigationManager]', ...args)
      }
    }
  }

  /**
   * Checks if current viewport is mobile
   * @returns {boolean} True if viewport is mobile size
   */
  const isMobileView = () => {
    return window.innerWidth <= config.mobileBreakpoint
  }

  /**
   * Function to reset the preventContentChange flag properly
   * This should be called in appropriate places
   */
  const resetContentChangeFlag = () => {
    if (preventContentChange) {
      debug.log('Resetting preventContentChange flag')
      preventContentChange = false
    }
  }

  /**
   * Updated mousemove handler to monitor when to reset the flag
   */
  const documentMouseMoveHandler = (event) => {
    // Only check if the flag is set to prevent unnecessary processing
    if (preventContentChange) {
      // Check if mouse is far from drawer
      if (drawerPosition) {
        const distanceFromDrawer = Math.min(
          Math.abs(event.clientX - drawerPosition.left),
          Math.abs(event.clientX - drawerPosition.right)
        )

        // If we're far from the drawer (over 200px away) and not in drawer
        if (distanceFromDrawer > 200 && !mouseInDrawer) {
          resetContentChangeFlag()
        }
      }
    }
  }

  /**
   * Update the drawer position data for movement detection
   */
  const updateDrawerPosition = () => {
    if (!ui?.nav?.element) return
    drawerPosition = ui.nav.element.getBoundingClientRect()
  }

  /**
   * Detect if the mouse is moving toward the drawer
   * @param {number} currentX - Current mouse X position
   * @param {number} currentY - Current mouse Y position
   * @returns {boolean} True if the mouse appears to be moving toward the drawer
   */
  const isMovingTowardDrawer = (currentX, currentY) => {
    if (!drawerPosition) {
      updateDrawerPosition()
      return false
    }

    // If drawer is visible
    if (isDrawerVisible()) {
      // For left-positioned drawer
      const movingRight = currentX > lastMouseX

      // Calculate the angle of movement
      const deltaX = currentX - lastMouseX
      const deltaY = currentY - lastMouseY

      // Check if mouse is at a height that could be moving toward drawer
      const isAtDrawerHeight = currentY >= (drawerPosition.top - config.pathPredictionThreshold) &&
                               currentY <= (drawerPosition.bottom + config.pathPredictionThreshold)

      // More aggressive detection of movement toward drawer:
      // 1. Moving right (toward drawer) and is within drawer height range
      // 2. Horizontal movement is significant
      if (movingRight && isAtDrawerHeight && currentX < drawerPosition.left &&
          Math.abs(deltaX) > Math.abs(deltaY)) {
        return true
      }

      // If we're very close to the drawer and moving horizontally
      if (currentX < drawerPosition.left &&
          (drawerPosition.left - currentX) < 100 &&
          isAtDrawerHeight) {
        return true
      }
    }

    return false
  }

  /**
   * Check if the drawer is currently visible
   * @returns {boolean} True if drawer is visible
   */
  const isDrawerVisible = () => {
    if (!ui?.nav?.element) return false
    return !ui.nav.element.classList.contains(config.drawerClasses.hidden)
  }

  /**
   * Initialize navigation rail with enhanced hover behavior
   * @private
   */
  const initializeRail = () => {
    if (!ui.rail) return

    debug.log('Initializing navigation rail with enhanced hover behavior')

    // Add document mousemove listener for flag reset detection
    document.addEventListener('mousemove', documentMouseMoveHandler)

    // Click handler - for actual navigation
    railHandler = (event) => {
      const { id } = event

      debug.log('Rail selection changed:', id)

      // Clear any pending timers
      if (hoverTimer) {
        clearTimeout(hoverTimer)
        hoverTimer = null
      }
      if (drawerChangeTimer) {
        clearTimeout(drawerChangeTimer)
        drawerChangeTimer = null
      }

      // Navigate to section
      if (router) {
        router.navigate(id, '', { replace: true })
      }

      // Update current section
      currentSection = id
      lastHoveredSection = id

      // Update drawer with section items - force update since this is a direct click
      if (navigation[id] && navigation[id].length > 0) {
        const items = navigation[id].map(item => ({
          ...item,
          section: id
        }))

        updateDrawerItems(items)
        toggleDrawer(true)
      } else {
        // No items for this section, hide drawer
        toggleDrawer(false)
      }
    }

    // Enhanced mouseover handler with better movement detection
    const railMouseoverHandler = (event) => {
      // Get the original DOM event if it's a wrapped component event
      const domEvent = event.originalEvent || event
      const railItem = event.target ? event.target.closest('[data-id]') : domEvent.target.closest('[data-id]')
      if (!railItem) return

      const id = railItem.getAttribute('data-id')
      if (!id) return

      // Skip if content changes are prevented
      if (preventContentChange) {
        debug.log('Skipping rail mouseover - content changes are prevented')
        return
      }

      // Clear any existing timers for consistency
      if (hoverTimer) {
        clearTimeout(hoverTimer)
        hoverTimer = null
      }

      // Use a shorter, consistent delay for better UX
      hoverTimer = setTimeout(() => {
        debug.log(`Rail item hover (${id}): Updating drawer content`)

        // Check if section has items
        if (navigation[id] && navigation[id].length > 0) {
          // Has items - show drawer with content
          const items = navigation[id].map(item => ({
            ...item,
            section: id
          }))

          updateDrawerItems(items)
          toggleDrawer(true)
          lastHoveredSection = id
        } else {
          // No items for this section, hide drawer
          debug.log(`No items for section: ${id}, hiding drawer`)
          toggleDrawer(false)
        }
      }, 150) // Short, consistent delay
    }

    /**
     * Updated drawerMouseenterHandler that sets both flags
     */
    const drawerMouseenterHandler = () => {
      debug.log('Mouse entered drawer')
      mouseInDrawer = true
      preventContentChange = true // Original behavior - prevent content changes
      preventDrawerHiding = true // New flag - prevent drawer from hiding

      // Clear any pending drawer hide timer
      if (closeTimer) {
        clearTimeout(closeTimer)
        closeTimer = null
      }
    }

    /**
     * Updated drawerMouseleaveHandler that handles the new flag
     */
    const drawerMouseleaveHandler = (event) => {
      debug.log('Mouse left drawer')
      mouseInDrawer = false

      // Always reset drawer hiding prevention when mouse leaves drawer
      preventDrawerHiding = false

      // Get the element the mouse is moving to
      const relatedTarget = event.relatedTarget

      // Check if moving to rail
      if (relatedTarget &&
      (relatedTarget.closest('.mtrl-nav--rail') ||
      relatedTarget.classList.contains('mtrl-nav--rail'))) {
        debug.log('Moving to rail, not hiding drawer')
        // Reset content change prevention immediately when moving to rail
        // This allows hovering over other rail items to work
        preventContentChange = false
        preventDrawerHiding = true
        return
      }

      // Reset content change prevention IMMEDIATELY if not moving to rail
      // This fixes the issue where rail hover doesn't work after leaving drawer
      preventContentChange = false

      debug.log('Moving away from drawer, hiding with delay')
      hideDrawer(true)
    }

    // Add mouse handlers
    if (ui.rail.element) {
      // Use standard DOM event for more consistent handling
      ui.rail.element.addEventListener('mouseover', railMouseoverHandler)
    }
    // Also add through component event system if available
    if (ui.rail.on) {
      ui.rail.on('change', railHandler)
      ui.rail.on('mouseover', railMouseoverHandler)
    }

    // Add drawer mouse handlers
    if (ui.nav && ui.nav.element) {
      ui.nav.element.addEventListener('mouseenter', drawerMouseenterHandler)
      ui.nav.element.addEventListener('mouseleave', drawerMouseleaveHandler)
    }

    // Update initial drawer position
    updateDrawerPosition()
  }

  /**
   * Update drawer for a specific section
   * @param {string} id - Section ID
   */
  const updateDrawerForSection = (id) => {
    debug.log(`Updating drawer for section: ${id}`)

    // Check if section has items
    if (!navigation[id] || navigation[id].length === 0) {
      debug.log(`No items for section: ${id}, hiding drawer`)
      toggleDrawer(false)
      return
    }

    // Has items - update content
    const items = navigation[id].map(item => ({
      ...item,
      section: id
    }))

    updateDrawerItems(items)
    toggleDrawer(true)

    // Update drawer position after content changes
    setTimeout(updateDrawerPosition, 50)
  }

  // Close timer for drawer
  let closeTimer = null

  /**
   * Updated hideDrawer function that properly respects both flags
   * @param {boolean} withDelay - Whether to apply delay before closing
   * @param {boolean} force - Whether to force hiding regardless of prevention flags
   */
  const hideDrawer = (withDelay = false, force = false) => {
    if (!ui?.nav?.element) return

    // Don't hide if mouse is in drawer (unless forced)
    if (!force && mouseInDrawer) {
      debug.log('Not hiding drawer because mouse is over it')
      return
    }

    // Don't hide if drawer hiding is prevented (unless forced)
    if (!force && preventDrawerHiding) {
      debug.log('Not hiding drawer because drawer hiding is prevented')
      return
    }

    // Don't hide if content changes are prevented and we're moving toward drawer
    // This preserves the original mouse movement prediction behavior
    if (!force && preventContentChange && isMovingTowardDrawer(lastMouseX, lastMouseY)) {
      debug.log('Not hiding drawer because user appears to be moving toward it')
      return
    }

    // Clear any existing close timer
    if (closeTimer) {
      clearTimeout(closeTimer)
      closeTimer = null
    }

    const doHide = () => {
    // Final check before hiding
      if (force || (!mouseInDrawer && !preventDrawerHiding)) {
        debug.log('Hiding drawer', force ? '(forced)' : '')
        toggleDrawer(false)
      } else {
        debug.log('Cancelled drawer hiding - conditions changed')
      }
    }

    // Use delay if requested
    if (withDelay && !isMobileView()) {
      debug.log(`Setting drawer hide timer with ${config.closeDelay}ms delay`)
      closeTimer = setTimeout(doHide, config.closeDelay)
    } else {
      doHide()
    }
  }

  /**
   * Initialize navigation drawer
   * @private
   */
  const initializeDrawer = () => {
    if (!ui.nav) return

    debug.log('Initializing navigation drawer')

    // Initially hide drawer
    if (config.autoOpenDrawer !== true) {
      toggleDrawer(false)
    }
  }

  /**
   * Set up router hooks for navigation synchronization
   * @private
   */
  const setupRouterHooks = () => {
    debug.log('Setting up router hooks')

    // After navigation hook to sync UI state
    router.afterEach((route) => {
      debug.log('Router afterEach hook:', route)

      // Update rail selection if different
      if (ui.rail?.setActive && route.section !== currentSection) {
        debug.log('Updating rail selection to:', route.section)
        ui.rail.setActive(route.section)
        currentSection = route.section
      }

      // Update drawer selection
      if (ui.nav?.setActive && route.subsection) {
        debug.log('Setting active subsection from hook:', route.subsection)

        // Parse the subsection path to get actual IDs
        const { parentId, subsectionId } = parseSubsectionPath(route.section, route.subsection)

        // Try to expand parent item first if found
        if (parentId) {
          debug.log('Expanding parent item from hook:', parentId)
          expandParentItem(parentId, subsectionId)

          // Set active on the actual subsection ID
          debug.log('Setting active on subsection ID:', subsectionId)
          ui.nav.setActive(subsectionId)
          currentSubsection = subsectionId
        } else {
          // Try to expand using original method
          if (typeof ui.nav.expandForItem === 'function') {
            debug.log('Using expandForItem method for:', route.subsection)
            ui.nav.expandForItem(route.subsection)
          }

          // Set active item with original subsection
          ui.nav.setActive(route.subsection)
          currentSubsection = route.subsection
        }
      }
    })
  }

  /**
   * Parse a subsection path to extract the actual subsection ID and parent ID
   * @param {string} section - The section (e.g., 'components')
   * @param {string} subsectionPath - The full subsection path (e.g., 'buttons/common')
   * @returns {Object} Object with parentId and subsectionId
   */
  const parseSubsectionPath = (section, subsectionPath) => {
    debug.log(`Parsing subsection path: ${subsectionPath} in section: ${section}`)

    // Split the path on slashes
    const parts = subsectionPath.split('/')
    debug.log('Path parts:', parts)

    // The last part is likely the actual subsection ID
    const potentialSubsection = parts[parts.length - 1]

    // And the parent would be the part before it
    const potentialParent = parts.length > 1 ? parts[0] : null

    debug.log('Potential subsection ID:', potentialSubsection)
    debug.log('Potential parent ID:', potentialParent)

    // Check if this structure matches our navigation
    if (navigation[section] && potentialParent) {
      const parentItem = navigation[section].find(item => item.id === potentialParent)

      if (parentItem && parentItem.items) {
        debug.log('Found potential parent:', parentItem.id)

        // Check if the potential subsection exists in the parent's items
        const subsectionItem = parentItem.items.find(item => item.id === potentialSubsection)

        if (subsectionItem) {
          debug.log('Found exact match:', subsectionItem.id, 'under parent:', parentItem.id)
          return {
            parentId: parentItem.id,
            subsectionId: subsectionItem.id
          }
        }
      }
    }

    // If we couldn't find an exact match, return just the potential IDs
    return {
      parentId: potentialParent,
      subsectionId: potentialSubsection
    }
  }

  /**
   * Expand a parent item to reveal its children
   * @param {string} parentId - ID of the parent item to expand
   * @param {string} childId - ID of the child item (for expandForItem method)
   */
  const expandParentItem = (parentId, childId) => {
    debug.log('Attempting to expand parent item:', parentId, 'for child:', childId)

    // Try various expansion methods that might be available
    if (ui.nav) {
      // If the drawer has a direct expandItem method
      if (typeof ui.nav.expandItem === 'function') {
        debug.log('Using expandItem method')
        ui.nav.expandItem(parentId)
      } else if (typeof ui.nav.expandForItem === 'function') {
        // If the drawer has an expandForItem method that takes child ID
        debug.log('Using expandForItem method')
        ui.nav.expandForItem(childId)
      } else {
        // Last resort - try to manipulate the DOM directly
        debug.log('No expansion methods found, trying direct DOM manipulation')
        try {
          // Find the parent item element
          const parentItem = ui.nav.getItem?.(parentId)?.element ||
                           ui.nav.element.querySelector(`[data-id="${parentId}"]`)

          if (parentItem) {
            debug.log('Found parent item element, setting aria-expanded')
            // Check if it has an aria-expanded attribute (expandable item)
            if (parentItem.hasAttribute('aria-expanded')) {
              parentItem.setAttribute('aria-expanded', 'true')

              // Find the nested container
              const container = parentItem.closest('.mtrl-nav-item-container')
              if (container) {
                const nestedContainer = container.querySelector('.mtrl-nav-nested-container')
                if (nestedContainer) {
                  debug.log('Found nested container, unhiding')
                  nestedContainer.hidden = false
                }
              }
            }
          } else {
            debug.log('Parent item element not found')
          }
        } catch (err) {
          console.warn('Error expanding parent item:', err)
        }
      }
    }
  }

  // Public API methods

  /**
   * Initialize navigation systems
   * @returns {Object} Navigation manager for chaining
   */
  const initialize = () => {
    debug.log('Initializing NavigationManager')

    if (!ui) {
      console.warn('NavigationManager: UI components not available')
      return navigationManager
    }

    // Initialize navigation rail if available
    if (ui.rail) {
      initializeRail()
    }

    // Initialize drawer if available
    if (ui.nav) {
      initializeDrawer()
    }

    // Add router hooks if available
    if (router) {
      setupRouterHooks()
    }

    return navigationManager
  }

  /**
   * Update drawer items
   * @param {Array} items - Navigation items
   */
  const updateDrawerItems = (items) => {
    if (!ui.nav) return

    debug.log('Updating drawer items, count:', items.length)

    try {
      // Remove existing handler if any
      if (drawerHandler) {
        ui.nav.off('change', drawerHandler)
        drawerHandler = null
      }

      // Clear all existing items
      const currentItems = ui.nav.getAllItems()
      if (currentItems && Array.isArray(currentItems)) {
        debug.log('Removing existing items, count:', currentItems.length)
        currentItems.forEach(item => {
          ui.nav.removeItem(item.config.id)
        })
      }

      // Add new items
      items.forEach(item => {
        const itemConfig = {
          id: item.id,
          label: item.label,
          data: {
            section: item.section,
            path: item.path
          }
        }

        // Handle nested items
        if (item.items && item.items.length > 0) {
          debug.log('Adding nested items for:', item.id, 'count:', item.items.length)
          itemConfig.items = item.items.map(nestedItem => ({
            id: nestedItem.id,
            label: nestedItem.label,
            data: {
              section: item.section,
              path: nestedItem.path,
              parentId: item.id // Track parent ID for expansion
            }
          }))
        }

        ui.nav.addItem(itemConfig)
      })

      // Create new change handler
      drawerHandler = (event) => {
        const selectedItem = event.item
        if (!selectedItem || !selectedItem.config) return

        // Get item data
        const itemConfig = selectedItem.config

        if (router && itemConfig.data.path) {
          // Parse the path
          const route = router.parsePath(itemConfig.data.path)

          debug.log('Drawer item selected:', itemConfig.id, 'path:', itemConfig.data.path)

          // Navigate to the route
          router.navigate(route.section, route.subsection, { replace: true })
        }
      }

      // Attach new handler
      ui.nav.on('change', drawerHandler)
    } catch (error) {
      console.error('Error updating drawer items:', error)
    }
  }

  /**
   * Toggle drawer visibility
   * @param {boolean} show - Whether to show the drawer
   */
  const toggleDrawer = (show) => {
    if (!ui.nav?.element) return

    debug.log('Toggling drawer visibility:', show)

    const className = config.drawerClasses.hidden

    if (show) {
      ui.nav.element.classList.remove(className)
      ui.nav.element.setAttribute('aria-hidden', 'false')
    } else {
      ui.nav.element.classList.add(className)
      ui.nav.element.setAttribute('aria-hidden', 'true')
    }
  }

  /**
   * Handle the initial route from the current URL
   * Used during app initialization
   */
  const handleInitialRoute = () => {
    if (!ui || !router) return

    try {
      const { pathname } = window.location
      debug.log('Handling initial route:', pathname)

      const route = router.parsePath(pathname)
      debug.log('Parsed route:', route)

      if (route.section) {
        // Update rail selection if it exists
        if (ui.rail?.setActive) {
          debug.log('Setting active rail section:', route.section)
          ui.rail.setActive(route.section)
        }

        // Update drawer with section items
        if (ui.nav && navigation[route.section]) {
          const items = navigation[route.section].map(item => ({
            ...item,
            section: route.section
          }))

          debug.log('Setting drawer items for section:', route.section, 'count:', items.length)

          // Clear any existing items
          cleanupDrawer()

          // Update with new items
          updateDrawerItems(items)
          toggleDrawer(true)

          // Handle subsection - we need to ensure the drawer has fully rendered
          if (route.subsection && ui.nav.setActive) {
            debug.log('Need to set active subsection path:', route.subsection)

            // Use a small timeout to ensure DOM is ready
            setTimeout(() => {
              // Parse the subsection path to get the actual IDs
              const { parentId, subsectionId } = parseSubsectionPath(route.section, route.subsection)

              debug.log('Parsed subsection path:', { parentId, subsectionId })

              // If we have a parent, expand it
              if (parentId) {
                debug.log('Expanding parent item:', parentId)
                expandParentItem(parentId, subsectionId)

                // Then set active on the actual subsection ID
                debug.log('Setting active state on subsection ID:', subsectionId)
                ui.nav.setActive(subsectionId)
              } else {
                // No parent found, try with the original subsection
                debug.log('No parent found, trying with original subsection:', route.subsection)
                ui.nav.setActive(route.subsection)
              }

              // Second attempt with a slightly longer delay
              setTimeout(() => {
                if (parentId && subsectionId) {
                  debug.log('Second attempt to set active subsection:', subsectionId)
                  ui.nav.setActive(subsectionId)
                } else {
                  debug.log('Second attempt with original subsection:', route.subsection)
                  ui.nav.setActive(route.subsection)
                }
              }, 50)
            }, 10)
          }
        }

        // Navigate to initial route with noHistory to avoid duplicate entries
        debug.log('Navigating to initial route:', route.section, route.subsection)
        router.navigate(route.section, route.subsection, { noHistory: true })
      }

      // Set current section/subsection
      currentSection = route.section
      currentSubsection = route.subsection
    } catch (error) {
      console.error('Error handling initial route:', error)
    }
  }

  /**
   * Navigate to a specific route
   * @param {string} section - Section to navigate to
   * @param {string} subsection - Subsection to navigate to
   * @param {Object} options - Navigation options
   */
  const navigateTo = (section, subsection = '', options = {}) => {
    debug.log('Navigating to:', section, subsection, options)

    // Update rail if available and different from current
    if (ui.rail?.setActive && section !== currentSection) {
      debug.log('Updating rail selection to:', section)
      ui.rail.setActive(section)
    }

    // Update drawer if available
    if (ui.nav && navigation[section]) {
      const items = navigation[section].map(item => ({
        ...item,
        section
      }))

      debug.log('Updating drawer with items for section:', section)
      updateDrawerItems(items)
      toggleDrawer(true)

      // Set active subsection if provided
      if (subsection && ui.nav.setActive) {
        debug.log('Setting active subsection:', subsection)

        // Parse the subsection path to get actual IDs
        const { parentId, subsectionId } = parseSubsectionPath(section, subsection)

        // If parent found, expand it
        if (parentId) {
          debug.log('Found parent item, expanding:', parentId)
          expandParentItem(parentId, subsectionId)

          // Set active state on the actual subsection ID with small delay
          setTimeout(() => {
            debug.log('Setting active state on subsection ID (delayed):', subsectionId)
            ui.nav.setActive(subsectionId)
          }, 10)
        } else {
          // No parent found, try with the original subsection
          setTimeout(() => {
            debug.log('Setting active state on original subsection (delayed):', subsection)
            ui.nav.setActive(subsection)
          }, 10)
        }
      }
    }

    // Navigate using router
    if (router) {
      debug.log('Using router to navigate to:', section, subsection)
      router.navigate(section, subsection, options)
    }

    // Update current section/subsection
    currentSection = section
    currentSubsection = subsection
  }

  /**
   * Clean up drawer resources
   */
  const cleanupDrawer = () => {
    if (ui.nav && drawerHandler) {
      debug.log('Cleaning up drawer resources')
      ui.nav.off('change', drawerHandler)
      drawerHandler = null

      // Clear items
      const currentItems = ui.nav.getAllItems()
      if (currentItems && Array.isArray(currentItems)) {
        debug.log('Removing all drawer items, count:', currentItems.length)
        currentItems.forEach(item => {
          ui.nav.removeItem(item.config.id)
        })
      }
    }
  }

  /**
   * Clean up navigation manager resources
   */
  const cleanup = () => {
    debug.log('Cleaning up NavigationManager resources')

    // Clean up document mouse move handler
    document.removeEventListener('mousemove', documentMouseMoveHandler)

    // Clean up timers
    if (hoverTimer) {
      clearTimeout(hoverTimer)
      hoverTimer = null
    }
    if (drawerChangeTimer) {
      clearTimeout(drawerChangeTimer)
      drawerChangeTimer = null
    }
    if (closeTimer) {
      clearTimeout(closeTimer)
      closeTimer = null
    }

    // Clean up rail handler
    if (ui.rail && railHandler) {
      ui.rail.off('change', railHandler)
      if (ui.rail.off) {
        ui.rail.off('mouseover', null) // Remove all mouseover handlers
      }
      if (ui.rail.element) {
        ui.rail.element.removeEventListener('mouseover', null) // Remove all mouseover handlers
      }
      railHandler = null
    }

    // Clean up drawer mouse handlers
    if (ui.nav && ui.nav.element) {
      ui.nav.element.removeEventListener('mouseenter', null)
      ui.nav.element.removeEventListener('mouseleave', null)
    }

    // Clean up drawer
    cleanupDrawer()
  }

  // Create the API object
  const navigationManager = {
    initialize,
    updateDrawerItems,
    toggleDrawer,
    handleInitialRoute,
    navigateTo,
    cleanupDrawer,
    cleanup,
    isDrawerVisible,
    updateDrawerForSection,
    hideDrawer
  }

  return navigationManager
}
