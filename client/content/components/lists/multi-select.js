import {
  createComponentSection
} from '../../../layout'

import {
  countries
} from '../../../data/isocode'

import {
  createLayout,
  createList
} from 'mtrl'

export const initMultiSelectList = (container) => {
  // let selection = []

  const title = 'Multi Select List'
  const layout = createLayout(createComponentSection({ title }), container).component

  console.log('countries', countries)

  // Create a multi-select list
  const list = createList({
    // multiSelect: true,
    items: countries,
    dynamicItemSize: true,
    baseUrl: null,
    renderItem: (item) => {
      console.log('renderItem', item)
      // const isSelected = selection.includes(item.id)
      const layout = createLayout(
        [{ class: 'list-item' },
          [{ class: 'list-item-content' },
            [{ class: 'list-item-text', text: item.name }]
          ]
        ]
      )

      const element = layout.get('element')

      console.log('element', element)

      return element
    },
    parent: layout.showcase
  })

  // Handle selection changes
  list.on('select', (event) => {
    log.info('Selection changed:', event.selectedItems)
    // selection = event.selectedItems
  })
}
