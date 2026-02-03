import {
  createComponentSection
} from '../../../layout'

import {
  createSlider
} from 'mtrl'
import { SLIDER_COLORS } from 'mtrl/components/slider/constants'
import { createLayout } from 'mtrl-addons'

export const initDiscrete = (container) => {
  const title = 'Slider with tick marks'
  const layout = createLayout(createComponentSection({ title }), container).component

  createSlider({
    min: 0,
    max: 5,
    value: 2,
    step: 1,
    ticks: true,
    color: SLIDER_COLORS.TERTIARY,
    parent: layout.showcase
  })
}
