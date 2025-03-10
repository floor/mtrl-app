// src/client/content/components/chips.js
import { capitalize } from '../../core/utils'

import {
  contentLayout,
  createComponentsSectionLayout
} from '../../config'

import {
  createLayout,
  createButton,
  createTextfield
} from 'mtrl'

import createChip, { CHIP_VARIANTS } from 'mtrl/src/components/chip'
import createChipSet from 'mtrl/src/components/chip/chip-set'

// Icons for chip examples
const checkIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/>
</svg>`

const closeIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" fill="currentColor"/>
</svg>`

const addIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor"/>
</svg>`

const faceIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M9 11.75c-.69 0-1.25.56-1.25 1.25s.56 1.25 1.25 1.25 1.25-.56 1.25-1.25-.56-1.25-1.25-1.25zm6 0c-.69 0-1.25.56-1.25 1.25s.56 1.25 1.25 1.25 1.25-.56 1.25-1.25-.56-1.25-1.25-1.25zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-.29.02-.58.05-.86 2.36-1.05 4.23-2.98 5.21-5.37C11.07 8.33 14.05 10 17.42 10c.78 0 1.53-.09 2.25-.26.21.71.33 1.47.33 2.26 0 4.41-3.59 8-8 8z" fill="currentColor"/>
</svg>`

const locationIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
</svg>`

/**
 * Creates the main Chips content showcase
 * @param {HTMLElement} container - The container element to append content to
 */
export const createChipsContent = (container) => {
  const info = {
    title: 'Chips',
    description: 'Compact elements that represent an input, attribute, or action'
  }

  container.classList.add('components')

  const layout = createLayout(contentLayout(info), container).component

  initChipVariants(layout.body)
  initChipWithIcons(layout.body)
  initSelectableChips(layout.body)
  initChipSet(layout.body)
  initFilterChipSet(layout.body)
  initInputChips(layout.body)
  initInteractiveChipExample(layout.body)
}

/**
 * Initializes the chip variants section
 * @param {HTMLElement} container - Container element
 */
export const initChipVariants = (container) => {
  const title = 'Chip Variants'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component

  const variants = Object.values(CHIP_VARIANTS)
  variants.forEach(variant => {
    const text = capitalize(variant)
    const chip = createChip({
      text: `${text} Chip`,
      variant,
      ripple: true
    })
    layout.body.appendChild(chip.element)
  })
}

/**
 * Initializes chips with icons section
 * @param {HTMLElement} container - Container element
 */
export const initChipWithIcons = (container) => {
  const title = 'Chips with Icons'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component

  // Example with leading icon
  const leadingIconChip = createChip({
    text: 'Leading Icon',
    leadingIcon: faceIcon,
    variant: CHIP_VARIANTS.FILLED
  })
  layout.body.appendChild(leadingIconChip.element)

  // Example with trailing icon
  const trailingIconChip = createChip({
    text: 'Trailing Icon',
    trailingIcon: closeIcon,
    variant: CHIP_VARIANTS.FILLED,
    onTrailingIconClick: (chip) => {
      console.log('Trailing icon clicked')
    }
  })
  layout.body.appendChild(trailingIconChip.element)

  // Example with both icons
  const bothIconsChip = createChip({
    text: 'Both Icons',
    leadingIcon: locationIcon,
    trailingIcon: closeIcon,
    variant: CHIP_VARIANTS.OUTLINED
  })
  layout.body.appendChild(bothIconsChip.element)

  // Example with icon only
  const iconOnlyChip = createChip({
    leadingIcon: addIcon,
    variant: CHIP_VARIANTS.ELEVATED
  })
  layout.body.appendChild(iconOnlyChip.element)
}

/**
 * Initializes selectable chips section
 * @param {HTMLElement} container - Container element
 */
export const initSelectableChips = (container) => {
  const title = 'Selectable Chips'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component

  // Create a selection chips container
  const chipsContainer = document.createElement('div')
  chipsContainer.style.display = 'flex'
  chipsContainer.style.gap = '8px'
  layout.body.appendChild(chipsContainer)

  // Create selectable chips with different variants
  const selectableVariants = [
    CHIP_VARIANTS.FILLED,
    CHIP_VARIANTS.OUTLINED,
    CHIP_VARIANTS.FILTER
  ]

  selectableVariants.forEach(variant => {
    const chip = createChip({
      text: capitalize(variant),
      variant,
      selected: variant === CHIP_VARIANTS.FILTER, // Pre-select the filter variant
      leadingIcon: variant === CHIP_VARIANTS.FILTER ? checkIcon : null
    })

    // Add click handler to toggle selection using component API
    chip.on('click', () => {
      chip.toggleSelected()

      // Update icon for filter chips
      if (variant === CHIP_VARIANTS.FILTER) {
        if (chip.isSelected()) {
          chip.setLeadingIcon(checkIcon)
        } else {
          chip.setLeadingIcon('')
        }
      }
    })

    chipsContainer.appendChild(chip.element)
  })
}

/**
 * Initializes chip set section
 * @param {HTMLElement} container - Container element
 */
export const initChipSet = (container) => {
  const title = 'Chip Set'
  const subtitle = 'Scrollable horizontal chip set'

  const layout = createLayout(createComponentsSectionLayout({
    title,
    subtitle
  }), container).component

  // Define chips with unique values
  const chipConfigs = [
    { text: 'JavaScript', variant: CHIP_VARIANTS.FILLED, value: 'js' },
    { text: 'TypeScript', variant: CHIP_VARIANTS.FILLED, value: 'ts' },
    { text: 'HTML', variant: CHIP_VARIANTS.FILLED, value: 'html' },
    { text: 'CSS', variant: CHIP_VARIANTS.FILLED, value: 'css' },
    { text: 'React', variant: CHIP_VARIANTS.FILLED, value: 'react' },
    { text: 'Vue', variant: CHIP_VARIANTS.FILLED, value: 'vue' },
    { text: 'Angular', variant: CHIP_VARIANTS.FILLED, value: 'angular' },
    { text: 'Svelte', variant: CHIP_VARIANTS.FILLED, value: 'svelte' },
    { text: 'Node.js', variant: CHIP_VARIANTS.FILLED, value: 'node' }
  ]

  // Create a scrollable chip set container
  const chipSetContainer = document.createElement('div')
  chipSetContainer.className = `${PREFIX}-chip-set ${PREFIX}-chip-set--scrollable`
  chipSetContainer.style.display = 'flex'
  chipSetContainer.style.flexWrap = 'nowrap'
  chipSetContainer.style.overflowX = 'auto'
  chipSetContainer.style.gap = '8px'
  chipSetContainer.style.paddingBottom = '8px'
  chipSetContainer.style.marginBottom = '-8px'
  chipSetContainer.style.WebkitOverflowScrolling = 'touch'

  // Add chips to the set
  const chipInstances = []
  chipConfigs.forEach(config => {
    const chip = createChip(config)
    chipSetContainer.appendChild(chip.element)
    chipInstances.push(chip)

    // Add click handler for selection using component API
    chip.on('click', () => {
      chip.toggleSelected()
      // Log the selected values
      const selectedChips = chipInstances.filter(c => c.isSelected())
      console.log('Selected technologies:', selectedChips.map(c => c.getValue()))
    })
  })

  layout.body.appendChild(chipSetContainer)

  // Add a vertical chip set example
  const verticalTitle = document.createElement('p')
  verticalTitle.textContent = 'Vertical chip set'
  verticalTitle.style.marginTop = '24px'
  verticalTitle.style.marginBottom = '8px'
  layout.body.appendChild(verticalTitle)

  // Create a vertical chip set container
  const verticalChipSetContainer = document.createElement('div')
  verticalChipSetContainer.className = `${PREFIX}-chip-set ${PREFIX}-chip-set--vertical`
  verticalChipSetContainer.style.display = 'flex'
  verticalChipSetContainer.style.flexDirection = 'column'
  verticalChipSetContainer.style.alignItems = 'flex-start'
  verticalChipSetContainer.style.gap = '8px'

  // Add vertical chips
  const verticalChipConfigs = [
    { text: 'Option 1', variant: CHIP_VARIANTS.OUTLINED, value: '1' },
    { text: 'Option 2', variant: CHIP_VARIANTS.OUTLINED, value: '2' },
    { text: 'Option 3', variant: CHIP_VARIANTS.OUTLINED, value: '3' }
  ]

  verticalChipConfigs.forEach(config => {
    const chip = createChip(config)
    verticalChipSetContainer.appendChild(chip.element)
  })

  layout.body.appendChild(verticalChipSetContainer)
}

/**
 * Initializes filter chip set section
 * @param {HTMLElement} container - Container element
 */
export const initFilterChipSet = (container) => {
  const title = 'Filter Chip Set'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component

  // Example label
  const label = document.createElement('p')
  label.textContent = 'Filter by:'
  layout.body.appendChild(label)

  // Create the filter chip set container
  const filterSetContainer = document.createElement('div')
  filterSetContainer.className = `${PREFIX}-chip-set`
  filterSetContainer.style.display = 'flex'
  filterSetContainer.style.flexWrap = 'wrap'
  filterSetContainer.style.gap = '8px'
  layout.body.appendChild(filterSetContainer)

  // Filter chip configurations
  const filterChipConfigs = [
    { text: 'Paid', variant: CHIP_VARIANTS.FILTER, value: 'paid' },
    { text: 'Free', variant: CHIP_VARIANTS.FILTER, value: 'free' },
    { text: 'Trial', variant: CHIP_VARIANTS.FILTER, value: 'trial' },
    { text: 'Subscription', variant: CHIP_VARIANTS.FILTER, value: 'subscription' }
  ]

  // Create and add chips to the set
  const filterChips = []
  filterChipConfigs.forEach(config => {
    const chip = createChip(config)
    filterSetContainer.appendChild(chip.element)
    filterChips.push(chip)

    // Add click handler for selection with icon toggle using component API
    chip.on('click', () => {
      chip.toggleSelected()

      // Update the checkmark icon based on selection state
      if (chip.isSelected()) {
        chip.setLeadingIcon(checkIcon)
      } else {
        chip.setLeadingIcon('')
      }

      // Log the selected filters
      const selectedChips = filterChips.filter(c => c.isSelected())
      console.log('Filters applied:', selectedChips.map(c => c.getValue()))
    })
  })

  // Add a button to clear all filters
  const clearButton = createButton({
    text: 'Clear Filters',
    variant: 'text',
    size: 'small'
  })

  clearButton.element.addEventListener('click', () => {
    // Clear all chip selections
    filterChips.forEach(chip => {
      chip.setSelected(false)
      chip.setLeadingIcon('')
    })
  })

  // Add some spacing before the clear button
  layout.body.appendChild(clearButton.element)
}

/**
 * Initializes input chips section with a textfield integration
 * @param {HTMLElement} container - Container element
 */
export const initInputChips = (container) => {
  const title = 'Input Chips'
  const subtitle = 'Use with Textfield for tag/recipient input'
  const layout = createLayout(createComponentsSectionLayout({ title, subtitle }), container).component

  // Create a container for the input chips
  const inputChipSetContainer = document.createElement('div')
  inputChipSetContainer.className = `${PREFIX}-chip-set`
  inputChipSetContainer.style.display = 'flex'
  inputChipSetContainer.style.flexWrap = 'wrap'
  inputChipSetContainer.style.gap = '8px'
  inputChipSetContainer.style.marginBottom = '16px'
  layout.body.appendChild(inputChipSetContainer)

  // Initial email chips
  const initialEmails = [
    'john@example.com',
    'jane@example.com',
    'team@example.com'
  ]

  // Keep track of chip instances
  const emailChips = []

  // Function to create and add a new email chip
  const addEmailChip = (email) => {
    if (!email) return null

    const chip = createChip({
      text: email,
      variant: CHIP_VARIANTS.INPUT,
      leadingIcon: faceIcon,
      trailingIcon: closeIcon,
      value: email
    })

    // Add click handler for the trailing icon (close button)
    const trailingIconEl = chip.element.querySelector(`.${PREFIX}-chip-trailing-icon`)
    if (trailingIconEl) {
      trailingIconEl.addEventListener('click', (e) => {
        e.stopPropagation() // Prevent chip selection

        // Remove the chip from the DOM and array
        chip.element.remove()
        const index = emailChips.indexOf(chip)
        if (index > -1) {
          emailChips.splice(index, 1)
        }
      })
    }

    // Add the chip to the container and array
    inputChipSetContainer.appendChild(chip.element)
    emailChips.push(chip)
    return chip
  }

  // Add initial email chips
  initialEmails.forEach(email => addEmailChip(email))

  // Create a container for the textfield and add button
  const inputGroup = document.createElement('div')
  inputGroup.style.display = 'flex'
  inputGroup.style.gap = '8px'

  // Create a textfield for entering new emails
  const emailInput = createTextfield({
    label: 'Add email address',
    variant: 'outlined'
  })

  // Create an add button
  const addButton = createButton({
    text: 'Add',
    variant: 'filled',
    size: 'small'
  })

  // Handle adding a new email chip
  const handleAddEmail = () => {
    const email = emailInput.getValue().trim()
    if (email) {
      addEmailChip(email)
      emailInput.setValue('') // Clear the input
    }
  }

  // Add event listeners
  addButton.element.addEventListener('click', handleAddEmail)
  emailInput.element.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddEmail()
    }
  })

  // Add elements to the layout
  inputGroup.appendChild(emailInput.element)
  inputGroup.appendChild(addButton.element)
  layout.body.appendChild(inputGroup)
}

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
  cityChipsContainer.className = `${PREFIX}-chip-set`
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
  resultText.style.backgroundColor = '#f5f5f5'
  resultText.style.borderRadius = '4px'

  // Create and add city chips
  const cityChips = []
  cityConfigs.forEach(config => {
    const chip = createChip({
      text: config.text,
      variant: CHIP_VARIANTS.ASSIST,
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
        resultText.style.backgroundColor = '#e3f2fd' // Light blue background
      } else {
        resultText.textContent = 'Please select a city'
        resultText.style.backgroundColor = '#f5f5f5' // Default gray background
      }
    })
  })

  // Add a textfield for custom city input
  const customCityContainer = document.createElement('div')
  customCityContainer.style.display = 'flex'
  customCityContainer.style.flexDirection = 'column'
  customCityContainer.style.gap = '8px'
  customCityContainer.style.marginTop = '16px'

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
        variant: CHIP_VARIANTS.ASSIST,
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

// Add a consistent PREFIX constant for class naming
const PREFIX = 'mtrl'
