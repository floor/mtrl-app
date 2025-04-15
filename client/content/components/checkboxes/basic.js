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

  // Default checkbox
  const defaultCheckbox = createCheckbox({
    label: 'Default'
  })
  layout.body.appendChild(defaultCheckbox.element)

  // Checked checkbox
  const checkedCheckbox = createCheckbox({
    label: 'Checked',
    checked: true
  })
  layout.body.appendChild(checkedCheckbox.element)

  // Disabled checkbox
  const disabledCheckbox = createCheckbox({
    label: 'Disabled',
    disabled: true
  })
  layout.body.appendChild(disabledCheckbox.element)

  // Disabled and checked checkbox
  const disabledCheckedCheckbox = createCheckbox({
    label: 'Disabled',
    disabled: true,
    checked: true
  })
  layout.body.appendChild(disabledCheckedCheckbox.element)
}
