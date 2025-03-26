// src/client/content/components/button/variants.js

import { capitalize } from '../../../../core/utils'

import {
  createComponentsSectionStructure
} from '../../../../structure'

import {
  createStructure,
  createButton
} from 'mtrl'

export const initVariants = (container) => {
  const title = 'Buttons Variants'
  const structure = createStructure(createComponentsSectionStructure({ title }), container).component

  const variants = ['filled', 'tonal', 'elevated', 'outlined', 'text']
  variants.forEach(variant => {
    const text = capitalize(variant)
    const btn = createButton({
      text: `${text} button`,
      variant,
      ripple: true
    })
    // btn.element.addEventListener('click', () => log.info('native button clicked'))
    // btn.on('click', () => log.info('component button clicked'))
    structure.showcase.appendChild(btn.element)
  })
}
