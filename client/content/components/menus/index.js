// src/client/content/components/menus.js

import { createComponentsLayout, createDocs } from '../../../layout'

import { initBasicMenu } from './basic'
import { initVerticalMenu } from './vertical'
import { initNestedMenu } from './nested'
import { initPositionsMenu } from './positions'
import { initTexfieldMenu } from './textfield'
// import { initCustomMenu } from './custom'

import { createLayout } from 'mtrl-addons'
export const createMenusContent = (container) => {
  const info = {
    title: 'Menus',
    description: 'Display a list of choices on a temporary surface'
  }

  const layout = createLayout(createComponentsLayout(info), container).component

  initVerticalMenu(layout.body)
  initBasicMenu(layout.body)
  initPositionsMenu(layout.body)
  initNestedMenu(layout.body)
  initTexfieldMenu(layout.body)
  // initCustomMenu(layout.body)

  createDocs(layout.body, 'components/menu.md')
}
