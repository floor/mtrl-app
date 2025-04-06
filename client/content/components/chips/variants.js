// src/client/content/components/chips/variants.js
import { capitalize } from '../../../core/utils'
import { createComponentsSectionLayout } from '../../../layout'
import { fLayout, fChip } from 'mtrl'

/**
 * Initializes the chip variants section
 * @param {HTMLElement} container - Container element
 */
export const initChipVariants = (container) => {
  const title = 'Chip Variants'
  const layout = fLayout(createComponentsSectionLayout({ title }), container).component

  // List of all available variants
  const variants = ['filled', 'outlined', 'elevated', 'assist', 'filter', 'input', 'suggestion']

  variants.forEach(variant => {
    const text = capitalize(variant)
    const chip = fChip({
      text: `${text} Chip`,
      variant
    })

    layout.body.appendChild(chip.element)
  })
}
