// src/client/content/components/fab/sizes.js
import { capitalize } from '../../../../core/utils'

import {
  createComponentsSectionLayout
} from '../../../../config'

import {
  createLayout
} from 'mtrl'

import {
  createFab,
  FAB_SIZES
} from 'mtrl/src/components/fab'

// Icon for the FABs
const addIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M12 5v14M5 12h14"/>
</svg>`

// Large icon for large FAB
const largeAddIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M12 5v14M5 12h14"/>
</svg>`

export const initSizes = (container) => {
  const title = 'FAB Sizes'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component

  // Convert the enum to an array of strings
  const sizes = Object.values(FAB_SIZES)

  sizes.forEach(size => {
    const text = capitalize(size)
    // Use the large icon for the large FAB
    const icon = size === FAB_SIZES.LARGE ? largeAddIcon : addIcon

    const fab = createFab({
      icon,
      size,
      ariaLabel: `${text} size action`
    })

    fab.on('click', () => log.info(`${size} FAB clicked`))

    layout.showcase.appendChild(fab.element)
  })
}
