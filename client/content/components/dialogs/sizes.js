import {
  createComponentsSectionLayout
} from '../../../layout'

import {
  fLayout,
  fButton,
  fDialog
} from 'mtrl'

import {
  DIALOG_SIZES
} from 'mtrl/src/components/dialog'

const createSizesDialog = (size) => {
  const dialog = fDialog({
    title: `${size.name} Dialog`,
    content: `<p>This is a ${size.name.toLowerCase()} sized dialog.</p>
                <p>Dialog sizes can be customized to fit different amounts of content.</p>`,
    size: size.value,
    buttons: [
      {
        text: 'Close',
        variant: 'text',
        closeDialog: true
      }
    ]
  })
  dialog.open()
}

export const initSizes = (container) => {
  const title = 'Dialog Sizes'
  const description = 'Dialogs come in different sizes: small, medium, large, fullwidth'
  const layout = fLayout(createComponentsSectionLayout({ title, description }), container).component

  // Create a dialog for each size
  const sizes = [
    { name: 'Small', value: DIALOG_SIZES.SMALL },
    { name: 'Medium', value: DIALOG_SIZES.MEDIUM },
    { name: 'Large', value: DIALOG_SIZES.LARGE },
    { name: 'Fullwidth', value: DIALOG_SIZES.FULLWIDTH }
  ]

  sizes.forEach(size => {
    // Create button to open dialog
    const openButton = fButton({
      text: `Open ${size.name} Dialog`,
      variant: 'filled'
    })

    // Create dialog with specific size

    // Open dialog when button is clicked
    openButton.on('click', () => {
      createSizesDialog(size)
    })

    // Add button to layout with some margin
    openButton.element.style.marginRight = '8px'
    layout.body.appendChild(openButton.element)
  })
}
