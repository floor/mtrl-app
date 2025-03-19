// src/client/content/components/timepickers/variants.js

import {
  createComponentsSectionLayout
} from '../../../layout'

import {
  createLayout,
  createButton,
  createTimePicker
} from 'mtrl'

export const initVariants = (container) => {
  const title = 'TimePicker Variants'
  const description = 'TimePickers come in different types and orientations'
  const layout = createLayout(createComponentsSectionLayout({ title, description }), container).component

  // Create grid layout for variants
  const grid = document.createElement('div')
  grid.style.display = 'grid'
  grid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(280px, 1fr))'
  grid.style.gap = '24px'
  grid.style.marginBottom = '24px'

  // 1. Standard TimePicker (default)
  const standardContainer = createSectionContainer('Standard TimePicker', 'Default clock face for time selection')

  const standardInput = createTimeInput('3:45 PM')

  const standardPicker = createTimePicker({
    value: new Date(2025, 0, 1, 15, 45, 0)
  })

  standardInput.addEventListener('click', () => {
    standardPicker.element.classList.remove('hidden')
    document.body.appendChild(standardPicker.element)
  })

  standardPicker.on('select', ({ value }) => {
    // Format the date object for display
    const hours = value.getHours()
    const minutes = value.getMinutes()
    const period = hours >= 12 ? 'PM' : 'AM'
    const hour12 = hours % 12 === 0 ? 12 : hours % 12
    const minutesStr = minutes.toString().padStart(2, '0')

    standardInput.value = `${hour12}:${minutesStr} ${period}`
  })

  standardContainer.appendChild(standardInput)

  // 2. Compact TimePicker
  const compactContainer = createSectionContainer('Compact TimePicker', 'Smaller, more condensed time picker')

  const compactInput = createTimeInput('8:15 AM')

  const compactPicker = createTimePicker({
    value: new Date(2025, 0, 1, 8, 15, 0)
  })

  compactInput.addEventListener('click', () => {
    compactPicker.element.classList.remove('hidden')
    document.body.appendChild(compactPicker.element)
  })

  compactPicker.on('select', ({ value }) => {
    // Format the date object for display
    const hours = value.getHours()
    const minutes = value.getMinutes()
    const period = hours >= 12 ? 'PM' : 'AM'
    const hour12 = hours % 12 === 0 ? 12 : hours % 12
    const minutesStr = minutes.toString().padStart(2, '0')

    compactInput.value = `${hour12}:${minutesStr} ${period}`
  })

  compactContainer.appendChild(compactInput)

  // 3. Vertical Orientation
  const verticalContainer = createSectionContainer('Vertical Orientation', 'Default layout optimized for mobile')

  const verticalButton = createButton({
    text: 'Open Vertical TimePicker',
    variant: 'outlined'
  })

  const verticalPicker = createTimePicker({
    value: new Date(2025, 0, 1, 10, 30, 0),
    orientation: 'vertical'
  })

  verticalButton.on('click', () => {
    verticalPicker.element.classList.remove('hidden')
    document.body.appendChild(verticalPicker.element)
  })

  verticalContainer.appendChild(verticalButton.element)

  // 4. Horizontal Orientation
  const horizontalContainer = createSectionContainer('Horizontal Orientation', 'Landscape layout for desktop')

  const horizontalButton = createButton({
    text: 'Open Horizontal TimePicker',
    variant: 'outlined'
  })

  const horizontalPicker = createTimePicker({
    value: new Date(2025, 0, 1, 18, 0, 0),
    orientation: 'horizontal'
  })

  horizontalButton.on('click', () => {
    horizontalPicker.element.classList.remove('hidden')
    document.body.appendChild(horizontalPicker.element)
  })

  horizontalContainer.appendChild(horizontalButton.element)

  // Add all variants to the grid
  grid.appendChild(standardContainer)
  grid.appendChild(compactContainer)
  grid.appendChild(verticalContainer)
  grid.appendChild(horizontalContainer)

  // Add the grid to the layout
  layout.body.appendChild(grid)

  // Description of variants
  const variantInfo = document.createElement('div')
  variantInfo.innerHTML = `
    <p>The TimePicker component supports different variants to suit different use cases:</p>
    <ul style="margin-left: 20px; line-height: 1.5;">
      <li><strong>Standard TimePicker:</strong> Uses a clock face interface for intuitive time selection with regular size.</li>
      <li><strong>Compact TimePicker:</strong> Smaller variant good for space-constrained interfaces.</li>
      <li><strong>Vertical Orientation:</strong> Compact layout with clock below time display, best for mobile devices.</li>
      <li><strong>Horizontal Orientation:</strong> Wider layout with clock beside time display, optimized for desktop views.</li>
    </ul>
  `
  layout.body.appendChild(variantInfo)
}

// Helper function to create section containers
function createSectionContainer (title, description) {
  const container = document.createElement('div')

  const titleEl = document.createElement('h4')
  titleEl.textContent = title
  titleEl.style.marginBottom = '4px'

  const descEl = document.createElement('p')
  descEl.textContent = description
  descEl.style.fontSize = '14px'
  descEl.style.marginTop = '0'
  descEl.style.marginBottom = '12px'

  container.appendChild(titleEl)
  container.appendChild(descEl)

  return container
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
