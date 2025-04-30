// src/client/content/components/chips/input.js
import { createComponentSection } from '../../../layout'
import { createLayout, createChip, createTextfield, createButton, PREFIX } from 'mtrl'
import { faceIcon, closeIcon } from '../../../icons'

/**
 * Initializes input chips section with a textfield integration
 * @param {HTMLElement} container - Container element
 */
export const initInputChips = (container) => {
  const title = 'Input Chips'
  const subtitle = 'Use with Textfield for tag/recipient input'
  const layout = createLayout(createComponentSection({ title, subtitle }), container).component

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
      variant: 'input',
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
