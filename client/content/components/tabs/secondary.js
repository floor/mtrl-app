import {
  createComponentsSectionLayoutBox
} from '../../../layout'

import {
  createStructure,
  createTabs
} from 'mtrl'

export const initSecondaryTabs = (container) => {
  const title = 'Secondary Tabs'
  const layout = createStructure(createComponentsSectionLayoutBox({ title, class: 'noflex' }), container).component

  // Create tabs with secondary variant
  const tabs = createTabs({
    variant: 'secondary',
    tabs: [
      { text: 'All items', value: 'all', state: 'active' },
      { text: 'Unread', value: 'unread' },
      { text: 'Archived', value: 'archived' }
    ]
  })

  // Debug: Log the variant value and element classes
  console.log('Secondary Variant Value:', 'secondary')
  console.log('Tabs Element Classes:', tabs.element.className)

  // Add info text
  const infoText = document.createElement('p')
  infoText.className = 'mtrl-content__secondary-info'
  infoText.textContent = 'Secondary tabs are useful for filtering content within a screen or adding a second level of navigation.'

  // Add tabs to the layout
  layout.body.appendChild(tabs.element)
  layout.body.appendChild(infoText)
}
