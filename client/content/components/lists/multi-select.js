import {
  createComponentsSectionLayout
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
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component

  // Create a multi-select list
  const list = createList({
    multiSelect: true,
    items: countries,
    baseUrl: null,
    renderItem: (item) => {
      // const isSelected = selection.includes(item.id)
      const layout = createLayout(
        [{ class: 'list-item' },
          [{ class: 'list-item-content' },
            [{ class: 'list-item-text', text: item.name }]
          ]
        ]
      )

      const element = layout.get('element')

      return element
    }
  })

  // Handle selection changes
  list.on('select', (event) => {
    log.info('Selection changed:', event.selectedItems)
    // selection = event.selectedItems
  })

  layout.body.appendChild(list.element)
}
