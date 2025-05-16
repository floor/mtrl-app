import {
  createComponentSection
} from '../../../layout'

import {
  createLayout,
  createProgress,
  PROGRESS_VARIANTS
} from 'mtrl'

/**
 * Initializes the buffer progress section
 * @param {HTMLElement} container - Container element
 */
export const initBufferProgress = (container) => {
  const title = 'Buffer Progress'
  const layout = createLayout(createComponentSection({ title }), container).component

  // Create progress with buffer indicator
  const progress = createProgress({
    variant: PROGRESS_VARIANTS.LINEAR,
    value: 40,
    buffer: 70,
    showLabel: true
  })
  layout.showcase.appendChild(progress.element)

  // Create another progress with buffer indicator
  const progress2 = createProgress({
    variant: PROGRESS_VARIANTS.LINEAR,
    value: 20,
    buffer: 90
  })
  layout.showcase.appendChild(progress2.element)
}
