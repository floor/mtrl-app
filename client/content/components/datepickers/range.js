import {
  createComponentSection
} from '../../../layout'

import {
  createLayout,
  createDatePicker,
  DATEPICKER_SELECTION_MODES
} from 'mtrl'

export const initRange = (container) => {
  const title = 'Date Range Selection'
  const description = 'Select a start and end date for a date range'
  const layout = createLayout(createComponentSection({ title, description, class: 'noflex' }), container).component

  // Create date range picker
  const rangePicker = createDatePicker({
    label: 'Select Date Range',
    placeholder: 'Start - End Date',
    selectionMode: DATEPICKER_SELECTION_MODES.RANGE
  })

  // Status display
  const statusDisplay = document.createElement('div')
  statusDisplay.style.marginTop = '16px'
  statusDisplay.style.padding = '8px'
  statusDisplay.style.borderRadius = '4px'
  statusDisplay.style.backgroundColor = '#f5f5f5'
  statusDisplay.style.minHeight = '40px'
  statusDisplay.textContent = 'No date range selected'

  // Listen for date selection
  rangePicker.on('change', (data) => {
    if (!data.value) {
      statusDisplay.textContent = 'No date range selected'
      return
    }

    if (Array.isArray(data.value)) {
      const [startDate, endDate] = data.value
      const formattedStart = startDate.toLocaleDateString()
      const formattedEnd = endDate.toLocaleDateString()

      // Calculate number of days
      const diffTime = Math.abs(endDate - startDate)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1

      statusDisplay.textContent = `Selected range: ${formattedStart} to ${formattedEnd} (${diffDays} days)`
      statusDisplay.style.backgroundColor = '#e8f4fd'
    }
  })

  // Add components to layout
  layout.body.appendChild(rangePicker.element)
  layout.body.appendChild(statusDisplay)

  // Add some helpful text
  const helpText = document.createElement('p')
  helpText.textContent = 'Select a start date and an end date to create a range. The days in between will be highlighted.'
  helpText.style.marginTop = '8px'
  helpText.style.fontSize = '14px'
  layout.body.appendChild(helpText)
}
