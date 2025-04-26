// src/client/layout/lists/index.js
import {
  componentsLayout
} from '../../../layout'

import {
  createLayout
} from 'mtrl'

import { initBasicList } from './basic'
import { initSingleSelectList } from './single-select'
import { initMultiSelectList } from './multi-select'
import { initCursorList } from './cursor'
import { initUsersList } from './users'

import { initSectionedList } from './sectioned'
import { initVerticalLayout } from './vertical'

export const createListsContent = (container, components) => {
  const info = {
    title: 'Lists',
    description: 'Lists are continuous, vertical indexes of text and images'
  }

  const layout = createLayout(componentsLayout(info), container).component

  initBasicList(layout.body)
  // initSingleSelectList(layout.body)
  initMultiSelectList(layout.body)
  initUsersList(layout.body)
  initCursorList(layout.body)
  // initSectionedList(layout.body)
  // initVerticalLayout(layout.body)
  // initListsAdapter(layout.body)
}
