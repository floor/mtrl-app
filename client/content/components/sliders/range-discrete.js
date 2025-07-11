import {
  createComponentSection
} from '../../../layout'

import {
  createSlider,
  SLIDER_COLORS
} from 'mtrl'
import { createLayout } from 'mtrl-addons'

export const initRangeDiscrete = (container) => {
  const title = 'Range slider with tick marks'
  const layout = createLayout(createComponentSection({ title }), container).component

  createSlider({
    min: 0,
    max: 1000,
    value: 200,
    secondValue: 800,
    range: true,
    step: 100,
    ticks: true,
    color: SLIDER_COLORS.SECONDARY,
    contaoner: layout.showcase
  })
}
