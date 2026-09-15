// src/client/content/components/segmented-button/index.js

import { createComponentsLayout, createDocs } from '../../../../layout'

import { initVariants } from './variants'
import { initSelectionModes } from './selection-modes'
import { initDisabled } from './disabled'
import { initIconsOptions } from './icons'
import { initInteraction } from './interaction'
import { initFormIntegration } from './form-integration'

import { createLayout } from 'mtrl-addons'
export const createSegmentedButtonsContent = (container) => {
  const info = {
    title: 'Segmented Button (deprecated)',
    description: 'Deprecated in Material 3 expressive: use the connected button group, with kind connected and single or multi selection, for new work. The segmented button still ships and behaves as shown here, so existing code keeps working; the documentation below maps each option to its button group equivalent.'
  }

  const layout = createLayout(createComponentsLayout(info), container).component

  initVariants(layout.body)
  initSelectionModes(layout.body)
  initDisabled(layout.body)
  initIconsOptions(layout.body)
  initInteraction(layout.body)
  initFormIntegration(layout.body)

  createDocs(layout.body, 'components/segmented-button.md')
}
