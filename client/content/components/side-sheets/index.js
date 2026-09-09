// src/client/content/components/side-sheets/index.js

import { createComponentsLayout, createDocs } from '../../../layout'
import { createLayout } from 'mtrl-addons'

import { initModalSideSheet } from './modal'
import { initStandardSideSheet } from './standard'
import { initSideSheetPositions } from './positions'

export const createSideSheetsContent = (container) => {
  const info = {
    title: 'Side Sheet',
    description:
      'A surface docked to a vertical edge, holding content that supports the page rather than replacing it. Modal sheets float over the page behind a scrim; standard sheets sit beside it.'
  }

  const layout = createLayout(createComponentsLayout(info), container).component

  initModalSideSheet(layout.body)
  initStandardSideSheet(layout.body)
  initSideSheetPositions(layout.body)

  createDocs(layout.body, 'components/side-sheet.md')
}

export default createSideSheetsContent
