import {
  createComponentsSectionLayout
} from '../../../layout'

import {
  createLayout,
  createList
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

export const initVerticalLayout = (container) => {
  const title = 'Vertical Layout'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component

  const list = createList({
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
