// src/client/content/components/timepickers/programming.js

import {
  createComponentsSectionLayout
} from '../../../layout'

import {
  createStructure,
  createButton,
  createTimePicker
} from 'mtrl'

export const initProgramming = (container) => {
  const title = 'Programmatic Control'
  const description = 'Control the TimePicker programmatically using its API'
  const layout = createStructure(createComponentsSectionLayout({ title, description, class: 'noflex' }), container).component

  // Create a time picker
  const timePicker = createTimePicker({
    title: 'Controlled TimePicker',
    value: '14:30'
  })

  // Create time display field
  const timeDisplay = document.createElement('div')
  timeDisplay.style.marginBottom = '16px'
  timeDisplay.style.padding = '12px'
  timeDisplay.style.fontSize = '24px'
  timeDisplay.style.fontWeight = 'bold'
  timeDisplay.style.color = '#6200ee'
  timeDisplay.style.backgroundColor = '#f5f5f5'
  timeDisplay.style.borderRadius = '4px'
  timeDisplay.style.textAlign = 'center'
  timeDisplay.textContent = '2:30 PM'

  // Create control buttons container
  const buttonContainer = document.createElement('div')
  buttonContainer.style.display = 'flex'
  buttonContainer.style.flexWrap = 'wrap'
  buttonContainer.style.gap = '8px'
  buttonContainer.style.marginBottom = '16px'

  // Set Current Time button
  const setCurrentBtn = createButton({
    text: 'Set Current Time',
    variant: 'outlined'
  })

  setCurrentBtn.on('click', () => {
    const now = new Date()
    const hours = now.getHours()
    const minutes = now.getMinutes()
    const hoursStr = hours.toString().padStart(2, '0')
    const minutesStr = minutes.toString().padStart(2, '0')

    timePicker.setValue(`${hoursStr}:${minutesStr}`)

    // Update display
    const period = hours >= 12 ? 'PM' : 'AM'
    const hours12 = hours % 12 === 0 ? 12 : hours % 12
    timeDisplay.textContent = `${hours12}:${minutesStr} ${period}`
  })

  // Set Specific Time button
  const setTimeBtn = createButton({
    text: 'Set to 8:15 AM',
    variant: 'outlined'
  })

  setTimeBtn.on('click', () => {
    timePicker.setValue('08:15')
    timeDisplay.textContent = '8:15 AM'
  })

  // Toggle Format button
  const toggleFormatBtn = createButton({
    text: 'Toggle 12h/24h Format',
    variant: 'outlined'
  })

  toggleFormatBtn.on('click', () => {
    const currentFormat = timePicker.getFormat()
    const newFormat = currentFormat === '12h' ? '24h' : '12h'

    timePicker.setFormat(newFormat)

    // Update button text
    toggleFormatBtn.setText(`Current: ${newFormat === '12h' ? '12-hour' : '24-hour'} format`)
  })

  // Toggle Type button
  const toggleTypeBtn = createButton({
    text: 'Toggle Dial/Input Type',
    variant: 'outlined'
  })

  toggleTypeBtn.on('click', () => {
    const currentType = timePicker.getType()
    const newType = currentType === 'dial' ? 'input' : 'dial'

    timePicker.setType(newType)

    // Update button text
    toggleTypeBtn.setText(`Current: ${newType === 'dial' ? 'Dial' : 'Input'} type`)
  })

  // Open TimePicker button
  const openBtn = createButton({
    text: 'Open TimePicker',
    variant: 'filled'
  })

  openBtn.on('click', () => {
    timePicker.open()
  })

  // Add event listener for time changes
  timePicker.on('change', (time) => {
    // Convert to appropriate display format
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours, 10)
    const period = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 === 0 ? 12 : hour % 12

    timeDisplay.textContent = `${hour12}:${minutes} ${period}`
  })

  // Add buttons to container
  buttonContainer.appendChild(setCurrentBtn.element)
  buttonContainer.appendChild(setTimeBtn.element)
  buttonContainer.appendChild(toggleFormatBtn.element)
  buttonContainer.appendChild(toggleTypeBtn.element)
  buttonContainer.appendChild(openBtn.element)

  // Create status display for events
  const eventLog = document.createElement('div')
  eventLog.style.marginTop = '16px'
  eventLog.style.padding = '8px'
  eventLog.style.borderRadius = '4px'
  eventLog.style.backgroundColor = '#f5f5f5'
  eventLog.style.maxHeight = '100px'
  eventLog.style.overflow = 'auto'
  eventLog.style.fontSize = '14px'
  eventLog.style.fontFamily = 'monospace'

  // Add event listeners for various events
  const events = ['change', 'open', 'close', 'confirm', 'cancel']

  events.forEach(eventName => {
    timePicker.on(eventName, (data) => {
      const logEntry = document.createElement('div')
      logEntry.textContent = `${new Date().toLocaleTimeString()} - Event: ${eventName}${data ? ' - ' + data : ''}`
      eventLog.appendChild(logEntry)
      eventLog.scrollTop = eventLog.scrollHeight
    })
  })

  // Add components to layout
  layout.body.appendChild(timeDisplay)
  layout.body.appendChild(buttonContainer)
  layout.body.appendChild(document.createElement('hr'))

  const eventsTitle = document.createElement('h4')
  eventsTitle.textContent = 'Event Log'
  layout.body.appendChild(eventsTitle)
  layout.body.appendChild(eventLog)

  // Add description of API
  const apiDescription = document.createElement('div')
  apiDescription.innerHTML = `
    <p style="margin-top: 16px; font-weight: bold;">Available API Methods:</p>
    <ul style="margin-left: 20px; line-height: 1.5;">
      <li><code>timePicker.setValue(time)</code>: Sets the selected time (format: 'HH:MM' or 'HH:MM:SS')</li>
      <li><code>timePicker.getValue()</code>: Gets the current time value as a string</li>
      <li><code>timePicker.getTimeObject()</code>: Gets the time as an object with hours, minutes, seconds, and period</li>
      <li><code>timePicker.open()</code>: Opens the time picker</li>
      <li><code>timePicker.close()</code>: Closes the time picker</li>
      <li><code>timePicker.toggle()</code>: Toggles the time picker open/closed state</li>
      <li><code>timePicker.setType(type)</code>: Sets the picker type (DIAL or INPUT)</li>
      <li><code>timePicker.getType()</code>: Gets the current picker type</li>
      <li><code>timePicker.setFormat(format)</code>: Sets the time format (AMPM or MILITARY)</li>
      <li><code>timePicker.getFormat()</code>: Gets the current format</li>
      <li><code>timePicker.on(event, handler)</code>: Adds an event listener</li>
      <li><code>timePicker.off(event, handler)</code>: Removes an event listener</li>
    </ul>
    
    <p style="margin-top: 16px; font-weight: bold;">Available Events:</p>
    <ul style="margin-left: 20px; line-height: 1.5;">
      <li><code>change</code>: Fired when the selected time changes</li>
      <li><code>open</code>: Fired when the time picker opens</li>
      <li><code>close</code>: Fired when the time picker closes</li>
      <li><code>confirm</code>: Fired when the user confirms a time selection</li>
      <li><code>cancel</code>: Fired when the user cancels time selection</li>
    </ul>
  `
  layout.body.appendChild(apiDescription)
}
