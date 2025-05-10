// src/client/content/styles/index.js

import {
  createContentLayout,
  createDocs
} from '../../layout'

import {
  createLayout
} from 'mtrl'

// import { createAppRouter } from '../../core/router'

export const createStylesContent = (container) => {
  // log.info('createStylesContent', container)
  const info = {
    title: 'Styling System',
    description: 'A comprehensive design system for consistent, accessible, and beautiful interfaces'
  }
  const layout = createLayout(createContentLayout(info), container).component

  // const ui = createLayout(createStylesStructure(), layout.body).component

  // Initialize the style card click handlers
  // initStyleCardHandlers(ui)
  createDocs(layout.body, 'styles/styles.md')
}
