// src/client/content/components/textfields/leading-icons.js
import {
  createComponentSection
} from '../../../layout'

import {
  createLayout,
  createTextfield
} from 'mtrl'

export const initPrefix = (container) => {
  const title = 'Textfields with prefix text'
  const layout = createLayout(createComponentSection({ title }), container).component

  // Filled textfield with leading icon
  const filled = createTextfield({
    label: 'Amount',
    placeholder: 'Amount...',
    variant: 'filled',
    prefixText: 'USD'
  })

  // Outlined textfield with leading icon
  const outlined = createTextfield({
    label: 'Amount',
    placeholder: 'Amount...',
    variant: 'outlined',
    prefixText: 'USD'
  })

  // Add leading icon textfields to the layout
  layout.showcase.appendChild(filled.element)
  layout.showcase.appendChild(outlined.element)
}
