import {
  createComponentsSectionLayout
} from '../../../layout'

import {
  createLayout,
  createSlider
} from 'mtrl'

import {
  SLIDER_COLORS
} from 'mtrl/src/components/slider'

export const initDiscrete = (container) => {
  const title = 'Slider with tick marks and labels'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component

  const slider = createSlider({
    min: 0,
    max: 5,
    value: 2,
    step: 1,
    ticks: true,
    color: SLIDER_COLORS.TERTIARY
  })

  layout.body.appendChild(slider.element)
}

export const initDiscreteWithLabels = (container) => {
  const title = 'Slider with tick marks and labels'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component

  const slider = createSlider({
    min: 0,
    max: 5,
    value: 2,
    step: 1,
    ticks: true,
    tickLabels: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent', 'Outstanding']
    // color: SLIDER_COLORS.TERTIARY
  })

  layout.body.appendChild(slider.element)
}
