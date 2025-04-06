// src/client/content/components/badges/standard.js

import {
  createComponentsSectionLayout
} from '../../../layout'

import {
  fLayout,
  fBadge
} from 'mtrl'

import {
  BADGE_COLORS,
  BADGE_VARIANTS
} from 'mtrl/src/components/badge'

export const initStandard = (container) => {
  const title = 'Standard Badges with Different Colors'
  const layout = fLayout(createComponentsSectionLayout({ title }), container).component

  const badgeContainer = document.createElement('div')
  badgeContainer.style.display = 'flex'
  badgeContainer.style.gap = '24px'
  badgeContainer.style.marginBottom = '20px'

  // Create badges with different colors
  const colors = Object.values(BADGE_COLORS)

  let count = 1

  colors.forEach(color => {
    const wrapper = document.createElement('div')
    wrapper.style.position = 'relative'
    wrapper.style.display = 'flex'
    wrapper.style.flexDirection = 'column'
    wrapper.style.alignItems = 'center'
    wrapper.style.gap = '8px'

    const badge = fBadge({
      variant: BADGE_VARIANTS.LARGE,
      label: count,
      color,
      standalone: true
    })

    count++

    const label = document.createElement('span')
    label.textContent = color
    label.style.fontSize = '12px'
    label.style.marginTop = '20px'

    wrapper.appendChild(badge.element)
    wrapper.appendChild(label)
    badgeContainer.appendChild(wrapper)
  })

  layout.showcase.appendChild(badgeContainer)
}
