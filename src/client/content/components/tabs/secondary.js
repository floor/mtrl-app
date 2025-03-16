import {
  createComponentsSectionLayoutBox
} from '../../../layout'

import {
  createLayout,
  createTabs
} from 'mtrl'

import {
  TABS_VARIANTS
} from 'mtrl/src/components/tabs'

export const initSecondaryTabs = (container) => {
  const title = 'Secondary Tabs'
  const layout = createLayout(createComponentsSectionLayoutBox({ title, class: 'noflex' }), container).component

  // Create tabs with secondary variant
  const tabs = createTabs({
    variant: TABS_VARIANTS.SECONDARY,
    tabs: [
      { text: 'All items', value: 'all', state: 'active' },
      { text: 'Unread', value: 'unread' },
      { text: 'Archived', value: 'archived' }
    ]
  })

  // Debug: Log the variant value and element classes
  console.log('Secondary Variant Value:', TABS_VARIANTS.SECONDARY)
  console.log('Tabs Element Classes:', tabs.element.className)

  // Add info text
  const infoText = document.createElement('p')
  infoText.className = 'mtrl-content__secondary-info'
  infoText.textContent = 'Secondary tabs are useful for filtering content within a screen or adding a second level of navigation.'

  // Add tabs to the layout
  layout.body.appendChild(tabs.element)
  layout.body.appendChild(infoText)
}
