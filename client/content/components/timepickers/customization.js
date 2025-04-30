// src/client/content/components/timepickers/customization.js

import {
  createComponentSection
} from '../../../layout'

import {
  createLayout,
  createTimePicker
} from 'mtrl'

export const initCustomization = (container) => {
  const title = 'Customized TimePickers'
  const description = 'Customize the appearance and behavior of TimePickers'
  const layout = createLayout(createComponentSection({ title, description, class: 'noflex' }), container).component

  // Create grid layout for customized examples
  const grid = document.createElement('div')
  grid.style.display = 'grid'
  grid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(280px, 1fr))'
  grid.style.gap = '24px'
  grid.style.marginBottom = '24px'

  // 1. Custom Button Text
  const customButtonsContainer = document.createElement('div')

  const customButtonsTitle = document.createElement('h4')
  customButtonsTitle.textContent = 'Custom Button Text'
  customButtonsTitle.style.marginBottom = '4px'

  const customButtonsDesc = document.createElement('p')
  customButtonsDesc.textContent = 'Customized text for action buttons'
  customButtonsDesc.style.fontSize = '14px'
  customButtonsDesc.style.marginTop = '0'
  customButtonsDesc.style.marginBottom = '12px'

  const customButtonsInput = createTimeInput('4:30 PM')

  const customButtonsPicker = createTimePicker({
    title: 'Schedule Call',
    value: '16:30',
    cancelText: 'Dismiss',
    confirmText: 'Schedule'
  })

  customButtonsInput.addEventListener('click', () => {
    customButtonsPicker.open()
  })

  customButtonsPicker.on('confirm', (time) => {
    // Convert 24h to 12h format
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours, 10)
    const period = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 === 0 ? 12 : hour % 12

    customButtonsInput.value = `${hour12}:${minutes} ${period}`
  })

  customButtonsContainer.appendChild(customButtonsTitle)
  customButtonsContainer.appendChild(customButtonsDesc)
  customButtonsContainer.appendChild(customButtonsInput)

  // 2. Custom Icons
  const customIconsContainer = document.createElement('div')

  const customIconsTitle = document.createElement('h4')
  customIconsTitle.textContent = 'Custom Icons'
  customIconsTitle.style.marginBottom = '4px'

  const customIconsDesc = document.createElement('p')
  customIconsDesc.textContent = 'Custom icons for clock and keyboard buttons'
  customIconsDesc.style.fontSize = '14px'
  customIconsDesc.style.marginTop = '0'
  customIconsDesc.style.marginBottom = '12px'

  const customIconsInput = createTimeInput('10:00 AM')

  // Custom icons
  const customClockIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
      <path d="M12 2 L12 4"></path>
      <path d="M12 20 L12 22"></path>
      <path d="M20 12 L22 12"></path>
      <path d="M2 12 L4 12"></path>
    </svg>
  `

  const customKeyboardIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
      <path d="M6 8h.01"></path>
      <path d="M10 8h.01"></path>
      <path d="M14 8h.01"></path>
      <path d="M18 8h.01"></path>
      <path d="M6 12h.01"></path>
      <path d="M10 12h.01"></path>
      <path d="M14 12h.01"></path>
      <path d="M18 12h.01"></path>
      <path d="M7 16h10"></path>
    </svg>
  `

  const customIconsPicker = createTimePicker({
    title: 'Meeting Start Time',
    value: '10:00',
    clockIcon: customClockIcon,
    keyboardIcon: customKeyboardIcon
  })

  customIconsInput.addEventListener('click', () => {
    customIconsPicker.open()
  })

  customIconsPicker.on('confirm', (time) => {
    // Convert 24h to 12h format
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours, 10)
    const period = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 === 0 ? 12 : hour % 12

    customIconsInput.value = `${hour12}:${minutes} ${period}`
  })

  customIconsContainer.appendChild(customIconsTitle)
  customIconsContainer.appendChild(customIconsDesc)
  customIconsContainer.appendChild(customIconsInput)

  // 3. Custom Container
  const customContainerTitle = document.createElement('h4')
  customContainerTitle.textContent = 'Custom Container'
  customContainerTitle.style.marginBottom = '4px'

  const customContainerDesc = document.createElement('p')
  customContainerDesc.textContent = 'TimePicker mounted in a specific container'
  customContainerDesc.style.fontSize = '14px'
  customContainerDesc.style.marginTop = '0'
  customContainerDesc.style.marginBottom = '12px'

  const customContainerDiv = document.createElement('div')
  customContainerDiv.style.border = '1px dashed #6200ee'
  customContainerDiv.style.padding = '16px'
  customContainerDiv.style.borderRadius = '4px'
  customContainerDiv.style.position = 'relative'
  customContainerDiv.style.minHeight = '120px'
  customContainerDiv.style.textAlign = 'center'

  const customContainerLabel = document.createElement('p')
  customContainerLabel.textContent = 'This TimePicker will open inline in this container'
  customContainerLabel.style.margin = '0 0 16px 0'

  const openCustomContainerBtn = document.createElement('button')
  openCustomContainerBtn.textContent = 'Open Inline TimePicker'
  openCustomContainerBtn.style.padding = '8px 16px'
  openCustomContainerBtn.style.backgroundColor = '#6200ee'
  openCustomContainerBtn.style.color = 'white'
  openCustomContainerBtn.style.border = 'none'
  openCustomContainerBtn.style.borderRadius = '4px'
  openCustomContainerBtn.style.cursor = 'pointer'

  customContainerDiv.appendChild(customContainerLabel)
  customContainerDiv.appendChild(openCustomContainerBtn)

  // Add custom container to the parent
  const customContainerWrapper = document.createElement('div')
  customContainerWrapper.appendChild(customContainerTitle)
  customContainerWrapper.appendChild(customContainerDesc)
  customContainerWrapper.appendChild(customContainerDiv)

  // Create the time picker with custom container
  const customContainerPicker = createTimePicker({
    title: 'Inline TimePicker',
    value: '12:00',
    container: customContainerDiv, // Set the custom container
    isOpen: false // Start closed, will open on button click
  })

  openCustomContainerBtn.addEventListener('click', () => {
    customContainerPicker.open()
  })

  // Add all examples to the grid
  grid.appendChild(customButtonsContainer)
  grid.appendChild(customIconsContainer)
  grid.appendChild(customContainerWrapper)

  // Add the grid to the layout
  layout.body.appendChild(grid)

  // Add customization instructions
  const customizationInfo = document.createElement('div')
  customizationInfo.innerHTML = `
    <h4>Customizing TimePickers</h4>
    <p>The TimePicker component offers several customization options:</p>
    
    <h5>1. Custom Text and Labels</h5>
    <pre style="background-color: #f5f5f5; padding: 12px; border-radius: 4px; overflow-x: auto;">
const timePicker = createTimePicker({
  title: 'Schedule Your Call',     // Custom title
  cancelText: 'Dismiss',           // Custom cancel button text
  confirmText: 'Schedule'          // Custom confirm button text
});</pre>
    
    <h5>2. Custom Icons</h5>
    <pre style="background-color: #f5f5f5; padding: 12px; border-radius: 4px; overflow-x: auto;">
const timePicker = createTimePicker({
  clockIcon: '&lt;svg&gt;...&lt;/svg&gt;',    // Custom clock icon SVG
  keyboardIcon: '&lt;svg&gt;...&lt;/svg&gt;'  // Custom keyboard icon SVG
});</pre>
    
    <h5>3. Custom Container</h5>
    <pre style="background-color: #f5f5f5; padding: 12px; border-radius: 4px; overflow-x: auto;">
const timePicker = createTimePicker({
  container: document.getElementById('my-container'),  // Custom container element
  isOpen: true  // Start open when using a custom container for inline display
});</pre>
    
    <h5>4. CSS Customization</h5>
    <p>You can customize the appearance further using CSS:</p>
    <pre style="background-color: #f5f5f5; padding: 12px; border-radius: 4px; overflow-x: auto;">
/* Custom time picker styling */
.mtrl-time-picker-dialog {
  --mtrl-primary: #0088ff;
  --mtrl-on-primary: #ffffff;
  
  /* Custom shadows */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

/* Custom dial styling */
.mtrl-time-picker-dial-face {
  background-color: #f0f8ff;
}
</pre>
  `
  layout.body.appendChild(customizationInfo)
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
