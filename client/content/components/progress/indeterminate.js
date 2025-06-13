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
  createProgress({
    variant: PROGRESS_VARIANTS.CIRCULAR,
    indeterminate: true,
    thickness: 'thick',
    size: 96,
    parent: layout.showcase
  })

  // Create indeterminate linear progress
  createProgress({
    variant: PROGRESS_VARIANTS.LINEAR,
    indeterminate: true,
    thickness: 'thick',
    parent: layout.showcase
  })

  // Create indeterminate circular progress
  createProgress({
    variant: PROGRESS_VARIANTS.CIRCULAR,
    indeterminate: true,
    shape: 'wavy',
    size: 96,
    thickness: 'thick',
    parent: layout.showcase
  })

  // Create indeterminate linear progress
  createProgress({
    variant: PROGRESS_VARIANTS.LINEAR,
    indeterminate: true,
    shape: 'wavy',
    thickness: 'thick',
    parent: layout.showcase
  })
}
