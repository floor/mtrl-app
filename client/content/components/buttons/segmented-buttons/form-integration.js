// src/client/content/components/segmented-button/form-integration.js
import {
  createComponentSection
} from '../../../../layout'

import {
  createLayout,
  createButton
} from 'mtrl'

import {
  createSegmentedButton,
  SelectionMode
} from 'mtrl/src/components/segmented-button'

export const initFormIntegration = (container) => {
  const title = 'Form Integration'
  const layout = createLayout(createComponentSection({
    title,
    description: 'Segmented buttons can be used within forms as an alternative to radio buttons or checkboxes.',
    class: 'noflex'
  }), container).component

  const formExampleDescription = document.createElement('p')
  formExampleDescription.textContent = 'Segmented buttons can be used in forms to select options. Single-select mode works like radio buttons, while multi-select mode works like checkboxes.'
  layout.showcase.appendChild(formExampleDescription)

  // Create a simple form
  const demoForm = document.createElement('form')
  demoForm.id = 'segmented-button-form'
  demoForm.style.width = '100%'
  demoForm.style.maxWidth = '600px'
  demoForm.style.padding = '20px'
  demoForm.style.backgroundColor = 'var(--mtrl-sys-color-surface-container)'
  demoForm.style.borderRadius = '4px'
  demoForm.style.marginBottom = '32px'

  // Prevent actual form submission
  demoForm.addEventListener('submit', (event) => {
    event.preventDefault()

    // Get form data
    const formData = new FormData(demoForm)
    const formValues = {}

    // Convert FormData to object
    for (const [key, value] of formData.entries()) {
      if (key in formValues) {
        // If key already exists, convert to array
        if (!Array.isArray(formValues[key])) {
          formValues[key] = [formValues[key]]
        }
        formValues[key].push(value)
      } else {
        formValues[key] = value
      }
    }

    // Display form data
    formResult.textContent = JSON.stringify(formValues, null, 2)
    log.info('Form submitted', formValues)
  })

  // Form title
  const formTitle = document.createElement('h4')
  formTitle.textContent = 'Event Preferences'
  formTitle.style.marginTop = '0'
  demoForm.appendChild(formTitle)

  // Event type field (single-select)
  const eventTypeLabel = document.createElement('label')
  eventTypeLabel.textContent = 'Event Type:'
  eventTypeLabel.style.display = 'block'
  eventTypeLabel.style.marginBottom = '4px'
  eventTypeLabel.style.fontWeight = 'bold'
  demoForm.appendChild(eventTypeLabel)

  // Create a hidden input to store the selected value
  const eventTypeInput = document.createElement('input')
  eventTypeInput.type = 'hidden'
  eventTypeInput.name = 'eventType'
  eventTypeInput.value = 'conference' // Default value
  demoForm.appendChild(eventTypeInput)

  // Create segmented button for event type
  const eventTypeButton = createSegmentedButton({
    mode: SelectionMode.SINGLE,
    segments: [
      { text: 'Conference', value: 'conference', selected: true },
      { text: 'Workshop', value: 'workshop' },
      { text: 'Seminar', value: 'seminar' }
    ]
  })

  // Update hidden input when selection changes
  eventTypeButton.on('change', (event) => {
    eventTypeInput.value = event.value[0]
    log.info(`Event type changed to: ${event.value[0]}`)
  })

  const eventTypeContainer = document.createElement('div')
  eventTypeContainer.style.marginBottom = '20px'
  eventTypeContainer.appendChild(eventTypeButton.element)
  demoForm.appendChild(eventTypeContainer)

  // Days of week field (multi-select)
  const daysLabel = document.createElement('label')
  daysLabel.textContent = 'Preferred Days:'
  daysLabel.style.display = 'block'
  daysLabel.style.marginBottom = '4px'
  daysLabel.style.fontWeight = 'bold'
  demoForm.appendChild(daysLabel)

  // Create segmented button for days
  const daysButton = createSegmentedButton({
    mode: SelectionMode.MULTI,
    segments: [
      { text: 'Mon', value: 'monday' },
      { text: 'Tue', value: 'tuesday' },
      { text: 'Wed', value: 'wednesday' },
      { text: 'Thu', value: 'thursday' },
      { text: 'Fri', value: 'friday' }
    ]
  })

  // Create hidden inputs for each selected day
  const createDayInput = (value) => {
    const input = document.createElement('input')
    input.type = 'hidden'
    input.name = 'preferredDays'
    input.value = value
    input.id = `day-${value}`
    return input
  }

  // Update hidden inputs when selection changes
  daysButton.on('change', (event) => {
    // Remove all existing day inputs
    document.querySelectorAll('[id^="day-"]').forEach(el => el.remove())

    // Add new inputs for selected days
    event.value.forEach(day => {
      demoForm.appendChild(createDayInput(day))
    })

    log.info(`Preferred days changed to: ${event.value.join(', ')}`)
  })

  const daysContainer = document.createElement('div')
  daysContainer.style.marginBottom = '20px'
  daysContainer.appendChild(daysButton.element)
  demoForm.appendChild(daysContainer)

  // Format field (single-select)
  const formatLabel = document.createElement('label')
  formatLabel.textContent = 'Format:'
  formatLabel.style.display = 'block'
  formatLabel.style.marginBottom = '4px'
  formatLabel.style.fontWeight = 'bold'
  demoForm.appendChild(formatLabel)

  // Create a hidden input for the format
  const formatInput = document.createElement('input')
  formatInput.type = 'hidden'
  formatInput.name = 'format'
  formatInput.value = 'in-person' // Default value
  demoForm.appendChild(formatInput)

  // Create segmented button for format
  const formatButton = createSegmentedButton({
    mode: SelectionMode.SINGLE,
    segments: [
      { text: 'In-Person', value: 'in-person', selected: true },
      { text: 'Hybrid', value: 'hybrid' },
      { text: 'Virtual', value: 'virtual' }
    ]
  })

  // Update hidden input when selection changes
  formatButton.on('change', (event) => {
    formatInput.value = event.value[0]
    log.info(`Format changed to: ${event.value[0]}`)
  })

  const formatContainer = document.createElement('div')
  formatContainer.style.marginBottom = '24px'
  formatContainer.appendChild(formatButton.element)
  demoForm.appendChild(formatContainer)

  // Submit button
  const submitButton = createButton({
    text: 'Submit Preferences',
    variant: 'filled'
  })

  submitButton.element.type = 'submit'
  demoForm.appendChild(submitButton.element)

  // Add form to showcase
  layout.showcase.appendChild(demoForm)

  // Results display
  const formResultTitle = document.createElement('h4')
  formResultTitle.textContent = 'Form Submission Result:'
  layout.showcase.appendChild(formResultTitle)

  const formResult = document.createElement('pre')
  formResult.style.backgroundColor = 'var(--mtrl-sys-color-surface-container-highest)'
  formResult.style.padding = '16px'
  formResult.style.borderRadius = '4px'
  formResult.style.overflow = 'auto'
  formResult.style.maxHeight = '200px'
  formResult.textContent = '// Submit the form to see results'
  layout.showcase.appendChild(formResult)

  // Implementation notes
  const implementationNotes = document.createElement('div')
  implementationNotes.style.marginTop = '32px'
  implementationNotes.style.padding = '16px'
  implementationNotes.style.backgroundColor = 'var(--mtrl-sys-color-surface-container)'
  implementationNotes.style.borderRadius = '4px'

  const notesTitle = document.createElement('h3')
  notesTitle.textContent = 'Implementation Notes'
  notesTitle.style.marginTop = '0'
  implementationNotes.appendChild(notesTitle)

  const notesList = document.createElement('ul')
  notesList.innerHTML = `
    <li><strong>Single-select mode</strong> works like radio buttons, where only one option can be selected</li>
    <li><strong>Multi-select mode</strong> works like checkboxes, where multiple options can be selected</li>
    <li>Use hidden inputs to store selected values for form submission</li>
    <li>Update hidden inputs when segmented button selection changes</li>
    <li>For multi-select, use multiple hidden inputs with the same name or a single input with a comma-separated list, depending on your backend requirements</li>
    <li>Ensure proper validation is in place for both client and server sides</li>
  `
  implementationNotes.appendChild(notesList)

  const codeExample = document.createElement('pre')
  codeExample.style.backgroundColor = 'var(--mtrl-sys-color-surface-container-highest)'
  codeExample.style.padding = '12px'
  codeExample.style.borderRadius = '4px'
  codeExample.style.overflow = 'auto'
  codeExample.textContent = `// JavaScript implementation example
const segmentedButton = createSegmentedButton({
  mode: SelectionMode.SINGLE,
  segments: [
    { text: 'Option A', value: 'a', selected: true },
    { text: 'Option B', value: 'b' }
  ]
});

// Create hidden input for form submission
const hiddenInput = document.createElement('input');
hiddenInput.type = 'hidden';
hiddenInput.name = 'selectedOption';
hiddenInput.value = 'a'; // Default value
form.appendChild(hiddenInput);

// Update hidden input when selection changes
segmentedButton.on('change', (event) => {
  hiddenInput.value = event.value[0];
});

// Add segmented button to form
form.appendChild(segmentedButton.element);`

  implementationNotes.appendChild(codeExample)
  layout.showcase.appendChild(implementationNotes)
}
