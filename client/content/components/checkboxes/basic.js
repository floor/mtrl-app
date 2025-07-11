import { createLayout } from 'mtrl-addons'
import {
  createCheckbox
} from 'mtrl'

import {
  createComponentSection
} from '../../../layout'

export const initBasicCheckboxes = (container) => {
  const title = 'Basic Checkboxes'
  const layout = createLayout(createComponentSection({ title }), container).component

  createLayout([{

  },
  [{ layout: { type: 'stack', gap: 1 } },
    [createCheckbox, { label: 'Default' }],
    [createCheckbox, { label: 'Checked', checked: true }],
    [createCheckbox, { label: 'Disabled', disabled: true }],
    [createCheckbox, { label: 'Disabled', disabled: true, checked: true }]
  ]
  ], layout.showcase)
}
