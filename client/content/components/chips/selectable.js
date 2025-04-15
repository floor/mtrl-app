// src/client/content/components/chips/selectable.js
import { capitalize } from '../../../core/utils'
import { createComponentsSectionLayout } from '../../../layout'
import { createLayout, createChip } from 'mtrl'

/**
 * Initializes selectable chips section
 * @param {HTMLElement} container - Container element
 */
export const initSelectableChips = (container) => {
  const title = 'Selectable Chips'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component

  // Create a selection chips container
  const chipsContainer = document.createElement('div')
  chipsContainer.style.display = 'flex'
  chipsContainer.style.gap = '8px'
  layout.body.appendChild(chipsContainer)

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

      // // Update icon for filter chips
      // if (variant !== 'filter') {
      //     chip.toggleSelected()
      //     chip.setLeadingIcon('')
      //   }
      // }
    })

    chipsContainer.appendChild(chip.element)
  })
}
