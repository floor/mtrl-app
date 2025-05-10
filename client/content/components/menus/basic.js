import {
  createComponentSection
} from '../../../layout'

import {
  createLayout,
  createMenu,
  createButton
} from 'mtrl'

import {
  countries
} from '../../../data'

export const initBasicMenu = (container) => {
  const title = 'Basic Menus'
  const description = 'Basic Menu'
  const layout = createLayout(createComponentSection({ title, description }), container).component

  const button = createButton({
    text: 'Basic Menu',
    variant: 'filled'
  })

  const menu = createMenu({
    opener: button,
    items: [
      { id: 'new', text: 'New File' },
      { id: 'open', text: 'Open...' },
      { type: 'divider' },
      { id: 'save', text: 'Save' },
      { id: 'save-as', text: 'Save As...' }
    ]
  })

  menu.on('select', (event) => {
    console.log('Selected Id:', event.itemId)
  })

  const button2 = createButton({
    text: 'Long Menu',
    variant: 'filled'
  })

  const menu2 = createMenu({
    opener: button2,
    items: countries
  })

  menu2.on('select', (event) => {
    console.log('Selected Id:', event.itemId)
  })

  layout.showcase.appendChild(button.element)
  layout.showcase.appendChild(button2.element)
}
