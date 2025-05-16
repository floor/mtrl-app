import {
  createComponentSection
} from '../../../layout'

import {
  createLayout,
  createProgress,
  PROGRESS_VARIANTS
} from 'mtrl'

/**
 * Initializes the linear progress section
 * @param {HTMLElement} container - Container element
 */
export const initLinearProgress = (container) => {
  const title = 'Linear Progress'
  const layout = createLayout(createComponentSection({ title }), container).component

  // Create determinate linear progress
  const progress25 = createProgress({
    variant: PROGRESS_VARIANTS.LINEAR,
    value: 25
  })
  layout.showcase.appendChild(progress25.element)

  const progress50 = createProgress({
    variant: PROGRESS_VARIANTS.LINEAR,
    value: 50
  })
  layout.showcase.appendChild(progress50.element)

  const progress75 = createProgress({
    variant: PROGRESS_VARIANTS.LINEAR,
    value: 75
  })
  layout.showcase.appendChild(progress75.element)

  const progress100 = createProgress({
    variant: PROGRESS_VARIANTS.LINEAR,
    value: 100
  })
  layout.showcase.appendChild(progress100.element)
}
