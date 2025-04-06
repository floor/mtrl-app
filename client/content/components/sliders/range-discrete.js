import {
  createComponentsSectionLayout
} from '../../../layout'

import {
  fLayout,
  fSlider
} from 'mtrl'

import {
  SLIDER_COLORS
} from 'mtrl/src/components/slider'

export const initRangeDiscrete = (container) => {
  const title = 'Range slider with tick marks'
  const layout = fLayout(createComponentsSectionLayout({ title }), container).component

  const slider = fSlider({
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
  layout.body.appendChild(slider.element)
}
