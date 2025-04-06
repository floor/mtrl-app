import {
  createComponentsSectionLayout
} from '../../../layout'

import {
  fLayout,
  fSlider
} from 'mtrl'

export const initCentered = (container) => {
  const title = 'Centered Slider'
  const layout = fLayout(createComponentsSectionLayout({ title }), container).component

  const slider = fSlider({
    min: -100,
    max: 100,
    value: 0,
    step: 1
  })
  layout.body.appendChild(slider.element)
}
