// src/client/content/components/app-bars/top/index.js

import { componentsLayout } from '../../../../layout'
import { createStructure } from 'mtrl'
import { initBasicTopAppBar } from './basic'
import { initTypesTopAppBar } from './types'
import { initScrollBehaviorTopAppBar } from './scroll-behavior'
import { initResponsiveTopAppBar } from './responsive'
import { initCustomActionsTopAppBar } from './custom-actions'
import { initEventsApiTopAppBar } from './events-api'

export const createTopAppBarsContent = (container) => {
  const info = {
    title: 'Top App Bar',
    description: 'Top app bars provide content and actions related to the current screen, including navigation, screen titles, and actions.'
  }

  container.classList.add('mtrl-components-top-app-bar')

  const layout = createStructure(componentsLayout(info), container).component

  initBasicTopAppBar(layout.body)
  initTypesTopAppBar(layout.body)
  initScrollBehaviorTopAppBar(layout.body)
  initResponsiveTopAppBar(layout.body)
  initCustomActionsTopAppBar(layout.body)
  initEventsApiTopAppBar(layout.body)
}
