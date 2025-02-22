// src/client/views/components/button.js

import {
  createElement,
  createLayout,
  createButton,
  createContainer
} from 'mtrl'

const heartIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor"/>
</svg>`

const startIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z" fill="currentColor"/>
</svg>`

export const createButtonsView = (container, components) => {
  const ui = createLayout(createButtonsLayout(components), container).component
  initButtonVariants(ui)
  initButtonSizes(ui)
  initIconButtons(ui)
  initIconTextButtons(ui)
}

export const initButtonVariants = (ui) => {
  const container = ui.buttonVariants
  console.log('initButtonVariants', container)
  const variants = ['filled', 'tonal', 'outlined', 'text', 'elevated']
  variants.forEach(variant => {
    const btn = createButton({
      text: `${variant} Button`,
      variant
    })
    // btn.on('click', () => components.logEvent(`${variant} button clicked`))
    container.appendChild(btn.element)
  })
}

export const initButtonSizes = (ui) => {
  const container = ui.buttonSizes
  const sizes = ['small', 'medium', 'large']
  sizes.forEach(size => {
    const btn = createButton({
      text: `${size} Button`,
      size
    })
    // btn.on('click', () => components.logEvent(`${variant} button clicked`))
    container.appendChild(btn.element)
  })
}

export const initIconButtons = (ui) => {
  const container = ui.buttonIcons
  const variants = ['filled', 'tonal', 'outlined', 'text', 'elevated']
  variants.forEach(variant => {
    const btn = createButton({
      icon: heartIcon,
      iconSize: 'medium'
    })
    // btn.on('click', () => components.logEvent(`${variant} button clicked`))
    container.appendChild(btn.element)
  })
}

export const initIconTextButtons = (ui) => {
  const container = ui.buttonTextIcons
  const variants = ['filled', 'tonal', 'outlined', 'text', 'elevated']
  variants.forEach(variant => {
    const btnStart = createButton({
      text: 'Icon End',
      icon: startIcon,
      variant,
      iconPosition: 'start'
    })

    container.appendChild(btnStart.element)
    // btnStart.on('click', () => components.logEvent(`${variant} button with start icon clicked`))

    const btnEnd = createButton({
      text: 'Icon End',
      icon: startIcon,
      variant,
      iconPosition: 'end'
    })
    container.appendChild(btnEnd.element)
    // btnEnd.on('click', () => components.logEvent(`${variant} button with end icon clicked`))
  })
}

export const createButtonsLayout = (components) => [
  [createContainer, { class: 'mtrl-playground__container' },
    // Header
    [createElement, 'header', { class: 'mtrl-playground__header' },
      [createElement, 'h1', { class: 'mtrl-playground__title', content: 'mtrl buttons' }]
    ],

    // Button Variants Section
    [createElement, { tag: 'section', class: 'mtrl-playground__section' },
      [createElement, { tag: 'h2', class: 'mtrl-playground__section-title', content: 'Button Variants' }],
      [createElement, 'buttonVariants', { class: 'mtrl-playground__grid', id: 'variants' }]
    ],

    // Button Sizes Section
    [createElement, { class: 'mtrl-playground__section' },
      [createElement, { class: 'mtrl-playground__section-title', content: 'Button Sizes' }],
      [createElement, 'buttonSizes', { class: 'mtrl-playground__grid', id: 'sizes' }]
    ],

    // Icon Buttons Section
    [createElement, { class: 'mtrl-playground__section' },
      [createElement, { class: 'mtrl-playground__section-title', content: 'Icon Buttons' }],
      [createElement, 'buttonIcons', { class: 'mtrl-playground__grid', id: 'iconButtons' }]
    ],

    // Text with Icons Section
    [createElement, { class: 'mtrl-playground__section' },
      [createElement, { class: 'mtrl-playground__section-title', content: 'Text with Icons' }],
      [createElement, 'buttonTextIcons', { class: 'mtrl-playground__grid', id: 'textWithIcons' }]
    ]
  ]
]
