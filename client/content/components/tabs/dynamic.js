import {
  createComponentSection
} from '../../../layout'

import {
  createLayout,
  createTabs,
  createButton
} from 'mtrl'

export const initDynamicTabs = (container) => {
  const title = 'Dynamic Tabs'
  const layout = createLayout(createComponentSection({ title, class: 'noflex' }), container).component

  // Create tabs with an initial set of tabs
  const tabs = createTabs({
    tabs: [
      { text: 'Tab 1', value: 'tab1', state: 'active' },
      { text: 'Tab 2', value: 'tab2' }
    ]
  })

  // Track the number of tabs for adding new ones
  let tabCount = 2

  // Create controls for adding and removing tabs
  const controlsContainer = document.createElement('div')
  controlsContainer.className = 'mtrl-content__tab-controls'

  // Add Tab button
  const addButton = createButton({
    text: 'Add Tab',
    variant: 'filled'
  })

  // Remove Tab button
  const removeButton = createButton({
    text: 'Remove Last Tab',
    variant: 'outlined'
  })

  // Add event listeners
  addButton.on('click', () => {
    tabCount++
    const newTab = tabs.addTab({
      text: `Tab ${tabCount}`,
      value: `tab${tabCount}`
    })
    console.log(`Added new tab: Tab ${tabCount}`)
  })

  removeButton.on('click', () => {
    if (tabCount > 1) {
      tabs.removeTab(`tab${tabCount}`)
      console.log(`Removed tab: Tab ${tabCount}`)
      tabCount--
    } else {
      console.log('Cannot remove the last tab')
    }
  })

  // Add components to the layout
  controlsContainer.appendChild(addButton.element)
  controlsContainer.appendChild(removeButton.element)

  layout.body.appendChild(tabs.element)
  layout.body.appendChild(controlsContainer)
}
