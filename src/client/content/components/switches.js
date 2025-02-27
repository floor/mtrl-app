// src/client/views/components/switches.js

import {
  createElement,
  createLayout,
  createSwitch,
  createButton
} from 'mtrl'

const CHECK_ICON = `
<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <polyline points="20 6 9 17 4 12"></polyline>
</svg>`

export const createSwitchesContent = (container, components) => {
  const ui = createLayout(createSwitchesLayout(), container).component
  console.info('ui', ui)
}

export const createSwitchesLayout = (components) => [
  // Header
  [createElement, 'header', { class: 'mtrl-content__header' },
    [createElement, 'h1', { class: 'mtrl-content__title', text: 'Switches' }]
  ],

  // Basic Switches Section
  [createElement, 'section', { class: 'mtrl-content__section' },
    [createElement, 'h2', { class: 'mtrl-content__section-title', content: 'Basic Switches' }],
    [createElement, 'div', {
      class: 'mtrl-content__grid',
      id: 'basic',
      onCreate: (el) => {
        // Default switch
        const defaultSwitch = createSwitch({
          label: 'Default Switch'
        })
        // defaultSwitch.on('change', (checked) =>
        //   components.logEvent(`Default switch ${checked ? 'checked' : 'unchecked'}`)
        // )
        el.appendChild(defaultSwitch.element)

        // Checked switch
        const checkedSwitch = createSwitch({
          label: 'Initially Checked',
          checked: true
        })
        // checkedSwitch.on('change', (checked) =>
        //   components.logEvent(`Checked switch ${checked ? 'checked' : 'unchecked'}`)
        // )
        el.appendChild(checkedSwitch.element)

        // Disabled switch
        const disabledSwitch = createSwitch({
          label: 'Disabled Switch',
          disabled: true
        })
        el.appendChild(disabledSwitch.element)

        // Disabled and checked switch
        const disabledCheckedSwitch = createSwitch({
          label: 'Disabled Checked',
          disabled: true,
          checked: true
        })
        el.appendChild(disabledCheckedSwitch.element)
      }
    }]
  ],

  // Switches with Icons Section
  [createElement, 'section', { class: 'mtrl-content__section' },
    [createElement, 'h2', { class: 'mtrl-content__section-title', content: 'Switches with Icons' }],
    [createElement, 'div', {
      class: 'mtrl-content__grid',
      id: 'icons',
      onCreate: (el) => {
        // Switch with icon and end label
        const endIconSwitch = createSwitch({
          label: 'Icon with End Label',
          icon: CHECK_ICON,
          labelPosition: 'end'
        })
        // endIconSwitch.on('change', (checked) =>
        //   components.logEvent(`Icon switch (end) ${checked ? 'checked' : 'unchecked'}`)
        // )
        el.appendChild(endIconSwitch.element)

        // Switch with icon and start label
        const startIconSwitch = createSwitch({
          label: 'Icon with Start Label',
          icon: CHECK_ICON,
          labelPosition: 'start'
        })
        // startIconSwitch.on('change', (checked) =>
        //   components.logEvent(`Icon switch (start) ${checked ? 'checked' : 'unchecked'}`)
        // )
        el.appendChild(startIconSwitch.element)

        // Disabled switch with icon
        const disabledIconSwitch = createSwitch({
          label: 'Disabled with Icon',
          icon: CHECK_ICON,
          disabled: true
        })
        el.appendChild(disabledIconSwitch.element)
      }
    }]
  ],

  // Label Position Section
  [createElement, 'section', { class: 'mtrl-content__section' },
    [createElement, 'h2', { class: 'mtrl-content__section-title', content: 'Label Positions' }],
    [createElement, 'div', {
      class: 'mtrl-content__grid',
      id: 'labelPositions',
      onCreate: (el) => {
        // Label at end (default)
        const endLabelSwitch = createSwitch({
          label: 'Label at End (Default)',
          labelPosition: 'end'
        })
        // endLabelSwitch.on('change', (checked) =>
        //   components.logEvent(`End label switch ${checked ? 'checked' : 'unchecked'}`)
        // )
        el.appendChild(endLabelSwitch.element)

        // Label at start
        const startLabelSwitch = createSwitch({
          label: 'Label at Start',
          labelPosition: 'start'
        })
        // startLabelSwitch.on('change', (checked) =>
        //   components.logEvent(`Start label switch ${checked ? 'checked' : 'unchecked'}`)
        // )
        el.appendChild(startLabelSwitch.element)

        // Disabled with start label
        const disabledStartLabelSwitch = createSwitch({
          label: 'Disabled with Start Label',
          labelPosition: 'start',
          disabled: true
        })
        el.appendChild(disabledStartLabelSwitch.element)
      }
    }]
  ],

  // Interactive States Section
  [createElement, 'section', { class: 'mtrl-content__section' },
    [createElement, 'h2', { class: 'mtrl-content__section-title', content: 'Interactive States' }],
    [createElement, 'div', { class: 'mtrl-content__grid' },
      [createElement, 'div', {
        id: 'stateTest',
        onCreate: (el) => {
          const switchComponent = createSwitch({
            label: 'Interactive Switch'
          })
          el.appendChild(switchComponent.element)
        }
      }],
      [createElement, 'div', { class: 'mtrl-content__controls' },
        [createButton, null, {
          text: 'Toggle Disabled'
        }],
        [createButton, null, {
          text: 'Toggle Checked'
        }],
        [createButton, null, {
          text: 'Toggle Label Position'
        }],
        [createButton, null, { text: 'Update Label' }]
      ]
    ]
  ],

  // With Values Section
  [createElement, 'section', { class: 'mtrl-content__section' },
    [createElement, 'h2', { class: 'mtrl-content__section-title', content: 'With Custom Values' }],
    [createElement, 'div', {
      class: 'mtrl-content__grid',
      id: 'values'
    }]
  ],

  // Required Switch Section
  [createElement, 'section', { class: 'mtrl-content__section' },
    [createElement, 'h2', { class: 'mtrl-content__section-title', content: 'Required Switch' }],
    [createElement, 'div', { class: 'mtrl-content__grid', id: 'required' }]
  ],

  // Event Handling Section
  [createElement, 'section', { class: 'mtrl-content__section' },
    [createElement, 'h2', { class: 'mtrl-content__section-title', content: 'Event Handling' }],
    [createElement, 'div', { id: 'eventTest' }],
    [createElement, 'div', { id: 'eventLog', class: 'mtrl-content__event-log' }]
  ]
]
