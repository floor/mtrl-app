import {
  createComponentSection
} from '../../../layout'
import {
  createLayout,
  createList
} from 'mtrl'

export const initBasicList = (container) => {
  const title = 'Basic List'
  const layout = createLayout(createComponentSection({ title }), container).component

  // Create a basic list with static items
  const list = createList({
    // Provide static items directly
    class: 'list--basic',
    baseUrl: null,
    items: [
      { id: '1', headline: 'List Item 1' },
      { id: '2', headline: 'List Item 2' },
      { id: '3', headline: 'List Item 3' },
      { id: '4', headline: 'List Item 4' },
      { id: '5', headline: 'List Item 5' }
    ],

    // Custom renderer for each item
    renderItem: (item) => {
      const element = document.createElement('div')
      element.className = 'mtrl-list-item'

      element.innerHTML = `
        <div class="mtrl-list-item-content">
          <span class="mtrl-list-item-text">${item.headline}</span>
        </div>
      `
      return element
    },
    parent: layout.showcase
  })

  // Handle selection events
  list.on('select', (event) => {
    console.log('Selected item:', event.item)
  })
}
