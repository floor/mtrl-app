// src/examples/responsive.js
import { createContentSection } from '../../../layout'
import {
  applyLayoutClasses,
  cleanupLayoutClasses
} from 'mtrl/src/core/layout'
import { createLayout, createChips } from 'mtrl'

/**
 * Creates a responsive layout demo that adapts to different screen sizes
 *
 * @param {HTMLElement} container - Container element to append to
 * @returns {Object} The created layout
 */
export const createResponsiveLayout = (container) => {
  // Create the content section with title and description
  const sectionLayout = createLayout(createContentSection({
    title: 'Responsive Layout',
    description: 'Layout that adapts to different screen sizes. Use the chips to toggle between different layouts.',
    class: 'theme-colors'
  }), container)

  const body = sectionLayout.get('body')

  // Create controls layout with createLayout and layout option
  const controlsLayout = createLayout([
    'controlsContainer', {
      tag: 'div',
      class: 'layout-demo__controls',
      // Use layout configuration option
      layout: { type: 'row', justify: 'center', align: 'center' }
    },
    [createChips, 'layoutType', {
      scrollable: false,
      multiSelect: false,
      label: 'Layout Type',
      onChange: (values) => layoutChangeHandler(values[0])
    }],
    [createChips, 'layoutChipSet2', {
      scrollable: false,
      multiSelect: false,
      label: 'Layout Gap',
      onChange: (values) => layoutChangeHandler(values[0])
    }]
  ], body)

  // Get chip set component
  const layoutType = controlsLayout.get('layoutType')

  // Create responsive container using createLayout with layout option
  const responsiveLayout = createLayout([
    'responsiveContainer', {
      tag: 'div',
      class: 'layout-demo responsive-layout',
      // Use layout configuration instead of raw classes
      layout: { type: 'stack', gap: 'md' }
    }
  ], body)

  // Get responsive container element
  const responsiveContainer = responsiveLayout.get('responsiveContainer')

  // Create example content boxes
  for (let i = 1; i <= 10; i++) {
    // Create box with createLayout
    createLayout([
      `box${i}`, {
        tag: 'div',
        class: 'layout-demo__box',
        text: `Item ${i}`
      }
    ], responsiveContainer)
  }

  // Define layout options with configuration objects
  const layoutOptions = [
    {
      text: 'Stack',
      value: 'stack',
      config: { type: 'stack', gap: 'md', align: 'stretch' }
    },
    {
      text: 'Row',
      value: 'row',
      config: { type: 'row', gap: 'md', mobileStack: true, justify: 'between' }
    },
    {
      text: 'Grid 2 Cols',
      value: 'grid-2',
      config: { type: 'grid', columns: 2, gap: 'md' }
    },
    {
      text: 'Grid 3 Cols',
      value: 'grid-3',
      config: { type: 'grid', columns: 3, gap: 'md' }
    },
    {
      text: 'Grid 4 Cols',
      value: 'grid-4',
      config: { type: 'grid', columns: 4, gap: 'md' }
    }
  ]

  // Track current layout
  let currentLayout = 'stack'

  /**
   * Handler for layout changes with proper class cleanup
   * @param {string} layout - Layout option value
   */
  const layoutChangeHandler = (layout) => {
    console.log('layoutChangeHandler', layout)
    if (!layout || layout === currentLayout) return

    // Find the selected configuration
    const option = layoutOptions.find(opt => opt.value === layout)
    if (!option) return
    cleanupLayoutClasses(responsiveContainer)
    applyLayoutClasses(responsiveContainer, option.config, false) // false = don't clean up again
    currentLayout = layout
  }

  // Add chips to the chip set
  layoutOptions.forEach(option => {
    layoutType.addChip({
      text: option.text,
      value: option.value,
      variant: 'filter',
      selectable: true,
      selected: option.value === currentLayout
    })
  })

  return sectionLayout
}
