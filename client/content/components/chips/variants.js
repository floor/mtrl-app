// src/client/content/components/chips/variants.js
import { capitalize } from '../../../core/utils'
import { createComponentSection } from '../../../layout'
import { createChip } from 'mtrl'
import { createLayout } from 'mtrl-addons'

/**
 * Initializes the chip variants section
 * @param {HTMLElement} container - Container element
 */
export const initChipVariants = (container) => {
  const title = 'Chip Variants'
  const layout = createLayout(createComponentSection({ title }), container).component

  // List of all available variants
  const variants = ['filled', 'outlined', 'elevated', 'assist', 'filter', 'input', 'suggestion']

  variants.forEach(variant => {
    const text = capitalize(variant)
    const chip = createChip({
      text: `${text} Chip`,
      variant
    })

    layout.showcase.appendChild(chip.element)
  })
}
