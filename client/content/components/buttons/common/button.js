// src/client/content/components/buttons/button.js

import {
  createComponentsSectionLayout
} from '../../../../layout'

import {
  createLayout, createButton,
  createChips, createSwitch, createTextfield,
  BUTTON_VARIANTS
} from 'mtrl'

export const createButtonComponent = (container) => {
  const title = 'Button Component'
  const description = 'With api usage. setVariant, setText, enable and disabled'
  const layout = createLayout(createComponentsSectionLayout({ title, description }), container).component

  // Create the button in the showcase section

  // Add the button to the showcase
  const showcase = createLayout([
    [createButton, 'button', {
      variant: BUTTON_VARIANTS.FILLED,
      text: 'Button'
    }]
  ], layout.showcase)

  const button = showcase.get('button')

  const variants = []
  Object.entries(BUTTON_VARIANTS).forEach(([value, label]) => {
    variants.push({ value, label })
  })

  // Component context information and controls in the info section
  const info = createLayout(
    [{ layout: { type: 'stack', gap: 6, autoHeight: true, dense: true, align: 'center' } /* style: { transform: 'scale(.9)' } */ },
      // [createElement, 'description', { tag: 'p', text: 'Modify the badge properties using the controls below.' }],
      [createChips, 'variant', { scrollable: false, label: 'setVariant' }],
      [createChips, 'icon', { scrollable: false, label: 'setIcon' }],
      [createTextfield, 'text', { label: 'Text', value: 'Button', variant: 'outlined' }],
      [createSwitch, 'disabled', { label: 'Disabled', checked: true }]
    ], layout.info).component

  for (let i = 0; i < variants.length; i++) {
    info.variant.addChip({
      text: variants[i].label,
      value: variants[i].value,
      variant: 'filter',
      selectable: true
    })
  }

  info.disabled.on('change', (value) => {
    if (value.checked) {
      button.enable()
    } else {
      button.disable()
    }
  })

  info.variant.on('change', (value) => {
    console.log('variant', value)
    button.setVariant(value[0].toLowerCase())
  })

  info.text.on('input', (event) => {
    button.setText(event.value)
  })
}
