// src/client/content/components/extended-fab/variants.js
import { capitalize } from '../../../../core/utils'

import {
  createComponentsSectionLayout
} from '../../../../layout'

import {
  createStructure,
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

export const initVariants = (container) => {
  const title = 'Extended FAB Variants'
  const layout = createStructure(createComponentsSectionLayout({
    title,
    description: 'Extended FABs are available in different color variants, each suitable for different contexts.'
  }), container).component

  // Convert the enum to an array of strings
  const variants = Object.values(FAB_VARIANTS)

  variants.forEach(variant => {
    const text = capitalize(variant)
    const extendedFab = createExtendedFab({
      icon: addIcon,
      text: 'Create',
      variant,
      ariaLabel: `${text} action`
    })

    extendedFab.element.addEventListener('click', () => log.info(`native ${variant} Extended FAB clicked`))
    extendedFab.on('click', () => log.info(`component ${variant} Extended FAB clicked`))

    layout.showcase.appendChild(extendedFab.element)

    // Add some spacing between the items
    layout.showcase.appendChild(document.createElement('br'))
    layout.showcase.appendChild(document.createElement('br'))
  })

  // Also show variants with icon at the end
  const iconEndTitle = document.createElement('h3')
  iconEndTitle.textContent = 'Icon Position - End'
  layout.showcase.appendChild(iconEndTitle)

  variants.forEach(variant => {
    const text = capitalize(variant)
    const extendedFab = createExtendedFab({
      icon: addIcon,
      text: 'Create',
      variant,
      iconPosition: 'end',
      ariaLabel: `${text} action with end icon`
    })

    layout.showcase.appendChild(extendedFab.element)

    // Add some spacing between the items
    layout.showcase.appendChild(document.createElement('br'))
    layout.showcase.appendChild(document.createElement('br'))
  })
}
