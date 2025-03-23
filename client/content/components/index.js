// src/client/content/components/index.js
import { contentLayout } from '../../layout'
import { createLayout, createElement } from 'mtrl'
import { createAppRouter } from '../../core/router'

import { componentsList } from './components-list'

import createCard, {
  CARD_VARIANTS
} from 'mtrl/src/components/card'

/**
 * Creates the main Components content
 * Entry point for browsing all available components
 *
 * @param {HTMLElement} container - The container element to append content to
 * @param {Object} options - Options including router instance
 */
export const createComponentsContent = (container, options = {}) => {
  // Get router from options or create a new one
  const router = options.router || createAppRouter()

  const info = {
    title: 'Components',
    description: 'Components are interactive building blocks for creating a user interface. They can be organized into categories based on their purpose: Action, containment, communication, navigation, selection, and text input.'
  }

  // Create layout
  const layout = createLayout(contentLayout(info), container).component

  componentsList.forEach((group, index) => {
    initComponentsGroup(layout.body, group, router)
  })

  return layout
}

/**
 * Initializes the components grid section
 * @param {HTMLElement} container - Container element for the grid
 * @param {Object} group - Component group data
 * @param {Object} router - Router instance for navigation
 */
const initComponentsGroup = (container, group, router) => {
  // Create section
  const section = createElement({
    tag: 'section',
    class: 'mtrl-content__section mtrl-components-grid'
  })

  // Add section title
  const title = createElement({
    tag: 'h2',
    class: 'mtrl-content__section-title',
    text: group.title
  })
  section.appendChild(title)

  // Add description
  const description = createElement({
    tag: 'p',
    class: 'mtrl-content__description',
    text: group.description
  })
  section.appendChild(description)

  // Create the grid container
  const grid = createElement({
    tag: 'div',
    class: 'mtrl-components-grid__container'
  })
  section.appendChild(grid)

  // Add component cards
  group.components.forEach((component, index) => {
    // Skip components without a path
    if (!component.path) return

    const card = createComponentCard(component)

    card.on('click', () => {
      // Format the component path for router
      let path = component.path

      // Ensure path starts with /
      if (!path.startsWith('/')) {
        path = `/${path}`
      }

      // console.log('Navigating to:', component.title, path)

      // Enhanced navigation approach
      if (router) {
        // Parse the path directly into section and subsection
        const pathParts = path.replace(/^\/+/, '').split('/')
        const section = pathParts[0] || 'home'
        const subsection = pathParts.slice(1).join('/') || ''

        // console.log('Navigating with parsed parts:', { section, subsection })

        // Use direct navigation with the component path
        if (window.app && window.app.getRouter()) {
          // If global app is available, use its router for consistent navigation
          window.app.getRouter().navigate(section, subsection, { replace: true })
        } else {
          // Fall back to provided router
          router.navigate(section, subsection, { replace: true })

          // Fallback for direct navigation in case the router isn't properly triggering content updates
          if (typeof window.handleNavigation === 'function') {
            window.handleNavigation(path)
          } else if (component.handler && typeof component.handler === 'function') {
            // If component has a direct handler, call it
            component.handler(document.querySelector('.mtrl-content'))
          }
        }
      } else {
        console.error('Router not available for navigation')

        // Fallback to direct URL change if router is unavailable
        window.location.href = path
      }
    })

    grid.appendChild(card.element)
  })

  // Add section to container
  container.appendChild(section)
}

/**
 * Creates an expandable component card using the mtrl card component
 * @param {Object} component - Component data
 * @param {string} variant - Card variant to use
 * @returns {HTMLElement} The component card element
 */
const createComponentCard = (component, variant = CARD_VARIANTS.FILLED) => {
  const card = createCard({
    variant,
    interactive: true,
    clickable: true,
    header: {
      title: component.title
    },
    content: {
      html: `<p>${component.description}</p>`,
      padding: true
    },
    ariaLabel: {
      role: 'region',
      label: `${component.title}`
    }
  })

  return card
}

export default createComponentsContent
