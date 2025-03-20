// src/client/content/components/textfields/leading-icons.js
import {
  createComponentsSectionLayout
} from '../../../layout'

import {
  createLayout,
  createTextfield
} from 'mtrl'

// Search icon SVG for the textfields
const searchIcon = `<svg viewBox="0 0 24 24" width="24" height="24">
  <path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
</svg>`

export const initLeadingIcons = (container) => {
  const title = 'Textfields with Leading Icons'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component

  // Filled textfield with leading icon
  const filled = createTextfield({
    label: 'Search',
    placeholder: 'Search...',
    variant: 'filled',
    leadingIcon: searchIcon
  })

  // Outlined textfield with leading icon
  const outlined = createTextfield({
    label: 'Search',
    placeholder: 'Search...',
    variant: 'outlined',
    leadingIcon: searchIcon
  })

  // Add leading icon textfields to the layout
  layout.body.appendChild(filled.element)
  layout.body.appendChild(outlined.element)
}
