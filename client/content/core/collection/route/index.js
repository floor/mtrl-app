// src/client/content/styles/layout.js

import {
  createContentLayout,
  createDocs
} from '../../../../layout'

import {
  createLayout
} from 'mtrl'

export const createLayoutStylesContent = (container) => {
  log.info('createLayoutContent', container)
  const info = {
    title: 'Route Adapter',
    description: 'A lightweight, flexible adapter for connecting to REST APIs with optimized features for pagination, query transformation, caching, and error handling.'
  }

  const layout = createLayout(createContentLayout(info), container).component

  createDocs(layout.body, 'core/collection/route.md')
}
