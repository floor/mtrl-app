import {
  createComponentSection
} from '../../../layout'

import {
  createLayout,
  createSlider,
  SLIDER_COLORS
} from 'mtrl'

export const initRangeDiscrete = (container) => {
  const title = 'Range slider with tick marks'
  const layout = createLayout(createComponentSection({ title }), container).component

  const slider = createSlider({
    min: 0,
    max: 1000,
    value: 200,
    secondValue: 800,
    range: true,
    step: 100,
    ticks: true,
    color: SLIDER_COLORS.SECONDARY
  })
  // btn.on('click', () => components.logEvent(`${variant} button clicked`))
  layout.showcase.appendChild(slider.element)
}
