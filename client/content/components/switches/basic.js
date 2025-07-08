import { createLayout } from 'mtrl-addons'
import {
  createComponentSection
} from '../../../layout'

import {
  createSwitch
} from 'mtrl'

export const initBasicSwitches = (container) => {
  const title = 'Switches'
  const layout = createLayout(createComponentSection({ title }), container).component

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
