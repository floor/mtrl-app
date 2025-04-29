// src/client/content/styles/layout.js

import { createLayout } from 'mtrl'

import {
  createContentLayout,
  createDocs
} from '../../../layout'

// Import utility functions for layout examples

// import { createLayoutBasicsSection } from './basics'
// import { createLayoutArraySection } from './array'
// import { createLayoutObjectSection } from './object'
// import { createLayoutComponentsSection } from './components'
// import { createLayoutDemoSection } from './demo'
// import { createLayoutCodeSection } from './code'

// import { createBasicLayout } from './basic'
import { createResponsiveLayout } from './responsive'
// import { createGridLayout } from './grid'
// import { createCardLayout } from './card'
import { createSplitLayout } from './split'
// import { initializeInteractiveLayouts } from './interactive'

export const createLayoutStylesContent = (container) => {
  log.info('createLayoutContent', container)
  const info = {
    title: 'Layout Module',
    description: 'A lightweight, flexible system for creating and managing visual arrangements and component hierarchies'
  }
  const layout = createLayout(createContentLayout(info), container).component

  console.log('layout', layout)

  // createBasicLayout(layout.body)
  createResponsiveLayout(layout.body)
  // createGridLayout(layout.body)
  // createCardLayout(layout.body)
  createSplitLayout(layout.body)

  // Initialize interactive elements after creating all layout components
  // initializeInteractiveLayouts(container)

  // createLayoutBasicsSection(layout.body)
  // createLayoutArraySection(layout.body)
  // createLayoutObjectSection(layout.body)
  // createLayoutComponentsSection(layout.body)
  // createLayoutDemoSection(layout.body)
  // createLayoutCodeSection(layout.body)

  createDocs(layout.body, 'core/layout.md')
}
