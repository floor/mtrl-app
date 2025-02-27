// src/client/views/components/button.js

import {
  createElement,
  createLayout,
  createButton
} from 'mtrl'

const heartIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor"/>
</svg>`

// const startIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//   <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z" fill="currentColor"/>
// </svg>`

const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1)

export const createButtonsContent = (container, components) => {
  const ui = createLayout(createButtonsLayout(components), container).component
  initButtonVariants(ui)
  initButtonVariantsDisabled(ui)
  initButtonSizes(ui)
  initIconButtons(ui)
  // initIconTextButtons(ui)
}

export const initButtonVariants = (ui) => {
  const container = ui.buttonVariants
  console.log('initButtonVariants', container)
  const variants = ['filled', 'tonal', 'elevated', 'outlined', 'text']
  variants.forEach(variant => {
    const text = capitalize(variant)
    const btn = createButton({
      text: `${text} Button`,
      variant
    })
    // btn.on('click', () => components.logEvent(`${variant} button clicked`))
    container.appendChild(btn.element)
  })
}

export const initButtonVariantsDisabled = (ui) => {
  const container = ui.buttonVariantsDisabled
  console.log('initButtonVariants', container)

  const variants = ['filled', 'tonal', 'elevated', 'outlined', 'text']
  variants.forEach(variant => {
    const text = capitalize(variant)
    const btn = createButton({
      text: `${text} Button`,
      variant,
      disabled: true
    })
    // btn.on('click', () => components.logEvent(`${variant} button clicked`))
    container.appendChild(btn.element)
  })
}

export const initButtonSizes = (ui) => {
  const container = ui.buttonSizes
  const sizes = ['small', 'medium', 'large']
  sizes.forEach(size => {
    const text = capitalize(size)
    const btn = createButton({
      text: `${text} Button`,
      size
    })
    // btn.on('click', () => components.logEvent(`${variant} button clicked`))
    container.appendChild(btn.element)
  })
}

export const initIconButtons = (ui) => {
  const container = ui.buttonIcons
  const states = ['enabled', 'disabled']
  states.forEach(state => {
    const disabled = state === 'enabled'

    log.info('disabled', disabled)

    const btn = createButton({
      icon: heartIcon,
      iconSize: 'medium',
      disabled
    })
    // btn.on('click', () => components.logEvent(`${variant} button clicked`))
    container.appendChild(btn.element)
  })
}

export const createButtonsLayout = (components) => [
  [createElement, 'header', { class: 'mtrl-content__header' },
    [createElement, { tag: 'section', class: 'mtrl-content__box info' },
      [createElement, 'h1', { class: 'mtrl-content__title', text: 'Buttons' }]
    ],
    [createElement, { tag: 'section', class: 'mtrl-content__box visual' }]
  ],

  // Button Variants Section
  [createElement, { tag: 'section', class: 'mtrl-content__section' },
    [createElement, { tag: 'h2', class: 'mtrl-content__section-title', text: 'Button Variants' }],
    [createElement, 'buttonVariants', { id: 'variants' }]
  ],

  // Button Variants Section
  [createElement, 'section', { class: 'mtrl-content__section' },
    [createElement, 'h2', { tag: 'h2', class: 'mtrl-content__section-title', text: 'Button Variants Disabled' }],
    [createElement, 'buttonVariantsDisabled', { id: 'variants' }]
  ],

  // Button Sizes Section
  [createElement, { class: 'mtrl-content__section' },
    [createElement, { class: 'mtrl-content__section-title', text: 'Button Sizes' }],
    [createElement, 'buttonSizes', { id: 'sizes' }]
  ],

  // Icon Buttons Section
  [createElement, { class: 'mtrl-content__section' },
    [createElement, { class: 'mtrl-content__section-title', text: 'Icon Buttons' }],
    [createElement, 'buttonIcons', { id: 'iconButtons' }]
  ],

  // Text with Icons Section
  [createElement, { class: 'mtrl-content__section' },
    [createElement, { class: 'mtrl-content__section-title', content: 'Text with Icons' }],
    [createElement, 'buttonTextIcons', { id: 'textWithIcons' }]
  ]
]
