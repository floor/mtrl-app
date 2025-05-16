// src/client/content/components/chips/selectable.js
import { capitalize } from '../../../core/utils'
import { createComponentSection } from '../../../layout'
import { createLayout, createChip } from 'mtrl'

/**
 * Initializes selectable chips section
 * @param {HTMLElement} container - Container element
 */
export const initSelectableChips = (container) => {
  const title = 'Selectable Chips'
  const description = 'Create independant selectable chips (without chipset)'
  const layout = createLayout(createComponentSection({ title, description }), container).component

  // Create a selection chips container

  // Create selectable chips with different variants
  const selectableVariants = [
    'filled',
    'outlined',
    'filter'
  ]

  selectableVariants.forEach(variant => {
    const chip = createChip({
      text: capitalize(variant),
      variant,
      selectable: true,
      selected: variant === 'filter' // Pre-select the filter variant
    })

    // Add click handler to toggle selection using component API
    chip.on('click', () => {
      console.log('variant', variant)
      console.log('selected', variant === 'filter')
    })

    layout.showcase.appendChild(chip.element)
  })
}
