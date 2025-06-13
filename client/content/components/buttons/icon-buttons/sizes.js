import {
  createComponentSection
} from '../../../../layout'

import {
  createLayout,
  createButton,
  BUTTON_SIZES,
  BUTTON_SHAPES
} from 'mtrl'

import { editIcon } from '../../../../icons'

export const createButtonSizes = (container) => {
  const title = 'Slider sizes'
  const layout = createLayout(
    createComponentSection({ title, class: 'noflex' }),
    container
  ).component

  const showcase = createLayout([
    { layout: { type: 'grid', column: 3, gap: 8 } },
    ['round', { layout: { type: 'stack', gap: 8, align: 'center' } }],
    ['square', { layout: { type: 'stack', gap: 8, align: 'center' } }],
    ['icon', { layout: { type: 'stack', gap: 8, align: 'center' } }]
  ], layout.showcase).component

  const sizes = Object.entries(BUTTON_SIZES).map(([label, size]) => ({
    label,
    size
  }))

  sizes.forEach(({ label, size }) => {
    createButton({
      text: `Button ${label}`,
      size,
      parent: showcase.round
    })
  })

  sizes.forEach(({ label, size }) => {
    createButton({
      text: `Button ${label}`,
      size,
      shape: BUTTON_SHAPES.SQUARE,
      parent: showcase.square
    })
  })

  sizes.forEach(({ label, size }) => {
    createButton({
      text: `Button ${label}`,
      size,
      icon: editIcon,
      parent: showcase.icon
    })
  })
}
