// src/client/content/components/buttons/icon-buttons/index.js

import { createComponentsLayout, createDocs } from '../../../../layout'
import { createLayout } from 'mtrl-addons'

import { initColorStyles } from './colors'
import { initSizes } from './sizes'
import { initShapes } from './shapes'
import { initWidths } from './widths'
import { initDisabled } from './disabled'

export const createIconButtonsContent = (container) => {
  const info = {
    title: 'Icon buttons',
    description:
      'Compact actions that need no label: four colour styles, each as a plain action or a toggle, in five sizes, two resting shapes and three widths. Pressing morphs the corners; a toggle also swaps its resting shape when selected.'
  }

  const layout = createLayout(createComponentsLayout(info), container).component

  initColorStyles(layout.body)
  initSizes(layout.body)
  initShapes(layout.body)
  initWidths(layout.body)
  initDisabled(layout.body)

  createDocs(layout.body, 'components/icon-button.md')
}

export default createIconButtonsContent
