import {
  createComponentsSectionLayout
} from '../../../layout'

import {
  organisation,
  location
} from '../../../data'

import {
  createLayout,
  createSelect
} from 'mtrl'

export const initSubmenu = (container) => {
  const title = 'Select with nested menu'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component

  // Create a basic select component with all countries
  const filled = createSelect({
    label: 'Position',
    supportingText: 'Select a position',
    options: organisation
  })

  filled.element.style.maxWidth = '240px'

  // Add change event listener
  filled.on('change', (event) => {
    console.log(`Selected: ${event.value} (${event.text})`)
  })

  const outlined = createSelect({
    label: 'Location',
    variant: 'outlined',
    supportingText: 'Select a location',
    options: location
  })

  outlined.element.style.maxWidth = '240px'

  // Add the select to the layout
  layout.body.appendChild(filled.element)
  layout.body.appendChild(outlined.element)

  return {
    filled,
    outlined,
    layout
  }
}
