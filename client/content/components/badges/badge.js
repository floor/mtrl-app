// src/client/content/components/badges/events-api.js

import {
  createComponentsSectionLayout
} from '../../../layout'

import {
  createLayout, createBadge, createSlider,
  createSelect, createChips, createSwitch,
  BADGE_COLORS, BADGE_VARIANTS
} from 'mtrl'

export const createBadgeContent = (container) => {
  const title = 'Badge API Demo'
  const description = 'Try out the badge API methods'
  const layout = createLayout(createComponentsSectionLayout({ title, description }), container).component

  // Create the badge in the showcase section

  const initialValue = '456'

  // Add the badge to the showcase with styling
  const showcase = createLayout([
    [createBadge, 'badge', {
      variant: BADGE_VARIANTS.LARGE,
      label: initialValue,
      mavValue: 500,
      color: BADGE_COLORS.ERROR,
      standalone: true,
      style: { transform: 'scale(5)' }
    }]
  ], layout.showcase)

  const badge = showcase.get('badge')

  const colors = []
  Object.entries(BADGE_COLORS).forEach(([id, text]) => {
    const object = { id, text, selected: id === 'ERROR' }
    if (id === 'ERROR') object.text = `${text} (default)`
    colors.push(object)
  })

  const variants = []
  Object.entries(BADGE_VARIANTS).forEach(([value, label]) => {
    variants.push({ value, label })
  })

  // Component context information and controls in the info section
  const info = createLayout(
    [{ layout: { type: 'stack', gap: 6, autoHeight: true, dense: true, align: 'center' } /* style: { transform: 'scale(.9)' } */ },
      // [createElement, 'description', { tag: 'p', text: 'Modify the badge properties using the controls below.' }],
      [createChips, 'variant', { scrollable: false, label: 'Select variant' }],
      [createSelect, 'color', { variant: 'outlined', label: 'Color', options: colors }],
      [createSlider, 'value', { label: `setLabel (${initialValue})`, min: 0, max: 1100, value: 456, step: 1, variant: 'discrete' }],
      [createSlider, 'maxValue', { label: ' setMax', min: 99, max: 999, value: 499, step: 100 }],
      [createSwitch, 'show', { label: 'Show', checked: true }]
    ], layout.info).component

  for (let i = variants.length - 1; i >= 0; i--) {
    info.variant.addChip({
      text: variants[i].label,
      value: variants[i].value,
      variant: 'filter',
      selectable: true
    })
  }

  info.maxValue.on('change', (event) => {
    badge.setMax(parseInt(event.value, 10))
  })

  info.color.on('change', (color) => {
    badge.setColor(color.value.toLowerCase())
  })

  info.show.on('change', (value) => {
    if (value.checked) {
      badge.show()
    } else {
      badge.hide()
    }
  })

  info.variant.on('change', (value) => {
    console.log('variant', value)
    badge.setVariant(value[0].toLowerCase())
  })

  info.value.on('input', (event) => {
    badge.setLabel(event.value)
    info.setLabel = `setValue ${'event.value'}`
  })
}
