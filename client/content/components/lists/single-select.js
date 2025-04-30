import {
  createComponentSection
} from '../../../layout'

import {
  createLayout,
  createList
} from 'mtrl'

export const initSingleSelectList = (container) => {
  const title = 'Single Select List'
  const layout = createLayout(createComponentSection({ title }), container).component

  const list = createList({
    type: 'single',
    items: [
      { id: '1', headline: 'Option 1' },
      { id: '2', headline: 'Option 2', selected: true },
      { id: '3', headline: 'Option 3' },
      { id: '4', headline: 'Option 4' }
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
