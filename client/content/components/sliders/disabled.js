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
    max: 100,
    value: 70,
    disabled: true,
    step: 10,
    ticks: true,
    parent: layout.showcase
  })
}
