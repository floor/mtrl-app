// src/client/core/router/dynamic-loader.js

import { highlightCodeBlocks } from '../code/highlight'

/**
 * Dynamic route handler that lazy loads content modules
 *
 * This approach uses dynamic imports to split code into separate chunks
 * that are loaded on demand when a route is accessed.
 */

// Map of route paths to their content module paths
// This allows us to map routes to their corresponding module paths
const ROUTE_MODULE_MAP = {
  // Section routes
  home: () => import('../../content/home'),
  getstarted: () => import('../../content/getstarted'),
  core: () => import('../../content/core'),
  styles: () => import('../../content/styles'),
  components: () => import('../../content/components'),

  // Core routes
  'core/events': () => import('../../content/core/events'),
  'core/state': () => import('../../content/core/state'),
  'core/collection': () => import('../../content/core/collection'),
  'core/collection/route': () => import('../../content/core/collection/route'),
  'core/collection/list-manager': () => import('../../content/core/collection/list-manager'),
  'core/composition': () => import('../../content/core/composition'),
  'core/composition/features': () => import('../../content/core/composition/features'),
  'core/gestures': () => import('../../content/core/gestures'),
  'core/layout': () => import('../../content/core/layout'),

  // Style routes
  'styles/colors': () => import('../../content/styles/colors'),
  'styles/typography': () => import('../../content/styles/typography'),
  'styles/elevation': () => import('../../content/styles/elevation'),

  // Components routes
  'components/buttons/common': () => import('../../content/components/buttons/common'),
  'components/buttons/fab': () => import('../../content/components/buttons/fab'),
  'components/buttons/extended-fab': () => import('../../content/components/buttons/extended-fab'),
  'components/buttons/segmented-buttons': () => import('../../content/components/buttons/segmented-buttons'),
  'components/app-bars/bottom': () => import('../../content/components/app-bars/bottom'),
  'components/app-bars/top': () => import('../../content/components/app-bars/top'),
  'components/badges': () => import('../../content/components/badges'),
  'components/cards': () => import('../../content/components/cards'),
  'components/checkboxes': () => import('../../content/components/checkboxes'),
  'components/chips': () => import('../../content/components/chips'),
  'components/datepickers': () => import('../../content/components/datepickers'),
  'components/dialogs': () => import('../../content/components/dialogs'),
  'components/lists': () => import('../../content/components/lists'),
  'components/menus': () => import('../../content/components/menus'),
  'components/progress': () => import('../../content/components/progress'),
  'components/radios': () => import('../../content/components/radios'),
  'components/search': () => import('../../content/components/search'),
  'components/sliders': () => import('../../content/components/sliders'),
  'components/snackbars': () => import('../../content/components/snackbars'),
  'components/selects': () => import('../../content/components/selects'),
  'components/switches': () => import('../../content/components/switches'),
  'components/tabs': () => import('../../content/components/tabs'),
  'components/textfields': () => import('../../content/components/textfields'),
  'components/timepickers': () => import('../../content/components/timepickers')

}

/**
 * Creates a dynamic handler for a route that lazy loads the content module
 *
 * @param {string} routePath - The route path to create a handler for
 * @returns {Function} A handler function that loads the module and renders the content
 */
export const createDynamicHandler = (routePath) => {
  // console.log('createDynamicHandler', routePath)
  return async (route, ui) => {
    try {
      // Check if we have a direct mapping for this route
      const importFunc = ROUTE_MODULE_MAP[routePath]

      if (!importFunc) {
        // console.warn(`No module mapping found for route: ${routePath}`)
        throw new Error(`No content module found for route: ${routePath}`)
      }

      // Dynamically import the module
      const module = await importFunc()

      // Get the expected creator function name patterns
      const patterns = getContentCreatorPatterns(routePath)

      // Log the expected patterns and available exports for debugging
      // console.debug(`Looking for content creator for route: ${routePath}`)
      // console.debug('Expected patterns:', patterns)
      // console.debug('Available exports:', Object.keys(module))

      // Try to find a content creator function using the patterns
      let contentCreator = null

      // Try all patterns until we find a matching function
      for (const pattern of patterns) {
        if (module[pattern] && typeof module[pattern] === 'function') {
          // console.debug(`Found matching content creator: ${pattern}`)
          contentCreator = module[pattern]
          break
        }
      }

      // If still not found, look for default export
      if (!contentCreator && module.default && typeof module.default === 'function') {
        // onsole.debug('Using default export as content creator')
        contentCreator = module.default
      }

      // Last attempt - look for any exported function that might be a content creator
      if (!contentCreator) {
        for (const key of Object.keys(module)) {
          if (typeof module[key] === 'function' &&
              (key.toLowerCase().includes('content') ||
               key.toLowerCase().includes('render') ||
               key.toLowerCase().includes('create'))) {
            // console.debug(`Using best guess content creator: ${key}`)
            contentCreator = module[key]
            break
          }
        }
      }

      if (!contentCreator || typeof contentCreator !== 'function') {
        console.error(`No content creator function found for route: ${routePath}. Available exports:`, Object.keys(module))
        throw new Error(`Invalid content module for route: ${routePath}`)
      }

      if (ui.content) {
        highlightCodeBlocks(ui.content, { delay: 50 })
      }

      // Call the content creator function with the UI container
      return contentCreator(ui.content)
    } catch (error) {
      console.error(`Error loading content for route "${routePath}":`, error)

      // Display error message in the UI
      if (ui?.content) {
        ui.content.innerHTML = `
          <div class="error-container">
            <h2>Error Loading Content</h2>
            <p>There was a problem loading the content for "${routePath}".</p>
            <p>Error: ${error.message}</p>
          </div>
        `
      }

      return false
    }
  }
}

/**
 * Generate potential content creator function names based on the route path
 *
 * @param {string} routePath - The route path
 * @returns {string[]} Array of potential function names
 */
function getContentCreatorPatterns (routePath) {
  const patterns = []

  // Split path into parts and process for different naming conventions
  const parts = routePath.split('/')
  const lastPart = parts[parts.length - 1]

  // Handle component routes like 'components/checkboxes'
  if (parts[0] === 'components') {
    // Get component name
    const componentName = lastPart

    // PascalCase: createCheckboxesContent
    patterns.push(`create${capitalizeFirstLetter(componentName)}Content`)

    // Format for full path: createComponentsCheckboxesContent
    const fullName = parts.map(part => capitalizeFirstLetter(part)).join('')
    patterns.push(`create${fullName}Content`)

    // Component specific pattern: createCheckboxes
    patterns.push(`create${capitalizeFirstLetter(componentName)}`)

    // render* pattern: renderCheckboxes
    patterns.push(`render${capitalizeFirstLetter(componentName)}`)

    // Handle sections where there might be just the name
    if (parts.length === 2) {
      patterns.push(componentName)
      patterns.push(`${componentName}Content`)
    }
  } else if (parts[0] === 'styles') {
    // Handle style routes like 'styles/colors'
    const styleName = lastPart
    patterns.push(`create${capitalizeFirstLetter(styleName)}Content`)

    // Format for full path: createStylesColorsContent
    const fullName = parts.map(part => capitalizeFirstLetter(part)).join('')
    patterns.push(`create${fullName}Content`)
  } else if (parts[0] === 'core') {
    // Handle core routes like 'core/state'
    const coreName = lastPart
    patterns.push(`create${capitalizeFirstLetter(coreName)}Content`)

    // Format for full path: createCoreStateContent
    const fullName = parts.map(part => capitalizeFirstLetter(part)).join('')
    patterns.push(`create${fullName}Content`)
  }

  // Add the standard content creator pattern for the full path
  patterns.push(`create${getContentCreatorName(routePath)}Content`)

  return patterns
}

/**
 * Helper to capitalize the first letter of a string
 *
 * @param {string} string - The string to capitalize
 * @returns {string} The capitalized string
 */
function capitalizeFirstLetter (string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

/**
 * Generate route handlers for all known routes
 *
 * @returns {Object} Map of route paths to handler functions
 */
export const generateDynamicRoutes = () => {
  const routes = {}

  Object.keys(ROUTE_MODULE_MAP).forEach(routePath => {
    routes[routePath] = {
      title: `${getTitleFromPath(routePath)}`,
      handler: createDynamicHandler(routePath)
    }
  })

  return routes
}

/**
 * Helper to generate a title from a route path
 *
 * @param {string} path - The route path
 * @returns {string} A formatted title
 */
function getTitleFromPath (path) {
  // Remove leading/trailing slashes and split into parts
  const parts = path.replace(/^\/+|\/+$/g, '').split('/')

  // Get the last part and format it
  const lastPart = parts[parts.length - 1] || 'Home'

  return lastPart
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Helper to generate the content creator function name from a path
 *
 * @param {string} path - The route path
 * @returns {string} The expected function name
 */
function getContentCreatorName (path) {
  // Remove leading/trailing slashes and split into parts
  const parts = path.replace(/^\/+|\/+$/g, '').split('/')

  // Format each part to PascalCase
  return parts.map(part =>
    part
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('')
  ).join('')
}
