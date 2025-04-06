// src/client/content/components/chips/chipset.js
import { createComponentsSectionLayout } from '../../../layout'
import { fLayout, fChip } from 'mtrl'

// Define prefix for CSS classes
const PREFIX = 'mtrl'

/**
 * Initializes chip set section
 * @param {HTMLElement} container - Container element
 */
export const initChipSet = (container) => {
  const title = 'Chip Set'
  const subtitle = 'Scrollable horizontal chip set'

  const layout = fLayout(createComponentsSectionLayout({
    title,
    subtitle
  }), container).component

  // Define chips with unique values
  const chipConfigs = [
    { text: 'TypeScript', variant: 'filled', value: 'ts' },
    { text: 'SCSS', variant: 'filled', value: 'css' },
    { text: 'Bun', variant: 'filled', value: 'bun' }
  ]

  // Create a scrollable chip set container
  const chipSetContainer = document.createElement('div')
  chipSetContainer.className = `${PREFIX}-chip-set ${PREFIX}-chip-set--scrollable`
  chipSetContainer.style.display = 'flex'
  chipSetContainer.style.flexWrap = 'nowrap'
  chipSetContainer.style.overflowX = 'auto'
  chipSetContainer.style.gap = '8px'
  chipSetContainer.style.paddingBottom = '8px'
  chipSetContainer.style.marginBottom = '-8px'
  chipSetContainer.style.WebkitOverflowScrolling = 'touch'

  // Add chips to the set
  const chipInstances = []
  chipConfigs.forEach(config => {
    const chip = fChip(config)
    chipSetContainer.appendChild(chip.element)
    chipInstances.push(chip)

    // Add click handler for selection using component API
    chip.on('click', () => {
      chip.toggleSelected()
      // Log the selected values
      const selectedChips = chipInstances.filter(c => c.isSelected())
      console.log('Selected technologies:', selectedChips.map(c => c.getValue()))
    })
  })

  layout.body.appendChild(chipSetContainer)

  // Add a vertical chip set example
  const verticalTitle = document.createElement('p')
  verticalTitle.textContent = 'Vertical chip set'
  verticalTitle.style.marginTop = '24px'
  verticalTitle.style.marginBottom = '8px'
  layout.body.appendChild(verticalTitle)

  // Create a vertical chip set container
  const verticalChipSetContainer = document.createElement('div')
  verticalChipSetContainer.className = `${PREFIX}-chip-set ${PREFIX}-chip-set--vertical`
  verticalChipSetContainer.style.display = 'flex'
  verticalChipSetContainer.style.flexDirection = 'column'
  verticalChipSetContainer.style.alignItems = 'flex-start'
  verticalChipSetContainer.style.gap = '8px'

  // Add vertical chips
  const verticalChipConfigs = [
    { text: 'Option 1', variant: 'outlined', value: '1' },
    { text: 'Option 2', variant: 'outlined', value: '2' },
    { text: 'Option 3', variant: 'outlined', value: '3' }
  ]

  verticalChipConfigs.forEach(config => {
    const chip = fChip(config)
    verticalChipSetContainer.appendChild(chip.element)
  })

  layout.body.appendChild(verticalChipSetContainer)
}
