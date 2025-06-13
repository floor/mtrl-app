// src/client/content/components/button/index.js

import {
  createContentLayout
  // createDocs
} from '../../../../layout'

import {
  createLayout
} from 'mtrl'

import { createIconButtonComponent } from './icon-button'
import { initVariants } from './variants'
import { createToggleButtons } from './toggle'
import { initDisabled } from './disabled'
import { createButtonSizes } from './sizes'

import { initProgressButton } from './progress'
import { initIcons } from './icons'

export const createButtonsContent = (container) => {
  // Set global defaults for all buttons in this section

  const info = {
    title: 'Buttons',
    description: 'Let users take action and make choices with one tap'
  }

  const layout = createLayout(createContentLayout(info), container).component

  createIconButtonComponent(layout.body)
  // initVariants(layout.body)
  // createToggleButtons(layout.body)
  // createButtonSizes(layout.body)

  // initIcons(layout.body)
  // initProgressButton(layout.body)
  // initDisabled(layout.body)
  // createDocs(layout.body, 'components/button.md')
}
