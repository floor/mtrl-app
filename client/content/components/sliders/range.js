// src/examples/price-range.js
import {
  createComponentSection
} from '../../../layout'

import {
  createLayout,
  createSlider,
  createSnackbar,
  SLIDER_COLORS
} from 'mtrl'

export const initRange = (container) => {
  const title = 'Price Range Filter'
  const layout = createLayout(createComponentSection({ title }), container).component

  const slider = createSlider({
    min: 0,
    max: 1000,
    value: 200,
    secondValue: 800,
    range: true,
    step: 100,
    ticks: true,
    color: SLIDER_COLORS.SECONDARY,
    label: 'Price range',
    parent: layout.showcase

  })

  const duration = 1000

  // Update price display when slider changes
  slider.on('change', (event) => {
    console.log('change', event.value)
    createSnackbar({
      message: `Price range changed: ${event.value} - ${event.secondValue}`,
      action: duration === 0 ? 'Dismiss' : undefined,
      duration
    }).show()
    // Here you would filter products based on price range
  })

  // priceSlider.on('input', (event) => {
  //   console.log('input', event.value, event.secondValue)
  // })
}
