// src/client/content/components/extended-fab/positions.js
import {
  createComponentSection
} from '../../../../layout'

import {
  createLayout,
  createExtendedFab,
  createButton

} from 'mtrl'

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

export const initAnimation = (container) => {
  const title = 'Animated Extended FAB'
  const description = 'This Extended FAB demonstrates the entrance animation'
  const layout = createLayout(createComponentSection({
    title,
    description
  }), container).component

  const animatedFab = createExtendedFab({
    icon: icons['bottom-right'],
    text: 'Create',
    animate: true,
    ariaLabel: 'Animated Extended FAB',
    parent: layout.showcase
  })

  layout.showcase.style.height = '176px'

  // Create a button to trigger animation
  const resetButton = createButton({
    text: 'Reset Animation',
    parent: layout.showcase
  })
  resetButton.element.addEventListener('click', () => {
    // Remove and re-add the Extended FAB to reset animation
    animatedFab.element.remove()
    animatedFab.element.classList.add('mtrl-extended-fab--animate-enter')
    setTimeout(() => {
      layout.showcase.appendChild(animatedFab.element)
    }, 10)
  })
}
