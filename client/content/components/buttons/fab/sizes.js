// src/client/content/components/fab/sizes.js

import { createLayout } from 'mtrl-addons'
import { createComponentSection } from '../../../../layout'
import { createFab } from 'mtrl'

// Container, icon and corner per size; small is deprecated in M3 expressive.
export const FAB_SIZES = {
  SMALL: 'small',
  DEFAULT: 'default',
  MEDIUM: 'medium',
  LARGE: 'large'
}

const addIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M12 5v14M5 12h14"/>
</svg>`

export const initSizes = (container) => {
  const title = 'Sizes'
  const description =
    'Default 56dp with a 24dp icon, medium 80dp with a 28dp icon on the 20dp corner, large 96dp with a 32dp icon on the 28dp corner. The icon scales with the size, so one SVG serves all of them. Small, 40dp, is no longer recommended.'
  const layout = createLayout(createComponentSection({ title, description }), container).component

  Object.values(FAB_SIZES).forEach((size) => {
    const fab = createFab({ icon: addIcon, size, ariaLabel: `${size} size action` })
    fab.on('click', () => log.info(`${size} FAB clicked`))
    layout.showcase.appendChild(fab.element)
  })
}
