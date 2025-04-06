// src/client/content/components/segmented-button/interaction.js
import {
  createComponentsSectionLayout
} from '../../../../layout'

import {
  fLayout,
  fButton
} from 'mtrl'

import {
  createSegmentedButton,
  SelectionMode
} from 'mtrl/src/components/segmented-button'

// The check icon for selected state visualization
const checkIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <polyline points="20 6 9 17 4 12"></polyline>
</svg>`

// Category icons
const categoryIcons = {
  food: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
    <line x1="6" y1="1" x2="6" y2="4"></line>
    <line x1="10" y1="1" x2="10" y2="4"></line>
    <line x1="14" y1="1" x2="14" y2="4"></line>
  </svg>`,

  shopping: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <path d="M16 10a4 4 0 0 1-8 0"></path>
  </svg>`,

  entertainment: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
  </svg>`
}

export const initInteraction = (container) => {
  const title = 'Interactive Behavior'
  const layout = fLayout(createComponentsSectionLayout({
    title,
    description: 'Demonstrates the interactive behaviors and events of segmented buttons.',
    class: 'noflex'
  }), container).component

  // Event handling section
  const eventsTitle = document.createElement('h3')
  eventsTitle.textContent = 'Event Handling'
  layout.showcase.appendChild(eventsTitle)

  const eventsDescription = document.createElement('p')
  eventsDescription.textContent = 'Segmented buttons emit change events when segments are selected or deselected. Event data includes the selected segments and their values.'
  layout.showcase.appendChild(eventsDescription)

  // Result display panel
  const eventResult = document.createElement('div')
  eventResult.className = 'result-panel'
  eventResult.style.padding = '12px'
  eventResult.style.backgroundColor = '#f5f5f5'
  eventResult.style.borderRadius = '4px'
  eventResult.style.marginBottom = '20px'
  eventResult.style.fontFamily = 'monospace'
  eventResult.textContent = 'Event log: Select a segment'
  layout.showcase.appendChild(eventResult)

  // Single-select event example
  const singleSelectEventButton = createSegmentedButton({
    mode: SelectionMode.SINGLE,
    segments: [
      { text: 'Option A', value: 'a' },
      { text: 'Option B', value: 'b', selected: true },
      { text: 'Option C', value: 'c' }
    ]
  })

  // Event handler for logging
  singleSelectEventButton.on('change', (event) => {
    const timestamp = new Date().toLocaleTimeString()
    eventResult.textContent = `Event log: ${timestamp} - Single-select changed to: ${event.value[0]} (previous: ${event.oldValue.join(', ')})`
    log.info(`Single-select changed to: ${event.value[0]}`, event)
  })

  const singleSelectEventContainer = document.createElement('div')
  singleSelectEventContainer.style.marginBottom = '24px'
  singleSelectEventContainer.appendChild(singleSelectEventButton.element)
  layout.showcase.appendChild(singleSelectEventContainer)

  // Multi-select event example
  const multiSelectEventButton = createSegmentedButton({
    mode: SelectionMode.MULTI,
    segments: [
      { text: 'Filter 1', value: 'filter1' },
      { text: 'Filter 2', value: 'filter2' },
      { text: 'Filter 3', value: 'filter3' }
    ]
  })

  // Event handler for logging
  multiSelectEventButton.on('change', (event) => {
    const timestamp = new Date().toLocaleTimeString()
    eventResult.textContent = `Event log: ${timestamp} - Multi-select changed to: ${event.value.join(', ')} (previous: ${event.oldValue.join(', ')})`
    log.info(`Multi-select changed to: ${event.value.join(', ')}`, event)
  })

  const multiSelectEventContainer = document.createElement('div')
  multiSelectEventContainer.style.marginBottom = '32px'
  multiSelectEventContainer.appendChild(multiSelectEventButton.element)
  layout.showcase.appendChild(multiSelectEventContainer)

  // Programmatic control section
  const programmaticTitle = document.createElement('h3')
  programmaticTitle.textContent = 'Programmatic Control'
  layout.showcase.appendChild(programmaticTitle)

  const programmaticDescription = document.createElement('p')
  programmaticDescription.textContent = 'Segmented buttons can be controlled programmatically using select() and deselect() methods.'
  layout.showcase.appendChild(programmaticDescription)

  // Create a demo segmented button
  const programmaticButton = createSegmentedButton({
    mode: SelectionMode.MULTI,
    segments: [
      { text: 'Food & Dining', icon: categoryIcons.food, value: 'food' },
      { text: 'Shopping', icon: categoryIcons.shopping, value: 'shopping' },
      { text: 'Entertainment', icon: categoryIcons.entertainment, value: 'entertainment' }
    ]
  })

  // Display for current selection
  const programmaticResult = document.createElement('div')
  programmaticResult.className = 'result-panel'
  programmaticResult.style.padding = '12px'
  programmaticResult.style.backgroundColor = '#f5f5f5'
  programmaticResult.style.borderRadius = '4px'
  programmaticResult.style.marginBottom = '20px'
  programmaticResult.textContent = 'Current selection: None'
  layout.showcase.appendChild(programmaticResult)

  // Container for the segmented button
  const programmaticSegmentedContainer = document.createElement('div')
  programmaticSegmentedContainer.style.marginBottom = '20px'
  programmaticSegmentedContainer.appendChild(programmaticButton.element)
  layout.showcase.appendChild(programmaticSegmentedContainer)

  // Update result display on change
  programmaticButton.on('change', (event) => {
    const selectedValues = event.value
    if (selectedValues.length === 0) {
      programmaticResult.textContent = 'Current selection: None'
    } else {
      // Capitalize each value
      const formattedValues = selectedValues.map(v =>
        v.charAt(0).toUpperCase() + v.slice(1)
      )
      programmaticResult.textContent = `Current selection: ${formattedValues.join(', ')}`
    }
  })

  // Control buttons
  const controlsContainer = document.createElement('div')
  controlsContainer.style.display = 'flex'
  controlsContainer.style.gap = '8px'
  controlsContainer.style.marginBottom = '16px'
  controlsContainer.style.flexWrap = 'wrap'

  // Select Food button
  const selectFoodBtn = fButton({
    text: 'Select Food',
    variant: 'outlined'
  })
  selectFoodBtn.on('click', () => {
    programmaticButton.select('food')
    log.info('Programmatically selected Food')
  })

  // Select Shopping button
  const selectShoppingBtn = fButton({
    text: 'Select Shopping',
    variant: 'outlined'
  })
  selectShoppingBtn.on('click', () => {
    programmaticButton.select('shopping')
    log.info('Programmatically selected Shopping')
  })

  // Deselect Food button
  const deselectFoodBtn = fButton({
    text: 'Deselect Food',
    variant: 'outlined'
  })
  deselectFoodBtn.on('click', () => {
    programmaticButton.deselect('food')
    log.info('Programmatically deselected Food')
  })

  // Select All button
  const selectAllBtn = fButton({
    text: 'Select All',
    variant: 'outlined'
  })
  selectAllBtn.on('click', () => {
    programmaticButton.segments.forEach(segment => {
      programmaticButton.select(segment.value)
    })
    log.info('Programmatically selected all segments')
  })

  // Clear All button
  const clearAllBtn = fButton({
    text: 'Clear All',
    variant: 'outlined'
  })
  clearAllBtn.on('click', () => {
    programmaticButton.segments.forEach(segment => {
      programmaticButton.deselect(segment.value)
    })
    log.info('Programmatically deselected all segments')
  })

  controlsContainer.appendChild(selectFoodBtn.element)
  controlsContainer.appendChild(selectShoppingBtn.element)
  controlsContainer.appendChild(deselectFoodBtn.element)
  controlsContainer.appendChild(selectAllBtn.element)
  controlsContainer.appendChild(clearAllBtn.element)
  layout.showcase.appendChild(controlsContainer)

  // Visual state section
  const visualStateTitle = document.createElement('h3')
  visualStateTitle.textContent = 'Visual States'
  layout.showcase.appendChild(visualStateTitle)

  const visualStateDescription = document.createElement('p')
  visualStateDescription.textContent = 'Segmented buttons have different visual states: normal, hovered, focused, selected, and disabled.'
  layout.showcase.appendChild(visualStateDescription)

  // Visual states examples (static)
  const statesContainer = document.createElement('div')
  statesContainer.style.display = 'flex'
  statesContainer.style.flexDirection = 'column'
  statesContainer.style.gap = '24px'
  statesContainer.style.marginBottom = '32px'

  // Normal state
  const normalStateGroup = document.createElement('div')

  const normalStateLabel = document.createElement('p')
  normalStateLabel.style.margin = '0 0 8px 0'
  normalStateLabel.style.fontWeight = 'bold'
  normalStateLabel.textContent = 'Normal State'
  normalStateGroup.appendChild(normalStateLabel)

  const normalStateButton = createSegmentedButton({
    mode: SelectionMode.SINGLE,
    segments: [
      { text: 'Normal', value: 'normal', selected: true },
      { text: 'Unselected', value: 'unselected' }
    ]
  })

  normalStateGroup.appendChild(normalStateButton.element)
  statesContainer.appendChild(normalStateGroup)

  // Selected state with explanation
  const selectedStateGroup = document.createElement('div')

  const selectedStateLabel = document.createElement('p')
  selectedStateLabel.style.margin = '0 0 8px 0'
  selectedStateLabel.style.fontWeight = 'bold'
  selectedStateLabel.textContent = 'Selected State'
  selectedStateGroup.appendChild(selectedStateLabel)

  const selectedExplanation = document.createElement('p')
  selectedExplanation.style.margin = '0 0 8px 0'
  selectedExplanation.style.fontSize = '14px'
  selectedExplanation.textContent = 'Selected segments are visually distinct with a background color change and a checkmark icon (when both text and icon are present).'
  selectedStateGroup.appendChild(selectedExplanation)

  // Don't need to create a new button, just refer to the example above
  selectedStateGroup.appendChild(document.createTextNode('See the "Normal" example above where the first segment is selected.'))
  statesContainer.appendChild(selectedStateGroup)

  // Disabled state
  const disabledStateGroup = document.createElement('div')

  const disabledStateLabel = document.createElement('p')
  disabledStateLabel.style.margin = '0 0 8px 0'
  disabledStateLabel.style.fontWeight = 'bold'
  disabledStateLabel.textContent = 'Disabled State'
  disabledStateGroup.appendChild(disabledStateLabel)

  const disabledStateButton = createSegmentedButton({
    mode: SelectionMode.SINGLE,
    disabled: true,
    segments: [
      { text: 'Disabled', value: 'disabled', selected: true },
      { text: 'Segment', value: 'segment' }
    ]
  })

  disabledStateGroup.appendChild(disabledStateButton.element)
  statesContainer.appendChild(disabledStateGroup)

  layout.showcase.appendChild(statesContainer)

  // Interactive behavior notes
  const behaviorTitle = document.createElement('h3')
  behaviorTitle.textContent = 'Behavior Guidelines'
  layout.showcase.appendChild(behaviorTitle)

  const behaviorNotes = document.createElement('div')
  behaviorNotes.style.backgroundColor = 'var(--mtrl-sys-color-surface-container)'
  behaviorNotes.style.padding = '16px'
  behaviorNotes.style.borderRadius = '4px'
  behaviorNotes.style.marginBottom = '32px'

  behaviorNotes.innerHTML = `
    <h4 style="margin-top: 0;">Single-Select Mode</h4>
    <ul>
      <li>Always maintains exactly one selected segment</li>
      <li>Clicking an unselected segment selects it and deselects the previously selected segment</li>
      <li>Clicking an already selected segment has no effect (it remains selected)</li>
    </ul>

    <h4>Multi-Select Mode</h4>
    <ul>
      <li>Allows any number of selected segments (including zero)</li>
      <li>Clicking an unselected segment selects it</li>
      <li>Clicking an already selected segment deselects it</li>
      <li>Each segment's state is independent of other segments</li>
    </ul>

    <h4>Accessibility</h4>
    <ul>
      <li>Uses proper ARIA attributes to communicate state to assistive technologies</li>
      <li>Responds to keyboard interactions (Tab to focus, Space/Enter to select)</li>
      <li>Touch targets meet minimum size recommendations (48dp)</li>
    </ul>
  `

  layout.showcase.appendChild(behaviorNotes)
}
