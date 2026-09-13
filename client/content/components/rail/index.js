// src/client/content/components/rail/index.js

import { createComponentsLayout, createDocs } from '../../../layout'
import { createLayout } from 'mtrl-addons'

import { initStandardRail } from './standard'
import { initModalRail } from './modal'

export const createRailContent = (container) => {
  const info = {
    title: 'Navigation rail',
    description:
      'The M3 expressive rail: a 96dp column of destinations that expands in place into a 280dp panel, the surface that replaces the navigation drawer. Selecting a destination grows a secondary-container pill out of the middle of the item; expanding glides the pills and icons on the spatial spring while the labels swap position behind a fade.'
  }

  const layout = createLayout(createComponentsLayout(info), container).component

  initStandardRail(layout.body)
  initModalRail(layout.body)

  createDocs(layout.body, 'components/navigation-rail.md')
}

export default createRailContent
