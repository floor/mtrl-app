import {
  createComponentsSectionLayout
} from '../../../layout'

import {
  createLayout,
  fButton,
  createDatePicker
} from 'mtrl'

const createBasicDatePicker = (container) => {
  // Create a basic date picker
  const datePicker = createDatePicker({
    label: 'Select Date',
    placeholder: 'MM/DD/YYYY'
  })

  // Add the date picker to the container
  container.appendChild(datePicker.element)

  // Log date selection events
  datePicker.on('change', (data) => {
    console.log('Date selected:', data.value)
    console.log('Formatted date:', data.formattedValue)
  })
}

export const initBasic = (container) => {
  const title = 'Basic DatePicker'
  const description = 'A simple date picker with default docked calendar style'
  const layout = createLayout(createComponentsSectionLayout({ title, description, class: 'noflex' }), container).component

  // Create the basic date picker
  createBasicDatePicker(layout.body)

  // Add some spacing
  const spacer = document.createElement('div')
  spacer.style.height = '24px'
  layout.body.appendChild(spacer)

  // Add explanation text
  const explanation = document.createElement('p')
  explanation.textContent = 'Click the input field above to open the calendar and select a date.'
  explanation.style.marginTop = '8px'
  layout.body.appendChild(explanation)
}
