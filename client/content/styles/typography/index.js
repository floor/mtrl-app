// src/client/content/styles/typography/index.js
import { createContentLayout } from '../../../layout'
import { createLayout } from 'mtrl'
import { createTypographyScalesSection } from './scales'
import { createTypeRolesSection } from './roles'
import { createFontWeightsSection } from './weights'
import { createTypographyDemoSection } from './demo'
import { createTypographyCodeSection } from './code'

/**
 * Creates the typography content section in the UI
 * @param {HTMLElement} container - Container to append content to
 */
export const createTypographyContent = (container) => {
  const info = {
    title: 'Typography',
    description: 'Typography expresses hierarchy and brand presence through type styles'
  }

  // Create the main layout
  const layout = createLayout(createContentLayout(info), container)

  // Get the layout body for adding content sections
  const contentBody = layout.get('body')

  // Create each section with its own function for better modularity
  createTypographyScalesSection(contentBody)
  createTypeRolesSection(contentBody)
  createFontWeightsSection(contentBody)
  createTypographyDemoSection(contentBody)
  createTypographyCodeSection(contentBody)
}
