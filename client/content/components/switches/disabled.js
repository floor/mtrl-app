import {
  createComponentsSectionLayout
} from '../../../layout'

import {
  createStructure,
  createSwitch
} from 'mtrl'

export const initDisabledSwitches = (container) => {
  const title = 'Disabled'
  const layout = createStructure(createComponentsSectionLayout({ title }), container).component

  // Disabled switch
  const disabledSwitch = createSwitch({
    label: 'Disabled Switch',
    disabled: true
  })
  layout.body.appendChild(disabledSwitch.element)

  // Disabled and checked switch
  const disabledCheckedSwitch = createSwitch({
    label: 'Disabled Checked',
    disabled: true,
    checked: true
  })
  layout.body.appendChild(disabledSwitch.element)
  layout.body.appendChild(disabledCheckedSwitch.element)
}
