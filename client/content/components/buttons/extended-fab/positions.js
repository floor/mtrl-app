// src/client/content/components/extended-fab/positions.js
import {
  createComponentSection
} from '../../../../layout'

import {
  topLeftIcon,
  topRightIcon,
  bottomLeftIcon,
  bottomRightIcon
} from '../../../../icons'

import {
  createExtendedFab,
  createLayout
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
  'top-right': topRightIcon,
  'top-left': topLeftIcon,
  'bottom-right': bottomRightIcon,
  'bottom-left': bottomLeftIcon
}

// Position labels for better clarity
const positionLabels = {
  'top-right': 'Top Right',
  'top-left': 'Top Left',
  'bottom-right': 'Bottom Right',
  'bottom-left': 'Bottom Left'
}

export const initPositions = (container) => {
  const title = 'Extended FAB Positions'
  const layout = createLayout(createComponentSection({
    title,
    description: 'Extended FABs can be positioned in different corners of the screen. In a real application, they would be fixed to the viewport.'
  }), container).component

  // Create a demo container that has position: relative
  const demoContainer = document.createElement('div')
  demoContainer.style.position = 'relative'
  demoContainer.style.height = '400px'
  // demoContainer.style.border = '1px dashed #ccc'

  layout.showcase.style.display = 'block'
  layout.showcase.style.padding = '0px'

  // Add to showcase
  layout.showcase.appendChild(demoContainer)

  // Convert the enum to an array of strings
  const positions = Object.values(FAB_POSITIONS)

  positions.forEach(position => {
    const formattedPosition = position.replace(/_/g, '-').toLowerCase()
    const icon = icons[formattedPosition] || icons['bottom-right']
    const label = positionLabels[formattedPosition] || 'Action'

    const extendedFab = createExtendedFab({
      icon,
      text: label,
      position: formattedPosition,
      ariaLabel: `${formattedPosition} position`
    })

    // Override positioning to be within our demo container
    extendedFab.element.style.position = 'absolute'

    extendedFab.on('click', () => log.info(`${formattedPosition} Extended FAB clicked`))

    demoContainer.appendChild(extendedFab.element)
  })
}
