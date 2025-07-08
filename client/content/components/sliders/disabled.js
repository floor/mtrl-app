import {
  createComponentSection
} from '../../../layout'

import {
  createSlider
} from 'mtrl'
import { createLayout } from 'mtrl-addons'

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
