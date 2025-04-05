// src/client/content/components/textfields/combined-features.js
import {
  createComponentsSectionLayout
} from '../../../layout'

import {
  createLayout,
  fTextfield
} from 'mtrl'

// Icons for the textfields
const searchIcon = `<svg viewBox="0 0 24 24" width="24" height="24">
  <path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
</svg>`

const clearIcon = `<svg viewBox="0 0 24 24" width="24" height="24">
  <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
</svg>`

export const initCombinedFeatures = (container) => {
  const title = 'Textfields with Combined Features'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component

  // Filled textfield with both icons and supporting text
  const filled = fTextfield({
    label: 'Search',
    placeholder: 'Search...',
    variant: 'filled',
    leadingIcon: searchIcon,
    trailingIcon: clearIcon,
    supportingText: 'Type to search, click X to clear'
  })

  // Add click event to the trailing icon
  filled.trailingIcon.addEventListener('click', () => {
    filled.setValue('')
  })

  // Outlined textfield with both icons and error state
  const outlined = fTextfield({
    label: 'Search',
    placeholder: 'Search...',
    variant: 'outlined',
    leadingIcon: searchIcon,
    trailingIcon: clearIcon,
    supportingText: 'min 3 characters',
    error: true
  })

  // Add click event to the trailing icon
  outlined.trailingIcon.addEventListener('click', () => {
    outlined.setValue('')
  })

  // Add combined feature textfields to the layout
  layout.body.appendChild(filled.element)
  layout.body.appendChild(outlined.element)
}
