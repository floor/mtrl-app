// src/client/content/components/drawer/standard.js

import { createDrawer, createButton } from 'mtrl'
import { createLayout } from 'mtrl-addons'
import { createComponentSection } from '../../../layout'
import { mailItems } from './items'

export const initStandardDrawer = (container) => {
  const title = 'Standard'
  const description =
    'Inline with the page as a navigation landmark. Click a destination and watch the active indicator grow out of the middle of the item on the spatial spring while the previous one shrinks away; hover, focus and press draw a state layer over it, and the press ripple is clipped to the same pill.'
  const layout = createLayout(createComponentSection({ title, description }), container).component

  const demo = createLayout(
    [
      ['frame', { class: 'drawer-demo' },
        ['page', { class: 'drawer-demo__page' },
          ['actions', { class: 'drawer-demo__actions' }],
          ['status', { tag: 'p', class: 'drawer-demo__status', text: 'Inbox' }]
        ]
      ]
    ],
    layout.showcase
  ).component

  const drawer = createDrawer({
    variant: 'standard',
    headline: 'Mail',
    open: true,
    items: mailItems(),
    onSelect: ({ label }) => { demo.status.textContent = label }
  })
  demo.frame.prepend(drawer.element)

  const toggle = createButton({ text: 'Toggle drawer', variant: 'tonal' })
  toggle.on('click', () => drawer.toggle())
  demo.actions.appendChild(toggle.element)

  const clear = createButton({ text: 'Select trash', variant: 'text' })
  clear.on('click', () => { drawer.setActive('trash'); demo.status.textContent = 'Trash' })
  demo.actions.appendChild(clear.element)
}
