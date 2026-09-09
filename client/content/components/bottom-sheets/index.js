// src/client/content/components/bottom-sheets/index.js

import { createComponentsLayout, createDocs } from '../../../layout'
import { createLayout } from 'mtrl-addons'

import { initModalSheet } from './modal'
import { initStandardSheet } from './standard'
import { initSheetStates } from './states'

export const createBottomSheetsContent = (container) => {
  const info = {
    title: 'Bottom Sheet',
    description:
      'A surface anchored to the bottom edge, holding content secondary to the page. A modal sheet covers the page and takes focus; a standard sheet leaves it usable alongside.'
  }

  const layout = createLayout(createComponentsLayout(info), container).component

  initModalSheet(layout.body)
  initStandardSheet(layout.body)
  initSheetStates(layout.body)

  createDocs(layout.body, 'components/bottom-sheet.md')
}

export default createBottomSheetsContent
