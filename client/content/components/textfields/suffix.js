import { createLayout } from 'mtrl-addons'
// src/client/content/components/textfields/leading-icons.js
import {
  createComponentSection
} from '../../../layout'

import {
  createTextfield
} from 'mtrl'

export const initSuffix = (container) => {
  const title = 'Textfields with suffix text'
  const layout = createLayout(createComponentSection({ title }), container).component

  // Filled textfield with leading icon
  const filled = createTextfield({
    label: 'Weight',
    placeholder: 'Weight...',
    variant: 'filled',
    suffixText: 'lbs'
  })

  // Outlined textfield with leading icon
  const outlined = createTextfield({
    label: 'Weight',
    placeholder: 'Weight...',
    variant: 'outlined',
    suffixText: 'lbs'
  })

  // Add leading icon textfields to the layout
  layout.showcase.appendChild(filled.element)
  layout.showcase.appendChild(outlined.element)
}
