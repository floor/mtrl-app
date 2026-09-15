// src/client/content/components/extended-fab/sizes.js

import { createLayout } from 'mtrl-addons'
import { createComponentSection } from '../../../../layout'
import { createExtendedFab, createButton } from 'mtrl'

const addIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M12 5v14M5 12h14"/>
</svg>`

export const initSizes = (container) => {
  const title = 'Sizes'
  const description =
    'Small is 56dp with a 24dp icon and a title-medium label; medium is 80dp with a 28dp icon and title-large on the 20dp corner; large is 96dp with a 32dp icon and headline-small on the 28dp corner. Collapsed, each becomes the FAB of the same size.'
  const layout = createLayout(createComponentSection({ title, description }), container).component

  const rows = createLayout(
    [
      ['fabs', { class: 'fab-row' }],
      ['actions', { class: 'fab-row' }]
    ],
    layout.showcase
  ).component

  const fabs = ['small', 'medium', 'large'].map((size) => {
    const fab = createExtendedFab({ icon: addIcon, text: 'Compose', size, ariaLabel: `${size} compose` })
    rows.fabs.appendChild(fab.element)
    return fab
  })

  let collapsed = false
  const toggle = createButton({ text: 'Collapse all', variant: 'tonal' })
  toggle.on('click', () => {
    collapsed = !collapsed
    fabs.forEach((fab) => (collapsed ? fab.collapse() : fab.expand()))
    toggle.setText(collapsed ? 'Expand all' : 'Collapse all')
  })
  rows.actions.appendChild(toggle.element)
}
