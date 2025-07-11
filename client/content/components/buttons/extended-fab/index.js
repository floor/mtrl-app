// src/client/content/components/extended-fab/index.js

import {
  createComponentsLayout
} from '../../../../layout'

import { initVariants } from './variants'
import { initWidthOptions } from './width'
import { initDisabled } from './disabled'
import { initPositions } from './positions'
import { initAnimation } from './animation'
import { initInteraction } from './interaction'
import { initCollapse } from './collapse'

import { createLayout } from 'mtrl-addons'
export const createExtendedFabContent = (container) => {
  const info = {
    title: 'Extended Floating Action Button',
    description: 'An Extended Floating Action Button (Extended FAB) contains both an icon and a text label. It represents the primary, most common, or most important action on a screen. Extended FABs are more prominent and provide clearer action guidance than standard FABs.'
  }

  const layout = createLayout(createComponentsLayout(info), container).component

  initVariants(layout.body)
  initWidthOptions(layout.body)
  initDisabled(layout.body)
  initPositions(layout.body)
  initAnimation(layout.body)
  initInteraction(layout.body)
  initCollapse(layout.body)
}
