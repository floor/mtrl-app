// src/client/content/components/textfields/multiline.js
import {
  createComponentsSectionLayout
} from '../../../layout'

import {
  createLayout,
  createTextfield
} from 'mtrl'

export const initMultilineTextfield = (container) => {
  const title = 'Multiline Textfield'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component

  // Filled multiline textfield
  const filled = createTextfield({
    label: 'Multiline Input',
    placeholder: 'Type multiple lines...',
    type: 'multiline',
    variant: 'filled',
    maxHeight: 200,
    supportingText: 'Filled multiline'
  })

  // Outlined multiline textfield
  const outlined = createTextfield({
    label: 'Multiline Input',
    placeholder: 'Type multiple lines...',
    type: 'multiline',
    variant: 'outlined',
    maxHeight: 200,
    supportingText: 'Outlined multiline'
  })

  // Add multiline textfields to the layout
  layout.showcase.appendChild(filled.element)
  layout.showcase.appendChild(outlined.element)
}
