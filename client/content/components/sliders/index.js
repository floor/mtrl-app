// src/client/content/components/sliders/index.js

import { createComponentsLayout, createDocs } from '../../../layout'
import { createLayout } from 'mtrl'
import { initContinuous, initContinuous1000 } from './continuous'
import { initCentered } from './centered'
import { initRange } from './range'
import { initSizes } from './sizes'

// import { initVertical } from './vertical'

import { initDiscrete } from './discrete'
import { initRangeDiscrete } from './range-discrete'
import { initDisabled } from './disabled'
import { initEventsAPI } from './events-api'

export const createSlidersContent = (container) => {
  const info = {
    title: 'Slider',
    description: 'Let users make selections from a range of values'
  }

  const layout = createLayout(createComponentsLayout(info), container).component

  initContinuous(layout.body)
  initContinuous1000(layout.body)
  initSizes(layout.body)
  initCentered(layout.body)
  initRange(layout.body)
  // initVertical(layout.body)
  // initDiscrete(layout.body)
  // initRangeDiscrete(layout.body)
  initDisabled(layout.body)
  // initEventsAPI(layout.body),
  createDocs(layout.body, 'components/slider.md')
}
