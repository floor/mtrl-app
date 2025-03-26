// src/client/content/components/textfields/index.js

import {
  componentsLayout
} from '../../../layout'

import {
  createStructure
} from 'mtrl'

import { initTextfieldVariants } from './variants'
import { initMultilineTextfield } from './multiline'
import { initLeadingIcons } from './leading-icons'
import { initTrailingIcons } from './trailing-icons'
import { initSupportingText } from './supporting-text'
import { initCombinedFeatures } from './combined-features'

export const createTextfieldsContent = (container) => {
  const info = {
    title: 'Text Fields',
    description: 'Text fields let users enter and edit text'
  }

  const layout = createStructure(componentsLayout(info), container).component

  // Initialize all the textfield examples
  initTextfieldVariants(layout.body)
  initLeadingIcons(layout.body)
  initTrailingIcons(layout.body)
  initSupportingText(layout.body)
  initCombinedFeatures(layout.body)
  initMultilineTextfield(layout.body)
}
