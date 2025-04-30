// src/client/content/core/layout/basics.js
import { createLayout, createElement } from 'mtrl'
import {
  createContentLayout
} from '../../../layout'

/**
 * Creates the Layout Basics section
 * @param {HTMLElement} container - Parent container
 */
export const createLayoutBasicsSection = (container) => {
  const section = createLayout(createContentLayout({
    title: 'Basic Layout',
    description: 'The Layout Module provides a declarative approach to building UI.',
    bodyClass: 'grid'
  }), container)

  // Add features to the container
  initLayoutFeatures(section.get('body'))
}

/**
 * Initializes the layout features display
 * @param {HTMLElement} container - Container for features
 */
const initLayoutFeatures = (body) => {
/**
 * SVG icons in Material Design 3 style
 */
  const svgIcons = {
    format_list_bulleted: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="24" height="24">
    <path d="M14,25a3,3 0 1,0 6,0a3,3 0 1,0 -6,0" fill="#1a73e8"/>
    <path d="M14,40a3,3 0 1,0 6,0a3,3 0 1,0 -6,0" fill="#1a73e8"/>
    <path d="M14,55a3,3 0 1,0 6,0a3,3 0 1,0 -6,0" fill="#1a73e8"/>
    <path d="M28,24h38a2,2 0 0,1 0,4h-38a2,2 0 0,1 0,-4z" fill="#1a73e8"/>
    <path d="M28,39h38a2,2 0 0,1 0,4h-38a2,2 0 0,1 0,-4z" fill="#1a73e8"/>
    <path d="M28,54h38a2,2 0 0,1 0,4h-38a2,2 0 0,1 0,-4z" fill="#1a73e8"/>
  </svg>`,

    speed: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="24" height="24">
    <path d="M40,14c-17.1,0-31,13.9-31,31c0,17.1,13.9,31,31,31c17.1,0,31-13.9,31-31C71,27.9,57.1,14,40,14z M40,70c-13.8,0-25-11.2-25-25c0-13.8,11.2-25,25-25c13.8,0,25,11.2,25,25C65,58.8,53.8,70,40,70z" fill="#1a73e8"/>
    <path d="M40,33c-1.1,0-2,0.9-2,2v5.5C38,41.4,38.9,42.2,40,42.2s2-0.8,2-1.8V35C42,33.9,41.1,33,40,33z" fill="#1a73e8"/>
    <path d="M45.2,36.2l3.5-3.5c0.8-0.8,0.8-2,0-2.8c-0.8-0.8-2-0.8-2.8,0l-7.8,7.8C37.4,38.4,37,39.4,37,40.5c0,2.5,2,4.5,4.5,4.5c2.5,0,4.5-2,4.5-4.5C46,39.1,45.7,37.5,45.2,36.2z M41.5,41c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5c0.3,0,0.5,0.2,0.5,0.5C42,40.8,41.8,41,41.5,41z" fill="#1a73e8"/>
  </svg>`,

    widgets: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="24" height="24">
    <path d="M20,20h15v15h-15z" fill="#1a73e8"/>
    <path d="M45,20h15v15h-15z" fill="#1a73e8"/>
    <path d="M20,45h15v15h-15z" fill="#1a73e8"/>
    <path d="M45,45h15v15h-15z" fill="#1a73e8"/>
  </svg>`,

    settings: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="24" height="24">
    <path d="M62,40c0-1.3-0.1-2.6-0.3-3.8l4.2-3.7l-6-10.4l-5.4,1.4c-1.9-1.5-3.9-2.7-6.2-3.5L47,15h-14l-1.2,5c-2.3,0.8-4.3,2-6.2,3.5l-5.4-1.4l-6,10.4l4.2,3.7c-0.2,1.2-0.3,2.5-0.3,3.8s0.1,2.6,0.3,3.8L14,47.5l6,10.4l5.4-1.4c1.9,1.5,3.9,2.7,6.2,3.5L33,65h14l1.2-5c2.3-0.8,4.3-2,6.2-3.5l5.4,1.4l6-10.4l-4.2-3.7C61.9,42.6,62,41.3,62,40z M40,52c-6.6,0-12-5.4-12-12s5.4-12,12-12s12,5.4,12,12S46.6,52,40,52z" fill="#1a73e8"/>
    <path d="M40,32c-4.4,0-8,3.6-8,8s3.6,8,8,8s8-3.6,8-8S44.4,32,40,32z M40,44c-2.2,0-4-1.8-4-4s1.8-4,4-4s4,1.8,4,4S42.2,44,40,44z" fill="#1a73e8"/>
  </svg>`,

    compress: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="24" height="24">
    <path d="M58,22h-8v4h5.2L40,41.2L24.8,26H30v-4h-8c-1.1,0-2,0.9-2,2v8h4v-5.2L40,42l15.2-15.2V32h4v-8C60,22.9,59.1,22,58,22z" fill="#1a73e8"/>
    <path d="M30,54h-5.2L40,38.8L55.2,54H50v4h8c1.1,0,2-0.9,2-2v-8h-4v5.2L40,38L24.8,53.2V48h-4v8c0,1.1,0.9,2,2,2h8V54z" fill="#1a73e8"/>
  </svg>`,

    code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="24" height="24">
    <path d="M32,48.8L20.2,37L32,25.2L28.8,22l-15,15l15,15L32,48.8z" fill="#1a73e8"/>
    <path d="M48,48.8l11.8-11.8L48,25.2L51.2,22l15,15l-15,15L48,48.8z" fill="#1a73e8"/>
    <path d="M36,54h4l4-28h-4L36,54z" fill="#1a73e8"/>
  </svg>`
  }

  const features = [
    {
      title: 'Multiple Schema Formats',
      description: 'Support for array-based, object-based, and HTML string schemas to fit different coding styles and needs.',
      icon: 'format_list_bulleted'
    },
    {
      title: 'Efficient DOM Operations',
      description: 'Uses DocumentFragment for batched DOM operations, significantly improving performance for large layouts.',
      icon: 'speed'
    },
    {
      title: 'Component Management',
      description: 'Simplifies access to component instances with consistent naming and easy retrieval methods.',
      icon: 'widgets'
    },
    {
      title: 'Customizable Creation',
      description: 'Control class prefixing, specify default creators, and pass custom options to all components.',
      icon: 'settings'
    },
    {
      title: 'Optimized for Bundle Size',
      description: 'Minimal footprint with maximum functionality through careful code organization and tree-shaking support.',
      icon: 'compress'
    },
    {
      title: 'TypeScript Support',
      description: 'Complete type definitions for an improved developer experience with autocompletion and error checking.',
      icon: 'code'
    }
  ]

  const containerCards = createLayout(['container'], body)

  features.forEach(feature => {
    createLayout(
      ['featureCard', { tag: 'div', class: 'mtrl-layout-feature-card' },
        ['iconContainer', { tag: 'div', class: 'mtrl-layout-feature-icon' },
          ['icon', { tag: 'div', html: svgIcons[feature.icon] }],
          'content', { tag: 'div', class: 'mtrl-layout-feature-content' },
          ['title', { tag: 'h3', class: 'mtrl-layout-feature-title', text: feature.title },
            'description', { tag: 'p', class: 'mtrl-layout-feature-description', text: feature.description }
          ]
        ]
      ], containerCards.element)
  })

  // Create a flow diagram to visualize the layout process
  const flowDiagram = createElement({
    tag: 'div',
    class: 'mtrl-layout-flow-diagram'
  })

  createLayout(
    ['diagram', { tag: 'div', class: 'mtrl-layout-diagram-container' },
      ['diagramTitle', { tag: 'h3', class: 'mtrl-layout-diagram-title', text: 'Layout Creation Flow' }],
      ['step1', { tag: 'div', class: 'mtrl-layout-diagram-step' },
        [
          'step1Label', { tag: 'div', class: 'mtrl-layout-diagram-label', text: '1. Schema Definition' },
          'step1Content', { tag: 'div', class: 'mtrl-layout-diagram-content', text: 'Define UI structure as array, object, or HTML string' }
        ],
        'arrow1', { tag: 'div', class: 'mtrl-layout-diagram-arrow', html: '&#8594;' },
        'step2', { tag: 'div', class: 'mtrl-layout-diagram-step' },
        [
          'step2Label', { tag: 'div', class: 'mtrl-layout-diagram-label', text: '2. Schema Processing' },
          'step2Content', { tag: 'div', class: 'mtrl-layout-diagram-content', text: 'Schema is parsed and components are instantiated' }
        ],
        'arrow2', { tag: 'div', class: 'mtrl-layout-diagram-arrow', html: '&#8594;' },
        'step3', { tag: 'div', class: 'mtrl-layout-diagram-step' },
        [
          'step3Label', { tag: 'div', class: 'mtrl-layout-diagram-label', text: '3. DOM Creation' },
          'step3Content', { tag: 'div', class: 'mtrl-layout-diagram-content', text: 'Elements created and added to DocumentFragment' }
        ],
        'arrow3', { tag: 'div', class: 'mtrl-layout-diagram-arrow', html: '&#8594;' },
        'step4', { tag: 'div', class: 'mtrl-layout-diagram-step' },
        [
          'step4Label', { tag: 'div', class: 'mtrl-layout-diagram-label', text: '4. DOM Insertion' },
          'step4Content', { tag: 'div', class: 'mtrl-layout-diagram-content', text: 'Fragment inserted into DOM in a single operation' }
        ],
        'arrow4', { tag: 'div', class: 'mtrl-layout-diagram-arrow', html: '&#8594;' },
        'step5', { tag: 'div', class: 'mtrl-layout-diagram-step' },
        [
          'step5Label', { tag: 'div', class: 'mtrl-layout-diagram-label', text: '5. Result Creation' },
          'step5Content', { tag: 'div', class: 'mtrl-layout-diagram-content', text: 'Layout result with component access methods returned' }
        ]
      ]

    ], body)

  // container.appendChild(flowDiagram)
}
