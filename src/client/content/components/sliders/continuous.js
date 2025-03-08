import {
  createComponentsSectionLayout
} from '../../../config'

import {
  createLayout,
  createSlider
} from 'mtrl'

export const initContinuous = (container) => {
  const title = 'Continous Slider: max 10'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component

  const slider = createSlider({
    min: 0,
    max: 10,
    value: 3,
    step: 1
  })
  layout.body.appendChild(slider.element)
}

export const initContinuous1000 = (container) => {
  const title = 'Continous Slider: max 1000'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component

  const slider = createSlider({
    min: 0,
    max: 1000,
    value: 250,
    step: 1
  })
  layout.body.appendChild(slider.element)
}
