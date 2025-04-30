// src/client/content/components/menu.js

import {
  createComponentsLayout
} from '../../../layout'

import {
  createElement,
  createLayout,
  createNavigation,
  createButton
} from 'mtrl'

export const createNavigationsContent = (container, components) => {
  log.info('createButtonsContent', container)
  const info = {
    title: 'Navigation',
    description: 'Let users switch between UI views'
  }
  const layout = createLayout(createComponentsLayout(info), container).component

  console.log('layout', layout)

  const ui = createLayout(createMenusLayout(components), layout.body).component
}

export const createMenusLayout = (components) => [
  // // Basic Navigation Section
  // [createElement, { tag: 'section', class: 'mtrl-content__section' },
  //   [createElement, { tag: 'h2', class: 'mtrl-content__section-title', text: 'Basic Navigation' }],
  //   [createElement, 'basicNavigation', { class: 'mtrl-content__demo' }]
  // ],

  // // Nested Navigation Section
  // [createElement, { class: 'mtrl-content__section' },
  //   [createElement, { class: 'mtrl-content__section-title', text: 'Nested Navigation' }],
  //   [createElement, 'nestedNavigation', { class: 'mtrl-content__demo' }]
  // ],

  // // Icon Navigation Section
  // [createElement, { class: 'mtrl-content__section' },
  //   [createElement, { class: 'mtrl-content__section-title', text: 'Icon Navigation' }],
  //   [createElement, 'iconNavigation', { class: 'mtrl-content__demo' }]
  // ],

  // // Custom Navigation Section
  // [createElement, { class: 'mtrl-content__section' },
  //   [createElement, { class: 'mtrl-content__section-title', text: 'Custom Menu' }],
  //   [createElement, 'customMenu', { class: 'mtrl-content__demo' }]
  // ]
]
