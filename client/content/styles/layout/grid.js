// src/examples/grid.js
import { createContentSection } from '../../../layout'
import {
  applyLayoutClasses,
  cleanupLayoutClasses
} from 'mtrl/src/core/layout'
import { fLayout, fElement, fChips } from 'mtrl'

/**
 * Creates a responsive grid layout demo
 *
 * @param {HTMLElement} container - Container element to append to
 * @returns {Object} The created layout
 */
export const createGridLayout = (container) => {
  // Create the content section with title and description
  const layout = fLayout(createContentSection({
    title: 'Grid Layout',
    description: 'CSS Grid-based layout with various configurations.',
    class: 'theme-colors'
  }), container)

  const body = layout.get('body')

  // Create grid layout using fLayout for structure with layout options
  const gridLayout = fLayout([
    // Create the grid container as root
    'gridContainer', {
      tag: 'div',
      class: 'layout-demo grid-layout',
      // Use layout configuration option instead of raw classes
      layout: {
        type: 'grid',
        columns: 3,
        gap: 'md'
      }
    }
  ], body)

  // Get grid container element
  const gridContainer = gridLayout.get('gridContainer')

  // Create a 3x3 grid of items
  for (let i = 1; i <= 9; i++) {
    const gridItem = fElement({
      tag: 'div',
      class: 'layout-demo__box',
      text: `${i}`
    })
    gridContainer.appendChild(gridItem)
  }

  // Create controls layout with chip set using fLayout
  const controlsLayout = fLayout([
    'controlsContainer', {
      tag: 'div',
      class: 'layout-demo__controls',
      // Use layout configuration
      layout: {
        type: 'row',
        justify: 'center',
        align: 'center'
      }
    },
    [
      // Add chip set inside the controls
      fChips, 'gridChipSet', {
        scrollable: false,
        multiSelect: false,
        class: 'grid-chip-set',
        label: 'Select Grid Layout',
        onChange: (values) => gridChangeHandler(values[0])
      }
    ]
  ], body)

  // Get chip set component
  const gridChipSet = controlsLayout.get('gridChipSet')

  // Define grid configuration options
  const gridOptions = [
    {
      text: '3-Column',
      value: 'cols-3',
      config: {
        type: 'grid',
        columns: 3,
        gap: 'md'
      }
    },
    {
      text: '2-Column',
      value: 'cols-2',
      config: {
        type: 'grid',
        columns: 2,
        gap: 'md'
      }
    },
    {
      text: 'Dense',
      value: 'dense',
      config: {
        type: 'grid',
        dense: true,
        gap: 'md'
      }
    },
    {
      text: 'Auto-fit',
      value: 'auto-fit',
      config: {
        type: 'grid',
        columns: 'auto-fit',
        gap: 'md'
      }
    }
  ]

  // Track current grid configuration
  let currentGrid = 'cols-3'

  /**
   * Handler for grid layout changes with proper class cleanup
   * @param {string} grid - Grid option value
   */
  const gridChangeHandler = (grid) => {
    if (!grid || grid === currentGrid) return

    // Find the selected configuration
    const option = gridOptions.find(opt => opt.value === grid)
    if (!option) return

    // First clean up any existing layout classes
    cleanupLayoutClasses(gridContainer)

    // Then apply the new layout configuration
    applyLayoutClasses(gridContainer, option.config, false) // false = don't clean up again

    // Update current grid tracking
    currentGrid = grid

    // For debugging - log the container classes after change
    console.log('Grid classes after change:', gridContainer.className)
  }

  // Add chips to the chip set
  gridOptions.forEach(option => {
    gridChipSet.addChip({
      text: option.text,
      value: option.value,
      variant: 'filter',
      selectable: true,
      selected: option.value === currentGrid
    })
  })

  // Move controls above grid container
  const controlsElement = controlsLayout.element
  body.insertBefore(controlsElement, gridContainer)

  return layout
}
