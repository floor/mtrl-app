// src/client/content/home.js

import {
  contentLayout
} from '../layout'

import {
  createLayout
} from 'mtrl'

export const createHomeContent = (container) => {
  const info = {
    title: 'mtrl',
    description: 'A functional TypeScript/Javascript component library with composable architecture'
  }

  container.classList.add('components')

  return createLayout(contentLayout(info), container).component
}
