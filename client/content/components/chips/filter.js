// src/client/content/components/chips/filter.js
import { createComponentsSectionLayout } from '../../../layout'
import { fLayout, fChip, fButton } from 'mtrl'
import { checkIcon } from '../../../icons'

// Define prefix for CSS classes
const PREFIX = 'mtrl'

/**
 * Initializes filter chip set section
 * @param {HTMLElement} container - Container element
 */
export const initFilterChipSet = (container) => {
  const title = 'Filter Chip Set'
  const layout = fLayout(createComponentsSectionLayout({ title }), container).component

  // Example label
  const label = document.createElement('p')
  label.textContent = 'Filter by:'
  layout.body.appendChild(label)

  // Create the filter chip set container
  const filterSetContainer = document.createElement('div')
  filterSetContainer.className = `${PREFIX}-chip-set`
  filterSetContainer.style.display = 'flex'
  filterSetContainer.style.flexWrap = 'wrap'
  filterSetContainer.style.gap = '8px'
  layout.body.appendChild(filterSetContainer)

  // Filter chip configurations
  const filterChipConfigs = [
    { text: 'Paid', variant: 'filter', value: 'paid' },
    { text: 'Free', variant: 'filter', value: 'free' },
    { text: 'Trial', variant: 'filter', value: 'trial' },
    { text: 'Subscription', variant: 'filter', value: 'subscription' }
  ]

  // Create and add chips to the set
  const filterChips = []
  filterChipConfigs.forEach(config => {
    const chip = fChip(config)
    filterSetContainer.appendChild(chip.element)
    filterChips.push(chip)

    // Add click handler for selection with icon toggle using component API
    chip.on('click', () => {
      chip.toggleSelected()

      // Update the checkmark icon based on selection state
      if (chip.isSelected()) {
        chip.setLeadingIcon(checkIcon)
      } else {
        chip.setLeadingIcon('')
      }

      // Log the selected filters
      const selectedChips = filterChips.filter(c => c.isSelected())
      console.log('Filters applied:', selectedChips.map(c => c.getValue()))
    })
  })

  // Add a button to clear all filters
  const clearButton = fButton({
    text: 'Clear Filters',
    variant: 'text',
    size: 'small'
  })

  clearButton.element.addEventListener('click', () => {
    // Clear all chip selections
    filterChips.forEach(chip => {
      chip.setSelected(false)
      chip.setLeadingIcon('')
    })
  })

  // Add some spacing before the clear button
  layout.body.appendChild(clearButton.element)
}
