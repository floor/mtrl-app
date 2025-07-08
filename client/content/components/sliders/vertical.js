import {
  createComponentSection
} from '../../../layout'

import {
  createSlider
} from 'mtrl'
import { createLayout } from 'mtrl-addons'

import {
  SLIDER_ORIENTATIONS
} from 'mtrl/src/components/slider'

export const initVertical = (container) => {
  const title = 'Vertical slider'
  const layout = createLayout(createComponentSection({ title }), container).component

  const slider = createSlider({
    min: 0,
    max: 100,
    value: 75,
    orientation: SLIDER_ORIENTATIONS.VERTICAL,
    showValue: true,
    // Format value as percentage
    valueFormatter: (value) => `${value}%`
  })

  layout.showcase.appendChild(slider.element)
}
