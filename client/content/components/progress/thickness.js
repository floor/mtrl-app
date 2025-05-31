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
export const initProgressThickness = (container) => {
  const title = 'Progress Thickness Config'
  const layout = createLayout(createComponentSection({ title, class: 'noflex' }), container).component

  const thickness = ['thin', 'thick', 12, 16]

  const showcase = createLayout([
    { layout: { type: 'stack', gap: 8 } },
    ['circular', { layout: { type: 'row', gap: 8, columns: 4, align: 'center' } }],
    ['linear', { layout: { type: 'stack', gap: 4 } }]
  ], layout.showcase).component

  for (let i = 0; i < thickness.length; i++) {
    const circularProgress = createProgress({
      variant: PROGRESS_VARIANTS.CIRCULAR,
      thickness: thickness[i],
      value: 50
    })
    showcase.circular.appendChild(circularProgress.element)
  }

  for (let i = 0; i < thickness.length; i++) {
    const linearProgress = createProgress({
      variant: PROGRESS_VARIANTS.LINEAR,
      thickness: thickness[i],
      value: 50
    })
    showcase.linear.appendChild(linearProgress.element)
  }
}
