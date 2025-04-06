// src/client/content/components/badges/outlined.js

import {
  createComponentsSectionLayout
} from '../../../layout'

import {
  fLayout,
  fBadge
} from 'mtrl'

import {
  BADGE_VARIANTS,
  BADGE_COLORS
} from 'mtrl/src/components/badge'

export const initOutlined = (container) => {
  const title = 'Outlined Badges'
  const layout = fLayout(createComponentsSectionLayout({ title }), container).component

  const badgeContainer = document.createElement('div')
  badgeContainer.style.display = 'flex'
  badgeContainer.style.gap = '24px'
  badgeContainer.style.marginBottom = '20px'

  // Create outlined badges with different colors
  const colors = Object.values(BADGE_COLORS)

  colors.forEach(color => {
    const wrapper = document.createElement('div')
    wrapper.style.position = 'relative'
    wrapper.style.display = 'flex'
    wrapper.style.flexDirection = 'column'
    wrapper.style.alignItems = 'center'
    wrapper.style.gap = '8px'

    const badge = fBadge({
      content: '1',
      variant: BADGE_VARIANTS.OUTLINED,
      color,
      standalone: true
    })

    const label = document.createElement('span')
    label.textContent = color
    label.style.fontSize = '12px'

    wrapper.appendChild(badge.element)
    wrapper.appendChild(label)
    badgeContainer.appendChild(wrapper)
  })

  layout.body.appendChild(badgeContainer)
}
