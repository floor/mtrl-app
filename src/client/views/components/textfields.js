// src/client/views/components/textfields.js

import {
  createLayout,
  createElement,
  createContainer,
  createTextfield,
  createButton
} from 'mtrl'

export const createTextfieldsView = (container, components) => {
  const ui = createLayout(createTextfieldsLayout(), container).component
  console.info('ui', ui)
}

export const createTextfieldsLayout = (components) => [
  [createContainer, { class: 'mtrl-playground__container' },
    // Header1
    [createElement, 'header', { class: 'mtrl-playground__header' },
      [createElement, 'h1', { class: 'mtrl-playground__title', content: 'mtrl textfields' }]
    ],

    // Textfield Variants Section
    [createElement, 'section', { class: 'mtrl-playground__section' },
      [createElement, 'h2', { class: 'mtrl-playground__section-title', content: 'Textfield Variants' }],
      [createElement, 'div', {
        class: 'mtrl-playground__grid',
        id: 'variants',
        onCreate: (el) => {
          // Filled variant
          const variantContainer = createElement({
            class: 'mtrl-playground__variant',
            onCreate: (container) => {
              const filledContainer = createElement({ id: 'filledVariant' })
              const filled = createTextfield({
                label: 'Filled Input',
                placeholder: 'Type something...',
                variant: 'filled',
                helperText: 'This is a filled textfield'
              })
              filledContainer.appendChild(filled.element)
              container.appendChild(filledContainer)
            }
          })

          // Outlined variant
          const outlinedContainer = createElement({
            class: 'mtrl-playground__variant',
            onCreate: (container) => {
              const outlinedDiv = createElement({ id: 'outlinedVariant' })
              const outlined = createTextfield({
                label: 'Outlined Input',
                placeholder: 'Type something...',
                variant: 'outlined',
                helperText: 'This is an outlined textfield'
              })
              outlinedDiv.appendChild(outlined.element)
              container.appendChild(outlinedDiv)
            }
          })

          el.appendChild(variantContainer)
          el.appendChild(outlinedContainer)
        }
      }]
    ],

    // States & Validation Section
    [createElement, 'section', { class: 'mtrl-playground__section' },
      [createElement, 'h2', { class: 'mtrl-playground__section-title', content: 'States & Validation' }],
      [createElement, 'div', { class: 'mtrl-playground__grid' },
        [createElement, 'div', {
          id: 'stateTest',
          onCreate: (el) => {
            const textfield = createTextfield({
              label: 'Interactive Textfield',
              placeholder: 'Test different states',
              variant: 'outlined',
              helperText: 'Try different states'
            })
            el.appendChild(textfield.element)
          }
        }],
        [createElement, 'div', { class: 'mtrl-playground__controls' },
          [createButton, null, {
            text: 'Toggle Disabled',
            variant: 'outlined',
            onclick: () => {
              const textfield = window.testTextfield
              if (textfield.input.disabled) {
                textfield.enable()
                components.logEvent('Textfield enabled')
              } else {
                textfield.disable()
                components.logEvent('Textfield disabled')
              }
            }
          }],
          [createButton, null, {
            text: 'Toggle Error',
            variant: 'outlined',
            onclick: () => {
              const textfield = window.testTextfield
              const hasError = textfield.element.classList.contains('mtrl-textfield--error')
              if (hasError) {
                textfield.element.classList.remove('mtrl-textfield--error')
                textfield.setHelperText('Error state removed')
                components.logEvent('Error state removed')
              } else {
                textfield.element.classList.add('mtrl-textfield--error')
                textfield.setHelperText('This field has an error')
                components.logEvent('Error state added')
              }
            }
          }],
          [createButton, null, {
            text: 'Update Placeholder',
            variant: 'outlined',
            onclick: () => {
              window.testTextfield.setPlaceholder(`Placeholder updated: ${new Date().toLocaleTimeString()}`)
              components.logEvent('Placeholder updated')
            }
          }]
        ]
      ]
    ],

    // Sizes Section
    [createElement, 'section', { class: 'mtrl-playground__section' },
      [createElement, 'h2', { class: 'mtrl-playground__section-title', content: 'Sizes' }],
      [createElement, 'div', {
        class: 'mtrl-playground__grid',
        id: 'sizes',
        onCreate: (el) => {
          const sizes = ['small', 'default', 'large']
          sizes.forEach(size => {
            const textfield = createTextfield({
              label: `${size} Textfield`,
              placeholder: 'Type here...',
              variant: 'outlined',
              size
            })
            el.appendChild(textfield.element)
          })
        }
      }]
    ],

    // Multiline Section
    [createElement, 'section', { class: 'mtrl-playground__section' },
      [createElement, 'h2', { class: 'mtrl-playground__section-title', content: 'Multiline' }],
      [createElement, 'div', {
        id: 'multiline',
        onCreate: (el) => {
          const multiline = createTextfield({
            label: 'Multiline Input',
            placeholder: 'Type multiple lines...',
            type: 'multiline',
            variant: 'outlined',
            helperText: 'This is a multiline textfield'
          })
          el.appendChild(multiline.element)
        }
      }]
    ],

    // Event Handling Section
    [createElement, 'section', { class: 'mtrl-playground__section' },
      [createElement, 'h2', { class: 'mtrl-playground__section-title', content: 'Event Handling' }],
      [createElement, 'div', {
        id: 'eventTest',
        onCreate: (el) => {
          const textfield = createTextfield({
            label: 'Event Test',
            placeholder: 'Type to test events',
            variant: 'outlined'
          })

          textfield.on('input', (e) => components.logEvent(`Input value: ${e.target.value}`))
          textfield.on('focus', () => components.logEvent('Textfield focused'))
          textfield.on('blur', () => components.logEvent('Textfield blurred'))

          el.appendChild(textfield.element)
        }
      }],
      [createElement, 'div', { id: 'eventLog', class: 'mtrl-playground__event-log' }]
    ]
  ]
]
