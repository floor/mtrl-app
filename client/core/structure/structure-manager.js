// src/client/core/structure/structure-manager.js

/**
 * Creates a structure manager that handles structure initialization, component registration,
 * and provides utilities for working with the UI components
 *
 * @param {Object} options - Configuration options
 * @returns {Object} Structure manager API
 */
export const createStructureManager = (options = {}) => {
  // Structure references
  const structure = options.structure || null
  const structureAPI = options.structureAPI || null

  // Component registry
  const components = new Map()

  // Initialization state
  let isInitialized = false

  // Configuration
  const config = {
    appBodyClass: 'mtrl-app',
    contentSelector: '.mtrl-content',
    ...options.options
  }

  // Create the API object - define this early to avoid reference issues
  const structureManager = {}

  // Private methods

  /**
   * Register a component
   * @param {string} name - Component name
   * @param {Object} component - Component instance
   * @private
   */
  const registerComponent = (name, component) => {
    if (!name || !component) return

    components.set(name, {
      instance: component,
      state: {},
      element: component.element || null
    })
  }

  // Public API methods

  /**
   * Initialize the structure manager
   * @returns {Object} Structure manager for chaining
   */
  const initialize = () => {
    if (isInitialized || !structure) return structureManager

    try {
      // Add application body class
      document.body.classList.add(config.appBodyClass)

      // Register all components from the structure
      if (structureAPI) {
        // Use the getAll method from the structure API
        const componentsMap = structureAPI.getAll()

        if (componentsMap && typeof componentsMap === 'object') {
          Object.entries(componentsMap).forEach(([name, component]) => {
            registerComponent(name, component)
          })
        }
      } else if (structure) {
        // Fallback to direct structure traversal
        Object.entries(structure).forEach(([name, component]) => {
          if (component && (
            component instanceof HTMLElement ||
            (component && typeof component === 'object' && component.element)
          )) {
            registerComponent(name, component)
          }
        })
      }

      isInitialized = true
    } catch (error) {
      console.error('Structure manager initialization failed:', error)
    }

    return structureManager
  }

  /**
   * Get a component by name
   * @param {string} name - Component name
   * @returns {Object|null} Component or null if not found
   */
  const getComponent = (name) => {
    // Try using the structure API first
    if (structureAPI && typeof structureAPI.get === 'function') {
      return structureAPI.get(name)
    }

    // Fallback to local component registry
    const component = components.get(name)
    return component ? component.instance : null
  }

  /**
   * Get a component element by name
   * @param {string} name - Component name
   * @returns {HTMLElement|null} Component element or null if not found
   */
  const getComponentElement = (name) => {
    const component = components.get(name)
    return component ? component.element : null
  }

  /**
   * Check if a component exists
   * @param {string} name - Component name
   * @returns {boolean} Whether the component exists
   */
  const hasComponent = (name) => {
    if (structureAPI && typeof structureAPI.get === 'function') {
      return structureAPI.get(name) !== null
    }
    return components.has(name)
  }

  /**
   * Get all registered components
   * @returns {Map} Map of all components
   */
  const getAllComponents = () => {
    if (structureAPI && typeof structureAPI.getAll === 'function') {
      return structureAPI.getAll()
    }
    return new Map(components)
  }

  /**
   * Clear the content area
   * @returns {Object} Structure manager for chaining
   */
  const clearContent = () => {
    const content = getComponent('content') ||
                    document.querySelector(config.contentSelector)

    if (content) {
      if (typeof content.clear === 'function') {
        content.clear()
      } else if (content.innerHTML !== undefined) {
        content.innerHTML = ''
      }

      // Reset scroll position
      if (content.scrollTop !== undefined) {
        content.scrollTop = 0
      }
    }

    return structureManager
  }

  /**
   * Set content in the main content area
   * @param {string|HTMLElement} content - Content to set
   * @returns {Object} Structure manager for chaining
   */
  const setContent = (contentToSet) => {
    const contentComponent = getComponent('content') ||
                           document.querySelector(config.contentSelector)

    if (!contentComponent) return structureManager

    // Clear existing content
    clearContent()

    // Add new content
    if (typeof contentToSet === 'string') {
      if (typeof contentComponent.setHTML === 'function') {
        contentComponent.setHTML(contentToSet)
      } else if (contentComponent.innerHTML !== undefined) {
        contentComponent.innerHTML = contentToSet
      }
    } else if (contentToSet instanceof HTMLElement) {
      if (typeof contentComponent.append === 'function') {
        contentComponent.append(contentToSet)
      } else if (contentComponent.appendChild) {
        contentComponent.appendChild(contentToSet)
      }
    } else if (typeof contentToSet === 'object' && contentToSet !== null) {
      if (contentToSet.element instanceof HTMLElement) {
        if (contentComponent.appendChild) {
          contentComponent.appendChild(contentToSet.element)
        }
      }
    }

    return structureManager
  }

  /**
   * Set the page title
   * @param {string} title - Page title
   * @returns {Object} Structure manager for chaining
   */
  const setPageTitle = (title) => {
    if (!title) return structureManager

    // Update document title
    document.title = title

    // Update title component if available
    const titleComponent = getComponent('title')
    if (titleComponent) {
      if (typeof titleComponent.setText === 'function') {
        titleComponent.setText(title)
      } else if (titleComponent.textContent !== undefined) {
        titleComponent.textContent = title
      }
    }

    return structureManager
  }

  /**
   * Show or hide a component
   * @param {string} name - Component name
   * @param {boolean} visible - Visibility state
   * @returns {Object} Structure manager for chaining
   */
  const setComponentVisibility = (name, visible) => {
    const component = getComponent(name)

    if (!component) return structureManager

    // Use component's show/hide methods if available
    if (typeof component.show === 'function' && typeof component.hide === 'function') {
      if (visible) {
        component.show()
      } else {
        component.hide()
      }
    } else if (component.element) {
      // Otherwise toggle display on the element
      component.element.style.display = visible ? '' : 'none'
    }

    return structureManager
  }

  /**
   * Clean up structure manager resources
   */
  const cleanup = () => {
    components.clear()
    isInitialized = false
  }

  // Assign methods to the API object
  structureManager.initialize = initialize
  structureManager.getComponent = getComponent
  structureManager.getComponentElement = getComponentElement
  structureManager.hasComponent = hasComponent
  structureManager.getAllComponents = getAllComponents
  structureManager.clearContent = clearContent
  structureManager.setContent = setContent
  structureManager.setPageTitle = setPageTitle
  structureManager.setComponentVisibility = setComponentVisibility
  structureManager.cleanup = cleanup

  // Initialize immediately if structure is provided
  if (structure || structureAPI) {
    initialize()
  }

  return structureManager
}

export default createStructureManager
