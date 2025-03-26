import {
  createComponentsSectionLayout
} from '../../../layout'

import {
  createStructure,
  createSlider
} from 'mtrl'

export const initCentered = (container) => {
  const title = 'Centered Slider'
  const layout = createStructure(createComponentsSectionLayout({ title }), container).component

  const slider = createSlider({
    min: -100,
    max: 100,
    value: 0,
    step: 1
  })
  layout.body.appendChild(slider.element)
}
