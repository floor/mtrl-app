// src/client/content/core/composition.js

import {
  createContentLayout,
  createDocs
} from '../../../layout'

import {
  createLayout
  // createElement
} from 'mtrl'

// import { initCompositionPatterns } from './patterns'
// import { initPipeFunction } from './pipe'
// import { initFeatures } from './features'
// import { initCustomComponent } from './custom'
// import { initAdvancedPatterns } from './advanced'
// import { initBestPractices } from './bestpractices'

export const createCompositionContent = (container) => {
  const info = {
    title: 'Composition',
    description: 'Build complex components through function composition and feature mixing'
  }
  const layout = createLayout(createContentLayout(info), container).component

  createDocs(layout.body, 'core/composition/composition.md')
}
