import {
  createComponentSection
} from '../../../layout'

import {
  createSwitch
} from 'mtrl'
import { createLayout } from 'mtrl-addons'

export const initSupportingText = (container) => {
  const title = 'Switches with supporting text'
  const layout = createLayout(createComponentSection({ title }), container).component

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
