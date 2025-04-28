import {
  createComponentsSectionLayout
} from '../../../layout'

import {
  createLayout,
  createSwitch
} from 'mtrl'

export const initBasicSwitches = (container) => {
  const title = 'Switches'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component

  createLayout([
    {
      style: {
        width: '340px'
      }
    },
    [createSwitch, {
      label: 'Default Switch'
    }],
    [createSwitch, {
      label: 'Initially Checked',
      checked: true
    }]

  ], layout.showcase)
}
