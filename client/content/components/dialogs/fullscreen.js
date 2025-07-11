import { createLayout } from 'mtrl-addons'
import {
  createComponentSection
} from '../../../layout'

import {
  createButton,
  createDialog,
  DIALOG_SIZES
} from 'mtrl'

const createFullscreenDialog = (size) => {
  const dialog = createDialog({
    title: 'Fullscreen Dialog',
    content: `
      <div style="padding: 20px 0;">
        <h3 style="margin-bottom: 16px;">This is a fullscreen dialog</h3>
        <p>Fullscreen dialogs are useful for:</p>
        <ul style="margin-left: 20px; margin-bottom: 20px; line-height: 1.5;">
          <li>Mobile interfaces</li>
          <li>Complex forms that require more space</li>
          <li>Immersive experiences</li>
          <li>Detailed content viewing</li>
        </ul>
        <p>Use the close button in the header or the button below to exit.</p>
      </div>
    `,
    size: DIALOG_SIZES.FULLSCREEN,
    buttons: [
      {
        text: 'Close',
        variant: 'filled',
        closeDialog: true
      }
    ]
  })
  dialog.open()
}

export const initFullscreen = (container) => {
  const title = 'Fullscreen Dialog'
  const description = 'A fullscreen dialog for immersive experiences or mobile interfaces'
  const layout = createLayout(createComponentSection({ title, description }), container).component

  // Create button to open dialog
  const openButton = createButton({
    text: 'Open Fullscreen Dialog',
    variant: 'filled'
  })

  // Create a fullscreen dialog

  // Open dialog when button is clicked
  openButton.on('click', () => {
    createFullscreenDialog()
  })

  // Add button to layout
  layout.showcase.appendChild(openButton.element)
}
