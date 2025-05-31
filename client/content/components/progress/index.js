// src/client/content/components/progress.js

import {
  createComponentsLayout,
  createDocs
} from '../../../layout'

import {
  createLayout
} from 'mtrl'
import { createProgressComponent } from './progress'
import { initLinearProgress } from './linear'
import { initCircularProgress } from './circular'
import { initProgressThickness } from './thickness'
import { initIndeterminateProgress } from './indeterminate'
import { initBufferProgress } from './buffer'

/**
 * Creates the main Progress component showcase
 * @param {HTMLElement} container - The container element to append content to
 */
export const createProgressesContent = (container) => {
  const info = {
    title: 'Progress Indicators',
    description: 'Progress indicators express an unspecified wait time or display the length of a process'
  }

  const layout = createLayout(createComponentsLayout(info), container).component

  createProgressComponent(layout.body)
  initLinearProgress(layout.body)
  initCircularProgress(layout.body)
  initProgressThickness(layout.body)
  initIndeterminateProgress(layout.body)
  initBufferProgress(layout.body)
  createDocs(layout.body, 'components/progress.md')
}
