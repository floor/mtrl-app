// src/client/content/components/timepickers/index.js

import { createComponentsLayout } from '../../../layout'
import { createLayout } from 'mtrl-addons'
import { initBasic } from './basic'
import { initVariants } from './variants'
import { initFormats } from './formats'
import { initConstraints } from './constraints'
import { initProgramming } from './programming'
import { initCustomization } from './customization'

export const createTimePickersContent = (container) => {
  const info = {
    title: 'TimePicker',
    description: 'Select time from a dial or input interface'
  }

  const layout = createLayout(createComponentsLayout(info), container).component

  // Initialize all timepicker examples
  initBasic(layout.body)
  initVariants(layout.body)
  initFormats(layout.body)
  initConstraints(layout.body)
  initProgramming(layout.body)
  initCustomization(layout.body)
}
