import { capitalize } from '../../../../core/utils'

import {
  createComponentsSectionLayout
} from '../../../../layout'

import {
  createLayout,
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

// Icon for the FABs
const addIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M12 5v14M5 12h14"/>
</svg>`

export const initDisabled = (container) => {
  const title = 'FAB Disabled'
  const layout = createLayout(createComponentsSectionLayout({ title, class: 'noflex' }), container).component

  const variants = Object.values(FAB_VARIANTS)

  // Create a disabled FAB for each variant
  variants.forEach(variant => {
    const text = capitalize(variant)
    const fab = fFab({
      icon: addIcon,
      variant,
      disabled: true,
      ariaLabel: `Disabled ${text} action`
    })

    layout.showcase.appendChild(fab.element)
  })

  // Also show different sizes in disabled state
  const sizes = Object.values(FAB_SIZES)

  sizes.forEach(size => {
    const text = capitalize(size)
    const fab = fFab({
      icon: addIcon,
      size,
      disabled: true,
      ariaLabel: `Disabled ${text} size action`
    })

    layout.showcase.appendChild(fab.element)
  })
}
