// src/client/content/components/badges/positions.js

import {
  createComponentsSectionLayout
} from '../../../config'

import {
  createLayout,
  createBadge
} from 'mtrl'

import {
  BADGE_POSITIONS,
  BADGE_VARIANTS
} from 'mtrl/src/components/badge'

export const initPositions = (container) => {
  const title = 'Badge Positions'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component

  const badgeContainer = document.createElement('div')
  badgeContainer.style.display = 'flex'
  badgeContainer.style.gap = '48px'
  badgeContainer.style.marginBottom = '20px'
  badgeContainer.style.flexWrap = 'wrap'

  // Add section subtitle for large badges
  const largeTitle = document.createElement('h4')
  largeTitle.textContent = 'Large Badge Positions'
  largeTitle.style.marginBottom = '16px'
  largeTitle.style.width = '100%'
  badgeContainer.appendChild(largeTitle)

  // Create badges with different positions
  const positions = Object.values(BADGE_POSITIONS)

  positions.forEach(position => {
    const wrapper = document.createElement('div')
    wrapper.style.display = 'flex'
    wrapper.style.flexDirection = 'column'
    wrapper.style.alignItems = 'center'
    wrapper.style.gap = '20px'

    // Create a box to attach the badge to
    const box = document.createElement('div')
    box.style.width = '64px'
    box.style.height = '64px'
    box.style.backgroundColor = '#e0e0e0'
    box.style.borderRadius = '4px'
    box.style.position = 'relative'

    // First add the box to our wrapper
    wrapper.appendChild(box)

    // Then create badge attached to the box
    const badge = createBadge({
      variant: BADGE_VARIANTS.LARGE,
      label: '8',
      position,
      target: box
    })

    const label = document.createElement('span')
    label.textContent = position
    label.style.fontSize = '12px'
    label.style.textAlign = 'center'

    wrapper.appendChild(label)
    badgeContainer.appendChild(wrapper)
  })

  // Add section for small badges
  const smallTitle = document.createElement('h4')
  smallTitle.textContent = 'Small Badge Positions'
  smallTitle.style.marginTop = '32px'
  smallTitle.style.marginBottom = '16px'
  smallTitle.style.width = '100%'
  badgeContainer.appendChild(smallTitle)

  // Create small badges with different positions
  positions.forEach(position => {
    const wrapper = document.createElement('div')
    wrapper.style.display = 'flex'
    wrapper.style.flexDirection = 'column'
    wrapper.style.alignItems = 'center'
    wrapper.style.gap = '20px'

    // Create a box to attach the badge to
    const box = document.createElement('div')
    box.style.width = '64px'
    box.style.height = '64px'
    box.style.backgroundColor = '#e0e0e0'
    box.style.borderRadius = '4px'
    box.style.position = 'relative'

    // First add the box to our wrapper
    wrapper.appendChild(box)

    // Then create badge attached to the box
    const badge = createBadge({
      variant: BADGE_VARIANTS.SMALL,
      position,
      target: box
    })

    const label = document.createElement('span')
    label.textContent = position
    label.style.fontSize = '12px'
    label.style.textAlign = 'center'

    wrapper.appendChild(label)
    badgeContainer.appendChild(wrapper)
  })

  layout.body.appendChild(badgeContainer)
}
