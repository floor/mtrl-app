// src/client/content/components/badges/dot.js

import {
  createComponentSection
} from '../../../layout'

import {
  createBadge,
  BADGE_VARIANTS, BADGE_COLORS
} from 'mtrl'
import { createLayout } from 'mtrl-addons'

export const initDot = (container) => {
  const title = 'Small Dot Badges'
  const layout = createLayout(createComponentSection({ title }), container).component

  const badgeContainer = document.createElement('div')
  badgeContainer.style.display = 'flex'
  badgeContainer.style.gap = '24px'
  badgeContainer.style.marginBottom = '20px'

  // Create dot badges with different colors
  const colors = Object.values(BADGE_COLORS)

  colors.forEach(color => {
    const wrapper = document.createElement('div')
    wrapper.style.position = 'relative'
    wrapper.style.display = 'flex'
    wrapper.style.flexDirection = 'column'
    wrapper.style.alignItems = 'center'
    wrapper.style.gap = '8px'

    const badge = createBadge({
      variant: BADGE_VARIANTS.SMALL,
      color,
      standalone: true
    })

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
