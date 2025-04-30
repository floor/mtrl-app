import {
  createComponentSection
} from '../../../layout'

import {
  createLayout,
  createMenu,
  createButton
} from 'mtrl'

export const initCustomMenu = (container) => {
  const title = 'Custom Menu'
  const layout = createLayout(createComponentSection({ title }), container).component

  const button = createButton({
    text: 'Show Custom Menu',
    variant: 'elevated'
  })

  const menu = createMenu({
    opener: button,
    items: [
      { name: 'share', text: 'Share', disabled: true },
      { name: 'download', text: 'Download' },
      { type: 'divider' },
      { name: 'rename', text: 'Rename' },
      { name: 'delete', text: 'Delete', disabled: true }
    ]
  })

  menu.on('select', ({ name, text }) => {
    console.log(`Selected from custom menu: ${name} (${text})`)
  })

  layout.body.appendChild(button.element)
}
