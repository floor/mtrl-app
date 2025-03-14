// src/client/content/components/textfields.js
import { capitalize } from '../../core/utils'

import {
  componentsLayout,
  createComponentsSectionLayout
} from '../../config'

import {
  createLayout,
  createElement,
  createTextfield
} from 'mtrl'

export const createTextfieldsContent = (container) => {
  const info = {
    title: 'Text Fields',
    description: 'Text fields let users enter and edit text'
  }

  const layout = createLayout(componentsLayout(info), container).component

  initTextfieldVariants(layout.body)
  initMultilineTextfield(layout.body)
}

export const initTextfieldVariants = (container) => {
  const title = 'Textfield Variants'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component

  // Create a wrapper for the filled variant
  const filledWrapper = createElement({ class: 'mtrl-content__variant' })

  // Filled textfield
  const filled = createTextfield({
    label: 'Filled Input',
    placeholder: 'Type something...',
    variant: 'filled',
    helperText: 'This is a filled textfield'
  })
  filledWrapper.appendChild(filled.element)

  // Create a wrapper for the outlined variant
  const outlinedWrapper = createElement({ class: 'mtrl-content__variant' })

  // Outlined textfield
  const outlined = createTextfield({
    label: 'Outlined Input',
    placeholder: 'Type something...',
    variant: 'outlined',
    helperText: 'This is an outlined textfield'
  })
  outlinedWrapper.appendChild(outlined.element)

  // Add both variants to the layout
  layout.body.appendChild(filledWrapper)
  layout.body.appendChild(outlinedWrapper)
}

export const initFilledTextfieldSizes = (container) => {
  const title = 'Filled Textfield Sizes'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component

  layout.body.appendChild(box)

  const sizes = ['small', 'default', 'large']

  sizes.forEach(size => {
    const textfield = createTextfield({
      label: `${capitalize(size)} Textfield`,
      placeholder: 'Type here...',
      size
    })
    box.appendChild(textfield.element)
  })
}

export const initMultilineTextfield = (container) => {
  const title = 'Multiline Textfield'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component

  const multiline = createTextfield({
    label: 'Multiline Input',
    placeholder: 'Type multiple lines...',
    type: 'multiline',
    variant: 'outlined',
    helperText: 'This is a multiline textfield'
  })

  layout.body.appendChild(multiline.element)
}
