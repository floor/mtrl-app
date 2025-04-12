// src/client/content/components/textfields/index.js

import {
  componentsLayout
} from '../../../layout'

import {
  createLayout
} from 'mtrl'

import { initBasicSelect } from './basic'

export const createTextfieldsContent = (container) => {
  const info = {
    title: 'Selects',
    description: ''
  }

  const layout = createLayout(componentsLayout(info), container).component

  // Initialize all the textfield examples
  initBasicSelect(layout.body)
}
