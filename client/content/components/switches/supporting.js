import {
  createComponentsSectionLayout
} from '../../../layout'

import {
  createLayout,
  createSwitch
} from 'mtrl'

export const initSupportingText = (container) => {
  const title = 'Switches with supporting text'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component

  // layout.body.style.flexDirection = 'column'
  // layout.body.style.gap = '10px'
  // layout.body.style.paddingTop = '30px'
  // layout.body.style.paddingBottom = '60px'
  // layout.body.style.alignItems = 'center'

  createLayout([
    {
      style: {
        width: '340px'
      }
    },
    [createSwitch, {
      label: 'Permission manager',
      supportingText: 'App has access to your data'
    }],
    [createSwitch, {
      label: 'Camera access',
      supportingText: 'App has access to you camera',
      checked: true
    }]

  ], layout.showcase)
}
