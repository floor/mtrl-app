import {
  createComponentSection
} from '../../../layout'

import {
  createLayout,
  createList
} from 'mtrl'

export const initSectionedList = (container) => {
  const title = 'Sectioned List'
  const layout = createLayout(createComponentSection({ title }), container).component

  const list = createList({
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

  list.on('selectionChange', (event) => {
    log.info('selectionChange', event)
  })

  layout.body.appendChild(list.element)

  list.element.addEventListener('click', (event) => {
    const item = event.target.closest('.mtrl-list-item')
    if (item) {
      log.info(item)
    }
  })
}
