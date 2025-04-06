// src/client/content/components/textfields/supporting-text.js
import {
  createComponentsSectionLayout
} from '../../../layout'

import {
  fLayout,
  fTextfield
} from 'mtrl'

export const initSupportingText = (container) => {
  const title = 'Textfields with Supporting Text'
  const layout = fLayout(createComponentsSectionLayout({ title }), container).component

  // Filled textfield with supporting text
  const filled = fTextfield({
    label: 'Username',
    variant: 'filled',
    supportingText: 'Between 3-20 characters'
  })

  // Outlined textfield with supporting text
  const outlined = fTextfield({
    label: 'Password',
    type: 'password',
    variant: 'outlined',
    supportingText: 'At least 8 characters'
  })

  // Textfield with error state and supporting text
  const error = fTextfield({
    label: 'Email',
    type: 'email',
    variant: 'outlined',
    supportingText: 'Invalid email address',
    error: true
  })

  // Add supporting text textfields to the layout
  layout.body.appendChild(filled.element)
  layout.body.appendChild(outlined.element)
  layout.body.appendChild(error.element)
}
