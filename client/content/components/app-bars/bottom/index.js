// src/client/content/components/app-bars/bottom/index.js

import { componentsLayout } from '../../../../layout'
import { createStructure } from 'mtrl'
import { initBasicBottomAppBar } from './basic'
import { initWithFabBottomAppBar } from './with-fab'
import { initAutoHideBottomAppBar } from './auto-hide'
import { initCustomActionsBottomAppBar } from './custom-actions'
import { initProgrammaticBottomAppBar } from './programmatic'
import { initEventsApiBottomAppBar } from './events-api'

export const createBottomAppBarsContent = (container) => {
  const info = {
    title: 'Bottom App Bar',
    description: 'Bottom app bars provide access to actions and navigation at the bottom of mobile screens'
  }

  container.classList.add('mtrl-components-bottom-app-bar')

  const layout = createStructure(componentsLayout(info), container).component

  initBasicBottomAppBar(layout.body)
  initWithFabBottomAppBar(layout.body)
  initAutoHideBottomAppBar(layout.body)
  initCustomActionsBottomAppBar(layout.body)
  initProgrammaticBottomAppBar(layout.body)
  initEventsApiBottomAppBar(layout.body)
}
