import {
  createComponentsSectionLayout
} from '../../../layout'

import {
  createLayout,
  createMenu,
  createButton
} from 'mtrl'

export const initBasicMenu = (container) => {
  const title = 'Basic Menu'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component

  const button = createButton({
    text: 'Show Basic Menu',
    variant: 'filled'
  })

  const menu = createMenu({
    anchor: button,
    items: [
      { name: 'new', text: 'New File' },
      { name: 'open', text: 'Open...' },
      { type: 'divider' },
      { name: 'save', text: 'Save' },
      { name: 'save-as', text: 'Save As...' }
    ]
  })

  menu.on('select', (event) => {
    console.log('Selected:', event)
  })

  layout.body.appendChild(button.element)
}
