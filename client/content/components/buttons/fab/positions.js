// src/client/content/components/fab/positions.js
import {
  createComponentsSectionLayoutInfo
} from '../../../../layout'

import {
  createStructure,
  createFab
} from 'mtrl'

/**
 * FAB positions for fixed positioning
 */
export const FAB_POSITIONS = {
  /** Top right corner */
  TOP_RIGHT: 'top-right',
  /** Top left corner */
  TOP_LEFT: 'top-left',
  /** Bottom right corner */
  BOTTOM_RIGHT: 'bottom-right',
  /** Bottom left corner */
  BOTTOM_LEFT: 'bottom-left'
}

// Different icons for position demonstration
const icons = {
  'top-right': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="15 3 21 3 21 9"></polyline>
    <polyline points="9 21 3 21 3 15"></polyline>
    <line x1="21" y1="3" x2="14" y2="10"></line>
    <line x1="3" y1="21" x2="10" y2="14"></line>
  </svg>`,
  'top-left': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="9 3 3 3 3 9"></polyline>
    <polyline points="15 21 21 21 21 15"></polyline>
    <line x1="3" y1="3" x2="10" y2="10"></line>
    <line x1="21" y1="21" x2="14" y2="14"></line>
  </svg>`,
  'bottom-right': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 5v14M5 12h14"/>
  </svg>`,
  'bottom-left': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 19V5M5 12h14"/>
  </svg>`
}

export const initPositions = (container) => {
  const title = 'FAB Positions'
  const layout = createStructure(createComponentsSectionLayoutInfo({
    title,
    description: 'These FABs demonstrate positioning. In a real application, they would be fixed to the viewport.'
  }), container).component

  // Create a demo container that has position: relative
  const demoContainer = document.createElement('div')
  demoContainer.style.position = 'relative'
  demoContainer.style.height = '300px'
  demoContainer.style.border = '1px dashed #ccc'
  demoContainer.style.marginBottom = '20px'

  layout.showcase.style.display = 'block'

  // Add to showcase
  layout.showcase.appendChild(demoContainer)

  // Convert the enum to an array of strings
  const positions = Object.values(FAB_POSITIONS)

  positions.forEach(position => {
    const formattedPosition = position.replace(/_/g, '-').toLowerCase()
    const icon = icons[formattedPosition] || icons['bottom-right']

    const fab = createFab({
      icon,
      position: formattedPosition,
      ariaLabel: `${formattedPosition} position`
    })

    // Override positioning to be within our demo container
    fab.element.style.position = 'absolute'

    fab.on('click', () => log.info(`${formattedPosition} FAB clicked`))

    demoContainer.appendChild(fab.element)
  })

  // Add a note about animating FABs
  const animatedTitle = document.createElement('h3')
  animatedTitle.textContent = 'Animated FAB'
  layout.showcase.appendChild(animatedTitle)

  const animatedDescription = document.createElement('p')
  animatedDescription.textContent = 'This FAB demonstrates the entrance animation'
  layout.showcase.appendChild(animatedDescription)

  const animatedFab = createFab({
    icon: icons['bottom-right'],
    animate: true,
    ariaLabel: 'Animated FAB'
  })

  layout.showcase.appendChild(animatedFab.element)

  // Create a button to trigger animation
  const resetButton = document.createElement('button')
  resetButton.textContent = 'Reset Animation'
  resetButton.style.marginTop = '20px'
  resetButton.addEventListener('click', () => {
    // Remove and re-add the FAB to reset animation
    animatedFab.element.remove()
    animatedFab.element.classList.add('mtrl-fab--animate-enter')
    setTimeout(() => {
      layout.showcase.appendChild(animatedFab.element)
    }, 10)
  })

  layout.showcase.appendChild(resetButton)
}
