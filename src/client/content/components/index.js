import { contentLayout } from '../../config'
import { createLayout, createElement, createButton } from 'mtrl'

import createCard, {
  createCardHeader,
  createCardContent,
  createCardActions,
  CARD_VARIANTS,
  withExpandable
} from 'mtrl/src/components/card'

// Import icons (you can replace these with your actual icon imports)
import {
  iconComponents,
  iconCore,
  iconStyles
} from '../../icons'

/**
 * Creates the main Components showcase content
 * Entry point for browsing all available components
 *
 * @param {HTMLElement} container - The container element to append content to
 */
export const createComponentsContent = (container) => {
  const info = {
    title: 'Components',
    description: 'Reusable UI building blocks following Material Design 3 principles'
  }

  container.classList.add('components-showcase')

  // Add component-specific styles

  const layout = createLayout(contentLayout(info), container).component

  initComponentsGrid(layout.body)
  initComponentsUsage(layout.body)
}

/**
 * Initializes the components grid section
 * @param {HTMLElement} container - Container element
 */
const initComponentsGrid = (container) => {
  // Create section
  const section = createElement({
    tag: 'section',
    class: 'mtrl-content__section components-grid'
  })

  // Add section title
  const title = createElement({
    tag: 'h2',
    class: 'mtrl-content__section-title',
    text: 'Available Components'
  })
  section.appendChild(title)

  // Add description
  const description = createElement({
    tag: 'p',
    class: 'mtrl-content__description',
    text: 'Explore our collection of Material Design 3 components, each designed for accessibility, customization, and performance.'
  })
  section.appendChild(description)

  // Create the grid container
  const grid = createElement({
    tag: 'div',
    class: 'components-grid__container'
  })
  section.appendChild(grid)

  // Add component cards
  // Alternate between filled and outlined variants for visual interest
  componentsList.forEach((component, index) => {
    // Alternate between different card variants for visual variety
    // const variant = index % 2 === 0 ? CARD_VARIANTS.FILLED : CARD_VARIANTS.OUTLINED

    const variant = CARD_VARIANTS.FILLED

    const card = createComponentCard(component, variant)
    grid.appendChild(card)
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
const createComponentCard = (component, variant = CARD_VARIANTS.ELEVATED) => {
  // Create base card
  const baseCard = createCard({
    variant,
    aria: {
      label: `${component.title} component card`,
      expanded: 'false'
    }
  })

  // Create the expandable content
  const expandableContent = document.createElement('div')
  expandableContent.id = `expandable-content-${component.id}`
  expandableContent.className = 'component-card__expandable'

  // Add detailed content for expansion
  const detailedInfo = document.createElement('div')
  detailedInfo.style.padding = '16px'
  detailedInfo.style.borderTop = '1px solid var(--mtrl-sys-color-outline-variant)'

  // Add usage examples section
  if (component.examples) {
    const examplesTitle = document.createElement('h4')
    examplesTitle.textContent = 'Usage Examples'
    examplesTitle.style.margin = '0 0 8px 0'
    examplesTitle.style.fontSize = '1rem'
    detailedInfo.appendChild(examplesTitle)

    const examplesText = document.createElement('p')
    examplesText.textContent = component.examples
    detailedInfo.appendChild(examplesText)
  }

  // Add code example if available
  const codeExample = document.createElement('pre')
  codeExample.style.backgroundColor = 'var(--mtrl-sys-color-surface-container-high)'
  codeExample.style.padding = '12px'
  codeExample.style.borderRadius = '8px'
  codeExample.style.overflow = 'auto'
  codeExample.style.margin = '12px 0'

  const codeContent = document.createElement('code')
  codeContent.style.fontFamily = 'monospace'

  // Simple example code based on component type
  let sampleCode = ''
  switch (component.id) {
    case 'buttons':
      sampleCode = 'import { createButton } from \'mtrl\';\n\nconst button = createButton({\n  text: \'Click Me\',\n  variant: \'filled\',\n  onClick: () => console.log(\'Button clicked!\')\n});\n\ndocument.body.appendChild(button.element);'
      break
    case 'cards':
      sampleCode = 'import createCard, { createCardHeader, createCardContent } from \'mtrl/src/components/card\';\n\nconst card = createCard({ variant: \'elevated\' });\nconst header = createCardHeader({ title: \'Card Title\' });\nconst content = createCardContent({ text: \'Card content goes here\' });\n\ncard.setHeader(header);\ncard.addContent(content);\ndocument.body.appendChild(card.element);'
      break
    default:
      sampleCode = `import { create${component.title.replace(/s$/, '')} } from 'mtrl';\n\n// Example usage\nconst ${component.id.replace(/s$/, '')} = create${component.title.replace(/s$/, '')}({\n  // Configuration options\n});\n\ndocument.body.appendChild(${component.id.replace(/s$/, '')}.element);`
  }

  codeContent.textContent = sampleCode
  codeExample.appendChild(codeContent)
  detailedInfo.appendChild(codeExample)

  // Add component variations section if features exist
  if (component.features && component.features.length) {
    const variationsTitle = document.createElement('h4')
    variationsTitle.textContent = 'Available Variations'
    variationsTitle.style.margin = '16px 0 8px 0'
    variationsTitle.style.fontSize = '1rem'
    detailedInfo.appendChild(variationsTitle)

    const variationsList = document.createElement('ul')
    variationsList.style.paddingLeft = '20px'

    component.features.forEach(feature => {
      const featureItem = document.createElement('li')
      featureItem.textContent = feature
      featureItem.style.margin = '4px 0'
      variationsList.appendChild(featureItem)
    })

    detailedInfo.appendChild(variationsList)
  }

  // Add note about documentation
  // const docNote = document.createElement('p')
  // docNote.textContent = 'Click the Explore button below for complete documentation and interactive examples.'
  // docNote.style.marginTop = '16px'
  // docNote.style.fontSize = '0.875rem'
  // docNote.style.fontStyle = 'italic'
  // docNote.style.color = 'var(--mtrl-sys-color-on-surface-variant)'
  // detailedInfo.appendChild(docNote)

  expandableContent.appendChild(detailedInfo)

  // Enhance card with expandable functionality
  const card = withExpandable({
    initialExpanded: false,
    expandableContent
  })(baseCard)

  // Create card header
  const header = createCardHeader({
    title: component.title
  })

  // Create content container
  const content = createCardContent({})

  // // Create icon container for the header
  // const iconContainer = createElement({
  //   tag: 'div',
  //   class: 'component-card__icon'
  // })

  // // Add icon visual
  // const iconVisual = createElement({
  //   tag: 'div',
  //   class: `component-card__icon-visual component-card__icon-${component.id}`
  // })
  // iconContainer.appendChild(iconVisual)
  // header.appendChild(iconContainer)

  // Add description
  const descriptionElement = document.createElement('p')
  descriptionElement.className = 'component-card__description'
  descriptionElement.textContent = component.description
  content.appendChild(descriptionElement)

  // // Add "Click to expand" hint
  // const expandHint = createElement({
  //   tag: 'p',
  //   class: 'component-card__expand-hint',
  //   text: 'Click to see code examples and details'
  // })
  // content.appendChild(expandHint)

  // Create button for actions
  const exploreButton = createButton({
    text: `Explore ${component.title}`,
    variant: 'filled',
    onClick: (e) => {
      e.stopPropagation() // Prevent expanding the card when clicking the button

      // Get router from window.app if available
      let router = null
      if (window.app?.getRouter) {
        router = window.app.getRouter()
      } else if (window.router) {
        router = window.router
      }

      if (router) {
        router.navigate('components', component.id)
      } else {
        // Fallback to direct navigation if router isn't available
        window.location.href = `/components/${component.id}`
      }
    }
  }).element

  // Create card actions
  const actions = createCardActions({
    actions: [exploreButton],
    align: 'end'
  })

  // Assemble the card
  card.setHeader(header)
  card.addContent(content)
  card.setActions(actions)

  return card.element
}

/**
 * Initializes the components usage section with code examples
 * @param {HTMLElement} container - Container element
 */
const initComponentsUsage = (container) => {
  const section = createElement({
    tag: 'section',
    class: 'mtrl-content__section'
  })

  const title = createElement({
    tag: 'h2',
    class: 'mtrl-content__section-title',
    text: 'Using Components'
  })
  section.appendChild(title)

  const usageContainer = createElement({
    tag: 'div',
    class: 'usage-guide'
  })

  // Step 1
  const step1 = createElement({
    tag: 'div',
    class: 'usage-guide__step'
  })
  step1.appendChild(createElement({
    tag: 'h3',
    text: '1. Import Components'
  }))
  step1.appendChild(createElement({
    tag: 'pre',
    class: 'code-block',
    children: [
      createElement({
        tag: 'code',
        text: 'import { createButton, createTextfield } from "mtrl";'
      })
    ]
  }))
  usageContainer.appendChild(step1)

  // Step 2
  const step2 = createElement({
    tag: 'div',
    class: 'usage-guide__step'
  })
  step2.appendChild(createElement({
    tag: 'h3',
    text: '2. Create Components'
  }))
  step2.appendChild(createElement({
    tag: 'pre',
    class: 'code-block',
    children: [
      createElement({
        tag: 'code',
        text: 'const button = createButton({\n  text: "Click Me",\n  variant: "filled"\n});'
      })
    ]
  }))
  usageContainer.appendChild(step2)

  // Step 3
  const step3 = createElement({
    tag: 'div',
    class: 'usage-guide__step'
  })
  step3.appendChild(createElement({
    tag: 'h3',
    text: '3. Add to DOM'
  }))
  step3.appendChild(createElement({
    tag: 'pre',
    class: 'code-block',
    children: [
      createElement({
        tag: 'code',
        text: 'document.body.appendChild(button.element);'
      })
    ]
  }))
  usageContainer.appendChild(step3)

  section.appendChild(usageContainer)
  container.appendChild(section)
}

/**
 * Adds component showcase specific styles
 */
const addComponentStyles = () => {
  // Check if styles already exist
  if (document.getElementById('components-showcase-styles')) {
    return
  }

  const styleElement = document.createElement('style')
  styleElement.id = 'components-showcase-styles'
  styleElement.textContent = `
   
  `

  document.head.appendChild(styleElement)
}

/**
 * List of all components with metadata for the showcase
 */
const componentsList = [
  {
    id: 'buttons',
    title: 'Buttons',
    description: 'Let users take action and make choices with a single tap.',
    features: ['Filled', 'Outlined', 'Text', 'Icon buttons', 'State handling'],
    examples: 'Use buttons as primary actions in forms, dialogs, and cards. Button states reflect interactions: enabled, disabled, hovered, focused, and pressed.'
  },
  {
    id: 'cards',
    title: 'Cards',
    description: 'Display content and actions about a single subject.',
    features: ['Elevated', 'Filled', 'Outlined', 'Actions', 'Media', 'Expandable'],
    examples: 'Cards are surfaces that display content and actions on a single topic. They should be easy to scan for relevant and actionable information.'
  },
  {
    id: 'checkboxes',
    title: 'Checkboxes',
    description: 'Let users select one or more items from a list, or turn an item on or off.',
    features: ['Single state', 'Indeterminate state', 'Label placement', 'Validation'],
    examples: 'Use checkboxes when users need to select multiple options from a list or toggle a single option on or off.'
  },
  {
    id: 'chips',
    title: 'Chips',
    description: 'Compact elements that represent an input, attribute, or action.',
    features: ['Input chips', 'Filter chips', 'Suggestion chips', 'Selection behavior'],
    examples: 'Chips are compact elements that represent an input, attribute, or action. They allow users to make selections, filter content, or trigger actions.'
  },
  {
    id: 'lists',
    title: 'Lists',
    description: 'Continuous, vertical indexes of text and images.',
    features: ['Single select', 'Multi select', 'Sectioned lists', 'Rich content']
  },
  {
    id: 'menus',
    title: 'Menus',
    description: 'Display a list of choices on a temporary surface.',
    features: ['Dropdown', 'Context menu', 'Cascading', 'Keyboard navigation']
  },
  {
    id: 'navigations',
    title: 'Navigation',
    description: 'Help users move between views and sections of your app.',
    features: ['Drawer', 'Rails', 'Navigation bars', 'Responsive behavior']
  },
  {
    id: 'progress',
    title: 'Progress Indicators',
    description: 'Express an unspecified wait time or display the length of a process.',
    features: ['Linear', 'Circular', 'Determinate', 'Indeterminate']
  },
  {
    id: 'radios',
    title: 'Radio Buttons',
    description: 'Allow users to select one option from a set.',
    features: ['Single selection', 'Grouping', 'Label placement', 'States']
  },
  {
    id: 'sliders',
    title: 'Sliders',
    description: 'Let users make selections from a range of values.',
    features: ['Continuous', 'Discrete', 'Range selection', 'Value display']
  },
  {
    id: 'snackbars',
    title: 'Snackbars',
    description: 'Provide brief messages about app processes at the bottom of the screen.',
    features: ['Temporary messages', 'Action buttons', 'Position variants', 'Duration control']
  },
  {
    id: 'switches',
    title: 'Switches',
    description: 'Toggle the state of a single item on or off.',
    features: ['Binary control', 'Instant action', 'Label placement', 'State feedback']
  },
  {
    id: 'tabs',
    title: 'Tabs',
    description: 'Organize content into separate views where only one view is visible at a time.',
    features: ['Horizontal tabs', 'Scrollable', 'Icon tabs', 'Secondary tabs']
  },
  {
    id: 'textfields',
    title: 'Text Fields',
    description: 'Let users enter and edit text.',
    features: ['Single line', 'Multi-line', 'Filled', 'Outlined', 'Validation']
  },
  {
    id: 'carousel',
    title: 'Carousel',
    description: 'Display a collection of items that can be scrolled horizontally.',
    features: ['Multi-browse', 'Hero layout', 'Snap scrolling', 'Controls']
  }
]

export default createComponentsContent
