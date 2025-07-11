// src/client/content/components/fab/variants.js
import { capitalize } from '../../../../core/utils'

import { createLayout } from 'mtrl-addons'
import {
  createComponentSection
} from '../../../../layout'

import {
  createFab
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

// Icon for the FABs
const addIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M12 5v14M5 12h14"/>
</svg>`

export const initVariants = (container) => {
  const title = 'FAB Variants'
  const layout = createLayout(createComponentSection({ title }), container).component

  // Convert the enum to an array of strings
  const variants = Object.values(FAB_VARIANTS)

  variants.forEach(variant => {
    const text = capitalize(variant)
    const fab = createFab({
      icon: addIcon,
      variant,
      ariaLabel: `${text} action`
    })

    fab.element.addEventListener('click', () => log.info(`native ${variant} FAB clicked`))
    fab.on('click', () => log.info(`component ${variant} FAB clicked`))

    layout.showcase.appendChild(fab.element)
  })
}
