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
export const initCircularProgress = (container) => {
  const title = 'Circular Progress'
  const layout = createLayout(createComponentSection({ title }), container).component

  // Create determinate circular progress indicators
  const progress25 = createProgress({
    variant: PROGRESS_VARIANTS.CIRCULAR,
    value: 25
  })
  layout.showcase.appendChild(progress25.element)

  const progress50 = createProgress({
    variant: PROGRESS_VARIANTS.CIRCULAR,
    value: 50
  })
  layout.showcase.appendChild(progress50.element)

  const progress75 = createProgress({
    variant: PROGRESS_VARIANTS.CIRCULAR,
    value: 75
  })
  layout.showcase.appendChild(progress75.element)

  const progress100 = createProgress({
    variant: PROGRESS_VARIANTS.CIRCULAR,
    value: 100
  })
  layout.showcase.appendChild(progress100.element)
}
