// src/client/content/styles/elevation/usage.js
import { createStructure } from 'mtrl'

/**
 * Initializes the elevation usage examples
 * @param {HTMLElement} container - Container for the content
 */
export const createElevationUsageSection = (container) => {
  // Create examples of common usage patterns
  const usageExamples = [
    {
      component: 'Card',
      elevation: 1,
      description: 'Cards use elevation 1 to lift content from the background and create containment.'
    },
    {
      component: 'Dialog',
      elevation: 4,
      description: 'Dialogs use higher elevation (4) to appear above other content and focus user attention.'
    },
    {
      component: 'Navigation Bar',
      elevation: 2,
      description: 'Navigation elements use elevation 2 to separate from content but remain accessible.'
    },
    {
      component: 'Floating Action Button',
      elevation: 3,
      description: 'FABs use elevation 3 to stand out as primary actions.'
    }
  ]

  usageExamples.forEach(example => {
    createStructure([
      'container', { tag: 'div', class: 'usage-container' },
      [
        'component', { tag: 'div', class: `component-example elevation-${example.elevation}` },
        [
          'icon', { tag: 'div', class: `component-icon component-${example.component.toLowerCase().replace(' ', '-')}` },
          'name', { tag: 'div', class: 'component-name', text: example.component },
          'elevation', { tag: 'div', class: 'component-elevation', text: `Elevation ${example.elevation}` }
        ],
        'description', { tag: 'p', class: 'component-description', text: example.description }
      ]
    ], container)
  })
}
