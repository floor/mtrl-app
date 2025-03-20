// src/client/core/navigation/drawer-behavior.js

/**
 * Creates a minimal drawer behavior manager that defers to the navigation manager
 * Maintains the same API for backward compatibility
 *
 * @param {Object} options - Configuration options
 * @returns {Object} Drawer behavior manager API
 */
export function createDrawerBehavior (options = {}) {
  // Configuration with defaults
  const config = {
    ui: null,
    navigation: null, // Navigation configuration data
    navigationManager: null, // Reference to navigation manager
    ...options
  }

  // State
  let isInitialized = false

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
      config.navigation = options.navigation
    }

    // Store navigation manager
    if (options.navigationManager) {
      config.navigationManager = options.navigationManager
    }

    return api
  }

  /**
   * Checks if a section has drawer items - delegates to navigation manager if available
   *
   * @param {string} sectionId - The section ID to check
   * @returns {boolean} True if the section has items
   */
  function hasSectionItems (sectionId) {
    if (config.navigationManager) {
      // Let the navigation manager handle this if available
      return config.navigation[sectionId] &&
             Array.isArray(config.navigation[sectionId]) &&
             config.navigation[sectionId].length > 0
    }

    // Fallback to direct check
    if (!config.navigation || !sectionId) {
      return false
    }

    // Check if the section exists in navigation and has items
    const sectionItems = config.navigation[sectionId]
    return !!(sectionItems && Array.isArray(sectionItems) && sectionItems.length > 0)
  }

  /**
   * Shows the drawer - delegates to navigation manager if available
   *
   * @returns {Object} Drawer behavior manager for chaining
   */
  function showDrawer () {
    if (config.navigationManager) {
      // Let the navigation manager handle this if available
      config.navigationManager.toggleDrawer(true)
    }
    return api
  }

  /**
   * Hides the drawer - delegates to navigation manager if available
   *
   * @param {boolean} withDelay - Whether to apply delay before closing
   * @param {boolean} force - Whether to force hiding
   * @returns {Object} Drawer behavior manager for chaining
   */
  function hideDrawer (withDelay = false, force = false) {
    if (config.navigationManager) {
      // Let the navigation manager handle this if available
      config.navigationManager.hideDrawer(withDelay, force)
    }
    return api
  }

  /**
   * Update the drawer content for a specific section
   * Delegates to navigation manager if available
   *
   * @param {string} sectionId - The section ID to display
   * @param {Object} options - Options for the update
   * @returns {boolean} - True if the section has items and drawer was shown
   */
  function updateSection (sectionId, options = {}) {
    if (config.navigationManager && sectionId) {
      // Let the navigation manager handle this if available
      return config.navigationManager.updateDrawerForSection(sectionId)
    }
    return false
  }

  /**
   * Initializes the drawer behavior - minimal version that defers to
   * navigation manager
   *
   * @returns {Object} Drawer behavior manager for chaining
   */
  function initialize () {
    if (isInitialized) return api

    try {
      console.log('Drawer behavior initialized (simplified version)')
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
    config.navigation = navigation
    return api
  }

  /**
   * Sets the navigation manager
   *
   * @param {Object} navigationManager - Navigation manager instance
   * @returns {Object} Drawer behavior manager for chaining
   */
  function setNavigationManager (navigationManager) {
    config.navigationManager = navigationManager
    return api
  }

  /**
   * Cleans up - minimal version
   */
  function cleanup () {
    isInitialized = false
  }

  // Compatibility methods for existing implementations
  function setPreventContentChange () { return api }

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
    setNavigationManager,
    setPreventContentChange,
    isPreventContentChange: () => false,
    isInitialized: () => isInitialized,
    isVisible: () => config.navigationManager ? config.navigationManager.isDrawerVisible() : false
  }

  return api
}

// Create a singleton instance
const drawerBehavior = createDrawerBehavior()

export default drawerBehavior
