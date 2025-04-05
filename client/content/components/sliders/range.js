// src/examples/price-range.js
import {
  createComponentsSectionLayoutInfo
} from '../../../layout'

import {
  createLayout,
  fSlider,
  fSnackbar
} from 'mtrl'

import {
  SLIDER_COLORS
} from 'mtrl/src/components/slider'

export const initRange = (container) => {
  const title = 'Price Range Filter'
  const layout = createLayout(createComponentsSectionLayoutInfo({ title }), container).component

  const priceSlider = fSlider({
    min: 0,
    max: 1000,
    value: 200,
    secondValue: 800,
    range: true,
    step: 100,
    ticks: true,
    color: SLIDER_COLORS.SECONDARY,
    label: 'Price range'
  })

  const duration = 1000

  // Update price display when slider changes
  priceSlider.on('change', (event) => {
    console.log('change', event.value)
    fSnackbar({
      message: `Price range changed: ${event.value} - ${event.secondValue}`,
      action: duration === 0 ? 'Dismiss' : undefined,
      duration
    }).show()
    // Here you would filter products based on price range
  })

  // priceSlider.on('input', (event) => {
  //   console.log('input', event.value, event.secondValue)
  // })

  layout.body.appendChild(priceSlider.element)
}
