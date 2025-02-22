// src/client/view/components/switches.js

import {
  createLayout,
  createElement,
  createContainer,
  createSnackbar,
  createButton
} from 'mtrl'

export const SNACKBAR_POSITIONS = {
  CENTER: 'center',
  START: 'start',
  END: 'end'
}

export const createSnackbarsView = (container, components) => {
  const ui = createLayout(createSnackbarsLayout(), container).component
  console.info('ui', ui)
}

export const createSnackbarsLayout = (components) => [
  [createContainer, { class: 'mtrl-playground__container' },
    // Header
    [createElement, 'header', { class: 'mtrl-playground__header' },
      [createElement, 'h1', { class: 'mtrl-playground__title', content: 'mtrl snackbars' }]
    ],

    // Basic Snackbars Section
    [createElement, 'section', { class: 'mtrl-playground__section' },
      [createElement, 'h2', { class: 'mtrl-playground__section-title', content: 'Basic Snackbars' }],
      [createElement, 'div', {
        class: 'mtrl-playground__grid',
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
    [createElement, 'section', { class: 'mtrl-playground__section' },
      [createElement, 'h2', { class: 'mtrl-playground__section-title', content: 'Snackbar Positions' }],
      [createElement, 'div', {
        class: 'mtrl-playground__grid',
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
    [createElement, 'section', { class: 'mtrl-playground__section' },
      [createElement, 'h2', { class: 'mtrl-playground__section-title', content: 'Duration Options' }],
      [createElement, 'div', {
        class: 'mtrl-playground__grid',
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

    // Interactive Demo Section
    // [createElement, 'section', { class: 'mtrl-playground__section' },
    //   [createElement, 'h2', { class: 'mtrl-playground__section-title', content: 'Interactive Demo' }],
    //   [createElement, 'div', { class: 'mtrl-playground__grid' },
    //     [createElement, 'div', {
    //       id: 'interactiveDemo',
    //       onCreate: (el) => {
    //         let currentSnackbar = null

    //         const showButton = createButton({
    //           text: 'Show Interactive Snackbar',
    //           variant: 'filled'
    //         })
    //         showButton.on('click', () => {
    //           if (currentSnackbar) {
    //             currentSnackbar.hide()
    //           }

    //           currentSnackbar = createSnackbar({
    //             message: 'Interactive snackbar demo',
    //             duration: 0,
    //             variant: 'action',
    //             action: 'Action'
    //           })

    //           // currentSnackbar.on('action', () => components.logEvent('Action clicked'))
    //           currentSnackbar.show()

    //           components.testSnackbar = currentSnackbar
    //           window.testSnackbar = currentSnackbar
    //           // components.logEvent('Interactive snackbar shown')
    //         })
    //         el.appendChild(showButton.element)
    //       }
    //     }],
    //     [createElement, 'div', { class: 'mtrl-playground__controls' },
    //       [createButton, null, {
    //         text: 'Update Message',
    //         variant: 'outlined',
    //         onclick: () => {
    //           if (window.testSnackbar) {
    //             window.testSnackbar.setMessage(`Updated: ${new Date().toLocaleTimeString()}`)
    //             // components.logEvent('Snackbar message updated')
    //           }
    //         }
    //       }],
    //       [createButton, null, {
    //         text: 'Hide Snackbar',
    //         variant: 'outlined',
    //         onclick: () => {
    //           if (window.testSnackbar) {
    //             window.testSnackbar.hide()
    //             // components.logEvent('Snackbar hidden via button')
    //           }
    //         }
    //       }]
    //     ]
    //   ]
    // ],

    // Event Handling Section
    // [createElement, 'section', { class: 'mtrl-playground__section' },
    //   [createElement, 'h2', { class: 'mtrl-playground__section-title', content: 'Event Handling' }],
    //   [createElement, 'div', {
    //     id: 'eventTest',
    //     onCreate: (el) => {
    //       const button = createButton({
    //         text: 'Show Event Test Snackbar',
    //         variant: 'filled'
    //       })
    //       button.on('click', () => {
    //         const snackbar = createSnackbar({
    //           message: 'Event test snackbar',
    //           action: 'Action',
    //           duration: 0
    //         })

    //         // snackbar.on('action', () => components.logEvent('Action event triggered'))
    //         // snackbar.on('dismiss', () => components.logEvent('Dismiss event triggered'))

    //         snackbar.show()
    //         // components.logEvent('Event test snackbar shown')
    //       })
    //       el.appendChild(button.element)
    //     }
    //   }],
    //   [createElement, 'div', { id: 'eventLog', class: 'mtrl-playground__event-log' }]
    // ]
  ]
]
