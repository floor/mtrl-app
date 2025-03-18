// src/client/core/navigation/navigation-manager.js

/**
 * Creates a navigation manager that handles synchronized navigation
 * between rail, drawer and routes
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

  // Event handlers
  let railHandler = null
  let drawerHandler = null

  // Options with defaults
  const config = {
    drawerClasses: {
      hidden: 'mtrl-nav--hidden'
    },
    autoOpenDrawer: true,
    persistDrawerState: true,
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

  // Private methods

  /**
   * Initialize navigation rail
   * @private
   */
  const initializeRail = () => {
    if (!ui.rail) return

    debug.log('Initializing navigation rail')

    // Create rail change handler
    railHandler = (event) => {
      const { id } = event

      debug.log('Rail selection changed:', id)

      // Get items for this section
      const items = navigation[id] || []

      // Update drawer if available
      if (ui.nav) {
        if (items.length > 0) {
          const itemsWithSection = items.map(item => ({
            ...item,
            section: id
          }))

          debug.log('Updating drawer with items for section:', id, itemsWithSection.length)
          updateDrawerItems(itemsWithSection)

          if (config.autoOpenDrawer) {
            toggleDrawer(true)
          }
        } else {
          updateDrawerItems([])
          toggleDrawer(false)
        }
      }

      // Navigate to section
      if (router) {
        router.navigate(id, '', { replace: true })
      }

      // Update current section
      currentSection = id
    }

    // Attach handler
    ui.rail.on('change', railHandler)
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
   * Improved helper to find parent item ID for a subsection
   * @param {string} section - Current section
   * @param {string} subsectionPath - Subsection path to find parent for
   * @returns {string|null} Parent ID or null if not found
   */
  const findParentForSubsection = (section, subsectionPath) => {
    if (!navigation[section]) {
      debug.log('No navigation items found for section:', section)
      return null
    }

    debug.log('Finding parent for subsection path:', subsectionPath, 'in section:', section)

    // First try to parse the path to get potential parent and subsection
    const { parentId, subsectionId } = parseSubsectionPath(section, subsectionPath)

    // If we found a parent directly, return it
    if (parentId) {
      // Verify this parent exists and has the subsection as a child
      const parentItem = navigation[section].find(item => item.id === parentId)
      if (parentItem && parentItem.items) {
        const hasChild = parentItem.items.some(item => item.id === subsectionId)
        if (hasChild) {
          debug.log('Confirmed parent for subsection:', parentId)
          return parentId
        }
      }
    }

    // Fall back to searching through all items
    debug.log('Searching through all items for parent of:', subsectionId)
    for (const item of navigation[section]) {
      if (item.items && Array.isArray(item.items)) {
        const foundChild = item.items.find(child => child.id === subsectionId)
        if (foundChild) {
          debug.log('Found parent through search:', item.id)
          return item.id
        }
      }
    }

    debug.log('No parent found for subsection:', subsectionPath)
    return null
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
      }
      // If the drawer has an expandForItem method that takes child ID
      else if (typeof ui.nav.expandForItem === 'function') {
        debug.log('Using expandForItem method')
        ui.nav.expandForItem(childId)
      }
      // Last resort - try to manipulate the DOM directly
      else {
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

    // Clean up rail handler
    if (ui.rail && railHandler) {
      ui.rail.off('change', railHandler)
      railHandler = null
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
    cleanup
  }

  return navigationManager
}

export default createNavigationManager
