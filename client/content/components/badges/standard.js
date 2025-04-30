// src/client/content/components/badges/standard.js

import {
  createComponentSection
} from '../../../layout'

import {
  createElement, createLayout, createBadge,
  BADGE_COLORS
} from 'mtrl'

export const initStandard = (container) => {
  const title = 'Standard Badges with Different Colors'
  const layout = createLayout(createComponentSection({ title }), container).component

  // Component showcase

  // Create badges with different colors
  const colors = Object.values(BADGE_COLORS)

  let count = 1

  colors.forEach(color => {
    createLayout([
      [{ class: 'showcase-wrapper' },
        [createBadge, {
          variant: 'large',
          label: count,
          color,
          standalone: true
        }],
        [{ tag: 'span', text: color, class: 'showcase-label' }]
      ]
    ], layout.showcase)

    count++
  })

  // Component context information and controls

  createLayout([
    [createElement, 'description', {
      tag: 'p',
      text: 'The basic search bar provides a simple search field with a leading search icon and clear button.'
    }],
    [createElement, 'searchContainer', { class: 'search-bar-container' }]
  ], layout.info)
}
