// src/client/content/components/rail/standard.js

import { createNavigationRail, createButton } from 'mtrl'
import { createLayout } from 'mtrl-addons'
import { createComponentSection } from '../../../layout'
import { railItems } from './items'

export const initStandardRail = (container) => {
  const title = 'Standard'
  const description =
    'Collapsed by default, with the menu button expanding it in place so the page beside it gives up the width. Icons and labels, a large badge and a dot badge, a disabled destination. Arrow keys move between destinations, Enter or Space selects, and the ripple is clipped to the pill.'
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

  const rail = createNavigationRail({
    items: railItems(),
    ariaLabel: 'Mail',
    onSelect: ({ id }) => {
      const item = rail.getItems().find((item) => item.id === id)
      demo.status.textContent = item ? item.label : id
    }
  })
  demo.frame.prepend(rail.element)

  const toggle = createButton({ text: 'Toggle rail', variant: 'tonal' })
  toggle.on('click', () => rail.toggle())
  demo.actions.appendChild(toggle.element)

  const select = createButton({ text: 'Select trash', variant: 'text' })
  select.on('click', () => { rail.setActive('trash'); demo.status.textContent = 'Trash' })
  demo.actions.appendChild(select.element)

  const badge = createButton({ text: 'Clear badge', variant: 'text' })
  badge.on('click', () => rail.setBadge('inbox', undefined))
  demo.actions.appendChild(badge.element)
}
