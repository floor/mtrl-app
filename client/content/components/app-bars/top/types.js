// src/client/content/components/app-bars/top/types.js
import {
  createComponentsSectionLayoutBox
} from '../../../../layout'

import {
  createLayout,
  fTopAppBar,
  fButton
} from 'mtrl'

export const initTypesTopAppBar = (container) => {
  const title = 'Top App Bar Types'

  const layout = createLayout(createComponentsSectionLayoutBox({
    title,
    class: 'noflex'
  }), container).component

  // Create a flex container to display all types
  const typesContainer = document.createElement('div')
  typesContainer.className = 'mtrl-content__top-app-bar-types'
  typesContainer.style.display = 'flex'
  typesContainer.style.flexDirection = 'column'
  typesContainer.style.gap = '24px'
  typesContainer.style.marginBottom = '16px'

  // Create all four top app bar types
  const centerAlignedBar = createTypeDemoContainer('center', 'Center-Aligned',
    'Used for the main root page in an app. Displays the app name or page headline centered in the bar.')

  const smallBar = createTypeDemoContainer('small', 'Small',
    'Used for sub-pages that require back navigation and multiple actions. Default height is 64dp.')

  const mediumBar = createTypeDemoContainer('medium', 'Medium',
    'Used for a larger headline treatment. Default height is 112dp with the headline in the bottom section.')

  const largeBar = createTypeDemoContainer('large', 'Large',
    'Used to emphasize the headline of the page. Default height is 152dp with a more prominent headline.')

  // Add all demo containers to the types container
  typesContainer.appendChild(centerAlignedBar)
  typesContainer.appendChild(smallBar)
  typesContainer.appendChild(mediumBar)
  typesContainer.appendChild(largeBar)

  // Add a description
  const description = document.createElement('div')
  description.className = 'mtrl-content__description'
  description.innerHTML = `
    <p>Material Design offers four types of top app bars to match different UX needs:</p>
    <ul style="list-style-type: disc; margin-left: 24px; margin-bottom: 16px;">
      <li><strong>Center-aligned:</strong> For root pages, with the title centered in the bar</li>
      <li><strong>Small:</strong> For compact layouts or sub-pages requiring back navigation</li>
      <li><strong>Medium:</strong> For initial states that highlight the screen title (112dp height)</li>
      <li><strong>Large:</strong> For maximum headline emphasis with a 152dp height</li>
    </ul>
    <p>The type can be selected based on information hierarchy needs, with medium and large variants creating more visual space between content sections.</p>
  `

  // Add to layout
  layout.body.appendChild(typesContainer)
  layout.body.appendChild(description)
}

/**
 * Creates a demo container showing a specific top app bar type
 * @param {string} type - Type of top app bar ('small', 'medium', 'large', 'center')
 * @param {string} typeTitle - Display name for the type
 * @param {string} description - Description of when to use this type
 * @returns {HTMLElement} The demo container element
 */
function createTypeDemoContainer (type, typeTitle, description) {
  // Create demo container
  const demoContainer = document.createElement('div')
  demoContainer.className = `mtrl-content__top-app-bar-demo mtrl-content__top-app-bar-${type}`
  demoContainer.style.position = 'relative'
  demoContainer.style.border = '1px solid var(--mtrl-sys-color-outline-variant)'
  demoContainer.style.borderRadius = '8px'
  demoContainer.style.overflow = 'hidden'

  // Set height based on type
  if (type === 'small' || type === 'center') {
    demoContainer.style.height = '200px'
  } else if (type === 'medium') {
    demoContainer.style.height = '250px'
  } else if (type === 'large') {
    demoContainer.style.height = '300px'
  }

  // Create the top app bar with the specific type
  const topBar = fTopAppBar({
    title: `${typeTitle} Title`,
    type
  })

  // Create leading navigation button
  const leadingIcon = fButton({
    icon: type === 'center'
      ? '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>'
      : '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>',
    variant: 'icon',
    ariaLabel: type === 'center' ? 'Menu' : 'Back'
  })

  // Create trailing action button
  const trailingIcon = fButton({
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>',
    variant: 'icon',
    ariaLabel: 'More options'
  })

  // Add elements to the app bar
  topBar.addLeadingElement(leadingIcon.element)
  topBar.addTrailingElement(trailingIcon.element)

  // Add type label and description
  const labelContainer = document.createElement('div')
  labelContainer.className = 'mtrl-content__type-label'
  labelContainer.style.padding = '16px'

  // Set padding-top based on app bar type height
  if (type === 'small' || type === 'center') {
    labelContainer.style.paddingTop = '80px' // 64px + extra padding
  } else if (type === 'medium') {
    labelContainer.style.paddingTop = '128px' // 112px + extra padding
  } else if (type === 'large') {
    labelContainer.style.paddingTop = '168px' // 152px + extra padding
  }

  labelContainer.innerHTML = `
    <p style="margin-bottom: 8px; font-weight: 500;">${typeTitle} Type</p>
    <p style="color: var(--mtrl-sys-color-on-surface-variant); font-size: 14px;">${description}</p>
  `

  // Add the bar and label to the demo container
  demoContainer.appendChild(topBar.element)
  demoContainer.appendChild(labelContainer)

  // Initialize lifecycle
  topBar.lifecycle.mount()

  return demoContainer
}
