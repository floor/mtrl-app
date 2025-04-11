import {
  createComponentsSectionLayout
} from '../../../layout'

import {
  createLayout,
  createMenu,
  createButton
} from 'mtrl'

const moreIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" fill="currentColor"/>
</svg>`

export const initPositionsMenu = (container) => {
  const title = 'Menu Positions'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component

  const buttons = createLayout([
    {
      layout: {
        type: 'grid',
        columns: 6,
        gap: 6,
        align: 'center'
      }
    },
    [createButton, 'button1', { icon: moreIcon, variant: 'outlined' }],
    [createButton, 'button2', { icon: moreIcon, variant: 'outlined' }],
    [createButton, 'button3', { icon: moreIcon, variant: 'outlined' }],
    [createButton, 'button4', { icon: moreIcon, variant: 'outlined' }],
    [createButton, 'button5', { icon: moreIcon, variant: 'outlined' }],
    [createButton, 'button6', { icon: moreIcon, variant: 'outlined' }]
  ], layout.body)

  const { button1, button2, button3, button4, button5, button6 } = buttons.component

  const menu1 = createMenu({
    anchor: button1.element,
    items: [
      { name: 'refresh', text: 'Refresh' },
      { name: 'settings', text: 'Settings' },
      { type: 'divider' },
      { name: 'keyboard', text: 'Keyboard shortcuts' },
      { name: 'help', text: 'Help' }
    ],
    placement: 'bottom-start'

  })

  const menu2 = createMenu({
    anchor: button2.element,
    items: [
      { name: 'refresh', text: 'Refresh' },
      { name: 'settings', text: 'Settings' },
      { type: 'divider' },
      { name: 'keyboard', text: 'Keyboard shortcuts' },
      { name: 'help', text: 'Help' }
    ],
    placement: 'top-start'

  })

  const menu3 = createMenu({
    anchor: button3.element,
    items: [
      { name: 'refresh', text: 'Refresh' },
      { name: 'settings', text: 'Settings' },
      { type: 'divider' },
      { name: 'keyboard', text: 'Keyboard shortcuts' },
      { name: 'help', text: 'Help' }
    ],
    placement: 'right-start'
  })

  const menu4 = createMenu({
    anchor: button4.element,
    items: [
      { name: 'refresh', text: 'Refresh' },
      { name: 'settings', text: 'Settings' },
      { type: 'divider' },
      { name: 'keyboard', text: 'Keyboard shortcuts' },
      { name: 'help', text: 'Help' }
    ],
    placement: 'top-end'
  })

  const menu5 = createMenu({
    anchor: button5.element,
    items: [
      { name: 'refresh', text: 'Refresh' },
      { name: 'settings', text: 'Settings' },
      { type: 'divider' },
      { name: 'keyboard', text: 'Keyboard shortcuts' },
      { name: 'help', text: 'Help' }
    ],
    placement: 'right'
  })

  const menu6 = createMenu({
    anchor: button6.element,
    items: [
      { name: 'refresh', text: 'Refresh' },
      { name: 'settings', text: 'Settings' },
      { type: 'divider' },
      { name: 'keyboard', text: 'Keyboard shortcuts' },
      { name: 'help', text: 'Help' }
    ],
    placement: 'left-end'
  })

  // button1.on('click', () => {
  //   menu1.show()
  // })

  // button2.on('click', () => {
  //   menu2.show()
  // })

  // button3.on('click', () => {
  //   menu3.show()
  // })
}
