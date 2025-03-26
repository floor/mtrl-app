// src/client/content/components/timepickers/basic.js

import {
  createComponentsSectionLayout
} from '../../../layout'

import {
  createStructure,
  createButton,
  createTimePicker
} from 'mtrl'

const createBasicTimePicker = (container) => {
  // Create a basic time picker
  const timePicker = createTimePicker({
    title: 'Select Time',
    value: '14:30' // Initial value (2:30 PM)
  })

  // Create input field to trigger the time picker
  const timeInput = document.createElement('input')
  timeInput.type = 'text'
  timeInput.readOnly = true
  timeInput.placeholder = 'Click to select time'
  timeInput.value = '2:30 PM'
  timeInput.style.padding = '8px 12px'
  timeInput.style.border = '1px solid #ccc'
  timeInput.style.borderRadius = '4px'
  timeInput.style.fontSize = '16px'
  timeInput.style.width = '200px'

  // Open the time picker when input is clicked
  timeInput.addEventListener('click', () => {
    timePicker.open()
  })

  // Update the input when time changes
  timePicker.on('change', () => {
    // Convert 24h format to 12h for display
    const timeValue = timePicker.getValue()
    const [hours, minutes] = timeValue.split(':')
    const hour = parseInt(hours, 10)
    const minute = parseInt(minutes, 10)
    const period = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 === 0 ? 12 : hour % 12

    timeInput.value = `${hour12}:${minute} ${period}`
  })

  // Update input when time is confirmed
  timePicker.on('confirm', (time) => {
    console.log('Time confirmed:', time)
  })

  // Add the input to the container
  container.appendChild(timeInput)
}

export const initBasic = (container) => {
  const title = 'Basic TimePicker'
  const description = 'A simple time picker with dial and input modes'
  const layout = createStructure(createComponentsSectionLayout({ title, description, class: 'noflex' }), container).component

  // Create the basic time picker
  createBasicTimePicker(layout.body)

  // Add some spacing
  const spacer = document.createElement('div')
  spacer.style.height = '24px'
  layout.body.appendChild(spacer)

  // // Add explanation text
  // const explanation = document.createElement('div')
  // explanation.innerHTML = `
  //   <p>Click the input field above to open the time picker.</p>
  //   <p>The TimePicker component provides two selection methods:</p>
  //   <ul>
  //     <li><strong>Dial Selection</strong>: Select time using a clock dial interface</li>
  //     <li><strong>Input Selection</strong>: Enter time directly using input fields</li>
  //   </ul>
  //   <p>You can toggle between these modes using the icon button in the bottom-left corner of the time picker.</p>
  // `
  // layout.body.appendChild(explanation)
}
