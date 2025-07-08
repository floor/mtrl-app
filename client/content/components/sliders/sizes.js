import {
  createComponentSection
} from '../../../layout'

import {
  createSlider,
  SLIDER_SIZES
} from 'mtrl'
import { createLayout } from 'mtrl-addons'

export const initSizes = (container) => {
  const title = 'Slider sizes'
  const layout = createLayout(
    createComponentSection({ title, class: 'noflex' }),
    container
  ).component

  let value = 200
  const max = 1000

  const sizes = Object.entries(SLIDER_SIZES).map(([label, size]) => ({
    label,
    size
  }))

  sizes.forEach(({ label, size }) => {
    createSlider({
      max,
      value,
      label,
      size,
      parent: layout.showcase
    })

    value = value + 200
  })
}
