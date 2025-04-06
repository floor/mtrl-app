import {
  createContentSection
} from '../../../layout'

import {
  fLayout,
  fButton,
  createElement
} from 'mtrl'

export const createGridLayout = (container) => {
  console.log('createGridLayout', container)
  const layout = fLayout(createContentSection({
    title: 'Responsive Layout',
    description: '',
    class: 'theme-colors'
  }), container).getAll()

  const body = layout.body

  // Add description
  const description = createElement({
    tag: 'p',
    class: 'mtrl-content__description',
    text: 'CSS Grid-based layout with various configurations.'
  })
  layout.body.appendChild(description)

  const gridContainer = createElement({
    class: 'layout-demo grid-layout'
  })

  // Create a 3x3 grid
  for (let i = 1; i <= 9; i++) {
    const gridItem = createElement({
      tag: 'div',
      class: 'layout-demo__grid-item',
      text: `${i}`
    })
    gridContainer.appendChild(gridItem)
  }

  // Create buttons to toggle different grid configurations
  const controls = createElement({
    tag: 'div',
    class: 'layout-demo__controls'
  })

  const gridOptions = [
    { text: '3-Column', class: 'columns-3' },
    { text: '2-Column', class: 'columns-2' },
    { text: 'Dense', class: 'dense' },
    { text: 'Auto-fit', class: 'auto-fit' }
  ]

  gridOptions.forEach(option => {
    const button = fButton({
      text: option.text,
      variant: 'outlined'
    })

    button.on('click', () => {
      // Remove existing grid classes
      gridContainer.classList.remove('columns-3', 'columns-2', 'dense', 'auto-fit')
      // Add the selected grid class
      gridContainer.classList.add(option.class)
    })

    controls.appendChild(button.element)
  })

  // Default to 3-column grid
  gridContainer.classList.add('columns-3')

  body.appendChild(controls)
  body.appendChild(gridContainer)
}
