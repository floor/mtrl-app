// src/client/content/components/badges/index.js

import { createComponentsLayout, createDocs } from '../../../layout'
import { createLayout } from 'mtrl'
import { initStandard } from './standard'
import { initDot } from './dot'
// import { initPositions } from './positions'
// import { initMax } from './max'
// import { initAttached } from './attached'
import { createBadgeContent } from './badge'

export const createBadgesContent = (container) => {
  const info = {
    title: 'Badge',
    description: 'Small status descriptors for UI elements according to Material Design 3 guidelines'
  }

  const layout = createLayout(createComponentsLayout(info), container).component

  // Introduction to the badges
  const introContainer = document.createElement('div')
  introContainer.style.marginBottom = '32px'

  layout.body.appendChild(introContainer)

  // Initialize all the demo sections
  createBadgeContent(layout.body)
  initStandard(layout.body)
  initDot(layout.body)
  // initPositions(layout.body)

  // initAttached(layout.body)

  // initMax(layout.body)
  createDocs(layout.body, 'components/badge.md')
}
