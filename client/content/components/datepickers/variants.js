import {
  createComponentsSectionLayout
} from '../../../layout'

import {
  createStructure,
  createButton,
  createDatePicker
} from 'mtrl'

const DATEPICKER_VARIANTS = {
  /** Displays inline with a text field above the calendar */
  DOCKED: 'docked',

  /** Displays as a modal dialog */
  MODAL: 'modal',

  /** Displays as a modal dialog with text input */
  MODAL_INPUT: 'modal-input'
}

export const initVariants = (container) => {
  const title = 'DatePicker Variants'
  const sectionDescription = 'DatePickers come in three variants: docked, modal, and modal input'
  const layout = createStructure(createComponentsSectionLayout({ title, description: sectionDescription }), container).component

  // Create grid layout for variants
  const grid = document.createElement('div')
  grid.style.display = 'grid'
  grid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(280px, 1fr))'
  grid.style.gap = '24px'
  grid.style.marginBottom = '24px'

  // 1. Docked DatePicker (default)
  const dockedContainer = document.createElement('div')
  const dockedLabel = document.createElement('h4')
  dockedLabel.textContent = 'Docked'
  dockedLabel.style.marginBottom = '8px'

  const dockedPicker = createDatePicker({
    label: 'Docked Picker',
    placeholder: 'MM/DD/YYYY',
    variant: DATEPICKER_VARIANTS.DOCKED
  })

  dockedContainer.appendChild(dockedLabel)
  dockedContainer.appendChild(dockedPicker.element)

  // 2. Modal DatePicker
  const modalContainer = document.createElement('div')
  const modalLabel = document.createElement('h4')
  modalLabel.textContent = 'Modal'
  modalLabel.style.marginBottom = '8px'

  const openModalButton = createButton({
    text: 'Open Modal DatePicker',
    variant: 'outlined'
  })

  const modalPicker = createDatePicker({
    label: 'Event Date',
    placeholder: 'Select date',
    variant: DATEPICKER_VARIANTS.MODAL
  })

  openModalButton.on('click', () => {
    modalPicker.open()
  })

  modalContainer.appendChild(modalLabel)
  modalContainer.appendChild(openModalButton.element)

  // 3. Modal Input DatePicker
  const modalInputContainer = document.createElement('div')
  const modalInputLabel = document.createElement('h4')
  modalInputLabel.textContent = 'Modal Input'
  modalInputLabel.style.marginBottom = '8px'

  const openModalInputButton = createButton({
    text: 'Open Modal Input DatePicker',
    variant: 'outlined'
  })

  const modalInputPicker = createDatePicker({
    label: 'Birth Date',
    placeholder: 'Enter date',
    variant: DATEPICKER_VARIANTS.MODAL_INPUT,
    dateFormat: 'MMMM D, YYYY'
  })

  openModalInputButton.on('click', () => {
    modalInputPicker.open()
  })

  modalInputContainer.appendChild(modalInputLabel)
  modalInputContainer.appendChild(openModalInputButton.element)

  // Add all variants to the grid
  grid.appendChild(dockedContainer)
  grid.appendChild(modalContainer)
  grid.appendChild(modalInputContainer)

  // Add the grid to the layout
  layout.body.appendChild(grid)

  // Description of variants
  const variantInfo = document.createElement('div')
  variantInfo.innerHTML = `
    <ul style="margin-left: 20px; line-height: 1.5;">
      <li><strong>Docked:</strong> Calendar appears below the input field, ideal for desktop interfaces.</li>
      <li><strong>Modal:</strong> Calendar appears in a modal dialog, good for mobile and desktop.</li>
      <li><strong>Modal Input:</strong> Date input appears in a modal dialog, ideal for birth dates or dates far in the past.</li>
    </ul>
  `
  layout.body.appendChild(variantInfo)
}
