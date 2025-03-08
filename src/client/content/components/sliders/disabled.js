import {
  createComponentsSectionLayout
} from '../../../config'

import {
  createLayout,
  createSlider
} from 'mtrl'

export const initDisabled = (container) => {
  const title = 'Disabled slider'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component

  const slider = createSlider({
    min: 0,
    max: 10,
    value: 5,
    disabled: true
  })

  layout.body.appendChild(slider.element)
}
