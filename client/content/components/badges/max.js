// src/client/content/components/badges/max.js

import {
  createComponentsSectionLayout
} from '../../../layout'

import {
  createLayout, createBadge,
  BADGE_VARIANTS
} from 'mtrl'

export const initMax = (container) => {
  const title = 'Badges with Maximum Value'
  const subtitle = 'badge truncation (max 4 characters, including "+")'
  const layout = createLayout(createComponentsSectionLayout({ title, subtitle }), container).component

  const badgeContainer = document.createElement('div')
  badgeContainer.style.display = 'flex'
  badgeContainer.style.gap = '32px'
  badgeContainer.style.marginBottom = '20px'
  badgeContainer.style.flexWrap = 'wrap'

  // Create badges with different content and max values
  const examples = [
    { label: 5, max: 99, description: 'Under max (5/99)' },
    { label: 99, max: 99, description: 'At max (99/99)' },
    { label: 100, max: 99, description: 'Over max (100/99) → 99+' },
    { label: 1000, max: 999, description: 'Over max (1000/999) → 999+' }
  ]

  examples.forEach(example => {
    const wrapper = document.createElement('div')
    wrapper.style.position = 'relative'
    wrapper.style.display = 'flex'
    wrapper.style.flexDirection = 'column'
    wrapper.style.alignItems = 'center'
    wrapper.style.gap = '8px'

    const badge = createBadge({
      variant: BADGE_VARIANTS.LARGE,
      label: example.label,
      max: example.max,
      standalone: true
    })

    const label = document.createElement('span')
    label.textContent = example.description
    label.style.fontSize = '12px'
    label.style.textAlign = 'center'
    label.style.marginTop = '20px'

    wrapper.appendChild(badge.element)
    wrapper.appendChild(label)
    badgeContainer.appendChild(wrapper)
  })

  // Add examples of string truncation for large character counts
  const stringTitle = document.createElement('h4')
  stringTitle.textContent = 'Character Count Limitation (max 4 characters)'
  stringTitle.style.marginTop = '32px'
  stringTitle.style.marginBottom = '16px'
  stringTitle.style.width = '100%'
  badgeContainer.appendChild(stringTitle)

  const stringExamples = [
    { label: '1', description: 'Single character' },
    { label: '42', description: 'Two characters' },
    { label: '999', description: 'Three characters' },
    { label: '1234', description: 'Max four characters' },
    { label: '12345', description: 'Five characters (truncated)' }
  ]

  stringExamples.forEach(example => {
    const wrapper = document.createElement('div')
    wrapper.style.position = 'relative'
    wrapper.style.display = 'flex'
    wrapper.style.flexDirection = 'column'
    wrapper.style.alignItems = 'center'
    wrapper.style.gap = '8px'

    const badge = createBadge({
      variant: BADGE_VARIANTS.LARGE,
      label: example.label,
      standalone: true
    })

    const label = document.createElement('span')
    label.textContent = example.description
    label.style.fontSize = '12px'
    label.style.textAlign = 'center'
    label.style.marginTop = '20px'

    wrapper.appendChild(badge.element)
    wrapper.appendChild(label)
    badgeContainer.appendChild(wrapper)
  })

  layout.showcase.appendChild(badgeContainer)
}
