// src/client/content/components/textfields/leading-icons.js
import {
  createComponentsSectionLayout
} from '../../../layout'

import {
  fLayout,
  fTextfield
} from 'mtrl'

export const initPrefix = (container) => {
  const title = 'Textfields with prefix text'
  const layout = fLayout(createComponentsSectionLayout({ title }), container).component

  // Filled textfield with leading icon
  const filled = fTextfield({
    label: 'Amount',
    placeholder: 'Amount...',
    variant: 'filled',
    prefixText: 'USD'
  })

  // Outlined textfield with leading icon
  const outlined = fTextfield({
    label: 'Amount',
    placeholder: 'Amount...',
    variant: 'outlined',
    prefixText: 'USD'
  })

  // Add leading icon textfields to the layout
  layout.body.appendChild(filled.element)
  layout.body.appendChild(outlined.element)
}
