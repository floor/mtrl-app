import {
  createComponentSection
} from '../../../layout'

import {
  createLayout, createTextfield, createChips,
  createSwitch,
  TEXTFIELD_VARIANTS,
  TEXTFIELD_DENSITY
} from 'mtrl'

export const createTextfieldShowcase = (container) => {
  const title = 'Textfield'
  const description = 'Try out the textfield API methods'
  const layout = createLayout(createComponentSection({ title, description }), container).component

  const showcase = createLayout([
    [createTextfield, 'textfield', {
      label: 'Filled Input',
      placeholder: 'Type something...',
      variant: 'filled',
      helperText: 'This is a filled textfield'
    }]
  ], layout.showcase)

  const textfield = showcase.get('textfield')

  const variants = []
  Object.entries(TEXTFIELD_VARIANTS).forEach(([value, label]) => {
    variants.push({ value, label })
  })

  const density = []
  Object.entries(TEXTFIELD_DENSITY).forEach(([value, label]) => {
    density.push({ value, label })
  })

  const info = createLayout(
    [{ layout: { type: 'stack', gap: 6, autoHeight: true, dense: true, align: 'center' } /* style: { transform: 'scale(.9)' } */ },
      // [createElement, 'description', { tag: 'p', text: 'Modify the badge properties using the controls below.' }],
      [createChips, 'variant', { scrollable: false, label: 'Variant' }],
      [createChips, 'density', { scrollable: false, label: 'Density' }],
      [createSwitch, 'disabled', { label: 'Disabled', checked: false }]
    ], layout.info).component

  for (let i = 0; i < variants.length; i++) {
    info.density.addChip({
      text: density[i].label,
      value: density[i].value,
      variant: 'filter',
      selectable: true,
      selected: density[i].label === 'standard'
    })
  }

  for (let i = 0; i < variants.length; i++) {
    info.variant.addChip({
      text: variants[i].label,
      value: variants[i].value,
      variant: 'filter',
      selectable: true,
      selected: variants[i].label === 'filled'
    })
  }

  info.variant.on('change', (value) => {
    console.log('variant', value)
    textfield.setVariant(value[0].toLowerCase())
  })

  info.density.on('change', (value) => {
    console.log('density', value)
    textfield.setDensity(value[0].toLowerCase())
  })

  info.disabled.on('change', (value) => {
    if (value.checked) {
      textfield.disable()
    } else {
      textfield.enable()
    }
  })
}
