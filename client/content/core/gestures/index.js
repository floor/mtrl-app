// src/client/content/core/events.js

import {
  createContentLayout,
  createDocs
} from '../../../layout'

import {
  createLayout
} from 'mtrl'

import { initGestures } from './gestures'

export const createEventsContent = (container) => {
  const content = {
    title: 'Gestures',
    description: 'The gesture system provides first-class support for touch interactions.'
  }

  const layout = createLayout(createContentLayout(content), container).component

  initGestures(layout.body)
  createDocs(layout.body, 'core/gestures.md')
}
