import {
  createComponentsSectionLayout
} from '../../../layout'

import {
  createLayout,
  fButton,
  createDialog
} from 'mtrl'

import {
  DIALOG_FOOTER_ALIGNMENTS
} from 'mtrl/src/components/dialog'

export const initFooterAlignments = (container) => {
  const title = 'Footer Alignments'
  const description = 'Dialog buttons can be aligned in different ways within the footer'
  const layout = createLayout(createComponentsSectionLayout({ title, description }), container).component

  // Create a dialog for each footer alignment
  const alignments = [
    { name: 'Right', value: DIALOG_FOOTER_ALIGNMENTS.RIGHT },
    { name: 'Left', value: DIALOG_FOOTER_ALIGNMENTS.LEFT },
    { name: 'Center', value: DIALOG_FOOTER_ALIGNMENTS.CENTER },
    { name: 'Space Between', value: DIALOG_FOOTER_ALIGNMENTS.SPACE_BETWEEN }
  ]

  alignments.forEach(alignment => {
    // Create button to open dialog
    const openButton = fButton({
      text: `${alignment.name} Alignment`,
      variant: 'outlined'
    })

    // Create dialog with specific footer alignment
    const dialog = createDialog({
      title: `${alignment.name} Footer Alignment`,
      content: `<p>This dialog has its footer buttons aligned to the ${alignment.name.toLowerCase()}.</p>`,
      footerAlignment: alignment.value,
      buttons: [
        {
          text: 'Cancel',
          variant: 'text',
          closeDialog: true
        },
        {
          text: 'OK',
          variant: 'filled',
          closeDialog: true
        }
      ]
    })

    // For space-between alignment, add a third button to better demonstrate the effect
    if (alignment.value === DIALOG_FOOTER_ALIGNMENTS.SPACE_BETWEEN) {
      dialog.addButton({
        text: 'Help',
        variant: 'outlined',
        closeDialog: false,
        onClick: () => {
          alert('Space-between alignment distributes buttons across the full width of the footer.')
          return false // Prevent dialog from closing
        }
      })
    }

    // Open dialog when button is clicked
    openButton.on('click', () => {
      dialog.open()
    })

    // Add button to layout with some margin
    openButton.element.style.marginRight = '8px'
    openButton.element.style.marginBottom = '8px'
    layout.body.appendChild(openButton.element)
  })
}
