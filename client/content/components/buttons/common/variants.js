// src/client/content/components/button/variants.js

import { capitalize } from '../../../../core/utils'

import {
  createComponentSection
} from '../../../../layout'

import {
  createLayout,
  createButton,
  BUTTON_SHAPES
} from 'mtrl'

export const initVariants = (container) => {
  const title = 'Buttons Variants'
  const layout = createLayout(createComponentSection({ title }), container).component

  const showcase = createLayout([
    { layout: { type: 'stack', gap: 8 } },
    ['round', { layout: { type: 'row', gap: 8, columns: 5, align: 'center' } }],
    ['square', { layout: { type: 'row', gap: 8, columns: 5, align: 'center' } }]
  ], layout.showcase).component

  const variants = ['filled', 'tonal', 'elevated', 'outlined', 'text']

  variants.forEach(variant => {
    const text = capitalize(variant)
    const button = createButton({
      text: `${text} button`,
      variant,
      ripple: true,
      parent: showcase.round
    })
    // btn.element.addEventListener('click', () => log.info('native button clicked'))
    // btn.on('click', () => log.info('component button clicked'))
  })

  variants.forEach(variant => {
    const text = capitalize(variant)
    const button = createButton({
      text: `${text} button`,
      variant,
      ripple: true,
      shape: BUTTON_SHAPES.SQUARE,
      parent: showcase.square
    })
    // btn.element.addEventListener('click', () => log.info('native button clicked'))
    // btn.on('click', () => log.info('component button clicked'))
  })
}
