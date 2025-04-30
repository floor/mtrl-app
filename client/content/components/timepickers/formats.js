// src/client/content/components/timepickers/formats.js

import {
  createComponentSection
} from '../../../layout'

import {
  createLayout,
  createTimePicker
} from 'mtrl'

export const initFormats = (container) => {
  const title = 'Time Formats'
  const description = 'TimePicker supports 12-hour and 24-hour time formats'
  const layout = createLayout(createComponentSection({ title, description, class: 'noflex' }), container).component

  // Create grid layout for different formats
  const grid = document.createElement('div')
  grid.style.display = 'grid'
  grid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(280px, 1fr))'
  grid.style.gap = '24px'
  grid.style.marginBottom = '24px'

  // 1. 12-hour format (AM/PM)
  const format12Container = document.createElement('div')

  const format12Title = document.createElement('h4')
  format12Title.textContent = '12-Hour Format (AM/PM)'
  format12Title.style.marginBottom = '4px'

  const format12Description = document.createElement('p')
  format12Description.textContent = 'Standard time format with AM/PM indicator'
  format12Description.style.fontSize = '14px'
  format12Description.style.marginTop = '0'
  format12Description.style.marginBottom = '12px'

  const format12Input = createTimeInput('3:30 PM')

  const format12Picker = createTimePicker({
    title: 'Select Time',
    value: new Date(2025, 0, 1, 15, 30, 0),
    format: '12h'
  })

  format12Input.addEventListener('click', () => {
    format12Picker.open()
  })

  format12Picker.on('select', ({ value }) => {
    // Format the date object for display
    const hours = value.getHours()
    const minutes = value.getMinutes()
    const period = hours >= 12 ? 'PM' : 'AM'
    const hour12 = hours % 12 === 0 ? 12 : hours % 12
    const minutesStr = minutes.toString().padStart(2, '0')

    format12Input.value = `${hour12}:${minutesStr} ${period}`
  })

  format12Container.appendChild(format12Title)
  format12Container.appendChild(format12Description)
  format12Container.appendChild(format12Input)

  // 2. 24-hour format
  const format24Container = document.createElement('div')

  const format24Title = document.createElement('h4')
  format24Title.textContent = '24-Hour Format'
  format24Title.style.marginBottom = '4px'

  const format24Description = document.createElement('p')
  format24Description.textContent = 'Military time format without AM/PM'
  format24Description.style.fontSize = '14px'
  format24Description.style.marginTop = '0'
  format24Description.style.marginBottom = '12px'

  const format24Input = createTimeInput('15:30')

  const format24Picker = createTimePicker({
    title: 'Select Time',
    value: new Date(2025, 0, 1, 15, 30, 0),
    format: '24h'
  })

  format24Input.addEventListener('click', () => {
    format24Picker.open()
  })

  format24Picker.on('select', ({ value }) => {
    // Format the date object for 24-hour display
    const hours = value.getHours().toString().padStart(2, '0')
    const minutes = value.getMinutes().toString().padStart(2, '0')
    format24Input.value = `${hours}:${minutes}`
  })

  format24Container.appendChild(format24Title)
  format24Container.appendChild(format24Description)
  format24Container.appendChild(format24Input)

  // 3. 12-hour format with seconds
  const format12sContainer = document.createElement('div')

  const format12sTitle = document.createElement('h4')
  format12sTitle.textContent = '12-Hour Format with Seconds'
  format12sTitle.style.marginBottom = '4px'

  const format12sDescription = document.createElement('p')
  format12sDescription.textContent = 'AM/PM format with precise seconds'
  format12sDescription.style.fontSize = '14px'
  format12sDescription.style.marginTop = '0'
  format12sDescription.style.marginBottom = '12px'

  const format12sInput = createTimeInput('3:30:45 PM')

  const format12sPicker = createTimePicker({
    title: 'Select Time',
    value: new Date(2025, 0, 1, 15, 30, 45),
    format: '12h',
    showSeconds: true
  })

  format12sInput.addEventListener('click', () => {
    format12sPicker.open()
  })

  format12sPicker.on('select', ({ value }) => {
    // Format the date object for display with seconds
    const hours = value.getHours()
    const minutes = value.getMinutes()
    const seconds = value.getSeconds()
    const period = hours >= 12 ? 'PM' : 'AM'
    const hour12 = hours % 12 === 0 ? 12 : hours % 12
    const minutesStr = minutes.toString().padStart(2, '0')
    const secondsStr = seconds.toString().padStart(2, '0')

    format12sInput.value = `${hour12}:${minutesStr}:${secondsStr} ${period}`
  })

  format12sContainer.appendChild(format12sTitle)
  format12sContainer.appendChild(format12sDescription)
  format12sContainer.appendChild(format12sInput)

  // 4. 24-hour format with seconds
  const format24sContainer = document.createElement('div')

  const format24sTitle = document.createElement('h4')
  format24sTitle.textContent = '24-Hour Format with Seconds'
  format24sTitle.style.marginBottom = '4px'

  const format24sDescription = document.createElement('p')
  format24sDescription.textContent = 'Military time with seconds for precise timing'
  format24sDescription.style.fontSize = '14px'
  format24sDescription.style.marginTop = '0'
  format24sDescription.style.marginBottom = '12px'

  const format24sInput = createTimeInput('15:30:45')

  const format24sPicker = createTimePicker({
    title: 'Select Time',
    value: new Date(2025, 0, 1, 15, 30, 45),
    format: '24h',
    showSeconds: true
  })

  format24sInput.addEventListener('click', () => {
    format24sPicker.open()
  })

  format24sPicker.on('select', ({ value }) => {
    // Format the date object for 24-hour display with seconds
    const hours = value.getHours().toString().padStart(2, '0')
    const minutes = value.getMinutes().toString().padStart(2, '0')
    const seconds = value.getSeconds().toString().padStart(2, '0')
    format24sInput.value = `${hours}:${minutes}:${seconds}`
  })

  format24sContainer.appendChild(format24sTitle)
  format24sContainer.appendChild(format24sDescription)
  format24sContainer.appendChild(format24sInput)

  // Add all format examples to the grid
  grid.appendChild(format12Container)
  grid.appendChild(format24Container)
  grid.appendChild(format12sContainer)
  grid.appendChild(format24sContainer)

  // Add the grid to the layout
  layout.body.appendChild(grid)

  // Format information
  const formatInfo = document.createElement('div')
  formatInfo.innerHTML = `
    <p>The TimePicker component supports different time formats to match your application's needs:</p>
    <ul style="margin-left: 20px; line-height: 1.5;">
      <li><strong>12-Hour Format (AM/PM):</strong> Common in the US and some other countries, uses AM/PM indicators.</li>
      <li><strong>24-Hour Format (Military):</strong> Common internationally, eliminates AM/PM confusion.</li>
      <li><strong>Seconds Display:</strong> Optional seconds for precise time entry, useful for scheduling systems.</li>
    </ul>
    <p>You can customize the format using the <code>format</code> and <code>showSeconds</code> properties:</p>
    <pre style="background-color: #f5f5f5; padding: 12px; border-radius: 4px; overflow-x: auto;">
const timePicker = createTimePicker({
  format: TIME_FORMAT.FORMAT_24,  // Use 24-hour format
  showSeconds: true              // Show seconds selector
});</pre>
  `
  layout.body.appendChild(formatInfo)
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
