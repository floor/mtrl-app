// src/client/content/core/events.js

import {
  contentLayout
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

  const layout = createLayout(contentLayout(content), container).component

  initGestures(layout.body)
}
