// src/client/content/components/drawer/index.js

import { createComponentsLayout, createDocs } from '../../../layout'
import { createLayout } from 'mtrl-addons'

import { initStandardDrawer } from './standard'
import { initModalDrawer } from './modal'
import { initDenseDrawer } from './dense'

export const createDrawerContent = (container) => {
  const info = {
    title: 'Navigation drawer',
    description:
      'A vertical list of top-level destinations along one edge of the app. Selecting a destination grows a secondary-container pill out of the middle of the item; the pill shrinks back when another destination takes over.'
  }

  const layout = createLayout(createComponentsLayout(info), container).component

  initStandardDrawer(layout.body)
  initModalDrawer(layout.body)
  initDenseDrawer(layout.body)

  createDocs(layout.body, 'components/drawer.md')
}

export default createDrawerContent
