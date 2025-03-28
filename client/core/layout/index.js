// src/client/core/layout/layout-manager.ts

/**
 * Creates a layout manager that handles layout initialization, component registration,
 * and provides utilities for working with the UI components
 *
 * @param {Object} options - Configuration options
 * @returns {Object} Layout manager API
 */
export const createLayoutManager = (options) => {
  // Layout references
  const layout = options.layout || null
  const layoutAPI = options.layoutAPI || null

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
  const layoutManager = {}

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
   * Initialize the layout manager
   * @returns {Object} Layout manager for chaining
   */
  const initialize = () => {
    if (isInitialized || !layout) return layoutManager

    try {
      // Add application body class
      document.body.classList.add(config.appBodyClass)

      // Register all components from the layout
      if (layoutAPI) {
        // Use the getAll method from the layout API
        const componentsMap = layoutAPI.getAll()

        if (componentsMap && typeof componentsMap === 'object') {
          Object.entries(componentsMap).forEach(([name, component]) => {
            registerComponent(name, component)
          })
        }
      } else if (layout) {
        // Fallback to direct layout traversal
        Object.entries(layout).forEach(([name, component]) => {
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
      console.error('Layout manager initialization failed:', error)
    }

    return layoutManager
  }

  /**
   * Get a component by name
   * @param {string} name - Component name
   * @returns {Object|null} Component or null if not found
   */
  const getComponent = (name) => {
    // Try using the layout API first
    if (layoutAPI && typeof layoutAPI.get === 'function') {
      return layoutAPI.get(name)
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
    if (layoutAPI && typeof layoutAPI.get === 'function') {
      return layoutAPI.get(name) !== null
    }
    return components.has(name)
  }

  /**
   * Get all registered components
   * @returns {Map} Map of all components
   */
  const getAllComponents = () => {
    if (layoutAPI && typeof layoutAPI.getAll === 'function') {
      return layoutAPI.getAll()
    }
    return new Map(components)
  }

  /**
   * Clear the content area
   * @returns {Object} Layout manager for chaining
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

    return layoutManager
  }

  /**
   * Set content in the main content area
   * @param {string|HTMLElement} content - Content to set
   * @returns {Object} Layout manager for chaining
   */
  const setContent = (contentToSet) => {
    const contentComponent = getComponent('content') ||
                           document.querySelector(config.contentSelector)

    if (!contentComponent) return layoutManager

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

    return layoutManager
  }

  /**
   * Set the page title
   * @param {string} title - Page title
   * @returns {Object} Layout manager for chaining
   */
  const setPageTitle = (title) => {
    if (!title) return layoutManager

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

    return layoutManager
  }

  /**
   * Show or hide a component
   * @param {string} name - Component name
   * @param {boolean} visible - Visibility state
   * @returns {Object} Layout manager for chaining
   */
  const setComponentVisibility = (name, visible) => {
    const component = getComponent(name)

    if (!component) return layoutManager

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

    return layoutManager
  }

  /**
   * Clean up layout manager resources
   */
  const cleanup = () => {
    components.clear()
    isInitialized = false
  }

  // Assign methods to the API object
  layoutManager.initialize = initialize
  layoutManager.getComponent = getComponent
  layoutManager.getComponentElement = getComponentElement
  layoutManager.hasComponent = hasComponent
  layoutManager.getAllComponents = getAllComponents
  layoutManager.clearContent = clearContent
  layoutManager.setContent = setContent
  layoutManager.setPageTitle = setPageTitle
  layoutManager.setComponentVisibility = setComponentVisibility
  layoutManager.cleanup = cleanup

  // Initialize immediately if layout is provided
  if (layout || layoutAPI) {
    initialize()
  }

  return layoutManager
}

export default createLayoutManager
