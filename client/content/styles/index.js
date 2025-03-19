// src/client/content/styles/index.js

import {
  contentLayout
} from '../../layout'

import {
  createLayout,
  createElement,
  createButton,
  createCard
} from 'mtrl'

export const createStylesContent = (container) => {
  log.info('createStylesContent', container)
  const info = {
    title: 'Styling System',
    description: 'A comprehensive design system for consistent, accessible, and beautiful interfaces'
  }
  const layout = createLayout(contentLayout(info), container).component

  const ui = createLayout(createStylesLayout(), layout.body).component

  // Initialize the style card click handlers
  initStyleCardHandlers(ui)
}

const initStyleCardHandlers = (ui) => {
  // Get router from window.app if available or try to find it from other global objects
  let router = null

  if (window.app?.getRouter) {
    router = window.app.getRouter()
  } else if (window.router) {
    router = window.router
  }

  if (!router) {
    log.error('Router not found, adding manual navigation links')
    // Fallback to using href for navigation
    addManualNavigation(ui)
    return
  }

  // Add click handlers to each style card
  const styleCards = {
    colors: ui.colorsCard,
    typography: ui.typographyCard,
    elevation: ui.elevationCard,
    layout: ui.layoutCard
  }

  Object.entries(styleCards).forEach(([style, card]) => {
    if (card && card.querySelector) {
      const button = card.querySelector('.style-card__button')
      if (button) {
        button.addEventListener('click', () => {
          router.navigate('styles', style)
        })
      }
    }
  })
}

// Fallback function that adds normal navigation links when router is not available
const addManualNavigation = (ui) => {
  const stylePages = {
    colors: { name: 'Colors', path: '/styles/colors' },
    typography: { name: 'Typography', path: '/styles/typography' },
    elevation: { name: 'Elevation', path: '/styles/elevation' },
    layout: { name: 'Layout', path: '/styles/layout' }
  }

  Object.entries(stylePages).forEach(([key, info]) => {
    const cardId = `${key}Card`
    const card = ui[cardId]

    if (card && card.querySelector) {
      const buttonContainer = card.querySelector('.style-card__footer')
      if (buttonContainer) {
        // Clear existing button
        buttonContainer.innerHTML = ''

        // Create a link button instead
        const link = document.createElement('a')
        link.href = info.path
        link.className = 'mtrl-button mtrl-button--filled style-card__button'
        link.textContent = `Explore ${info.name}`

        buttonContainer.appendChild(link)
      }
    }
  })
}

export const createStylesLayout = () => [
  // Introduction Section
  [createElement, 'section', { class: 'mtrl-content__section' },
    [createElement, 'h2', { class: 'mtrl-content__section-title', text: 'Design System Overview' }],
    [createElement, 'p', { class: 'mtrl-content__description', text: 'The MTRL styling system provides a consistent foundation for building beautiful, functional interfaces. The system is based on Material Design principles but optimized for flexibility and performance.' }],
    [createElement, 'p', { class: 'mtrl-content__description', text: 'Explore each subsystem to understand the building blocks of our design language.' }]
  ],

  // Style Categories Grid
  [createElement, 'section', { class: 'mtrl-content__section style-categories' },
    [createElement, 'h2', { class: 'mtrl-content__section-title', text: 'Style Categories' }],
    [createElement, 'div', { class: 'style-categories__grid' },
      // Colors Card
      [createCard, 'colorsCard', { class: 'style-card style-card--colors' }],

      // Typography Card
      [createElement, 'typographyCard', { class: 'style-card style-card--typography' },
        [createElement, 'div', { class: 'style-card__icon' },
          [createElement, 'div', { class: 'style-card__typography-icon' }]
        ],
        [createElement, 'h3', { class: 'style-card__title', text: 'Typography' }],
        [createElement, 'p', { class: 'style-card__description', text: 'Type scales and styles designed for readability, hierarchy, and rhythm across all screen sizes.' }],
        [createElement, 'ul', { class: 'style-card__highlights' },
          [createElement, 'li', { text: 'Type scale' }],
          [createElement, 'li', { text: 'Font stacks' }],
          [createElement, 'li', { text: 'Semantic styles' }]
        ],
        [createElement, 'div', { class: 'style-card__footer' },
          [createButton, null, {
            text: 'Explore Typography',
            variant: 'filled',
            class: 'style-card__button'
          }]
        ]
      ],

      // Elevation Card
      [createElement, 'elevationCard', { class: 'style-card style-card--elevation' },
        [createElement, 'div', { class: 'style-card__icon' },
          [createElement, 'div', { class: 'style-card__elevation-icon' }]
        ],
        [createElement, 'h3', { class: 'style-card__title', text: 'Elevation' }],
        [createElement, 'p', { class: 'style-card__description', text: 'Shadow and surface systems that create depth and hierarchy through visual layers.' }],
        [createElement, 'ul', { class: 'style-card__highlights' },
          [createElement, 'li', { text: 'Elevation levels' }],
          [createElement, 'li', { text: 'Shadow utilities' }],
          [createElement, 'li', { text: 'Surface states' }]
        ],
        [createElement, 'div', { class: 'style-card__footer' },
          [createButton, null, {
            text: 'Explore Elevation',
            variant: 'filled',
            class: 'style-card__button'
          }]
        ]
      ],

      // Layout Card
      [createElement, 'layoutCard', { class: 'style-card style-card--layout' },
        [createElement, 'div', { class: 'style-card__icon' },
          [createElement, 'div', { class: 'style-card__layout-icon' }]
        ],
        [createElement, 'h3', { class: 'style-card__title', text: 'Layout' }],
        [createElement, 'p', { class: 'style-card__description', text: 'Responsive grid systems, spacing scales, and layout patterns for consistent interfaces.' }],
        [createElement, 'ul', { class: 'style-card__highlights' },
          [createElement, 'li', { text: 'Grid system' }],
          [createElement, 'li', { text: 'Spacing scale' }],
          [createElement, 'li', { text: 'Responsive patterns' }]
        ],
        [createElement, 'div', { class: 'style-card__footer' },
          [createButton, null, {
            text: 'Explore Layout',
            variant: 'filled',
            class: 'style-card__button'
          }]
        ]
      ]
    ]
  ],

  // Using the Style System Section
  [createElement, 'section', { class: 'mtrl-content__section' },
    [createElement, 'h2', { class: 'mtrl-content__section-title', text: 'Using the Style System' }],
    [createElement, 'div', { class: 'usage-guide' },
      [createElement, 'div', { class: 'usage-guide__step' },
        [createElement, 'h3', { text: '1. Import Styles' }],
        [createElement, 'pre', { class: 'code-block' },
          [createElement, 'code', { text: '@use "mtrl/src/styles/themes/baseline";\n@use "mtrl/src/styles/abstract/theme as t";' }]
        ]
      ],
      [createElement, 'div', { class: 'usage-guide__step' },
        [createElement, 'h3', { text: '2. Apply Colors' }],
        [createElement, 'pre', { class: 'code-block' },
          [createElement, 'code', { text: '.my-element {\n  background-color: t.color("surface");\n  color: t.color("on-surface");\n}' }]
        ]
      ],
      [createElement, 'div', { class: 'usage-guide__step' },
        [createElement, 'h3', { text: '3. Use Typography' }],
        [createElement, 'pre', { class: 'code-block' },
          [createElement, 'code', { text: '@include c.typography("headline-medium");\n@include c.typography("body-large");' }]
        ]
      ]
    ]
  ]
]
