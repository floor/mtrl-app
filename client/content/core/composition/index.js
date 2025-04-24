// src/client/content/core/composition.js

import {
  contentLayout
} from '../../../layout'

import {
  createLayout,
  createElement
} from 'mtrl'

import { initCompositionPatterns } from './patterns'
import { initPipeFunction } from './pipe'
import { initFeatures } from './features'
import { initCustomComponent } from './custom'
import { initAdvancedPatterns } from './advanced'
import { initBestPractices } from './bestpractices'

export const createCompositionContent = (container) => {
  const info = {
    title: 'Composition',
    description: 'Build complex components through function composition and feature mixing'
  }
  const layout = createLayout(contentLayout(info), container).component

  initCompositionPatterns(layout.body)
  initPipeFunction(layout.body)
  initFeatures(layout.body)
  initCustomComponent(layout.body)
  initAdvancedPatterns(layout.body)
  initBestPractices(layout.body)
}

export const createCompositionLayout = () => [
  // Composition Patterns Section
  [createElement, { tag: 'section', class: 'mtrl-content__section' },
    [createElement, { tag: 'h2', class: 'mtrl-content__section-title', text: 'Composition Patterns' }],
    [createElement, { tag: 'p', class: 'mtrl-content__description', text: 'Learn how mtrl uses functional composition instead of inheritance to create flexible, reusable components.' }],
    [createElement, 'patterns', { id: 'patterns', class: 'patterns-container' }]
  ],

  // Pipe Function Section
  [createElement, { tag: 'section', class: 'mtrl-content__section' },
    [createElement, { tag: 'h2', class: 'mtrl-content__section-title', text: 'Pipe Function' }],
    [createElement, { tag: 'p', class: 'mtrl-content__description', text: 'The pipe function is the core utility that enables functional composition in mtrl.' }],
    [createElement, 'pipe', { id: 'pipe', class: 'pipe-container' }]
  ],

  // Features Section
  [createElement, { tag: 'section', class: 'mtrl-content__section' },
    [createElement, { tag: 'h2', class: 'mtrl-content__section-title', text: 'Component Features' }],
    [createElement, { tag: 'p', class: 'mtrl-content__description', text: 'Features are higher-order functions that enhance components with specific capabilities.' }],
    [createElement, 'features', { id: 'features', class: 'features-container' }]
  ],

  // Custom Component Section
  [createElement, { tag: 'section', class: 'mtrl-content__section' },
    [createElement, { tag: 'h2', class: 'mtrl-content__section-title', text: 'Creating Custom Components' }],
    [createElement, { tag: 'p', class: 'mtrl-content__description', text: 'Learn how to create your own custom components using the composition pattern.' }],
    [createElement, 'custom', { id: 'custom', class: 'custom-container' }]
  ],

  // Advanced Patterns Section
  [createElement, { tag: 'section', class: 'mtrl-content__section' },
    [createElement, { tag: 'h2', class: 'mtrl-content__section-title', text: 'Advanced Patterns' }],
    [createElement, { tag: 'p', class: 'mtrl-content__description', text: 'Explore advanced composition patterns for more complex scenarios.' }],
    [createElement, 'advanced', { id: 'advanced', class: 'advanced-container' }]
  ],

  // Best Practices Section
  [createElement, { tag: 'section', class: 'mtrl-content__section' },
    [createElement, { tag: 'h2', class: 'mtrl-content__section-title', text: 'Best Practices' }],
    [createElement, { tag: 'p', class: 'mtrl-content__description', text: 'Follow these guidelines to get the most out of the composition pattern in your mtrl applications.' }]

  ]
]
