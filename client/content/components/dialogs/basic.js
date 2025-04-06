import {
  createComponentsSectionLayout
} from '../../../layout'

import {
  fLayout,
  fButton,
  fDialog
} from 'mtrl'

const createBasicDialog = () => {
  const dialog = fDialog({
    title: 'Basic Dialog',
    content: '<p>This is a basic dialog with a title, content, and standard buttons.</p>',
    buttons: [
      {
        text: 'Cancel',
        variant: 'text',
        closeDialog: true,
        onClick: () => {
          console.log('Cancel button clicked')
        }
      },
      {
        text: 'OK',
        variant: 'text',
        closeDialog: true,
        onClick: () => {
          console.log('OK button clicked')
        }
      }
    ]
  })
  dialog.open()
}

export const initBasic = (container) => {
  const title = 'Basic Dialog'
  const description = 'A simple dialog with title, content and buttons'
  const layout = fLayout(createComponentsSectionLayout({ title, description }), container).component

  // Create button to open dialog
  const openButton = fButton({
    text: 'Open Basic Dialog',
    variant: 'filled'
  })

  // Open dialog when button is clicked
  openButton.on('click', () => {
    createBasicDialog()
  })

  layout.body.appendChild(openButton.element)
}
