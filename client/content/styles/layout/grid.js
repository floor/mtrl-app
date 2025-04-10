import {
  createContentSection
} from '../../../layout'

import {
  fLayout,
  fChips,
  createElement,
  addClass, removeClass
} from 'mtrl'

export const createGridLayout = (container) => {
  console.log('createGridLayout', container)
  const layout = fLayout(createContentSection({
    title: 'Grid Layout',
    description: 'CSS Grid-based layout with various configurations.',
    class: 'theme-colors'
  }), container).getAll()

  const body = layout.body

  const gridContainer = createElement({
    class: 'layout-demo grid-layout'
  })

  // Create a 3x3 grid
  for (let i = 1; i <= 9; i++) {
    const gridItem = createElement({
      tag: 'div',
      class: 'layout-demo__grid-item',
      text: `${i}`
    })
    gridContainer.appendChild(gridItem)
  }

  // Create layout with containers for controls and grid demo
  const mainLayout = fLayout([
    ['controlsContainer', { class: 'layout-demo__controls' },
      [fChips, 'gridChipSet', {
        scrollable: false,
        multiSelect: false,
        class: 'grid-chip-set',
        label: 'Select Grid Layout',
        onChange: (values) => {
          gridChangeHandler(values[0])
        }
      }]
    ]
  ], body)

  // Extract chip set component
  const { gridChipSet } = mainLayout.component

  // Define grid options using the new layout system class naming
  const gridOptions = [
    { text: '3-Column', value: 'layout--grid-cols-3' },
    { text: '2-Column', value: 'layout--grid-cols-2' },
    { text: 'Dense', value: 'layout--grid-dense' },
    { text: 'Auto-fit', value: 'layout--grid' } // Default auto-fit behavior
  ]

  // Current grid layout tracking
  let currentGrid = 'layout--grid-cols-3'

  const gridChangeHandler = (grid) => {
    if (!grid) return

    // Prevent update if grid layout hasn't changed
    if (grid !== currentGrid) {
      // Remove existing grid classes
      removeClass(gridContainer, 'layout--grid-cols-3 layout--grid-cols-2 layout--grid-dense layout--grid')
      // Add the selected grid class
      addClass(gridContainer, grid)
      // For auto-fit, we need to add the base grid class if it's not already there
      if (grid === 'layout--grid' && !gridContainer.classList.contains('layout--grid')) {
        addClass(gridContainer, 'layout--grid')
      }
      // Update current grid layout
      currentGrid = grid
    }
  }

  // Add chips to chip set
  gridOptions.forEach(option => {
    gridChipSet.addChip({
      text: option.text,
      value: option.value,
      variant: 'filter',
      selectable: true,
      selected: option.value === currentGrid
    })
  })

  // Default to 3-column grid using the new class name
  addClass(gridContainer, 'layout--grid-cols-3')

  // Add the grid container after the controls
  body.appendChild(gridContainer)
}
