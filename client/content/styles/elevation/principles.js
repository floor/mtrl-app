// src/client/content/styles/elevation/principles.js
import { createLayout } from 'mtrl'

/**
 * Initializes the elevation principles section
 * @param {HTMLElement} container - Container for the content
 */
export const createElevationPrinciplesSection = (container) => {
  // Create principles with visual examples
  const principles = [
    {
      title: 'Shadows define elevation',
      description: 'Shadows indicate the distance between surfaces. The larger the shadow, the greater the distance.',
      exampleClass: 'elevation-principle-shadow'
    },
    {
      title: 'Elevation creates hierarchy',
      description: 'Higher elevation increases importance and brings attention to UI elements.',
      exampleClass: 'elevation-principle-hierarchy'
    },
    {
      title: 'Surface color and elevation',
      description: 'As elevation increases, surface color may shift slightly to reinforce depth.',
      exampleClass: 'elevation-principle-surface'
    }
  ]

  principles.forEach(principle => {
    const cardStructure = createLayout([
      'card', { tag: 'div', class: 'principle-card' },
      [
        'example', { tag: 'div', class: `principle-example ${principle.exampleClass}` },
        'content', { tag: 'div', class: 'principle-content' },
        [
          'title', { tag: 'h3', class: 'principle-title', text: principle.title },
          'description', { tag: 'p', class: 'principle-description', text: principle.description }
        ]
      ]
    ], container)

    // Add specific example content based on the principle type
    const exampleContainer = cardStructure.get('example')

    if (principle.exampleClass === 'elevation-principle-shadow') {
      // Shadow demonstration with multiple elevated surfaces
      for (let i = 0; i < 3; i++) {
        createLayout([
          'surface', {
            tag: 'div',
            class: `demo-surface elevation-${i + 1}`,
            style: `transform: translateX(${i * 20}px)`
          }
        ], exampleContainer)
      }
    } else if (principle.exampleClass === 'elevation-principle-hierarchy') {
      // Hierarchy demonstration with stacked elements
      createLayout([
        'primary', {
          tag: 'div',
          class: 'demo-surface demo-primary elevation-4',
          text: 'Primary'
        },
        'secondary', {
          tag: 'div',
          class: 'demo-surface demo-secondary elevation-2',
          text: 'Secondary'
        },
        'tertiary', {
          tag: 'div',
          class: 'demo-surface demo-tertiary elevation-0',
          text: 'Tertiary'
        }
      ], exampleContainer)
    } else if (principle.exampleClass === 'elevation-principle-surface') {
      // Surface color shifts with elevation
      for (let i = 0; i < 4; i++) {
        createLayout([
          'surface', {
            tag: 'div',
            class: `demo-surface surface-level-${i}`,
            text: `Level ${i}`
          }
        ], exampleContainer)
      }
    }
  })
}
