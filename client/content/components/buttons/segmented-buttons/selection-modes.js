// src/client/content/components/segmented-button/selection-modes.js
import {
  createComponentsSectionLayout
} from '../../../../layout'

import {
  createLayout,
  createButton
} from 'mtrl'

import {
  createSegmentedButton,
  SelectionMode
} from 'mtrl/src/components/segmented-button'

export const initSelectionModes = (container) => {
  const title = 'Selection Modes'
  const layout = createLayout(createComponentsSectionLayout({
    title,
    description: 'Segmented buttons support two selection modes: single-select and multi-select.',
    class: 'noflex'
  }), container).component

  // Single-select section
  const singleSelectTitle = document.createElement('h3')
  singleSelectTitle.textContent = 'Single-Select Mode'
  layout.showcase.appendChild(singleSelectTitle)

  const singleSelectDescription = document.createElement('p')
  singleSelectDescription.textContent = 'In single-select mode, only one segment can be selected at a time. This mode is ideal for switching between views or options that are mutually exclusive.'
  layout.showcase.appendChild(singleSelectDescription)

  // Result display panel for single-select
  const singleSelectResult = document.createElement('div')
  singleSelectResult.className = 'result-panel'
  singleSelectResult.style.padding = '12px'
  singleSelectResult.style.backgroundColor = '#f5f5f5'
  singleSelectResult.style.borderRadius = '4px'
  singleSelectResult.style.marginBottom = '20px'
  singleSelectResult.textContent = 'Selected view: List'
  layout.showcase.appendChild(singleSelectResult)

  // Single-select example
  const singleSelectButton = createSegmentedButton({
    mode: SelectionMode.SINGLE,
    segments: [
      { text: 'List', value: 'list', selected: true },
      { text: 'Grid', value: 'grid' },
      { text: 'Map', value: 'map' }
    ]
  })

  singleSelectButton.on('change', (event) => {
    const selectedValue = event.value[0]
    singleSelectResult.textContent = `Selected view: ${selectedValue.charAt(0).toUpperCase() + selectedValue.slice(1)}`
    log.info(`Single-select changed to: ${selectedValue}`)
  })

  const singleSelectContainer = document.createElement('div')
  singleSelectContainer.style.marginBottom = '40px'
  singleSelectContainer.appendChild(singleSelectButton.element)
  layout.showcase.appendChild(singleSelectContainer)

  // Info note about single-select behavior
  const singleSelectNote = document.createElement('p')
  singleSelectNote.innerHTML = '<strong>Note:</strong> In single-select mode, exactly one segment is always selected, and users cannot deselect all segments.'
  layout.showcase.appendChild(singleSelectNote)

  // Programmatic selection controls
  const singleSelectControls = document.createElement('div')
  singleSelectControls.style.display = 'flex'
  singleSelectControls.style.gap = '8px'
  singleSelectControls.style.marginBottom = '40px'

  const selectListBtn = createButton({
    text: 'Select List',
    variant: 'outlined'
  })
  selectListBtn.on('click', () => singleSelectButton.select('list'))

  const selectGridBtn = createButton({
    text: 'Select Grid',
    variant: 'outlined'
  })
  selectGridBtn.on('click', () => singleSelectButton.select('grid'))

  const selectMapBtn = createButton({
    text: 'Select Map',
    variant: 'outlined'
  })
  selectMapBtn.on('click', () => singleSelectButton.select('map'))

  singleSelectControls.appendChild(selectListBtn.element)
  singleSelectControls.appendChild(selectGridBtn.element)
  singleSelectControls.appendChild(selectMapBtn.element)
  layout.showcase.appendChild(singleSelectControls)

  // Multi-select section
  const multiSelectTitle = document.createElement('h3')
  multiSelectTitle.textContent = 'Multi-Select Mode'
  layout.showcase.appendChild(multiSelectTitle)

  const multiSelectDescription = document.createElement('p')
  multiSelectDescription.textContent = 'In multi-select mode, any number of segments can be selected, including none. This mode is suitable for filters or settings where multiple options can be applied simultaneously.'
  layout.showcase.appendChild(multiSelectDescription)

  // Result display panel for multi-select
  const multiSelectResult = document.createElement('div')
  multiSelectResult.className = 'result-panel'
  multiSelectResult.style.padding = '12px'
  multiSelectResult.style.backgroundColor = '#f5f5f5'
  multiSelectResult.style.borderRadius = '4px'
  multiSelectResult.style.marginBottom = '20px'
  multiSelectResult.textContent = 'Selected filters: None'
  layout.showcase.appendChild(multiSelectResult)

  // Multi-select example
  const multiSelectButton = createSegmentedButton({
    mode: SelectionMode.MULTI,
    segments: [
      { text: 'Breakfast', value: 'breakfast' },
      { text: 'Lunch', value: 'lunch' },
      { text: 'Dinner', value: 'dinner' },
      { text: 'Delivery', value: 'delivery' }
    ]
  })

  multiSelectButton.on('change', (event) => {
    const selectedValues = event.value
    if (selectedValues.length === 0) {
      multiSelectResult.textContent = 'Selected filters: None'
    } else {
      // Capitalize first letter of each value
      const formattedValues = selectedValues.map(v => v.charAt(0).toUpperCase() + v.slice(1))
      multiSelectResult.textContent = `Selected filters: ${formattedValues.join(', ')}`
    }
    log.info(`Multi-select changed: ${selectedValues.join(', ')}`)
  })

  const multiSelectContainer = document.createElement('div')
  multiSelectContainer.style.marginBottom = '20px'
  multiSelectContainer.appendChild(multiSelectButton.element)
  layout.showcase.appendChild(multiSelectContainer)

  // Info note about multi-select behavior
  const multiSelectNote = document.createElement('p')
  multiSelectNote.innerHTML = '<strong>Note:</strong> In multi-select mode, users can select multiple segments or deselect all segments.'
  layout.showcase.appendChild(multiSelectNote)

  // Programmatic selection controls for multi-select
  const multiSelectControls = document.createElement('div')
  multiSelectControls.style.display = 'flex'
  multiSelectControls.style.gap = '8px'
  multiSelectControls.style.marginBottom = '40px'
  multiSelectControls.style.flexWrap = 'wrap'

  const selectAllBtn = createButton({
    text: 'Select All',
    variant: 'outlined'
  })
  selectAllBtn.on('click', () => {
    multiSelectButton.segments.forEach(segment => {
      multiSelectButton.select(segment.value)
    })
  })

  const clearAllBtn = createButton({
    text: 'Clear All',
    variant: 'outlined'
  })
  clearAllBtn.on('click', () => {
    multiSelectButton.segments.forEach(segment => {
      multiSelectButton.deselect(segment.value)
    })
  })

  const toggleBreakfastBtn = createButton({
    text: 'Toggle Breakfast',
    variant: 'outlined'
  })
  toggleBreakfastBtn.on('click', () => {
    const breakfastSegment = multiSelectButton.segments.find(s => s.value === 'breakfast')
    if (breakfastSegment.isSelected()) {
      multiSelectButton.deselect('breakfast')
    } else {
      multiSelectButton.select('breakfast')
    }
  })

  multiSelectControls.appendChild(selectAllBtn.element)
  multiSelectControls.appendChild(clearAllBtn.element)
  multiSelectControls.appendChild(toggleBreakfastBtn.element)
  layout.showcase.appendChild(multiSelectControls)

  // Comparison section
  const comparisonTitle = document.createElement('h3')
  comparisonTitle.textContent = 'When to Use Each Mode'
  layout.showcase.appendChild(comparisonTitle)

  const comparisonTable = document.createElement('div')
  comparisonTable.style.display = 'flex'
  comparisonTable.style.marginBottom = '30px'

  // Single-select column
  const singleColumn = document.createElement('div')
  singleColumn.style.flex = '1'
  singleColumn.style.padding = '16px'
  singleColumn.style.backgroundColor = 'var(--mtrl-sys-color-surface-container)'
  singleColumn.style.borderRadius = '4px 0 0 4px'
  singleColumn.style.marginRight = '2px'

  const singleTitle = document.createElement('h4')
  singleTitle.textContent = 'Single-Select'
  singleTitle.style.marginTop = '0'
  singleColumn.appendChild(singleTitle)

  const singleList = document.createElement('ul')
  singleList.innerHTML = `
    <li>View switching (List/Grid/Map)</li>
    <li>Time period selection (Day/Week/Month)</li>
    <li>Mutually exclusive options</li>
    <li>Tab alternatives</li>
    <li>Sorting options</li>
  `
  singleColumn.appendChild(singleList)

  // Multi-select column
  const multiColumn = document.createElement('div')
  multiColumn.style.flex = '1'
  multiColumn.style.padding = '16px'
  multiColumn.style.backgroundColor = 'var(--mtrl-sys-color-surface-container)'
  multiColumn.style.borderRadius = '0 4px 4px 0'

  const multiTitle = document.createElement('h4')
  multiTitle.textContent = 'Multi-Select'
  multiTitle.style.marginTop = '0'
  multiColumn.appendChild(multiTitle)

  const multiList = document.createElement('ul')
  multiList.innerHTML = `
    <li>Filtering options</li>
    <li>Feature toggles</li>
    <li>Settings configuration</li>
    <li>Independent but related choices</li>
    <li>Checkbox alternatives</li>
  `
  multiColumn.appendChild(multiList)

  comparisonTable.appendChild(singleColumn)
  comparisonTable.appendChild(multiColumn)
  layout.showcase.appendChild(comparisonTable)
}
