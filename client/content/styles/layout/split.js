import {
  createContentSection
} from '../../../layout'

import {
  createLayout,
  createButton,
  createElement
} from 'mtrl'

export const createSplitLayout = (container) => {
  console.log('createSplitLayout', container)
  const layout = createLayout(createContentSection({
    title: 'Split Layout',
    description: 'Two-panel layout with adjustable split ratios.',
    class: 'theme-colors'
  }), container).getAll()

  const splitContainer = createElement({
    class: 'layout-demo split-layout'
  })

  // Create left panel
  const leftPanel = createElement({
    tag: 'div',
    class: 'layout-demo__panel layout-demo__panel--left',
    text: 'Left Panel'
  })

  // Create right panel
  const rightPanel = createElement({
    tag: 'div',
    class: 'layout-demo__panel layout-demo__panel--right',
    text: 'Right Panel'
  })

  splitContainer.appendChild(leftPanel)
  splitContainer.appendChild(rightPanel)

  // Create buttons to toggle different split layouts
  const controls = createElement({
    tag: 'div',
    class: 'layout-demo__controls'
  })

  const splitOptions = [
    { text: '50/50', class: 'split-50-50' },
    { text: '30/70', class: 'split-30-70' },
    { text: '70/30', class: 'split-70-30' },
    { text: 'Stack (Mobile)', class: 'split-stack' }
  ]

  splitOptions.forEach(option => {
    const button = createButton({
      text: option.text,
      variant: 'outlined'
    })

    button.on('click', () => {
      // Remove existing split layout classes
      splitContainer.classList.remove('split-50-50', 'split-30-70', 'split-70-30', 'split-stack')
      // Add the selected split layout class
      splitContainer.classList.add(option.class)
    })

    controls.appendChild(button.element)
  })

  // Default to 50/50 split
  splitContainer.classList.add('split-50-50')

  layout.body.appendChild(splitContainer)
  layout.body.appendChild(controls)
}
