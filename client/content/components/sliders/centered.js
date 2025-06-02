import {
  createComponentSection
} from '../../../layout'

import {
  createLayout,
  createSlider
} from 'mtrl'

export const initCentered = (container) => {
  const title = 'Centered Slider'
  const layout = createLayout(createComponentSection({ title }), container).component

  const showcase = createLayout([
    { layout: { type: 'stack', gap: 8 } },
    ['one', { layout: { type: 'row', gap: 8, columns: 4, align: 'center' } }],
    ['two', { layout: { type: 'row', gap: 8, columns: 4, align: 'center' } }],
    ['three', { layout: { type: 'row', gap: 8, columns: 4, align: 'center' } }],
    ['four', { layout: { type: 'row', gap: 8, columns: 4, align: 'center' } }],
    ['five', { layout: { type: 'row', gap: 8, columns: 4, align: 'center' } }]
  ], layout.showcase).component

  // Basic centered slider
  createSlider({
    min: -100,
    max: 100,
    value: 0,
    step: 1,
    centered: true,
    label: 'Temperature adjustment',
    parent: showcase.one
  })

  // Centered slider with ticks
  createSlider({
    min: -50,
    max: 50,
    value: 25,
    step: 10,
    centered: true,
    ticks: true,
    label: 'Balance control',
    showValue: true,
    parent: showcase.two
  })

  // Centered slider with custom range
  createSlider({
    min: -10,
    max: 30,
    value: -5,
    step: 5,
    centered: true,
    ticks: true,
    label: 'Offset adjustment',
    showValue: true,
    valueFormatter: (value) => `${value > 0 ? '+' : ''}${value}°`,
    parent: showcase.three
  })

  // Centered slider with asymmetric range (zero not in middle)
  createSlider({
    min: -20,
    max: 60,
    value: 10,
    step: 5,
    centered: true,
    ticks: true,
    label: 'Asymmetric range',
    showValue: true,
    valueFormatter: (value) => `${value > 0 ? '+' : ''}${value}%`,
    parent: showcase.four
  })
}
