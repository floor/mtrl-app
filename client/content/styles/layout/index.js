// src/client/content/styles/layout.js

import {
  createContentLayout
} from '../../../layout'

// Import utility functions for layout examples

// import { createBasicLayout } from './basic'
import { createResponsiveLayout } from './responsive'
import { createGridLayout } from './grid'
import { createCardLayout } from './card'
import { createSplitLayout } from './split'
import { initializeInteractiveLayouts } from './interactive'

import {
  fLayout
} from 'mtrl'

export const createLayoutStylesContent = (container) => {
  log.info('createLayoutContent', container)
  const info = {
    title: 'Layout',
    description: 'Structured arrangements of components with responsive behavior'
  }
  const layout = fLayout(createContentLayout(info), container).component

  console.log('layout', layout)

  // createBasicLayout(layout.body)
  createResponsiveLayout(layout.body)
  createGridLayout(layout.body)
  createCardLayout(layout.body)
  createSplitLayout(layout.body)

  // Initialize interactive elements after creating all layout components
  initializeInteractiveLayouts(container)
}
