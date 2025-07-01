// src/client/layout/lists/index.js
import { createComponentsLayout, createDocs } from '../../../layout'

import { createLayout } from 'mtrl'

import { createListComponent } from './list'
import { initBasicList } from './basic'
import { initSingleSelectList } from './single-select'
import { initMultiSelectList } from './multi-select'
import { initCursorList } from './cursor'
import { initCollectionEvents } from './collection-events'
import { initNavigationDebug } from './debug-navigation'
import { virtualPositioningTest } from './virtual-positioning-test'

import { initSectionedList } from './sectioned'
import { initVerticalLayout } from './vertical'

export const createListsContent = (container, components) => {
  const info = {
    title: 'Lists',
    description: 'Lists are continuous, vertical indexes of text and images'
  }

  const layout = createLayout(
    createComponentsLayout(info),
    container
  ).component

  createListComponent(layout.body)

  // initCollectionEvents(layout.body);
  // initNavigationDebug(layout.body);
  // virtualPositioningTest(layout.body);

  // initBasicList(layout.body)
  // initSingleSelectList(layout.body)
  // initMultiSelectList(layout.body)
  // initCursorList(layout.body)
  createDocs(layout.body, 'components/list.md')

  // initSectionedList(layout.body)
  // initVerticalLayout(layout.body)
  // initListsAdapter(layout.body)
}
//
