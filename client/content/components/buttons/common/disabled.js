// src/client/content/components/button/disabled.js

import { capitalize } from '../../../../core/utils'

import {
  createComponentsSectionStructure
} from '../../../../structure'

import {
  createLayout,
  createButton
} from 'mtrl'

export const initDisabled = (container) => {
  const title = 'Buttons Disabled'
  const structure = createLayout(createComponentsSectionStructure({ title }), container).component

  const variants = ['filled', 'tonal', 'elevated', 'outlined', 'text']
  variants.forEach(variant => {
    const text = capitalize(variant)
    const btn = createButton({
      text: `${text} Button`,
      variant,
      disabled: true
    })
    // btn.on('click', () => components.logEvent(`${variant} button clicked`))
    structure.showcase.appendChild(btn.element)
  })
}
