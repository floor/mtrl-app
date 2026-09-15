// src/client/content/components/buttons/icon-buttons/shapes.js

import { createIconButton } from 'mtrl'
import { createLayout } from 'mtrl-addons'
import { createComponentSection } from '../../../../layout'
import { favoriteIcon, likeIcon } from '../../../../icons'

const sizes = ['xs', 's', 'm', 'l', 'xl']

export const initShapes = (container) => {
  const title = 'Shapes'
  const description =
    'Round and square resting shapes. Pressing rounds both to the same pressed radius for the size. A selected toggle takes the other resting shape: round becomes square, square becomes round.'
  const layout = createLayout(createComponentSection({ title, description }), container).component

  const rows = createLayout(
    [
      ['round', { class: 'icon-buttons-row' }],
      ['square', { class: 'icon-buttons-row' }]
    ],
    layout.showcase
  ).component

  sizes.forEach((size) => {
    rows.round.appendChild(
      createIconButton({ variant: 'tonal', size, shape: 'round', toggle: true, icon: favoriteIcon, selectedIcon: likeIcon, ariaLabel: `round ${size}` }).element
    )
    rows.square.appendChild(
      createIconButton({ variant: 'tonal', size, shape: 'square', toggle: true, icon: favoriteIcon, selectedIcon: likeIcon, ariaLabel: `square ${size}` }).element
    )
  })
}
