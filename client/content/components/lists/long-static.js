import { createLayout, createVList } from 'mtrl-addons'
import {
  createComponentSection
} from '../../../layout'

import {
  countries
} from '../../../data/isocode'

console.log('countries', countries)

export const initLongStaticList = (container) => {
  const title = 'Long static list'
  const description = 'List without list manager'
  const layout = createLayout(createComponentSection({ title, description }), container).component

  // Create a multi-select list with proper template
  const list = createVList({
    multiSelect: true,
    items: countries,
    baseUrl: null,

    // Use 'template' instead of 'renderItem'
    template: (item, index) => {
      const layout = createLayout(
        [{ class: 'list-item' },
          [{ class: 'list-item-content' },
            [{ class: 'list-item-text', text: `${item.name} (${item.id})` }]
          ]
        ]
      )

      return layout.get('element')
    }
  })

  // Append the list to the showcase container immediately
  layout.showcase.appendChild(list.element)

  // Handle selection changes
  list.on('select', (event) => {
    console.log('Selection changed:', event.selectedItems)
  })

  // Return the list for potential further use
  return list
}
