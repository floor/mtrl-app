// src/client/content/components/app-bars/bottom/with-fab.js
import {
  createSectionShowcase
} from '../../../../layout'

import {
  createLayout,
  fBottomAppBar,
  fButton,
  fFab
} from 'mtrl'

/**
 * FAB variants for styling
 */
export const FAB_VARIANTS = {
  /** Primary container color with on-primary-container icons */
  PRIMARY: 'primary',
  /** Secondary container color with on-secondary-container icons */
  SECONDARY: 'secondary',
  /** Tertiary container color with on-tertiary-container icons */
  TERTIARY: 'tertiary',
  /** Surface color with primary color icons */
  SURFACE: 'surface'
}

/**
 * FAB size variants
 */
export const FAB_SIZES = {
  /** Standard FAB size (56dp) */
  DEFAULT: 'default',
  /** Small FAB size (40dp) */
  SMALL: 'small',
  /** Large FAB size (96dp) */
  LARGE: 'large'
}

export const initWithFabBottomAppBar = (container) => {
  const title = 'Bottom App Bar with FAB'

  const layout = createLayout(createSectionShowcase({
    title,
    class: 'noflex'
  }), container).component

  // Create two demo containers for the two FAB positions
  const demoContainers = document.createElement('div')
  demoContainers.className = 'mtrl-content__multi-demo'
  demoContainers.style.display = 'flex'
  demoContainers.style.gap = '24px'
  demoContainers.style.marginBottom = '16px'

  // Create end FAB demo
  const endFabDemo = createFabPositionDemo('end')

  // // Create center FAB demo
  // const centerFabDemo = createFabPositionDemo('center')

  // Add containers to the demo section
  demoContainers.appendChild(endFabDemo.container)
  // demoContainers.appendChild(centerFabDemo.container)

  // Add a description
  const description = document.createElement('div')
  description.className = 'mtrl-content__description'
  description.innerHTML = `
    <p>Bottom app bar can include a floating action button (FAB) in two positions:</p>
    <ul style="list-style-type: disc; margin-left: 24px; margin-bottom: 16px;">
      <li><strong>End position:</strong> Aligned to the trailing edge of the container (right in LTR, left in RTL)</li>
      <li><strong>Center position:</strong> Centered horizontally in the container</li>
    </ul>
    <p>When a FAB is present, the bottom app bar uses a height of 72dp (instead of 80dp for standard).</p>
  `

  // Add to layout
  layout.showcase.appendChild(demoContainers)
  layout.info.appendChild(description)
}

/**
 * Helper function to create a demo container with a bottom app bar and FAB in specified position
 * @param {string} position - 'end' or 'center'
 * @returns {Object} Object containing the demo container and components
 */
function createFabPositionDemo (position) {
  // Create demo container
  const demoContainer = document.createElement('div')
  demoContainer.className = 'mtrl-content__bottom-app-bar-demo'
  demoContainer.style.position = 'relative'
  demoContainer.style.flex = '1'
  demoContainer.style.height = '300px'
  demoContainer.style.border = '1px solid var(--mtrl-sys-color-outline-variant)'
  demoContainer.style.borderRadius = '8px'
  demoContainer.style.overflow = 'hidden'

  // Position label
  const positionLabel = document.createElement('div')
  positionLabel.className = 'mtrl-content__position-label'
  positionLabel.style.padding = '16px'
  positionLabel.style.textAlign = 'center'
  positionLabel.style.fontWeight = '500'
  positionLabel.textContent = `${position === 'end' ? 'End' : 'Center'} position`
  demoContainer.appendChild(positionLabel)

  // Background text
  const demoContent = document.createElement('div')
  demoContent.style.padding = '16px'
  demoContent.style.textAlign = 'center'
  demoContent.style.marginTop = '80px'
  demoContent.style.color = 'var(--mtrl-sys-color-on-surface-variant)'
  demoContent.textContent = 'Demo content area'
  demoContainer.appendChild(demoContent)

  // Create bottom app bar with FAB configuration
  const bottomBar = fBottomAppBar({
    hasFab: true,
    fabPosition: position
  })

  // Create action buttons
  const searchButton = fButton({
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>',
    variant: 'icon',
    ariaLabel: 'Search'
  })

  const favoriteButton = fButton({
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>',
    variant: 'icon',
    ariaLabel: 'Favorite'
  })

  const shareButton = fButton({
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>',
    variant: 'icon',
    ariaLabel: 'Share'
  })

  // Create a FAB using the proper fFab component
  const fab = fFab({
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>',
    ariaLabel: 'Add new item',
    variant: FAB_VARIANTS.PRIMARY,
    size: FAB_SIZES.DEFAULT
  })

  // Add actions and FAB to the bottom bar
  bottomBar.addAction(searchButton.element)
  bottomBar.addAction(favoriteButton.element)
  bottomBar.addAction(shareButton.element)
  bottomBar.addFab(fab.element)

  // Add the bar to the demo container
  demoContainer.appendChild(bottomBar.element)

  // Initialize lifecycle
  bottomBar.lifecycle.mount()

  return {
    container: demoContainer,
    bottomBar,
    fab
  }
}
