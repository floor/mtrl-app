// src/client/content/core/layout/index.js
import { contentLayout } from '../../../layout'
import { fLayout } from 'mtrl'
import { createLayoutBasicsSection } from './basics'
import { createLayoutArraySection } from './array'
import { createLayoutObjectSection } from './object'
import { createLayoutComponentsSection } from './components'
import { createLayoutDemoSection } from './demo'
import { createLayoutCodeSection } from './code'

/**
 * Creates the layout module content section in the UI
 * @param {HTMLElement} container - Container to append content to
 */
export const createLayoutContent = (container) => {
  const info = {
    title: 'Layout Module',
    description: 'A lightweight, flexible system for creating and managing visual arrangements and component hierarchies'
  }

  // Create the main layout
  const structure = fLayout(contentLayout(info), container)

  // Get the layout body for adding content sections
  const contentBody = structure.get('body')

  // Create each section with its own function for better modularity
  createLayoutBasicsSection(contentBody)
  createLayoutArraySection(contentBody)
  createLayoutObjectSection(contentBody)
  createLayoutComponentsSection(contentBody)
  createLayoutDemoSection(contentBody)
  createLayoutCodeSection(contentBody)
}
