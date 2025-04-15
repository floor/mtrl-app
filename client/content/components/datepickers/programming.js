import {
  createComponentsSectionLayout
} from '../../../layout'

import {
  createLayout,
  createButton,
  createDatePicker
} from 'mtrl'

export const initProgramming = (container) => {
  const title = 'Programmatic Control'
  const description = 'Control the DatePicker programmatically using its API'
  const layout = createLayout(createComponentsSectionLayout({ title, description, class: 'noflex' }), container).component

  // Create a date picker
  const datePicker = createDatePicker({
    label: 'Controlled DatePicker',
    placeholder: 'MM/DD/YYYY'
  })

  // Create control buttons container
  const buttonContainer = document.createElement('div')
  buttonContainer.style.display = 'flex'
  buttonContainer.style.flexWrap = 'wrap'
  buttonContainer.style.gap = '8px'
  buttonContainer.style.marginTop = '16px'
  buttonContainer.style.marginBottom = '16px'

  // Set Today button
  const setTodayBtn = createButton({
    text: 'Set Today',
    variant: 'outlined'
  })

  setTodayBtn.on('click', () => {
    datePicker.setValue(new Date())
  })

  // Set Specific Date button
  const setDateBtn = createButton({
    text: 'Set to Christmas',
    variant: 'outlined'
  })

  setDateBtn.on('click', () => {
    const currentYear = new Date().getFullYear()
    datePicker.setValue(new Date(currentYear, 11, 25)) // December 25th
  })

  // Set Min Date button
  const setMinDateBtn = createButton({
    text: 'Set Min Date to Today',
    variant: 'outlined'
  })

  setMinDateBtn.on('click', () => {
    datePicker.setMinDate(new Date())
  })

  // Clear button
  const clearBtn = createButton({
    text: 'Clear Date',
    variant: 'outlined'
  })

  clearBtn.on('click', () => {
    datePicker.clear()
  })

  // Open Calendar button
  const openBtn = createButton({
    text: 'Open Calendar',
    variant: 'outlined'
  })

  openBtn.on('click', () => {
    datePicker.open()
  })

  // Get Value button
  const getValueBtn = createButton({
    text: 'Get Value',
    variant: 'outlined'
  })

  // Status display for current value
  const statusDisplay = document.createElement('div')
  statusDisplay.style.marginTop = '16px'
  statusDisplay.style.padding = '8px'
  statusDisplay.style.borderRadius = '4px'
  statusDisplay.style.backgroundColor = '#f5f5f5'
  statusDisplay.style.minHeight = '40px'
  statusDisplay.textContent = 'No date selected'

  getValueBtn.on('click', () => {
    const value = datePicker.getValue()
    if (value) {
      const formattedDate = value instanceof Date
        ? value.toLocaleDateString()
        : `${value[0].toLocaleDateString()} - ${value[1].toLocaleDateString()}`

      statusDisplay.textContent = `Current value: ${formattedDate}`
      statusDisplay.style.backgroundColor = '#e8f4fd'
    } else {
      statusDisplay.textContent = 'No date selected'
      statusDisplay.style.backgroundColor = '#f5f5f5'
    }
  })

  // Add buttons to container
  buttonContainer.appendChild(setTodayBtn.element)
  buttonContainer.appendChild(setDateBtn.element)
  buttonContainer.appendChild(setMinDateBtn.element)
  buttonContainer.appendChild(clearBtn.element)
  buttonContainer.appendChild(openBtn.element)
  buttonContainer.appendChild(getValueBtn.element)

  // Add components to layout
  layout.showcase.appendChild(datePicker.element)
  layout.showcase.appendChild(buttonContainer)
  layout.showcase.appendChild(statusDisplay)

  // Add description of API
  const apiDescription = document.createElement('div')
  apiDescription.innerHTML = `
    <p style="margin-top: 16px; font-weight: bold;">Available API Methods:</p>
    <ul style="margin-left: 20px; line-height: 1.5;">
      <li><code>setValue(date)</code>: Sets the selected date</li>
      <li><code>getValue()</code>: Gets the selected date</li>
      <li><code>clear()</code>: Clears the selected date</li>
      <li><code>open()</code>: Opens the date picker</li>
      <li><code>close()</code>: Closes the date picker</li>
      <li><code>setMinDate(date)</code>: Sets the minimum selectable date</li>
      <li><code>setMaxDate(date)</code>: Sets the maximum selectable date</li>
      <li><code>enable()/disable()</code>: Enables or disables the date picker</li>
    </ul>
  `
  layout.showcase.appendChild(apiDescription)
}
