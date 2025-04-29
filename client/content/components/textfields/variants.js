import {
  createComponentsSectionLayout
} from '../../../layout'

import {
  createLayout,
  createTextfield
} from 'mtrl'

export const initTextfieldVariants = (container) => {
  const title = 'Textfield Variants'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component

  // Create a wrapper for the filled variant
  // const filledWrapper = createElement({ class: 'mtrl-content__variant' })

  // Filled textfield
  const filled = createTextfield({
    label: 'Filled Input',
    placeholder: 'Type something...',
    variant: 'filled',
    helperText: 'This is a filled textfield'
  })
  // filledWrapper.appendChild(filled.element)

  // Create a wrapper for the outlined variant
  // const outlinedWrapper = createElement({ class: 'mtrl-content__variant' })

  // Outlined textfield
  const outlined = createTextfield({
    label: 'Outlined Input',
    placeholder: 'Type something...',
    variant: 'outlined',
    helperText: 'This is an outlined textfield'
  })
  // outlinedWrapper.appendChild(outlined.element)

  // Add both variants to the layout
  layout.showcase.appendChild(filled.element)
  layout.showcase.appendChild(outlined.element)
}
