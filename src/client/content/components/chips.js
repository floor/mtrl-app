// src/client/content/components/chips.js
import { capitalize } from '../../core/utils'

import {
  contentLayout,
  createComponentsSectionLayout
} from '../../config'

import {
  createLayout,
  createButton
} from 'mtrl'

import createChip, { CHIP_VARIANTS, CHIP_SIZES } from 'mtrl/src/components/chip'
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

export const createChipsContent = (container) => {
  const info = {
    title: 'Chips',
    description: 'Compact elements that represent an input, attribute, or action'
  }

  container.classList.add('components')

  const layout = createLayout(contentLayout(info), container).component

  initChipVariants(layout.body)
  initChipWithIcons(layout.body)
  initChipSizes(layout.body)
  initSelectableChips(layout.body)
  initChipSet(layout.body)
  initFilterChipSet(layout.body)
  initInputChips(layout.body)
  initInteractiveChipExample(layout.body)
}

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

export const initChipSizes = (container) => {
  const title = 'Chip Sizes'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component

  const sizes = Object.values(CHIP_SIZES)
  sizes.forEach(size => {
    const text = capitalize(size)
    const chip = createChip({
      text: `${text} Chip`,
      size,
      variant: CHIP_VARIANTS.FILLED
    })
    layout.body.appendChild(chip.element)
  })

  // Add chips with icons in different sizes
  sizes.forEach(size => {
    const chip = createChip({
      text: size,
      size,
      leadingIcon: faceIcon,
      variant: CHIP_VARIANTS.OUTLINED
    })
    layout.body.appendChild(chip.element)
  })
}

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

    // Add click handler to toggle selection
    chip.element.addEventListener('click', () => {
      chip.toggleSelected()

      // Update icon for filter chips
      if (variant === CHIP_VARIANTS.FILTER) {
        if (chip.isSelected()) {
          chip.setIcon(checkIcon)
        } else {
          chip.setIcon('')
        }
      }
    })

    chipsContainer.appendChild(chip.element)
  })
}

export const initChipSet = (container) => {
  const title = 'Chip Set'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component

  // Create scrollable chip set
  const scrollableSet = createChipSet({
    scrollable: true,
    chips: [
      { text: 'JavaScript', variant: CHIP_VARIANTS.FILLED, value: 'js' },
      { text: 'TypeScript', variant: CHIP_VARIANTS.FILLED, value: 'ts' },
      { text: 'HTML', variant: CHIP_VARIANTS.FILLED, value: 'html' },
      { text: 'CSS', variant: CHIP_VARIANTS.FILLED, value: 'css' },
      { text: 'React', variant: CHIP_VARIANTS.FILLED, value: 'react' },
      { text: 'Vue', variant: CHIP_VARIANTS.FILLED, value: 'vue' },
      { text: 'Angular', variant: CHIP_VARIANTS.FILLED, value: 'angular' },
      { text: 'Svelte', variant: CHIP_VARIANTS.FILLED, value: 'svelte' },
      { text: 'Node.js', variant: CHIP_VARIANTS.FILLED, value: 'node' }
    ],
    multiSelect: true,
    onChange: (selectedChips) => {
      console.log('Selected technologies:', selectedChips.map(chip => chip.getValue()))
    }
  })

  layout.body.appendChild(scrollableSet.element)

  // Create vertical chip set
  const verticalSet = createChipSet({
    vertical: true,
    chips: [
      { text: 'Option 1', variant: CHIP_VARIANTS.OUTLINED, value: '1' },
      { text: 'Option 2', variant: CHIP_VARIANTS.OUTLINED, value: '2' },
      { text: 'Option 3', variant: CHIP_VARIANTS.OUTLINED, value: '3' }
    ]
  })

  layout.body.appendChild(verticalSet.element)
}

export const initFilterChipSet = (container) => {
  const title = 'Filter Chip Set'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component

  // Example label
  const label = document.createElement('p')
  label.textContent = 'Filter by:'
  layout.body.appendChild(label)

  // Create filter chip set
  const filterSet = createChipSet({
    chips: [
      {
        text: 'Paid',
        variant: CHIP_VARIANTS.FILTER,
        value: 'paid',
        leadingIcon: '' // Empty initially
      },
      {
        text: 'Free',
        variant: CHIP_VARIANTS.FILTER,
        value: 'free',
        leadingIcon: ''
      },
      {
        text: 'Trial',
        variant: CHIP_VARIANTS.FILTER,
        value: 'trial',
        leadingIcon: ''
      },
      {
        text: 'Subscription',
        variant: CHIP_VARIANTS.FILTER,
        value: 'subscription',
        leadingIcon: ''
      }
    ],
    multiSelect: true,
    onChange: (selectedChips) => {
      console.log('Filters applied:', selectedChips.map(chip => chip.getValue()))

      // Update icons for all chips
      filterSet.getChips().forEach(chip => {
        if (chip.isSelected()) {
          chip.setIcon(checkIcon)
        } else {
          chip.setIcon('')
        }
      })
    }
  })

  layout.body.appendChild(filterSet.element)

  // Add a button to clear all filters
  const clearButton = createButton({
    text: 'Clear Filters',
    variant: 'text',
    size: 'small'
  })

  clearButton.element.addEventListener('click', () => {
    filterSet.clearSelection()
    // Update icons
    filterSet.getChips().forEach(chip => chip.setIcon(''))
  })

  layout.body.appendChild(clearButton.element)
}

export const initInputChips = (container) => {
  const title = 'Input Chips'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component

  // Create input chips example (like tags or recipients)
  const inputChipsSet = createChipSet({
    chips: [
      {
        text: 'john@example.com',
        variant: CHIP_VARIANTS.INPUT,
        leadingIcon: faceIcon,
        trailingIcon: closeIcon,
        value: 'john@example.com'
      },
      {
        text: 'jane@example.com',
        variant: CHIP_VARIANTS.INPUT,
        leadingIcon: faceIcon,
        trailingIcon: closeIcon,
        value: 'jane@example.com'
      },
      {
        text: 'team@example.com',
        variant: CHIP_VARIANTS.INPUT,
        leadingIcon: faceIcon,
        trailingIcon: closeIcon,
        value: 'team@example.com'
      }
    ]
  })

  // Add click handler for the trailing icons
  inputChipsSet.getChips().forEach(chip => {
    const trailingIcon = chip.element.querySelector('.mtrl-chip-trailing-icon')
    if (trailingIcon) {
      trailingIcon.addEventListener('click', (e) => {
        e.stopPropagation() // Prevent chip selection
        inputChipsSet.removeChip(chip)
      })
    }
  })

  layout.body.appendChild(inputChipsSet.element)

  // Add an input field and button to add new chips
  const inputGroup = document.createElement('div')
  inputGroup.style.display = 'flex'
  inputGroup.style.gap = '8px'
  inputGroup.style.marginTop = '16px'

  const input = document.createElement('input')
  input.type = 'text'
  input.placeholder = 'Add email address'
  input.style.padding = '8px'
  input.style.borderRadius = '4px'
  input.style.border = '1px solid #ccc'

  const addButton = createButton({
    text: 'Add',
    variant: 'filled',
    size: 'small'
  })

  addButton.element.addEventListener('click', () => {
    if (input.value) {
      const newChip = inputChipsSet.addChip({
        text: input.value,
        variant: CHIP_VARIANTS.INPUT,
        leadingIcon: faceIcon,
        trailingIcon: closeIcon,
        value: input.value
      })

      // Add click handler for the new chip's trailing icon
      const trailingIcon = newChip.element.querySelector('.mtrl-chip-trailing-icon')
      if (trailingIcon) {
        trailingIcon.addEventListener('click', (e) => {
          e.stopPropagation()
          inputChipsSet.removeChip(newChip)
        })
      }

      input.value = ''
    }
  })

  inputGroup.appendChild(input)
  inputGroup.appendChild(addButton.element)
  layout.body.appendChild(inputGroup)
}

export const initInteractiveChipExample = (container) => {
  const title = 'Interactive Chip Example'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component

  // Create a container for the example
  const demoContainer = document.createElement('div')
  demoContainer.style.display = 'flex'
  demoContainer.style.flexDirection = 'column'
  demoContainer.style.gap = '16px'

  // Create a label
  const label = document.createElement('p')
  label.textContent = 'Select your city:'

  // Create a chip set for city selection
  const cityChipSet = createChipSet({
    chips: [
      {
        text: 'New York',
        variant: CHIP_VARIANTS.ASSIST,
        leadingIcon: locationIcon,
        value: 'new-york'
      },
      {
        text: 'Los Angeles',
        variant: CHIP_VARIANTS.ASSIST,
        leadingIcon: locationIcon,
        value: 'los-angeles'
      },
      {
        text: 'Chicago',
        variant: CHIP_VARIANTS.ASSIST,
        leadingIcon: locationIcon,
        value: 'chicago'
      },
      {
        text: 'San Francisco',
        variant: CHIP_VARIANTS.ASSIST,
        leadingIcon: locationIcon,
        value: 'san-francisco'
      }
    ],
    onChange: (selectedChips, changedChip) => {
      // Update the result text
      if (selectedChips.length > 0) {
        resultText.textContent = `You selected: ${changedChip.getText()}`
      } else {
        resultText.textContent = 'Please select a city'
      }
    }
  })

  // Create a result display
  const resultText = document.createElement('p')
  resultText.textContent = 'Please select a city'
  resultText.style.padding = '8px'
  resultText.style.backgroundColor = '#f5f5f5'
  resultText.style.borderRadius = '4px'

  // Add all elements to the demo container
  demoContainer.appendChild(label)
  demoContainer.appendChild(cityChipSet.element)
  demoContainer.appendChild(resultText)

  layout.body.appendChild(demoContainer)
}
