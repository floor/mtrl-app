import { createLayout } from 'mtrl-addons'
import {
  createComponentSection
} from '../../../layout'

import {
  createSwitch
} from 'mtrl'

export const initDisabledSwitches = (container) => {
  const title = 'Disabled'
  const layout = createLayout(createComponentSection({ title }), container).component

  createLayout([
    {
      style: {
        width: '340px'
      }
    },
    [createSwitch, {
      label: 'Permission manager',
      supportingText: 'App has access to your data',
      disabled: true
    }],
    [createSwitch, {
      label: 'Camera access',
      supportingText: 'App has access to you camera',
      checked: true,
      disabled: true
    }]

  ], layout.showcase)
}
