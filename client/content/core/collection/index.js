import { createLayout } from 'mtrl-addons'
// src/client/content/styles/layout.js

import {
  createContentLayout,
  createDocs
} from '../../../layout'

export const createLayoutStylesContent = (container) => {
  log.info('createLayoutContent', container)
  const info = {
    title: 'Collection',
    description: 'Structured arrangements of components with responsive behavior'
  }

  const layout = createLayout(createContentLayout(info), container).component

  createDocs(layout.body, 'core/collection/collection.md')
}
