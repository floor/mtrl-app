// src/client/content/components/chips/interactive.js
import { createComponentsSectionLayout } from '../../../layout'
import { createLayout, createChip, createTextfield, createButton } from 'mtrl'
import { locationIcon } from '../../../icons'

/**
 * Initializes an interactive chip example with city selection
 * @param {HTMLElement} container - Container element
 */
export const initInteractiveChipExample = (container) => {
  const title = 'Interactive Chip Example'
  const subtitle = 'City selection with feedback'
  const layout = createLayout(createComponentsSectionLayout({ title, subtitle }), container).component

  // Create a container for the example
  const demoContainer = document.createElement('div')
  demoContainer.style.display = 'flex'
  demoContainer.style.flexDirection = 'column'
  demoContainer.style.gap = '16px'

  // Create a label
  const label = document.createElement('p')
  label.textContent = 'Select your city:'

  // Create a container for the city chips
  const cityChipsContainer = document.createElement('div')
  cityChipsContainer.className = 'mtrl-chip-set'
  cityChipsContainer.style.display = 'flex'
  cityChipsContainer.style.flexWrap = 'wrap'
  cityChipsContainer.style.gap = '8px'

  // City chip configurations
  const cityConfigs = [
    { text: 'New York', value: 'new-york' },
    { text: 'Los Angeles', value: 'los-angeles' },
    { text: 'Chicago', value: 'chicago' },
    { text: 'San Francisco', value: 'san-francisco' }
  ]

  // Result display
  const resultText = document.createElement('p')
  resultText.textContent = 'Please select a city'
  resultText.style.padding = '8px'
  resultText.style.backgroundColor = 'var(--mtrl-sys-color-primary)'
  resultText.style.color = 'var(--mtrl-sys-color-on-primary)'
  resultText.style.borderRadius = '4px'

  // Create and add city chips
  const cityChips = []
  cityConfigs.forEach(config => {
    const chip = createChip({
      text: config.text,
      variant: 'assist',
      leadingIcon: locationIcon,
      value: config.value
    })

    cityChipsContainer.appendChild(chip.element)
    cityChips.push(chip)

    // Add click handler for selection using component API
    chip.on('click', () => {
      // Deselect all other chips first (single selection)
      cityChips.forEach(c => {
        if (c !== chip && c.isSelected()) {
          c.setSelected(false)
        }
      })

      // Toggle this chip and update the result
      chip.toggleSelected()

      if (chip.isSelected()) {
        resultText.textContent = `You selected: ${chip.getText()}`
        resultText.style.backgroundColor = 'var(--mtrl-sys-color-tertiary-container)' // Light blue background
        resultText.style.color = 'var(--mtrl-sys-on-color-tertiary-container)'
      } else {
        resultText.textContent = 'Please select a city'
        resultText.style.color = 'var(--mtrl-sys-on-color-surface-bright)'
        resultText.style.backgroundColor = 'var(--mtrl-sys-color-surface-bright)' // Default gray background
      }
    })
  })

  // Add a textfield for custom city input
  const customCityContainer = document.createElement('div')
  customCityContainer.style.display = 'flex'
  customCityContainer.style.flexDirection = 'column'
  customCityContainer.style.gap = '8px'
  customCityContainer.style.marginTop = '16px'
  customCityContainer.style.backgroundColor = 'var(--mtrl-sys-color-surface-bright)'

  const customCityLabel = document.createElement('p')
  customCityLabel.textContent = 'Or enter your own city:'

  const customCityInput = createTextfield({
    label: 'Custom city',
    variant: 'outlined'
  })

  const addCustomCityButton = createButton({
    text: 'Add City',
    variant: 'outlined',
    size: 'small'
  })

  // Add event listener for adding custom city
  addCustomCityButton.element.addEventListener('click', () => {
    const cityName = customCityInput.getValue().trim()
    if (cityName) {
      // Deselect all existing chips
      cityChips.forEach(c => c.setSelected(false))

      // Add the new city chip
      const customChip = createChip({
        text: cityName,
        variant: 'assist',
        leadingIcon: locationIcon,
        value: cityName.toLowerCase().replace(/\s+/g, '-'),
        selected: true
      })

      // Add click handler for the new chip using component API
      customChip.on('click', () => {
        // Deselect all other chips
        cityChips.forEach(c => c.setSelected(false))

        // Toggle this chip and update the result
        customChip.toggleSelected()

        if (customChip.isSelected()) {
          resultText.textContent = `You selected: ${customChip.getText()}`
          resultText.style.backgroundColor = '#e3f2fd' // Light blue background
        } else {
          resultText.textContent = 'Please select a city'
          resultText.style.backgroundColor = '#f5f5f5' // Default gray background
        }
      })

      // Add the new chip to the container and array
      cityChipsContainer.appendChild(customChip.element)
      cityChips.push(customChip)

      // Update the result text
      resultText.textContent = `You selected: ${cityName}`
      resultText.style.backgroundColor = '#e3f2fd' // Light blue background

      // Clear the input
      customCityInput.setValue('')
    }
  })

  // Handle Enter key press
  customCityInput.element.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addCustomCityButton.element.click()
    }
  })

  // Add elements to containers
  customCityContainer.appendChild(customCityLabel)
  customCityContainer.appendChild(customCityInput.element)
  customCityContainer.appendChild(addCustomCityButton.element)

  // Add all elements to the demo container
  demoContainer.appendChild(label)
  demoContainer.appendChild(cityChipsContainer)
  demoContainer.appendChild(resultText)
  demoContainer.appendChild(customCityContainer)

  layout.body.appendChild(demoContainer)
}
