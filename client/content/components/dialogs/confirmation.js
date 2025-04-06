import {
  createComponentsSectionLayout
} from '../../../layout'

import {
  fLayout,
  fButton,
  fDialog
} from 'mtrl'

export const initConfirmation = (container) => {
  const title = 'Confirmation Dialog'
  const description = 'A simple confirmation dialog using the confirm() method'
  const layout = fLayout(createComponentsSectionLayout({ title, description }), container).component

  // Create button to open dialog
  const confirmButton = fButton({
    text: 'Open Confirmation Dialog',
    variant: 'filled'
  })

  // Status message element
  const resultDisplay = document.createElement('div')
  resultDisplay.classList.add('result-display')
  resultDisplay.style.marginTop = '16px'
  resultDisplay.style.padding = '8px'
  resultDisplay.style.borderRadius = '4px'
  resultDisplay.style.minHeight = '36px'

  // Create the base dialog

  // Open confirmation when button is clicked
  confirmButton.on('click', async () => {
    const dialog = fDialog()
    const result = await dialog.confirm({
      title: 'Delete Item',
      message: 'Are you sure you want to delete this item? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel'
    })

    if (result) {
      resultDisplay.textContent = 'User confirmed the action!'
      resultDisplay.style.backgroundColor = '#ccffcc'
    } else {
      resultDisplay.textContent = 'User cancelled the action'
      resultDisplay.style.backgroundColor = '#e0e0e0'
    }
  })

  // Add button and result display to layout
  layout.body.appendChild(confirmButton.element)
  layout.body.appendChild(resultDisplay)
}
