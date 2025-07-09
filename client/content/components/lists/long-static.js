import { createLayout } from 'mtrl-addons'
import {
  createComponentSection
} from '../../../layout'

import {
  countries
} from '../../../data/isocode'

import {
  createList
} from 'mtrl'

export const initLongStaticList = (container) => {
  // let selection = []

  const title = 'Long static list'
  const description = 'List without list manager'
  const layout = createLayout(createComponentSection({ title }), container).component

  console.log('countries', countries)

  // Create a multi-select list
  const list = createList({
    multiSelect: true,
    items: countries,
    baseUrl: null,
    renderItem: (item) => {
      // console.log('renderItem', item)
      // const isSelected = selection.includes(item.id)
      const layout = createLayout(
        [{ class: 'list-item' },
          [{ class: 'list-item-content' },
            [{ class: 'list-item-text', text: item.name }]
          ]
        ]
      )

      return layout.get('element')
    },
    parent: layout.showcase
  })

  // Handle selection changes
  list.on('select', (event) => {
    // log.info('Selection changed:', event.selectedItems)
    // selection = event.selectedItems
  })
}
