// src/client/content/components/buttons/icon-buttons/widths.js

import { createIconButton } from 'mtrl'
import { createLayout } from 'mtrl-addons'
import { createComponentSection } from '../../../../layout'
import { settingsIcon } from '../../../../icons'

const sizes = ['xs', 's', 'm', 'l', 'xl']
const widths = ['narrow', 'default', 'wide']

export const initWidths = (container) => {
  const title = 'Widths'
  const description =
    'Narrow, default and wide containers at every size. The height and the icon stay the same; only the space either side of the icon changes.'
  const layout = createLayout(createComponentSection({ title, description }), container).component

  const rows = createLayout(
    widths.map((width) => [width, { class: 'icon-buttons-row' }]),
    layout.showcase
  ).component

  widths.forEach((width) => {
    sizes.forEach((size) => {
      rows[width].appendChild(
        createIconButton({ variant: 'outlined', size, width, icon: settingsIcon, ariaLabel: `${width} ${size}` }).element
      )
    })
  })
}
