import {
  createComponentsSectionLayout
} from '../../../layout'

import {
  createLayout,
  createList
} from 'mtrl'

export const initMultiSelectList = (container) => {
  const title = 'Multi Select List'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component

  const list = createList({
    type: 'multi',
    items: [
      { id: '1', headline: 'Option 1', selected: true },
      { id: '2', headline: 'Option 2' },
      { id: '3', headline: 'Option 3', selected: true },
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
