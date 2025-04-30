// src/client/content/components/datepickers/index.js

import { createComponentsLayout } from '../../../layout'
import { createLayout } from 'mtrl'
import { initBasic } from './basic'
import { initRange } from './range'
import { initVariants } from './variants'
import { initProgramming } from './programming'
import { initFormatting } from './formatting'
import { initConstraints } from './constraints'

export const createDatePickersContent = (container) => {
  const info = {
    title: 'DatePicker',
    description: 'Select a date or range of dates from a calendar interface'
  }

  const layout = createLayout(createComponentsLayout(info), container).component

  // Initialize all datepicker examples
  initBasic(layout.body)
  initVariants(layout.body)
  initRange(layout.body)
  initFormatting(layout.body)
  initConstraints(layout.body)
  // initProgramming(layout.body)
}
