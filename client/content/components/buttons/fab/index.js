// src/client/content/components/fab/index.js

import {
  componentsLayout
} from '../../../../layout'

import {
  createStructure
} from 'mtrl'

import { initVariants } from './variants'
import { initSizes } from './sizes'
import { initDisabled } from './disabled'
import { initPositions } from './positions'
import { initInteraction } from './interaction'

export const createFabContent = (container) => {
  const info = {
    title: 'Floating Action Button (FAB)',
    description: 'A FAB (Floating Action Button) represents the primary action on a screen. It appears in front of all screen content and is recognizable for its circular shape and icon in the center.'
  }

  const layout = createStructure(componentsLayout(info), container).getAll()

  initVariants(layout.body)
  initSizes(layout.body)
  initDisabled(layout.body)
  initPositions(layout.body)
  initInteraction(layout.body)
}
