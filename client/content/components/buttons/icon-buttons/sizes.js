// src/client/content/components/buttons/icon-buttons/sizes.js

import { createIconButton } from 'mtrl'
import { createLayout } from 'mtrl-addons'
import { createComponentSection } from '../../../../layout'
import { settingsIcon } from '../../../../icons'

const sizes = ['xs', 's', 'm', 'l', 'xl']

export const initSizes = (container) => {
  const title = 'Sizes'
  const description =
    'Extra small to extra large: 32, 40, 56, 96 and 136dp containers with 20, 24, 24, 32 and 40dp icons. The two smallest keep a 48dp target.'
  const layout = createLayout(createComponentSection({ title, description }), container).component

  const rows = createLayout(
    [
      ['filled', { class: 'icon-buttons-row' }],
      ['tonal', { class: 'icon-buttons-row' }]
    ],
    layout.showcase
  ).component

  sizes.forEach((size) => {
    rows.filled.appendChild(
      createIconButton({ variant: 'filled', size, icon: settingsIcon, ariaLabel: `filled ${size}` }).element
    )
    rows.tonal.appendChild(
      createIconButton({ variant: 'tonal', size, toggle: true, icon: settingsIcon, ariaLabel: `tonal ${size}` }).element
    )
  })
}
