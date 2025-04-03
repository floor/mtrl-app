import {
  createContentSection
} from '../../../layout'

import {
  createLayout,
  createButton,
  createElement
} from 'mtrl'

export const createResponsiveLayout = (container) => {
  console.log('createResponsiveLayout', container)
  const layout = createLayout(createContentSection({
    title: 'Responsive Layout',
    description: 'Layout that adapts to different screen sizes. Use the buttons to toggle between different layouts.',
    class: 'theme-colors'
  }), container).getAll()

  console.log('layout.body', layout.body)

  const responsiveContainer = createElement({
    class: 'layout-demo responsive-layout'
  })

  // Create example content
  for (let i = 1; i <= 4; i++) {
    const box = createElement({
      tag: 'div',
      class: 'layout-demo__box',
      text: `Item ${i}`
    })
    responsiveContainer.appendChild(box)
  }

  // Create buttons to toggle different responsive layouts
  const controls = createElement({
    tag: 'div',
    class: 'layout-demo__controls'
  })

  const layoutOptions = [
    { text: 'Stack', class: 'stack' },
    { text: 'Row', class: 'row' },
    { text: 'Grid', class: 'grid' }
  ]

  layoutOptions.forEach(option => {
    const button = createButton({
      text: option.text,
      variant: 'outlined'
    })

    button.on('click', () => {
      // Remove existing layout classes
      responsiveContainer.classList.remove('stack', 'row', 'grid')
      // Add the selected layout class
      responsiveContainer.classList.add(option.class)
    })

    controls.appendChild(button.element)
  })

  // Default to stack layout
  responsiveContainer.classList.add('stack')

  layout.body.appendChild(responsiveContainer)
  layout.body.appendChild(controls)
}
