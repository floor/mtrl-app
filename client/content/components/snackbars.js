// src/client/view/components/snackbars.js
import {
  componentsLayout
} from '../../layout'

import {
  createLayout,
  createElement,
  createSnackbar,
  createButton
} from 'mtrl'

export const SNACKBAR_POSITIONS = {
  CENTER: 'center',
  START: 'start',
  END: 'end'
}

export const createSnackbarsContent = (container, components) => {
  const info = {
    title: 'Snackbars',
    description: 'Show short updates about app processes at the bottom of the screen'
  }
  const layout = createLayout(componentsLayout(info), container).component

  const ui = createLayout(createSnackbarsLayout(), layout.body).component
  console.info('ui', ui)
}

export const createSnackbarsLayout = (components) => [

  // Basic Snackbars Section
  [createElement, 'section', { class: 'mtrl-content__section' },
    [createElement, 'h2', { class: 'mtrl-content__section-title', text: 'Basic Snackbars' }],
    [createElement, 'div', {
      class: 'mtrl-content__grid',
      id: 'basic',
      onCreate: (el) => {
        // Basic snackbar
        const basicButton = createButton({
          text: 'Show Basic Snackbar',
          variant: 'filled'
        })
        basicButton.on('click', () => {
          const snackbar = createSnackbar({
            message: 'This is a basic snackbar message',
            variant: 'basic'
          })
          snackbar.show()
          // components.logEvent('Basic snackbar shown')
        })
        el.appendChild(basicButton.element)

        // Snackbar with action
        const actionButton = createButton({
          text: 'Show Action Snackbar',
          variant: 'filled'
        })
        actionButton.on('click', () => {
          const snackbar = createSnackbar({
            message: 'Snackbar with action button',
            variant: 'action',
            action: 'Undo'
          })
          // snackbar.on('action', () => {
          //   // components.logEvent('Snackbar action clicked')
          // })
          // snackbar.show()
          // // components.logEvent('Action snackbar shown')
        })
        el.appendChild(actionButton.element)
      }
    }]
  ],

  // Positions Section
  [createElement, 'section', { class: 'mtrl-content__section' },
    [createElement, 'h2', { class: 'mtrl-content__section-title', text: 'Snackbar Positions' }],
    [createElement, 'div', {
      class: 'mtrl-content__grid',
      id: 'positions',
      onCreate: (el) => {
        Object.values(SNACKBAR_POSITIONS).forEach(position => {
          const button = createButton({
            text: `Show ${position}`,
            variant: 'filled'
          })
          button.on('click', () => {
            const snackbar = createSnackbar({
              message: `Snackbar in ${position} position`,
              position,
              action: 'OK'
            })
            snackbar.show()
            // components.logEvent(`${position} position snackbar shown`)
          })
          el.appendChild(button.element)
        })
      }
    }]
  ],

  // Duration Section
  [createElement, 'section', { class: 'mtrl-content__section' },
    [createElement, 'h2', { class: 'mtrl-content__section-title', text: 'Duration Options' }],
    [createElement, 'div', {
      class: 'mtrl-content__grid',
      id: 'duration',
      onCreate: (el) => {
        const durations = [
          { label: 'Quick (2s)', value: 2000 },
          { label: 'Default (4s)', value: 4000 },
          { label: 'Long (8s)', value: 8000 },
          { label: 'Persistent', value: 0 }
        ]

        durations.forEach(({ label, value }) => {
          const button = createButton({
            text: label,
            variant: 'filled'
          })
          button.on('click', () => {
            const snackbar = createSnackbar({
              message: `${label} duration snackbar`,
              duration: value,
              action: value === 0 ? 'Dismiss' : undefined
            })
            snackbar.show()
            // components.logEvent(`${label} duration snackbar shown`)
          })
          el.appendChild(button.element)
        })
      }
    }]
  ]
]
