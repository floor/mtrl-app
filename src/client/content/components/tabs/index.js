// src/client/content/components/tabs/index.js

import { componentsLayout } from '../../../config'
import { createLayout } from 'mtrl'
import { initBasicTabs } from './basic'
import { initSecondaryTabs } from './secondary'
import { initIconTabs } from './icons'
import { initScrollableTabs } from './scrollable'
import { initDynamicTabs } from './dynamic'
import { initProgrammaticTabs } from './programmatic'
import { initDynamicContent } from './dynamic-content'
import { initEventsAPI } from './events-api'

export const createTabsContent = (container) => {
  const info = {
    title: 'Tabs',
    description: 'Organize content into separate views where only one view can be visible at a time'
  }

  container.classList.add('mtrl-components-tabs')

  const layout = createLayout(componentsLayout(info), container).component

  initBasicTabs(layout.body)
  initSecondaryTabs(layout.body)
  initIconTabs(layout.body)
  initScrollableTabs(layout.body)
  initDynamicTabs(layout.body)
  initProgrammaticTabs(layout.body)
  initDynamicContent(layout.body)
  initEventsAPI(layout.body)
}
