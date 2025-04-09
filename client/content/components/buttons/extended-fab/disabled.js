// src/client/content/components/extended-fab/disabled.js
import { capitalize } from '../../../../core/utils'

import {
  createComponentsSectionLayout
} from '../../../../layout'

import {
  fLayout,
  createExtendedFab
} from 'mtrl'

const FAB_VARIANTS = {
  /** Primary container color with on-primary-container icons */
  PRIMARY: 'primary',
  /** Secondary container color with on-secondary-container icons */
  SECONDARY: 'secondary',
  /** Tertiary container color with on-tertiary-container icons */
  TERTIARY: 'tertiary',
  /** Surface color with primary color icons */
  SURFACE: 'surface'
}

// Icon for the Extended FABs
const addIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M12 5v14M5 12h14"/>
</svg>`

export const initDisabled = (container) => {
  const title = 'Extended FAB Disabled'
  const layout = fLayout(createComponentsSectionLayout({
    title,
    description: 'Disabled Extended FABs are visually distinct and non-interactive.'
  }), container).component

  const variants = Object.values(FAB_VARIANTS)

  // Create a disabled Extended FAB for each variant
  variants.forEach(variant => {
    const text = capitalize(variant)
    const extendedFab = createExtendedFab({
      icon: addIcon,
      text: `${text} Disabled`,
      variant,
      disabled: true,
      ariaLabel: `Disabled ${text} action`
    })

    layout.showcase.appendChild(extendedFab.element)

    // Add some spacing between the items
    layout.showcase.appendChild(document.createElement('br'))
    layout.showcase.appendChild(document.createElement('br'))
  })

  // // Show different width options in disabled state
  // const disabledWidthTitle = document.createElement('h3')
  // disabledWidthTitle.textContent = 'Disabled Width Options'
  // layout.showcase.appendChild(disabledWidthTitle)

  // Container for width examples
  // const widthContainer = document.createElement('div')
  // widthContainer.style.width = '100%'
  // widthContainer.style.maxWidth = '400px'
  // widthContainer.style.border = '1px dashed #ccc'
  // widthContainer.style.padding = '20px'
  // widthContainer.style.display = 'flex'
  // widthContainer.style.flexDirection = 'column'
  // widthContainer.style.gap = '20px'

  // Fixed width disabled
  const fixedFab = createExtendedFab({
    icon: addIcon,
    text: 'Fixed Width Disabled',
    width: 'fixed',
    disabled: true,
    ariaLabel: 'Disabled fixed width'
  })

  // Fluid width disabled
  const fluidFab = createExtendedFab({
    icon: addIcon,
    text: 'Fluid Width Disabled',
    width: 'fluid',
    disabled: true,
    ariaLabel: 'Disabled fluid width'
  })

  // widthContainer.appendChild(fixedFab.element)
  // widthContainer.appendChild(fluidFab.element)

  // layout.showcase.appendChild(widthContainer)
}
