import {
  createComponentSection
} from '../../../layout'

import {
  createLayout,
  createProgress,
  PROGRESS_VARIANTS
} from 'mtrl'

/**
 * Initializes the circular progress section
 * @param {HTMLElement} container - Container element
 */
export const initLinearProgress = (container) => {
  const title = 'Linear Progress'
  const layout = createLayout(createComponentSection({ title, class: 'layout--stack layout--stack-gap-8' }), container).component

  const showcase = createLayout([
    { layout: { type: 'stack', gap: 4 } }
  ], layout.showcase).component

  const values = [0, 25, 50, 75, 100]

  for (let i = 0; i < values.length; i++) {
    const progress = createProgress({
      variant: PROGRESS_VARIANTS.LINEAR,
      value: values[i]
    })
    showcase.element.appendChild(progress.element)
  }

  for (let i = 0; i < values.length; i++) {
    const progress = createProgress({
      variant: PROGRESS_VARIANTS.LINEAR,
      value: values[i],
      shape: 'wavy'
    })
    showcase.element.appendChild(progress.element)
  }
}
