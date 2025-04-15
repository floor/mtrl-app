import {
  createComponentsSectionLayout
} from '../../../layout'

import {
  createLayout,
  createSwitch
} from 'mtrl'

export const initDisabledSwitches = (container) => {
  const title = 'Disabled'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component

  layout.body.style.flexDirection = 'column'
  layout.body.style.gap = '10px'
  layout.body.style.paddingTop = '30px'
  layout.body.style.paddingBottom = '60px'
  layout.body.style.alignItems = 'center'

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

  disabledSwitch.element.style.width = '340px'
  disabledCheckedSwitch.element.style.width = '340px'

  layout.body.appendChild(disabledSwitch.element)
  layout.body.appendChild(disabledCheckedSwitch.element)
}
