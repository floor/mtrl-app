import {
  createLayout,
  createCheckbox
} from 'mtrl'

import {
  createComponentsSectionLayout
} from '../../../layout'

export const initBasicCheckboxes = (container) => {
  const title = 'Basic Checkboxes'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component

  createLayout([
    [{ layout: { type: 'stack', gap: 1 } },
      [createCheckbox, { label: 'Default' }],
      [createCheckbox, { label: 'Checked', checked: true }],
      [createCheckbox, { label: 'Disabled', disabled: true }],
      [createCheckbox, { label: 'Disabled', disabled: true, checked: true }]
    ]
  ], layout.showcase)
}
