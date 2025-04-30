// src/client/content/components/textfields/supporting-text.js
import {
  createComponentSection
} from '../../../layout'

import {
  createLayout,
  createTextfield
} from 'mtrl'

export const initSupportingText = (container) => {
  const title = 'Textfields with Supporting Text'
  const layout = createLayout(createComponentSection({ title }), container).component

  // Filled textfield with supporting text
  const filled = createTextfield({
    label: 'Username',
    variant: 'filled',
    supportingText: 'Between 3-20 characters'
  })

  // Outlined textfield with supporting text
  const outlined = createTextfield({
    label: 'Password',
    type: 'password',
    variant: 'outlined',
    supportingText: 'At least 8 characters'
  })

  // Textfield with error state and supporting text
  const error = createTextfield({
    label: 'Email',
    type: 'email',
    variant: 'outlined',
    supportingText: 'Invalid email address',
    error: true
  })

  // Add supporting text textfields to the layout
  layout.showcase.appendChild(filled.element)
  layout.showcase.appendChild(outlined.element)
  layout.showcase.appendChild(error.element)
}
