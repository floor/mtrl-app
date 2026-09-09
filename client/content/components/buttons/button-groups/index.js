// client/content/components/buttons/button-groups/index.js

import { createComponentsLayout, createDocs } from '../../../../layout'
import { createLayout } from 'mtrl-addons'

import { initVariants } from './variants'
import { initSelection } from './selection'
import { initLabels } from './labels'
import { initSizes } from './sizes'
import { initColors } from './colors'

export const createButtonGroupsContent = (container) => {
  const info = {
    title: 'Button Groups',
    description: 'Button groups organize related buttons into a single row. Two variants: the standard group keeps individual round buttons with a gap; the connected group joins them with 2dp gaps, round outer ends and small inner corners. Groups have no colour of their own: they take the filled, tonal or outlined toggle button styles.'
  }

  const layout = createLayout(createComponentsLayout(info), container).component

  initVariants(layout.body)
  initSelection(layout.body)
  initLabels(layout.body)
  initSizes(layout.body)
  initColors(layout.body)

  createDocs(layout.body, 'components/button-group.md')
}

export default createButtonGroupsContent
