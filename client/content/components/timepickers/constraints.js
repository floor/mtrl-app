// src/client/content/components/timepickers/constraints.js

import {
  createComponentsSectionLayout
} from '../../../layout'

import {
  createStructure,
  createTimePicker
} from 'mtrl'

export const initConstraints = (container) => {
  const title = 'Time Constraints'
  const description = 'Restrict time selection with min and max time constraints'
  const layout = createStructure(createComponentsSectionLayout({ title, description, class: 'noflex' }), container).component

  // Create examples container
  const examples = document.createElement('div')
  examples.style.display = 'flex'
  examples.style.flexDirection = 'column'
  examples.style.gap = '24px'

  // 1. Business hours constraint (9 AM - 5 PM)
  const businessContainer = document.createElement('div')

  const businessTitle = document.createElement('h4')
  businessTitle.textContent = 'Business Hours'
  businessTitle.style.marginBottom = '4px'

  const businessDesc = document.createElement('p')
  businessDesc.textContent = 'Restrict selection to business hours (9:00 AM - 5:00 PM)'
  businessDesc.style.fontSize = '14px'
  businessDesc.style.marginTop = '0'
  businessDesc.style.marginBottom = '8px'

  const businessInput = createTimeInput('9:00 AM')

  const businessPicker = createTimePicker({
    title: 'Schedule Meeting',
    value: '09:00',
    minTime: '09:00', // 9:00 AM
    maxTime: '17:00' // 5:00 PM
  })

  businessInput.addEventListener('click', () => {
    businessPicker.open()
  })

  businessPicker.on('confirm', (time) => {
    // Convert 24h to 12h format
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours, 10)
    const period = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 === 0 ? 12 : hour % 12

    businessInput.value = `${hour12}:${minutes} ${period}`
  })

  businessContainer.appendChild(businessTitle)
  businessContainer.appendChild(businessDesc)
  businessContainer.appendChild(businessInput)

  // 2. Appointment slots (15-minute intervals)
  const appointmentContainer = document.createElement('div')

  const appointmentTitle = document.createElement('h4')
  appointmentTitle.textContent = 'Appointment Slots'
  appointmentTitle.style.marginBottom = '4px'

  const appointmentDesc = document.createElement('p')
  appointmentDesc.textContent = '15-minute intervals for appointment scheduling'
  appointmentDesc.style.fontSize = '14px'
  appointmentDesc.style.marginTop = '0'
  appointmentDesc.style.marginBottom = '8px'

  const appointmentInput = createTimeInput('10:00 AM')

  const appointmentPicker = createTimePicker({
    title: 'Select Appointment Time',
    value: '10:00',
    minuteStep: 15, // 15-minute intervals
    minTime: '08:00',
    maxTime: '18:00'
  })

  appointmentInput.addEventListener('click', () => {
    appointmentPicker.open()
  })

  appointmentPicker.on('confirm', (time) => {
    // Convert 24h to 12h format
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours, 10)
    const period = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 === 0 ? 12 : hour % 12

    appointmentInput.value = `${hour12}:${minutes} ${period}`
  })

  appointmentContainer.appendChild(appointmentTitle)
  appointmentContainer.appendChild(appointmentDesc)
  appointmentContainer.appendChild(appointmentInput)

  // 3. Delivery time slots (Morning/Afternoon/Evening)
  const deliveryContainer = document.createElement('div')

  const deliveryTitle = document.createElement('h4')
  deliveryTitle.textContent = 'Delivery Time Slots'
  deliveryTitle.style.marginBottom = '4px'

  const deliveryDesc = document.createElement('p')
  deliveryDesc.textContent = 'Morning (8-12), Afternoon (12-5), Evening (5-9)'
  deliveryDesc.style.fontSize = '14px'
  deliveryDesc.style.marginTop = '0'
  deliveryDesc.style.marginBottom = '8px'

  // Create time slot buttons
  const timeSlotContainer = document.createElement('div')
  timeSlotContainer.style.display = 'flex'
  timeSlotContainer.style.gap = '12px'
  timeSlotContainer.style.flexWrap = 'wrap'

  const slots = [
    { label: 'Morning (8-12)', value: '10:00' },
    { label: 'Afternoon (12-5)', value: '14:00' },
    { label: 'Evening (5-9)', value: '19:00' }
  ]

  slots.forEach(slot => {
    const slotButton = document.createElement('button')
    slotButton.textContent = slot.label
    slotButton.style.padding = '8px 16px'
    slotButton.style.border = '1px solid #6200ee'
    slotButton.style.borderRadius = '4px'
    slotButton.style.backgroundColor = 'transparent'
    slotButton.style.color = '#6200ee'
    slotButton.style.fontSize = '14px'
    slotButton.style.cursor = 'pointer'

    slotButton.addEventListener('click', () => {
      // Create time picker with appropriate constraints
      let minTime, maxTime

      if (slot.label.includes('Morning')) {
        minTime = '08:00'
        maxTime = '12:00'
      } else if (slot.label.includes('Afternoon')) {
        minTime = '12:00'
        maxTime = '17:00'
      } else if (slot.label.includes('Evening')) {
        minTime = '17:00'
        maxTime = '21:00'
      }

      const deliveryPicker = createTimePicker({
        title: `Select ${slot.label} Delivery Time`,
        value: slot.value,
        minTime,
        maxTime,
        minuteStep: 30 // 30-minute intervals for delivery
      })

      deliveryPicker.open()

      deliveryPicker.on('confirm', (time) => {
        // Convert 24h to 12h format
        const [hours, minutes] = time.split(':')
        const hour = parseInt(hours, 10)
        const period = hour >= 12 ? 'PM' : 'AM'
        const hour12 = hour % 12 === 0 ? 12 : hour % 12

        alert(`Delivery scheduled for ${hour12}:${minutes} ${period}`)
      })
    })

    timeSlotContainer.appendChild(slotButton)
  })

  deliveryContainer.appendChild(deliveryTitle)
  deliveryContainer.appendChild(deliveryDesc)
  deliveryContainer.appendChild(timeSlotContainer)

  // Add all examples to the container
  examples.appendChild(businessContainer)
  examples.appendChild(appointmentContainer)
  examples.appendChild(deliveryContainer)

  // Add the examples to the layout
  layout.body.appendChild(examples)

  // Add explanation about constraints
  const explanation = document.createElement('div')
  explanation.innerHTML = `
    <p style="margin-top: 16px;">Time constraints can be applied in different ways:</p>
    <ul style="margin-left: 20px; line-height: 1.5;">
      <li>Using the <code>minTime</code> property to prevent selection before a certain time</li>
      <li>Using the <code>maxTime</code> property to prevent selection after a certain time</li>
      <li>Using the <code>minuteStep</code> property to restrict minutes to specific intervals (e.g., 15-minute slots)</li>
      <li>Using the <code>secondStep</code> property for second intervals when seconds are displayed</li>
    </ul>
    <p>Time constraints are useful for:</p>
    <ul style="margin-left: 20px; line-height: 1.5;">
      <li>Restricting selection to business hours</li>
      <li>Creating appointment slots</li>
      <li>Setting up delivery windows</li>
      <li>Creating predefined time ranges</li>
    </ul>
    <p>Invalid times that fall outside constraints will be automatically adjusted to the nearest valid time.</p>
  `
  layout.body.appendChild(explanation)
}

// Helper function to create time input fields
function createTimeInput (initialValue) {
  const input = document.createElement('input')
  input.type = 'text'
  input.readOnly = true
  input.value = initialValue || ''
  input.placeholder = 'Click to select time'
  input.style.padding = '8px 12px'
  input.style.border = '1px solid #ccc'
  input.style.borderRadius = '4px'
  input.style.fontSize = '16px'
  input.style.width = '200px'
  input.style.cursor = 'pointer'

  return input
}
