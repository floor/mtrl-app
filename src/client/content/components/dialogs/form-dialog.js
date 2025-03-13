import {
  createComponentsSectionLayout
} from '../../../config'

import {
  createLayout,
  createButton,
  createDialog,
  createTextfield
} from 'mtrl'

export const initFormDialog = (container) => {
  const title = 'Form Dialog'
  const description = 'A dialog containing form elements for user input'
  const layout = createLayout(createComponentsSectionLayout({ title, description }), container).component

  // Create button to open dialog
  const openButton = createButton({
    text: 'Open Form Dialog',
    variant: 'filled'
  })

  // Result container
  const resultContainer = document.createElement('div')
  resultContainer.classList.add('form-result')
  resultContainer.style.marginTop = '16px'
  resultContainer.style.padding = '8px'
  resultContainer.style.borderRadius = '4px'
  resultContainer.style.minHeight = '36px'

  // Create a dialog with form content
  const dialog = createDialog({
    title: 'Create New Contact',
    content: '<div id="contact-form" style="display: flex; flex-direction: column; gap: 16px;"></div>',
    buttons: [
      {
        text: 'Cancel',
        variant: 'text',
        closeDialog: true
      },
      {
        text: 'Save',
        variant: 'filled',
        closeDialog: false,
        onClick: () => {
          // Get values from form fields
          const name = nameField.getValue()
          const email = emailField.getValue()
          const phone = phoneField.getValue()

          // Simple validation
          let isValid = true
          let errorMessage = ''

          if (!name) {
            nameField.element.classList.add('mtrl-textfield--error')
            isValid = false
            errorMessage = 'Name is required'
          } else {
            nameField.element.classList.remove('mtrl-textfield--error')
          }

          if (!email) {
            emailField.element.classList.add('mtrl-textfield--error')
            isValid = false
            errorMessage = errorMessage || 'Email is required'
          } else {
            emailField.element.classList.remove('mtrl-textfield--error')
          }

          // If valid, close dialog and show result
          if (isValid) {
            resultContainer.textContent = `Contact saved: ${name}, ${email}, ${phone}`
            resultContainer.style.backgroundColor = '#ccffcc'
            dialog.close()
          }
        }
      }
    ]
  })

  // Create form fields (will be added to form when dialog opens)
  let nameField, emailField, phoneField

  dialog.on('open', () => {
    // Get the form container
    const formContainer = dialog.getContentElement().querySelector('#contact-form')
    formContainer.innerHTML = '' // Clear previous fields

    // Create form fields
    nameField = createTextfield({
      label: 'Name',
      placeholder: 'Enter full name',
      variant: 'outlined'
    })

    emailField = createTextfield({
      label: 'Email',
      placeholder: 'email@example.com',
      variant: 'outlined'
    })

    phoneField = createTextfield({
      label: 'Phone (optional)',
      placeholder: '(123) 456-7890',
      variant: 'outlined'
    })

    // Add fields to form
    formContainer.appendChild(nameField.element)
    formContainer.appendChild(emailField.element)
    formContainer.appendChild(phoneField.element)
  })

  // Open dialog when button is clicked
  openButton.on('click', () => {
    dialog.open()
  })

  // Add button and result container to layout
  layout.body.appendChild(openButton.element)
  layout.body.appendChild(resultContainer)
}
