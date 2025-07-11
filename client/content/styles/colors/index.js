// src/client/content/styles/colors.js

import {
  createContentLayout
} from '../../../layout'

import { createLayout } from 'mtrl-addons'

import { createColorPalettes } from './palettes'
import { createThemeColors } from './themes'
import { createColorState } from './state'

export const createColorsContent = (content) => {
  console.log('createColorsContent', content)
  const info = {
    title: 'Colors',
    description: 'The color system helps create a consistent look across your UI'
  }
  const container = createLayout(createContentLayout(info), content).get('body')

  createColorPalettes(container)
  createThemeColors(container)
  createColorState(container)
}
