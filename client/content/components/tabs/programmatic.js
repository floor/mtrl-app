import {
  createComponentsSectionLayoutBox
} from '../../../layout'

import {
  fLayout,
  fTabs,
  fButton
} from 'mtrl'

export const initProgrammaticTabs = (container) => {
  const title = 'Programmatic Control'
  const layout = fLayout(createComponentsSectionLayoutBox({ title, class: 'noflex' }), container).component

  // Create tabs
  const tabs = fTabs({
    tabs: [
      { text: 'First', value: 'first' },
      { text: 'Second', value: 'second' },
      { text: 'Third', value: 'third' },
      { text: 'Fourth', value: 'fourth' }
    ]
  })

  // Create a status display
  const statusDisplay = document.createElement('div')
  statusDisplay.className = 'mtrl-content__tab-status'
  statusDisplay.innerHTML = '<p>No tab selected</p>'

  // Create control buttons
  const controlsContainer = document.createElement('div')
  controlsContainer.className = 'mtrl-content__tab-controls'

  // Button to select the first tab
  const firstButton = fButton({
    text: 'Select First',
    variant: 'outlined'
  })

  // Button to select the second tab
  const secondButton = fButton({
    text: 'Select Second',
    variant: 'outlined'
  })

  // Button to select the third tab
  const thirdButton = fButton({
    text: 'Select Third',
    variant: 'outlined'
  })

  // Button to select the fourth tab
  const fourthButton = fButton({
    text: 'Select Fourth',
    variant: 'outlined'
  })

  // Add event listeners
  firstButton.on('click', () => {
    tabs.setActiveTab('first')
    updateStatus('first')
  })

  secondButton.on('click', () => {
    tabs.setActiveTab('second')
    updateStatus('second')
  })

  thirdButton.on('click', () => {
    tabs.setActiveTab('third')
    updateStatus('third')
  })

  fourthButton.on('click', () => {
    tabs.setActiveTab('fourth')
    updateStatus('fourth')
  })

  // Handle tab changes
  tabs.on('change', (e) => {
    updateStatus(e.value)
  })

  // Update status display
  function updateStatus (value) {
    statusDisplay.innerHTML = `<p>Active tab: <strong>${value}</strong></p>`
  }

  // Set initial tab
  tabs.setActiveTab('first')
  updateStatus('first')

  // Add components to the layout
  controlsContainer.appendChild(firstButton.element)
  controlsContainer.appendChild(secondButton.element)
  controlsContainer.appendChild(thirdButton.element)
  controlsContainer.appendChild(fourthButton.element)

  layout.body.appendChild(tabs.element)
  layout.body.appendChild(statusDisplay)
  layout.body.appendChild(controlsContainer)
}
