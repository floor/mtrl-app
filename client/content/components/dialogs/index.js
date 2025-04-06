// src/client/content/components/dialogs/index.js

import { componentsLayout } from '../../../layout'
import { fLayout } from 'mtrl'
import { initBasic } from './basic'
import { initSizes } from './sizes'
import { initCustomButtons } from './custom-buttons'
import { initConfirmation } from './confirmation'
import { initFullscreen } from './fullscreen'
import { initFormDialog } from './form-dialog'
import { initAnimations } from './animations'
// import { initFooterAlignments } from './footer-alignments'

export const createDialogsContent = (container) => {
  const info = {
    title: 'Dialog',
    description: 'Display a popup dialog for focused user interactions'
  }

  const layout = fLayout(componentsLayout(info), container).component

  initBasic(layout.body)
  initFormDialog(layout.body)
  initSizes(layout.body)
  // initCustomButtons(layout.body)
  initConfirmation(layout.body)
  initFullscreen(layout.body)
  initAnimations(layout.body)
  // initFooterAlignments(layout.body)
}
