// src/client/content/home.js

import {
  createHomeLayout
} from '../layout/home'

import { createColorPalettes } from './styles/colors/palettes'
import { initVariants as createButtonVariants } from './components/buttons/common/variants'
import { initRange as createRangeSlider } from './components/sliders/range'
import { initCombinedFeatures as createTextfieldCombined } from './components/textfields/combined-features'
import { initSupportingText as createSwitches } from './components/switches/supporting'
import { initBasicTabs as createTabs } from './components/tabs/basic'

import { initFormDialog as createDialogs } from './components/dialogs/form-dialog'

import {
  createLayout
} from 'mtrl'

export const createHomeContent = (container) => {
  const info = {
    title: 'mtrl',
    description: 'A functional TypeScript/Javascript component library with composable architecture'
  }

  const body = createLayout(createHomeLayout(info), container).get('body')

  createColorPalettes(body)
  createButtonVariants(body)
  createSwitches(body)
  createTextfieldCombined(body)
  createRangeSlider(body)
  createDialogs(body)
  createTabs(body)
}
