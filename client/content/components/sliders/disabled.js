import {
  createComponentSection
} from '../../../layout'

import {
  createLayout,
  createSlider
} from 'mtrl'

export const initDisabled = (container) => {
  const title = 'Disabled slider'
  const layout = createLayout(createComponentSection({ title }), container).component

  const slider = createSlider({
    min: 0,
    max: 10,
    value: 5,
    disabled: true
  })

  layout.showcase.appendChild(slider.element)
}
