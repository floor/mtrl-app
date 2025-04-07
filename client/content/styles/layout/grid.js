import {
  createContentSection
} from '../../../layout'

import {
  fLayout,
  fChips,
  fChip,
  createElement
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

  // Define grid options
  const gridOptions = [
    { text: '3-Column', value: 'columns-3' },
    { text: '2-Column', value: 'columns-2' },
    { text: 'Dense', value: 'dense' },
    { text: 'Auto-fit', value: 'auto-fit' }
  ]

  // Current grid layout tracking
  let currentGrid = 'columns-3'

  const gridChangeHandler = (grid) => {
    if (!grid) return

    // Prevent update if grid layout hasn't changed
    if (grid !== currentGrid) {
      // Remove existing grid classes
      gridContainer.classList.remove('columns-3', 'columns-2', 'dense', 'auto-fit')
      // Add the selected grid class
      gridContainer.classList.add(grid)
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

  // Default to 3-column grid
  gridContainer.classList.add('columns-3')

  // Add the grid container after the controls
  body.appendChild(gridContainer)
}
