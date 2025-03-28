// src/client/content/components/button/index.js

import {
  createComponentsStructure
} from '../../../../structure'

import {
  createLayout
} from 'mtrl'

import { initVariants } from './variants'
import { initDisabled } from './disabled'
import { initIcons } from './icons'

export const createButtonsContent = (container) => {
  const info = {
    title: 'Buttons',
    description: 'Let users take action and make choices with one tap'
  }

  const structure = createLayout(createComponentsStructure(info), container).component

  initVariants(structure.body)
  initDisabled(structure.body)
  initIcons(structure.body)
}
