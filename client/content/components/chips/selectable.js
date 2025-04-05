// src/client/content/components/chips/selectable.js
import { capitalize } from '../../../core/utils'
import { createComponentsSectionLayout } from '../../../layout'
import { createLayout, fChip } from 'mtrl'
import { iconCheck } from '../../../icons'

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
    const chip = fChip({
      text: capitalize(variant),
      variant,
      selected: variant === 'filter', // Pre-select the filter variant
      leadingIcon: variant === 'filter' ? iconCheck : null
    })

    // Add click handler to toggle selection using component API
    chip.on('click', () => {
      chip.toggleSelected()

      // Update icon for filter chips
      if (variant === 'filter') {
        if (chip.isSelected()) {
          chip.setLeadingIcon(iconCheck)
        } else {
          chip.setLeadingIcon('')
        }
      }
    })

    chipsContainer.appendChild(chip.element)
  })
}
