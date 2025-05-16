import {
  createComponentSection
} from '../../../layout'

import {
  countries
} from '../../../data'

import {
  createLayout,
  createSelect
} from 'mtrl'

export const initLongMenu = (container) => {
  const title = 'Long Menu Select'
  const layout = createLayout(createComponentSection({ title }), container).component

  // Create a basic select component with all countries
  const filled = createSelect({
    label: 'Country',
    supportingText: 'Select a country',
    options: countries
  })

  filled.element.style.maxWidth = '240px'

  // Add change event listener
  filled.on('change', (event) => {
    console.log(`Selected: ${event.value} (${event.text})`)
  })

  const outlined = createSelect({
    label: 'Country',
    variant: 'outlined',
    supportingText: 'Select a country',
    options: countries
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
