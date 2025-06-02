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

  const showcase = createLayout([
    { layout: { type: 'stack', gap: 4 } }
  ], layout.showcase).component

  // Create progress with buffer indicator
  createProgress({
    variant: PROGRESS_VARIANTS.LINEAR,
    value: 40,
    buffer: 70,
    showLabel: true,
    parent: showcase.element
  })

  // Create another progress with buffer indicator
  createProgress({
    variant: PROGRESS_VARIANTS.LINEAR,
    value: 20,
    buffer: 90,
    parent: showcase.element
  })
}
