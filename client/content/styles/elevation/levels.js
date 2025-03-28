// src/client/content/styles/elevation/levels.js
import { createLayout } from 'mtrl'

/**
 * Creates the Elevation Levels section
 * @param {HTMLElement} container - Parent container
 */
export const createElevationLevelsSection = (container) => {
  const sectionStructure = createLayout([
    'section', { tag: 'section', class: 'mtrl-content__section' },
    [
      'title', { tag: 'h2', class: 'mtrl-content__section-title', text: 'Elevation Levels' },
      'description', {
        tag: 'p',
        class: 'mtrl-content__description',
        text: 'The mtrl framework provides standard elevation levels to create consistent depth throughout your application.'
      },
      'levels', { id: 'levels', class: 'elevation-levels-container' }
    ]
  ], container)

  // Initialize content for the levels section
  initElevationLevels(sectionStructure.get('levels'))
}

/**
 * Initializes the elevation levels demonstration
 * @param {HTMLElement} container - Container for the content
 */
export const initElevationLevels = (container) => {
  // Create elevation level examples
  const elevationLevels = [
    { level: 0, description: 'Base level for content' },
    { level: 1, description: 'For cards and elevated surfaces' },
    { level: 2, description: 'For navigation drawers' },
    { level: 3, description: 'For search bars and app bars' },
    { level: 4, description: 'For dialogs and menus' },
    { level: 5, description: 'For bottom sheets' }
  ]

  elevationLevels.forEach(elevation => {
    const structure = createLayout([
      'card', {
        tag: 'div',
        class: `elevation-card elevation-${elevation.level}`,
        attributes: {
          'data-level': elevation.level
        }
      },
      [
        'level', {
          tag: 'div',
          class: 'elevation-level',
          text: `Level ${elevation.level}`
        },
        'description', {
          tag: 'div',
          class: 'elevation-description',
          text: elevation.description
        }
      ]
    ], container)
  })
}
