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

import { faceIcon, locationIcon } from '../../../icons'

export const initSubmenu = (container) => {
  const title = 'Select with nested menu'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component

  // Create a basic select component with all countries
  const filled = createSelect({
    label: 'Position',
    leadingIcon: faceIcon,
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
    leadingIcon: locationIcon,
    variant: 'outlined',
    supportingText: 'Select a location',
    options: location
  })

  outlined.on('change', (event) => {
    console.log(`Selected: ${event.value} (${event.text})`)
  })

  outlined.element.style.maxWidth = '240px'

  // Add the select to the layout
  layout.showcase.appendChild(filled.element)
  layout.showcase.appendChild(outlined.element)

  return {
    filled,
    outlined,
    layout
  }
}
