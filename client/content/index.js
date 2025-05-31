// src/client/content/home.js

import {
  createHomeLayout
} from '../layout/home'

import { createColorPalettes } from './styles/colors/palettes'
import { createProgressComponent } from './components/progress/progress'
import { createButtonComponent } from './components/buttons/common/button'
import { initRange as createRangeSlider } from './components/sliders/range'
import { createTextfieldShowcase } from './components/textfields/textfield'
import { initSupportingText as createSwitches } from './components/switches/supporting'
import { initBasicTabs as createTabs } from './components/tabs/basic'
import { initSubmenu as createSelectSubmenu } from './components/selects/submenu'
import { initIndeterminateCheckboxes as createCheckboxes } from './components/checkboxes/indeterminate'
import { createBadgeContent } from './components/badges/badge'

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
  createProgressComponent(body)
  createButtonComponent(body)
  createSwitches(body)
  createTextfieldShowcase(body)
  createSelectSubmenu(body)
  createRangeSlider(body)
  createBadgeContent(body)
  createDialogs(body)
  createCheckboxes(body)
  createTabs(body)
}
