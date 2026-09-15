import { capitalize } from '../../../../core/utils'

import { createLayout } from 'mtrl-addons'
import {
  createComponentSection
} from '../../../../layout'

import {
  createFab
} from 'mtrl'

/**
 * FAB variants for styling
 */
export const FAB_VARIANTS = {
  PRIMARY_CONTAINER: 'primary-container',
  SECONDARY_CONTAINER: 'secondary-container',
  TERTIARY_CONTAINER: 'tertiary-container',
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  TERTIARY: 'tertiary',
  /** Deprecated */
  SURFACE: 'surface'
}

/**
 * FAB size variants
 */
export const FAB_SIZES = {
  /** Deprecated in M3 expressive */
  SMALL: 'small',
  DEFAULT: 'default',
  MEDIUM: 'medium',
  LARGE: 'large'
}

// Icon for the FABs
const addIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M12 5v14M5 12h14"/>
</svg>`

export const initDisabled = (container) => {
  const title = 'FAB Disabled'
  const layout = createLayout(createComponentSection({ title }), container).component

  const variants = Object.values(FAB_VARIANTS)

  // Create a disabled FAB for each variant
  variants.forEach(variant => {
    const text = capitalize(variant)
    const fab = createFab({
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
    const fab = createFab({
      icon: addIcon,
      size,
      disabled: true,
      ariaLabel: `Disabled ${text} size action`
    })

    layout.showcase.appendChild(fab.element)
  })
}
