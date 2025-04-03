// src/client/content/styles/elevation/index.js
import { createContentLayout } from '../../../layout'
import { createLayout } from 'mtrl'
import { createElevationLevelsSection } from './levels'
import { createElevationPrinciplesSection } from './principles'
import { createDynamicElevationSection } from './dynamic'
import { createElevationUsageSection } from './usage'
import { createElevationCodeSection } from './code'

/**
 * Creates the elevation content section in the UI
 * @param {HTMLElement} container - Container to append content to
 */
export const createElevationContent = (container) => {
  const info = {
    title: 'Elevation',
    description: 'Elevation creates visual hierarchy and depth using shadows and surface positioning'
  }

  // Create the main layout
  const structure = createLayout(createContentLayout(info), container)

  // Get the layout body for adding content sections
  const contentBody = structure.get('body')

  // Create each section with its own function for better modularity
  createElevationLevelsSection(contentBody)
  createElevationPrinciplesSection(contentBody)
  createDynamicElevationSection(contentBody)
  createElevationUsageSection(contentBody)
  createElevationCodeSection(contentBody)
}
