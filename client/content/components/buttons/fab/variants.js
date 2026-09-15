// src/client/content/components/fab/variants.js

import { createLayout } from 'mtrl-addons'
import { createComponentSection } from '../../../../layout'
import { createFab } from 'mtrl'

// M3 expressive colour styles: the container styles, then the tone styles.
// Surface is deprecated and kept only for existing callers.
const styles = [
  ['primary-container', 'Primary container (default)'],
  ['secondary-container', 'Secondary container'],
  ['tertiary-container', 'Tertiary container'],
  ['primary', 'Primary'],
  ['secondary', 'Secondary'],
  ['tertiary', 'Tertiary'],
  ['surface', 'Surface (deprecated)']
]

const addIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M12 5v14M5 12h14"/>
</svg>`

export const initVariants = (container) => {
  const title = 'Colour styles'
  const description =
    'Three container styles and three tone styles, named after the colour roles they use: primary container with on-primary-container, primary with on-primary, and so on. Every style rests at elevation level 3 and rises to level 4 on hover. The surface style predates the expressive update and is deprecated.'
  const layout = createLayout(createComponentSection({ title, description }), container).component

  styles.forEach(([variant, label]) => {
    const fab = createFab({ icon: addIcon, variant, ariaLabel: label })
    fab.on('click', () => log.info(`${variant} FAB clicked`))
    layout.showcase.appendChild(fab.element)
  })
}
