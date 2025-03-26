// src/client/content/components/search/index.js

import { componentsLayout } from '../../../layout'
import { createStructure } from 'mtrl'
import { initBasicBar } from './basic-bar'
import { initBasicView } from './basic-view'
// import { initDockedView } from './docked-view'
import { initWithIcons } from './with-icons'
import { initWithAvatar } from './with-avatar'
// import { initTransition } from './transition'
import { initWithSuggestions } from './with-suggestions'
import { initDisabled } from './disabled'
import { initEventsAPI } from './events-api'

export const createSearchContent = (container) => {
  const info = {
    title: 'Search',
    description: 'Let users search for content within your application'
  }

  const layout = createStructure(componentsLayout(info), container).component

  initBasicBar(layout.body)
  initBasicView(layout.body)
  initWithIcons(layout.body)
  // initDockedView(layout.body)
  // initTransition(layout.body)
  initWithAvatar(layout.body)
  initWithSuggestions(layout.body)
  initDisabled(layout.body)
  initEventsAPI(layout.body)
}
