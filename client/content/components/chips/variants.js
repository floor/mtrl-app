// src/client/content/components/chips/variants.js
import { capitalize } from '../../../core/utils'
import { createComponentsSectionLayout } from '../../../layout'
import { fLayout, fChips } from 'mtrl'

/**
 * Initializes the chip variants section
 * @param {HTMLElement} container - Container element
 */
export const initChipVariants = (container) => {
  const title = 'Chip Variants'
  const layout = fLayout(createComponentsSectionLayout({ title }), container).component

  // List of all available variants
  const variants = [
    'filled', // Standard filled chip with solid background
    'outlined', // Outlined chip with transparent background and border
    'elevated', // Elevated chip with shadow
    'assist', // Assist chip for suggesting actions
    'filter', // Filter chip for filtering content
    'input', // Input chip for representing user input
    'suggestion' // Suggestion chip for presenting options
  ]

  variants.forEach(variant => {
    const text = capitalize(variant)
    const chip = fChips({
      text: `${text} Chip`,
      variant
    })

    console.log('')

    layout.body.appendChild(chip.element)
  })
}
