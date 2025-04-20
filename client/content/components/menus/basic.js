import {
  createComponentsSectionLayout
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
  const layout = createLayout(createComponentsSectionLayout({ title, description }), container).component

  const button = createButton({
    text: 'Basic Menu',
    variant: 'filled'
  })

  const menu = createMenu({
    opener: button,
    items: [
      { name: 'new', text: 'New File' },
      { name: 'open', text: 'Open...' },
      { type: 'divider' },
      { name: 'save', text: 'Save' },
      { name: 'save-as', text: 'Save As...' }
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

  layout.body.appendChild(button.element)
  layout.body.appendChild(button2.element)
}
