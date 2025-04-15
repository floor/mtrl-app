import {
  createComponentsSectionLayout
} from '../../../layout'

import {
  createLayout,
  createMenu,
  createButton
} from 'mtrl'

import {
  location
} from '../../../data'

export const initNestedMenu = (container) => {
  const title = 'Nested Menu'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component

  const button = createButton({
    text: 'Show Nested Menu',
    variant: 'tonal'
  })

  const menu = createMenu({
    anchor: button,
    items: [
      {
        name: 'format',
        text: 'Format',
        hasSubmenu: true,
        submenu: [
          { name: 'bold', text: 'Bold' },
          { name: 'italic', text: 'Italic' },
          { name: 'underline', text: 'Underline' }
        ]
      },
      {
        name: 'paragraph',
        text: 'Paragraph',
        hasSubmenu: true,
        submenu: [
          { name: 'align-left', text: 'Align Left' },
          { name: 'align-center', text: 'Center' },
          { name: 'align-right', text: 'Align Right' }
        ]
      },
      { type: 'divider' },
      { name: 'find', text: 'Find and Replace...' }
    ]
  })

  const button2 = createButton({
    text: 'Show Nested Menu',
    variant: 'tonal'
  })

  const menu2 = createMenu({
    anchor: button2,
    items: location
  })

  menu.on('select', ({ name, text }) => {
    console.log(`Selected nested item: ${name} (${text})`)
  })

  layout.body.appendChild(button.element)
  layout.body.appendChild(button2.element)
}
