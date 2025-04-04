import {
  createComponentsSectionLayout
} from '../../../layout'

import {
  createLayout,
  fButton,
  createDialog,
  createTextfield,
  createSlider,
  createCheckbox,
  createSnackbar
} from 'mtrl'

const callVolume = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
    <path d="M798-120q-125 0-247-54.5T329-329Q229-429 174.5-551T120-798q0-18 12-30t30-12h162q14 0 25 9.5t13 22.5l26 140q2 16-1 27t-11 19l-97 98q20 37 47.5 71.5T387-386q31 31 65 57.5t72 48.5l94-94q9-9 23.5-13.5T670-390l138 28q14 4 23 14.5t9 23.5v162q0 18-12 30t-30 12ZM241-600l66-66-17-94h-89q5 41 14 81t26 79Zm358 358q39 17 79.5 27t81.5 13v-88l-94-19-67 67ZM241-600Zm358 358Z"/>
</svg>`

const alarmVolume = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
    <path d="M480-80q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T120-440q0-75 28.5-140.5t77-114q48.5-48.5 114-77T480-800q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-440q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-80Zm0-360Zm112 168 56-56-128-128v-184h-80v216l152 152ZM224-866l56 56-170 170-56-56 170-170Zm512 0 170 170-56 56-170-170 56-56ZM480-160q117 0 198.5-81.5T760-440q0-117-81.5-198.5T480-720q-117 0-198.5 81.5T200-440q0 117 81.5 198.5T480-160Z"/>
  </svg>`

const createSettingsDialog = () => {
  const dialog = createDialog({
    title: 'Settings',
    content: '<div id="settings-form" style="display: flex; flex-direction: column; gap: 16px; background-color: var(--mtrl-sys-color-surface-container-high"></div>',
    divider: true,
    buttons: [
      {
        text: 'Cancel',
        variant: 'text',
        closeDialog: true
      },
      {
        text: 'Save',
        variant: 'text',
        closeDialog: false,
        onClick: () => {
          dialog.close()
          createSnackbar({
            message: 'Settings saved',
            action: 'OK'
          }).show()
        }
      }
    ]
  })

  // dialog.element.style.transform = 'scale(.7)'

  dialog.open()

  dialog.on('open', () => {
    const formContainer = dialog.getContentElement().querySelector('#settings-form')
    formContainer.innerHTML = '' // Clear previous fields

    const sliderCallVolume = createSlider({
      label: 'Call volume',
      icon: callVolume,
      min: 0,
      max: 10,
      value: 7,
      step: 1,
      size: 'small'
    })

    const sliderAlarmVolume = createSlider({
      label: 'Alarm volume',
      icon: alarmVolume,
      min: 0,
      max: 10,
      value: 3,
      step: 1
    })
    formContainer.appendChild(sliderCallVolume.element)
    formContainer.appendChild(sliderAlarmVolume.element)
  })
}

const createContactDialog = (nameField, emailField, phoneField, newsletterCheckbox, resultContainer) => {
  const dialog = createDialog({
    title: 'Create New Contact',
    content: '<div id="contact-form" style="display: flex; flex-direction: column; gap: 16px; background-color: var(--mtrl-sys-color-surface-container-high"></div>',
    divider: true,
    buttons: [
      {
        text: 'Cancel',
        variant: 'text',
        closeDialog: true
      },
      {
        text: 'Save',
        variant: 'text',
        closeDialog: false,
        onClick: () => {
          // Get values from form fields
          const name = nameField.getValue()
          const email = emailField.getValue()
          // const phone = phoneField.getValue()

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
            dialog.close()
            createSnackbar({
              message: 'Contact saved',
              action: 'OK'
            }).show()
          }
        }
      }
    ]
  })

  // dialog.element.style.transform = 'scale(.7)'

  dialog.open()

  dialog.on('open', () => {
    // Get the form container
    const formContainer = dialog.getContentElement().querySelector('#contact-form')
    formContainer.innerHTML = '' // Clear previous fields

    // Create form fields
    nameField = createTextfield({
      label: 'Name',
      placeholder: 'Enter full name',
      variant: 'outlined'
      // supportingText: 'Required'
    })

    emailField = createTextfield({
      label: 'Email',
      placeholder: 'email@example.com',
      variant: 'outlined'
      // supportingText: 'Required'
    })

    phoneField = createTextfield({
      label: 'Phone (optional)',
      placeholder: '(123) 456-7890',
      variant: 'outlined'
    })

    newsletterCheckbox = createCheckbox({
      label: 'Newsletter'
    })

    // Add fields to form
    formContainer.appendChild(nameField.element)
    formContainer.appendChild(emailField.element)
    formContainer.appendChild(phoneField.element)
    formContainer.appendChild(newsletterCheckbox.element)
  })
}

export const initFormDialog = (container) => {
  const title = 'Form Dialog'
  const description = 'A dialog containing form elements for user input'
  const layout = createLayout(createComponentsSectionLayout({ title, description }), container).component

  // Create button to open dialog
  const openContactButton = fButton({
    text: 'Open Form Dialog',
    variant: 'filled'
  })

  // Create a dialog with form content

  // Create form fields (will be added to form when dialog opens)
  let nameField, emailField, phoneField, newsletterCheckbox

  // Open dialog when button is clicked
  openContactButton.on('click', () => {
    createContactDialog(nameField, emailField, phoneField, newsletterCheckbox)
  })

  // Create button to open dialog
  const openSettingsButton = fButton({
    text: 'Open Settings Dialog',
    variant: 'filled'
  })

  // Open dialog when button is clicked
  openSettingsButton.on('click', () => {
    createSettingsDialog()
  })

  // Add button and result container to layout
  layout.body.appendChild(openContactButton.element)
  layout.body.appendChild(openSettingsButton.element)
}
