import {
  createComponentsSectionLayout
} from '../../../layout'

import {
  fLayout,
  fSwitch
} from 'mtrl'

export const initSupportingText = (container) => {
  const title = 'Switches with supporting text'
  const layout = fLayout(createComponentsSectionLayout({ title }), container).component

  layout.body.style.flexDirection = 'column'
  layout.body.style.gap = '10px'
  layout.body.style.paddingTop = '30px'
  layout.body.style.paddingBottom = '60px'
  layout.body.style.alignItems = 'center'

  // Default switch
  const defaultSwitch = fSwitch({
    label: 'Permission manager',
    supportingText: 'App has access to your data'
  })
  layout.body.appendChild(defaultSwitch.element)

  // Checked switch
  const checkedSwitch = fSwitch({
    label: 'Camera access',
    supportingText: 'App has access to you camera',
    checked: true
  })

  checkedSwitch.element.style.width = '340px'
  defaultSwitch.element.style.width = '340px'

  layout.body.appendChild(checkedSwitch.element)
}
