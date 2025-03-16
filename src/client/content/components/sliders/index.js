// src/client/content/components/sliders/index.js

import { componentsLayout } from '../../../layout'
import { createLayout } from 'mtrl'
import { initContinuous, initContinuous1000 } from './continuous'
import { initCentered } from './centered'
import { initRange } from './range'
import { initDiscrete, initDiscreteWithLabels } from './discrete'
import { initDisabled } from './disabled'
import { initEventsAPI } from './events-api'

export const createSlidersContent = (container) => {
  const info = {
    title: 'Slider',
    description: 'Let users make selections from a range of values'
  }

  const layout = createLayout(componentsLayout(info), container).component

  initContinuous(layout.body)
  initContinuous1000(layout.body)
  initCentered(layout.body)
  initRange(layout.body)
  initDiscrete(layout.body)
  initDiscreteWithLabels(layout.body)
  initDisabled(layout.body)
  initEventsAPI(layout.body)
}
