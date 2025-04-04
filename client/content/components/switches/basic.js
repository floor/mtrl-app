import {
  createComponentsSectionLayout
} from '../../../layout'

import {
  createLayout,
  fSwitch
} from 'mtrl'

export const initBasicSwitches = (container) => {
  const title = 'Switches'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component

  layout.body.style.flexDirection = 'column'
  layout.body.style.gap = '10px'
  layout.body.style.paddingTop = '30px'
  layout.body.style.paddingBottom = '60px'
  layout.body.style.alignItems = 'center'

  // Default switch
  const defaultSwitch = fSwitch({
    label: 'Default Switch'
  })

  layout.body.appendChild(defaultSwitch.element)

  // Checked switch
  const checkedSwitch = fSwitch({
    label: 'Initially Checked',
    checked: true
  })

  checkedSwitch.element.style.width = '340px'
  defaultSwitch.element.style.width = '340px'

  layout.body.appendChild(checkedSwitch.element)
}
