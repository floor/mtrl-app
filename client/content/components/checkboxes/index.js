// src/client/content/components/checkboxes/index.js
import {
  componentsLayout
} from '../../../layout'

import {
  createLayout
} from 'mtrl'

import { initBasicCheckboxes } from './basic'
import { initLabelPositions } from './label'
import { initIndeterminateCheckboxes } from './indeterminate'

export const createCheckboxesContent = (container) => {
  const info = {
    title: 'Checkboxes',
    description: 'Checkboxes let users select one or more items from a list, or turn an item on or off'
  }

  const layout = createLayout(componentsLayout(info), container).component

  initBasicCheckboxes(layout.body)
  initLabelPositions(layout.body)
  initIndeterminateCheckboxes(layout.body)
}
