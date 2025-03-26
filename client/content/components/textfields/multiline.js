// src/client/content/components/textfields/multiline.js
import {
  createComponentsSectionLayout
} from '../../../layout'

import {
  createStructure,
  createTextfield
} from 'mtrl'

export const initMultilineTextfield = (container) => {
  const title = 'Multiline Textfield'
  const layout = createStructure(createComponentsSectionLayout({ title }), container).component

  // Filled multiline textfield
  const filled = createTextfield({
    label: 'Multiline Input',
    placeholder: 'Type multiple lines...',
    type: 'multiline',
    variant: 'filled',
    supportingText: 'Filled multiline'
  })

  // Outlined multiline textfield
  const outlined = createTextfield({
    label: 'Multiline Input',
    placeholder: 'Type multiple lines...',
    type: 'multiline',
    variant: 'outlined',
    supportingText: 'Outlined multiline'
  })

  // Add multiline textfields to the layout
  layout.body.appendChild(filled.element)
  layout.body.appendChild(outlined.element)
}
