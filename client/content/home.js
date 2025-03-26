// src/client/content/home.js

import {
  createContentStructure
} from '../structure'

import {
  createStructure
} from 'mtrl'

export const createHomeContent = (container) => {
  const info = {
    title: 'mtrl',
    description: 'A functional TypeScript/Javascript component library with composable architecture'
  }

  container.classList.add('components')

  return createStructure(createContentStructure(info), container).component
}
