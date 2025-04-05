import {
  createComponentsSectionLayout
} from '../../../layout'

import {
  createLayout,
  fButton,
  fDialog
} from 'mtrl'

const createButtonsDialog = (statusMessage) => {
  const dialog = fDialog({
    title: 'Save Changes?',
    content: '<p>Your changes will be lost if you don\'t save them.</p>',
    buttons: [
      {
        text: 'Discard',
        variant: 'text',
        closeDialog: true,
        onClick: () => {
          statusMessage.textContent = 'Changes discarded!'
          statusMessage.style.backgroundColor = '#ffcccc'
        }
      },
      {
        text: 'Cancel',
        variant: 'outlined',
        closeDialog: true,
        onClick: () => {
          statusMessage.textContent = 'Action cancelled'
          statusMessage.style.backgroundColor = '#e0e0e0'
        }
      },
      {
        text: 'Save',
        variant: 'filled',
        closeDialog: true,
        onClick: () => {
          statusMessage.textContent = 'Changes saved successfully!'
          statusMessage.style.backgroundColor = '#ccffcc'
        }
      }
    ]
  })
  dialog.open()
}

export const initCustomButtons = (container) => {
  const title = 'Dialog with Custom Buttons'
  const description = 'Dialogs can have custom buttons with different variants and behaviors'
  const layout = createLayout(createComponentsSectionLayout({ title, description }), container).component

  // Create button to open dialog
  const openButton = fButton({
    text: 'Dialog with Custom Buttons',
    variant: 'filled'
  })

  // Status message element
  const statusMessage = document.createElement('div')
  statusMessage.classList.add('status-message')
  statusMessage.style.marginTop = '16px'
  statusMessage.style.padding = '8px'
  statusMessage.style.borderRadius = '4px'

  // Create dialog with custom buttons

  // Open dialog when button is clicked
  openButton.on('click', () => {
    createButtonsDialog(statusMessage)
  })

  // Add button and status message to layout
  layout.body.appendChild(openButton.element)
  layout.body.appendChild(statusMessage)
}
