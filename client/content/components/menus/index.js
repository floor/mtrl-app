// src/client/content/components/menus.js

import {
  createComponentsLayout
} from '../../../layout'

import {
  createLayout
} from 'mtrl'

import { initBasicMenu } from './basic'
import { initNestedMenu } from './nested'
import { initPositionsMenu } from './positions'
import { initTexfieldMenu } from './textfield'
// import { initCustomMenu } from './custom'

export const createMenusContent = (container) => {
  const info = {
    title: 'Menus',
    description: 'Display a list of choices on a temporary surface'
  }

  const layout = createLayout(createComponentsLayout(info), container).component

  // initBasicMenu(layout.body)
  // initPositionsMenu(layout.body)
  initNestedMenu(layout.body)
  initTexfieldMenu(layout.body)
  // initCustomMenu(layout.body)
}
