// src/client/content/components/extended-fab/variants.js

import { createLayout } from 'mtrl-addons'
import { createComponentSection } from '../../../../layout'
import { createExtendedFab } from 'mtrl'

// M3 expressive colour styles, shared with the FAB. Surface is deprecated.
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
    'The same six styles as the FAB, container and tone, plus the deprecated surface style. Elevation level 3 at rest, 4 on hover. The second row puts the icon after the label.'
  const layout = createLayout(createComponentSection({ title, description }), container).component

  const rows = createLayout(
    [
      ['start', { class: 'fab-row' }],
      ['end', { class: 'fab-row' }]
    ],
    layout.showcase
  ).component

  styles.forEach(([variant, label]) => {
    const start = createExtendedFab({ icon: addIcon, text: 'Create', variant, ariaLabel: label })
    start.on('click', () => log.info(`${variant} extended FAB clicked`))
    rows.start.appendChild(start.element)

    const end = createExtendedFab({ icon: addIcon, text: 'Create', variant, iconPosition: 'end', ariaLabel: `${label}, icon after the label` })
    rows.end.appendChild(end.element)
  })
}
