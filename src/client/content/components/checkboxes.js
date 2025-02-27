// src/client/content/components/switches.js

import {
  contentLayout
} from '../../config'

import {
  createLayout,
  createElement,
  createCheckbox,
  createButton
} from 'mtrl'

const CHECK_ICON = `
<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <polyline points="20 6 9 17 4 12"></polyline>
</svg>`

export const createCheckboxesContent = (container, components) => {
  log.info('createButtonsContent', container)
  const info = {
    title: 'Checkboxes',
    description: 'Checkboxes let users select one or more items from a list, or turn an item on or off'
  }
  const layout = createLayout(contentLayout(info), container).component

  console.log('layout', layout)

  const ui = createLayout(createCheckboxesLayout(), layout.body).component
  console.info('ui', ui)
}

export const createCheckboxesLayout = (components) => [
  // Basic Switches Section
  [createElement, 'section', { class: 'mtrl-content__section' },
    [createElement, 'h2', { class: 'mtrl-content__section-title', text: 'Basic Checkboxes' }],
    [createElement, 'div', {
      class: 'mtrl-content__grid',
      id: 'basic',
      onCreate: (el) => {
        // Default switch
        const defaultSwitch = createCheckbox({
          label: 'Default Switch'
        })
        // defaultSwitch.on('change', (checked) =>
        //   components.logEvent(`Default switch ${checked ? 'checked' : 'unchecked'}`)
        // )
        el.appendChild(defaultSwitch.element)

        // Checked switch
        const checkedSwitch = createCheckbox({
          label: 'Initially Checked',
          checked: true
        })
        // checkedSwitch.on('change', (checked) =>
        //   components.logEvent(`Checked switch ${checked ? 'checked' : 'unchecked'}`)
        // )
        el.appendChild(checkedSwitch.element)

        // Disabled switch
        const disabledSwitch = createCheckbox({
          label: 'Disabled Switch',
          disabled: true
        })
        el.appendChild(disabledSwitch.element)

        // Disabled and checked switch
        const disabledCheckedSwitch = createCheckbox({
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
        const endIconSwitch = createCheckbox({
          label: 'Icon with End Label',
          icon: CHECK_ICON,
          labelPosition: 'end'
        })
        // endIconSwitch.on('change', (checked) =>
        //   components.logEvent(`Icon switch (end) ${checked ? 'checked' : 'unchecked'}`)
        // )
        el.appendChild(endIconSwitch.element)

        // Switch with icon and start label
        const startIconSwitch = createCheckbox({
          label: 'Icon with Start Label',
          icon: CHECK_ICON,
          labelPosition: 'start'
        })
        // startIconSwitch.on('change', (checked) =>
        //   components.logEvent(`Icon switch (start) ${checked ? 'checked' : 'unchecked'}`)
        // )
        el.appendChild(startIconSwitch.element)

        // Disabled switch with icon
        const disabledIconSwitch = createCheckbox({
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
        const endLabelSwitch = createCheckbox({
          label: 'Label at End (Default)',
          labelPosition: 'end'
        })
        // endLabelSwitch.on('change', (checked) =>
        //   components.logEvent(`End label switch ${checked ? 'checked' : 'unchecked'}`)
        // )
        el.appendChild(endLabelSwitch.element)

        // Label at start
        const startLabelSwitch = createCheckbox({
          label: 'Label at Start',
          labelPosition: 'start'
        })
        // startLabelSwitch.on('change', (checked) =>
        //   components.logEvent(`Start label switch ${checked ? 'checked' : 'unchecked'}`)
        // )
        el.appendChild(startLabelSwitch.element)

        // Disabled with start label
        const disabledStartLabelSwitch = createCheckbox({
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
          const switchComponent = createCheckbox({
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
