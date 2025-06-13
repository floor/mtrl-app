// src/client/content/components/button/disabled.js

import { capitalize } from '../../../../core/utils'

import {
  createComponentSection
} from '../../../../layout'

import {
  createLayout,
  createButton,
  BUTTON_SHAPES
} from 'mtrl'

export const initDisabled = (container) => {
  const title = 'Buttons Disabled'
  const layout = createLayout(createComponentSection({ title }), container).component

  const showcase = createLayout([
    { layout: { type: 'stack', gap: 8 } },
    ['round', { layout: { type: 'row', gap: 8, columns: 5, align: 'center' } }],
    ['square', { layout: { type: 'row', gap: 8, columns: 5, align: 'center' } }]
  ], layout.showcase).component

  const variants = ['filled', 'tonal', 'elevated', 'outlined', 'text']

  variants.forEach(variant => {
    const text = capitalize(variant)
    createButton({
      text: `${text} Button`,
      variant,
      disabled: true,
      parent: showcase.round
    })
  })

  variants.forEach(variant => {
    const text = capitalize(variant)
    createButton({
      text: `${text} Button`,
      variant,
      disabled: true,
      shape: BUTTON_SHAPES.SQUARE,
      parent: showcase.square
    })
  })
}
