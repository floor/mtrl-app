import {
  createComponentsSectionLayout
} from '../../../layout'

import {
  fLayout,
  fSlider
} from 'mtrl'

export const initDisabled = (container) => {
  const title = 'Disabled slider'
  const layout = fLayout(createComponentsSectionLayout({ title }), container).component

  const slider = fSlider({
    min: 0,
    max: 10,
    value: 5,
    disabled: true
  })

  layout.body.appendChild(slider.element)
}
