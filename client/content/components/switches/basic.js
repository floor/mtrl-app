import {
  createComponentsSectionLayout
} from '../../../layout'

import {
  createLayout,
  createSwitch
} from 'mtrl'

export const initBasicSwitches = (container) => {
  const title = 'Basic Switches'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component

  // Default switch
  const defaultSwitch = createSwitch({
    label: 'Default Switch'
  })
  layout.body.appendChild(defaultSwitch.element)

  // Checked switch
  const checkedSwitch = createSwitch({
    label: 'Initially Checked',
    checked: true
  })
  layout.body.appendChild(checkedSwitch.element)
}
