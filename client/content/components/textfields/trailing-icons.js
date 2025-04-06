// src/client/content/components/textfields/trailing-icons.js
import {
  createComponentsSectionLayout
} from '../../../layout'

import {
  fLayout,
  fTextfield
} from 'mtrl'

// Clear icon SVG for the textfields
const clearIcon = `<svg viewBox="0 0 24 24" width="24" height="24">
  <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
</svg>`

export const initTrailingIcons = (container) => {
  const title = 'Textfields with Trailing Icons'
  const layout = fLayout(createComponentsSectionLayout({ title }), container).component

  // Filled textfield with trailing icon
  const filled = fTextfield({
    label: 'Clear Input',
    placeholder: 'Type to clear...',
    variant: 'filled',
    trailingIcon: clearIcon,
    supportingText: 'Textfield with trailing clear icon'
  })

  // Add click event to the trailing icon
  filled.trailingIcon.addEventListener('click', () => {
    filled.setValue('')
  })

  // Outlined textfield with trailing icon
  const outlined = fTextfield({
    label: 'Clear Input',
    placeholder: 'Type to clear...',
    variant: 'outlined',
    trailingIcon: clearIcon,
    supportingText: 'Textfield with trailing clear icon'
  })

  // Add click event to the trailing icon
  outlined.trailingIcon.addEventListener('click', () => {
    outlined.setValue('')
  })

  // Add trailing icon textfields to the layout
  layout.body.appendChild(filled.element)
  layout.body.appendChild(outlined.element)
}
