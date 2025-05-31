import {
  createComponentSection
} from '../../../layout'

import {
  createLayout,
  createProgress,
  PROGRESS_VARIANTS
} from 'mtrl'

/**
 * Initializes the indeterminate progress section
 * @param {HTMLElement} container - Container element
 */
export const initIndeterminateProgress = (container) => {
  const title = 'Indeterminate Progress'
  const layout = createLayout(createComponentSection({ title, class: 'layout--stack layout--stack-gap-8' }), container).component

  // Create indeterminate circular progress
  const indeterminateCircular = createProgress({
    variant: PROGRESS_VARIANTS.CIRCULAR,
    indeterminate: true
  })
  layout.showcase.appendChild(indeterminateCircular.element)

  // Create indeterminate linear progress
  const indeterminateLinear = createProgress({
    variant: PROGRESS_VARIANTS.LINEAR,
    indeterminate: true
  })
  layout.showcase.appendChild(indeterminateLinear.element)
}
