import {
  createComponentsSectionLayout
} from '../../../layout'

import {
  createStructure,
  createSwitch
} from 'mtrl'

export const initBasicSwitches = (container) => {
  const title = 'Basic Switches'
  const layout = createStructure(createComponentsSectionLayout({ title }), container).component

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
