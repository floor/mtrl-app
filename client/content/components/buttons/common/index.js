// src/client/content/components/button/index.js

import {
  contentLayout as fContentLayout
} from '../../../../layout'

import {
  fLayout
} from 'mtrl'

import { initVariants } from './variants'
import { initDisabled } from './disabled'
import { initIcons } from './icons'

export const createButtonsContent = (container) => {
  const info = {
    title: 'Buttons',
    description: 'Let users take action and make choices with one tap'
  }

  const layout = fLayout(fContentLayout(info), container).component

  initVariants(layout.body)
  initDisabled(layout.body)
  initIcons(layout.body)
}
