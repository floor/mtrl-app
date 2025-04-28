// src/client/content/components/button/index.js

import {
  contentLayout as ContentLayout,
  createDocs
} from '../../../../layout'

import {
  createLayout
} from 'mtrl'

import { createButtonComponent } from './button'
import { initVariants } from './variants'
import { initDisabled } from './disabled'
import { initSpinnerButton } from './spinner'
import { initIcons } from './icons'

export const createButtonsContent = (container) => {
  const info = {
    title: 'Buttons',
    description: 'Let users take action and make choices with one tap'
  }

  const layout = createLayout(ContentLayout(info), container).component

  createButtonComponent(layout.body)
  // initVariants(layout.body)
  // initDisabled(layout.body)
  initIcons(layout.body)
  initSpinnerButton(layout.body)
  createDocs(layout.body, 'components/button.md')
}
