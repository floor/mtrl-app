// src/client/content/components/segmented-button/index.js

import {
  createComponentsLayout
} from '../../../../layout'

import {
  createLayout
} from 'mtrl'

import { initVariants } from './variants'
import { initSelectionModes } from './selection-modes'
import { initDisabled } from './disabled'
import { initIconsOptions } from './icons'
import { initInteraction } from './interaction'
import { initFormIntegration } from './form-integration'

export const createSegmentedButtonsContent = (container) => {
  const info = {
    title: 'Segmented Button',
    description: 'Segmented buttons help people select options, switch views, or sort elements. They contain two to five segments, each functioning as a distinct action. Segmented buttons can be used as an alternative to tabs, radio buttons, or standalone buttons when the options are closely related.'
  }

  const layout = createLayout(createComponentsLayout(info), container).component

  initVariants(layout.body)
  initSelectionModes(layout.body)
  initDisabled(layout.body)
  initIconsOptions(layout.body)
  initInteraction(layout.body)
  initFormIntegration(layout.body)
}
