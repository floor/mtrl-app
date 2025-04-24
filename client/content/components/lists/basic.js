import {
  createComponentsSectionLayout
} from '../../../layout'

import {
  createLayout,
  createList
} from 'mtrl'

export const initBasicList = (container) => {
  const title = 'Basic List'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component

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
  layout.body.appendChild(basicList.element)

  basicList.element.addEventListener('click', (event) => {
    const item = event.target.closest('.mtrl-list-item')
    if (item) {
      log.info(item)
    }
  })
}
