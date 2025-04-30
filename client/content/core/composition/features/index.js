// src/client/content/core/composition/features.js

import {
  createContentLayout,
  createDocs
} from '../../../../layout'

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
    title: 'Features',
    description: 'The composition system follows a functional programming approach, allowing you to build components by composing various features together.'
  }
  const layout = createLayout(createContentLayout(info), container).component

  createDocs(layout.body, 'core/composition/features.md')
}
