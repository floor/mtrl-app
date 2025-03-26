// src/client/content/components/extended-fab/index.js

import {
  componentsLayout
} from '../../../../layout'

import {
  createStructure
} from 'mtrl'

import { initVariants } from './variants'
import { initWidthOptions } from './width'
import { initDisabled } from './disabled'
import { initPositions } from './positions'
import { initInteraction } from './interaction'
import { initCollapse } from './collapse'

export const createExtendedFabContent = (container) => {
  const info = {
    title: 'Extended Floating Action Button',
    description: 'An Extended Floating Action Button (Extended FAB) contains both an icon and a text label. It represents the primary, most common, or most important action on a screen. Extended FABs are more prominent and provide clearer action guidance than standard FABs.'
  }

  const layout = createStructure(componentsLayout(info), container).component

  initVariants(layout.body)
  initWidthOptions(layout.body)
  initDisabled(layout.body)
  initPositions(layout.body)
  initInteraction(layout.body)
  initCollapse(layout.body)
}
