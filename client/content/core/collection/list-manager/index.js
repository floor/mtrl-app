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
    title: 'List Manager',
    description: 'Provides efficient virtualized list rendering, essential for displaying large datasets without performance degradation. '
  }

  const layout = createLayout(createContentLayout(info), container).component

  createDocs(layout.body, 'core/collection/list-manager.md')
}
