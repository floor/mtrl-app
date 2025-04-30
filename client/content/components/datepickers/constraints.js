import {
  createComponentSection
} from '../../../layout'

import {
  createLayout,
  createDatePicker
} from 'mtrl'

export const initConstraints = (container) => {
  const title = 'Date Constraints'
  const description = 'Restrict date selection with min and max date constraints'
  const layout = createLayout(createComponentSection({ title, description, class: 'noflex' }), container).component

  // Get dates for examples
  const today = new Date()
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(today.getDate() - 7)

  const oneWeekAhead = new Date()
  oneWeekAhead.setDate(today.getDate() + 7)

  const nextMonth = new Date()
  nextMonth.setMonth(today.getMonth() + 1)

  const currentYear = today.getFullYear()
  const nextYear = new Date(currentYear + 1, 0, 1)

  // Create examples container
  const examples = document.createElement('div')
  examples.style.display = 'flex'
  examples.style.flexDirection = 'column'
  examples.style.gap = '24px'

  // 1. Future dates only (for booking appointments)
  const futureContainer = document.createElement('div')

  const futureTitle = document.createElement('h4')
  futureTitle.textContent = 'Future Dates Only'
  futureTitle.style.marginBottom = '4px'

  const futureDesc = document.createElement('p')
  futureDesc.textContent = 'Restrict selection to future dates only (for booking appointments)'
  futureDesc.style.fontSize = '14px'
  futureDesc.style.marginTop = '0'
  futureDesc.style.marginBottom = '8px'

  const futurePicker = createDatePicker({
    label: 'Appointment Date',
    placeholder: 'Select a future date',
    minDate: today // Cannot select dates before today
  })

  futureContainer.appendChild(futureTitle)
  futureContainer.appendChild(futureDesc)
  futureContainer.appendChild(futurePicker.element)

  // 2. Date range within one month (for vacation booking)
  const rangeContainer = document.createElement('div')

  const rangeTitle = document.createElement('h4')
  rangeTitle.textContent = 'Date Range Within One Month'
  rangeTitle.style.marginBottom = '4px'

  const rangeDesc = document.createElement('p')
  rangeDesc.textContent = 'Can only select dates between today and next month (for vacation booking)'
  rangeDesc.style.fontSize = '14px'
  rangeDesc.style.marginTop = '0'
  rangeDesc.style.marginBottom = '8px'

  const rangePicker = createDatePicker({
    label: 'Vacation Period',
    placeholder: 'Select within one month',
    minDate: today,
    maxDate: nextMonth
  })

  rangeContainer.appendChild(rangeTitle)
  rangeContainer.appendChild(rangeDesc)
  rangeContainer.appendChild(rangePicker.element)

  // 3. Valid date of birth (past dates only)
  const dobContainer = document.createElement('div')

  const dobTitle = document.createElement('h4')
  dobTitle.textContent = 'Date of Birth'
  dobTitle.style.marginBottom = '4px'

  const dobDesc = document.createElement('p')
  dobDesc.textContent = 'Only allows selection of past dates, up to today (for date of birth)'
  dobDesc.style.fontSize = '14px'
  dobDesc.style.marginTop = '0'
  dobDesc.style.marginBottom = '8px'

  const dobPicker = createDatePicker({
    label: 'Date of Birth',
    placeholder: 'Select your birthday',
    maxDate: today, // Cannot select future dates
    dateFormat: 'MMMM D, YYYY'
  })

  dobContainer.appendChild(dobTitle)
  dobContainer.appendChild(dobDesc)
  dobContainer.appendChild(dobPicker.element)

  // 4. Recent dates only (last week to next week)
  const recentContainer = document.createElement('div')

  const recentTitle = document.createElement('h4')
  recentTitle.textContent = 'Recent Dates Window'
  recentTitle.style.marginBottom = '4px'

  const recentDesc = document.createElement('p')
  recentDesc.textContent = 'Limited to dates from last week to next week (for recent events)'
  recentDesc.style.fontSize = '14px'
  recentDesc.style.marginTop = '0'
  recentDesc.style.marginBottom = '8px'

  const recentPicker = createDatePicker({
    label: 'Recent Event',
    placeholder: 'Select a recent date',
    minDate: oneWeekAgo,
    maxDate: oneWeekAhead
  })

  recentContainer.appendChild(recentTitle)
  recentContainer.appendChild(recentDesc)
  recentContainer.appendChild(recentPicker.element)

  // Add all examples to the container
  examples.appendChild(futureContainer)
  examples.appendChild(rangeContainer)
  examples.appendChild(dobContainer)
  examples.appendChild(recentContainer)

  // Add the examples to the layout
  layout.body.appendChild(examples)

  // Add explanation about constraints
  const explanation = document.createElement('div')
  explanation.innerHTML = `
    <p style="margin-top: 16px;">Date constraints can be applied in different ways:</p>
    <ul style="margin-left: 20px; line-height: 1.5;">
      <li>Using the <code>minDate</code> property to prevent selection of dates before a certain date</li>
      <li>Using the <code>maxDate</code> property to prevent selection of dates after a certain date</li>
      <li>Using both <code>minDate</code> and <code>maxDate</code> to create a valid date range</li>
      <li>Using the <code>setMinDate()</code> and <code>setMaxDate()</code> methods to update constraints programmatically</li>
    </ul>
    <p>Disabled dates are grayed out in the calendar and cannot be selected.</p>
  `
  layout.body.appendChild(explanation)
}
