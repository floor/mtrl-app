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
import { initSubmenu as createSelectSubmenu } from './components/selects/submenu'
import { initIndeterminateCheckboxes as createCheckboxes } from './components/checkboxes/indeterminate'
import { initEventsAPI as createBadgeAPI } from './components/badges/events-api'

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
  createSelectSubmenu(body)
  createRangeSlider(body)
  createBadgeAPI(body)
  createDialogs(body)
  createCheckboxes(body)
  createTabs(body)
}
