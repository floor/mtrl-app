// src/client/content/home.js

import {
  contentLayout,
  createComponentsSectionLayout
} from '../config'

import {
  createLayout
} from 'mtrl'

export const createHomeContent = (container) => {
  const info = {
    title: 'MTRL',
    description: 'A functional JavaScript component library with composable architecture'
  }

  container.classList.add('components')

  const layout = createLayout(contentLayout(info), container).component
}
