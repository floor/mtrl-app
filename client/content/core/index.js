// src/client/content/core/composition.js

import {
  createContentLayout,
  createDocs
} from '../../layout'

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
    title: 'Core Library ',
    description: 'The core library provides the fundamental building blocks for creating efficient, composable UI components with the mtrl design system.'
  }
  const layout = createLayout(createContentLayout(info), container).component

  createDocs(layout.body, 'core/core.md')
}
