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

  const showcase = createLayout([
    { layout: { type: 'stack', gap: 8 } },
    ['line', { layout: { type: 'row', gap: 8, columns: 4, align: 'center' } }],
    ['wavy', { layout: { type: 'row', gap: 8, columns: 4, align: 'center' } }]
  ], layout.showcase).component

  const values = [0, 25, 50, 75, 100]

  for (let i = 0; i < values.length; i++) {
    const progress = createProgress({
      variant: PROGRESS_VARIANTS.CIRCULAR,
      value: values[i],
      size: 96
    })
    showcase.line.appendChild(progress.element)
  }

  for (let i = 0; i < values.length; i++) {
    const progress = createProgress({
      variant: PROGRESS_VARIANTS.CIRCULAR,
      value: values[i],
      shape: 'wavy',
      size: 96
    })
    showcase.wavy.appendChild(progress.element)
  }
}
