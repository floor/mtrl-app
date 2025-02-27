// src/client/layout/lists.js
import {
  contentLayout
} from '../../config'

import {
  createLayout,
  createElement,
  createList,
  createButton
} from 'mtrl'

const STAR_ICON = `
<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
</svg>`

const USER_ICON = `
<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
  <circle cx="12" cy="7" r="4"></circle>
</svg>`

export const createListsContent = (container, components) => {
  log.info('createButtonsContent', container)
  const info = {
    title: 'Lists',
    description: 'Lists are continuous, vertical indexes of text and images'
  }
  const layout = createLayout(contentLayout(info), container).component

  const ui = createLayout(createListsLayout(), layout.body).component
  log.info('ui', ui)
}

export const createListsLayout = (components) => [
  // Basic List Section
  [createElement, 'section', { class: 'mtrl-content__section' },
    [createElement, 'h2', { class: 'mtrl-content__section-title', text: 'Basic List' }],
    [createElement, 'div', {
      class: 'mtrl-content__grid',
      id: 'basic',
      onCreate: (el) => {
        const basicList = createList({
          items: [
            { id: '1', headline: 'List Item 1' },
            { id: '2', headline: 'List Item 2' },
            { id: '3', headline: 'List Item 3' },
            { divider: true },
            { id: '4', headline: 'List Item 4' },
            { id: '5', headline: 'List Item 5' }
          ]
        })
        el.appendChild(basicList.element)

        basicList.element.addEventListener('click', (event) => {
          const item = event.target.closest('.mtrl-list-item')
          if (item) {
            log.info(item)
          }
        })
      }
    }]
  ],

  // List with Icons Section
  [createElement, 'section', { class: 'mtrl-content__section' },
    [createElement, 'h2', { class: 'mtrl-content__section-title', text: 'List with Icons' }],
    [createElement, 'div', {
      class: 'mtrl-content__grid',
      id: 'withIcons',
      onCreate: (el) => {
        const iconList = createList({
          items: [
            { id: '1', headline: 'Starred Item', leading: STAR_ICON },
            { id: '2', headline: 'User Profile', leading: USER_ICON },
            { id: '3', headline: 'Important', leading: STAR_ICON, trailing: '99+' },
            { divider: true },
            { id: '4', headline: 'Settings', leading: USER_ICON, trailing: '>' }
          ]
        })
        el.appendChild(iconList.element)
      }
    }]
  ],

  // Single Select List Section
  [createElement, 'section', { class: 'mtrl-content__section' },
    [createElement, 'h2', { class: 'mtrl-content__section-title', text: 'Single Select List' }],
    [createElement, 'div', {
      class: 'mtrl-content__grid',
      id: 'singleSelect',
      onCreate: (el) => {
        const singleSelectList = createList({
          type: 'single',
          items: [
            { id: '1', headline: 'Option 1' },
            { id: '2', headline: 'Option 2', selected: true },
            { id: '3', headline: 'Option 3' },
            { id: '4', headline: 'Option 4' }
          ]
        })

        singleSelectList.on('selectionChange', (event) => {
        })

        el.appendChild(singleSelectList.element)
      }
    }]
  ],

  // Multi Select List Section
  [createElement, 'section', { class: 'mtrl-content__section' },
    [createElement, 'h2', { class: 'mtrl-content__section-title', text: 'Multi Select List' }],
    [createElement, 'div', {
      class: 'mtrl-content__grid',
      id: 'multiSelect',
      onCreate: (el) => {
        const multiSelectList = createList({
          type: 'multi',
          items: [
            { id: '1', headline: 'Option 1', selected: true },
            { id: '2', headline: 'Option 2' },
            { id: '3', headline: 'Option 3', selected: true },
            { id: '4', headline: 'Option 4' }
          ]
        })

        multiSelectList.on('selectionChange', (event) => {
        })

        el.appendChild(multiSelectList.element)
      }
    }]
  ],

  // Sectioned List
  [createElement, 'section', { class: 'mtrl-content__section' },
    [createElement, 'h2', { class: 'mtrl-content__section-title', text: 'Sectioned List' }],
    [createElement, 'div', {
      class: 'mtrl-content__grid',
      id: 'sectioned',
      onCreate: (el) => {
        const sectionedList = createList({
          sections: [
            {
              id: 'section1',
              title: 'Section 1',
              items: [
                { id: '1', headline: 'Item 1.1' },
                { id: '2', headline: 'Item 1.2' }
              ]
            },
            {
              id: 'section2',
              title: 'Section 2',
              items: [
                { id: '3', headline: 'Item 2.1' },
                { id: '4', headline: 'Item 2.2' }
              ]
            }
          ]
        })

        el.appendChild(sectionedList.element)
      }
    }]
  ],

  // Vertical Layout List
  [createElement, 'section', { class: 'mtrl-content__section' },
    [createElement, 'h2', { class: 'mtrl-content__section-title', text: 'Vertical Layout' }],
    [createElement, 'div', {
      class: 'mtrl-content__grid',
      id: 'vertical',
      onCreate: (el) => {
        const verticalList = createList({
          layout: 'vertical',
          items: [
            {
              id: '1',
              headline: 'Primary Text',
              supportingText: 'Secondary text that provides more details',
              leading: USER_ICON
            },
            {
              id: '2',
              headline: 'Another Item',
              supportingText: 'With supporting text and metadata',
              leading: STAR_ICON,
              meta: 'Meta'
            }
          ]
        })

        el.appendChild(verticalList.element)
      }
    }]
  ],

  // Interactive States Section
  [createElement, 'section', { class: 'mtrl-content__section' },
    [createElement, 'h2', { class: 'mtrl-content__section-title', text: 'Interactive States' }],
    [createElement, 'div', { class: 'mtrl-content__grid' },
      [createElement, 'div', {
        id: 'stateTest',
        onCreate: (el) => {
          const list = createList({
            type: 'single',
            items: [
              { id: '1', headline: 'Interactive Item 1' },
              { id: '2', headline: 'Interactive Item 2' }
            ]
          })
          el.appendChild(list.element)
        }
      }],
      [createElement, 'div', { class: 'mtrl-content__controls' },
        [createButton, null, {
          text: 'Toggle Disabled',
          variant: 'outlined',
          onclick: () => {
            const list = window.testList
            if (list.element.disabled) {
              list.enable()
            } else {
              list.disable()
            }
          }
        }],
        [createButton, null, {
          text: 'Add Item',
          variant: 'outlined',
          onclick: () => {
            const id = `new-${Date.now()}`
            window.testList.addItem({
              id,
              headline: `New Item ${id}`
            })
            components.logEvent(`Added item: ${id}`)
          }
        }],
        [createButton, null, {
          text: 'Remove First Item',
          variant: 'outlined',
          onclick: () => {
            const firstId = window.testList.items.keys().next().value
            if (firstId) {
              window.testList.removeItem(firstId)
            }
          }
        }]
      ]
    ]
  ],

  // Event Handling Section
  [createElement, 'section', { class: 'mtrl-content__section' },
    [createElement, 'h2', { class: 'mtrl-content__section-title', text: 'Event Handling' }],
    [createElement, 'div', {
      id: 'eventTest',
      onCreate: (el) => {
        const list = createList({
          items: [
            { id: '1', headline: 'Event Test Item 1' },
            { id: '2', headline: 'Event Test Item 2' }
          ]
        })

        el.appendChild(list.element)
      }
    }],
    [createElement, 'div', { id: 'eventLog', class: 'mtrl-content__event-log' }]
  ]
]
