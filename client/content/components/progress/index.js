// src/client/content/components/progress.js

import {
  createComponentsLayout
} from '../../../layout'

import {
  createLayout
} from 'mtrl'

import { initLinearProgress } from './linear'
import { initCircularProgress } from './circular'
import { initIndeterminateProgress } from './indeterminate'
import { initBufferProgress } from './buffer'
import { initInteractiveProgress } from './interactive'

/**
 * Creates the main Progress component showcase
 * @param {HTMLElement} container - The container element to append content to
 */
export const createProgressContent = (container) => {
  const info = {
    title: 'Progress Indicators',
    description: 'Progress indicators express an unspecified wait time or display the length of a process'
  }

  const layout = createLayout(createComponentsLayout(info), container).component

  // initLinearProgress(layout.body)
  // initCircularProgress(layout.body)
  initIndeterminateProgress(layout.body)
  // initBufferProgress(layout.body)
  // initInteractiveProgress(layout.body)
}
