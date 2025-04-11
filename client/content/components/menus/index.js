// src/client/content/components/menus.js

import {
  componentsLayout
} from '../../../layout'

import {
  createLayout
} from 'mtrl'

import { initBasicMenu } from './basic'
import { initNestedMenu } from './nested'
import { initPositionsMenu } from './positions'
import { initCustomMenu } from './custom'

export const createMenusContent = (container) => {
  const info = {
    title: 'Menus',
    description: 'Display a list of choices on a temporary surface'
  }

  const layout = createLayout(componentsLayout(info), container).component

  initBasicMenu(layout.body)
  initNestedMenu(layout.body)
  initPositionsMenu(layout.body)
  initCustomMenu(layout.body)
}
