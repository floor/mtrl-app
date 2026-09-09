// src/client/content/components/menus/vertical.js

import { createLayout } from 'mtrl-addons'
import { createComponentSection } from '../../../layout'
import { createMenu, createButton } from 'mtrl'

const icon = (d) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor"><path d="${d}"/></svg>`

const share = icon('M720-80q-50 0-85-35t-35-85q0-7 1-14.5t3-13.5L322-392q-17 15-38 23.5t-44 8.5q-50 0-85-35t-35-85q0-50 35-85t85-35q23 0 44 8.5t38 23.5l282-164q-2-6-3-13.5t-1-14.5q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35q-23 0-44-8.5T638-672L356-508q2 6 3 13.5t1 14.5q0 7-1 14.5t-3 13.5l282 164q17-15 38-23.5t44-8.5q50 0 85 35t35 85q0 50-35 85t-85 35Z')
const copy = icon('M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Z')
const folder = icon('M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h240l80 80h320q33 0 56.5 23.5T880-640v400q0 33-23.5 56.5T800-160H160Z')

const items = [
  { id: 'share', text: 'Share', icon: share, supportingText: 'Anyone with the link' },
  { id: 'copy', text: 'Copy link', icon: copy, shortcut: '⌘C' },
  {
    id: 'move',
    text: 'Move to',
    icon: folder,
    hasSubmenu: true,
    submenu: [
      { id: 'projects', text: 'Projects' },
      { id: 'archive', text: 'Archive' }
    ]
  },
  { type: 'divider' },
  { id: 'delete', text: 'Delete', disabled: true }
]

// The same content, separated the other way the spec offers: a gap, which
// splits the menu into its own surfaces rather than drawing a line across one
const gappedItems = items.map((item) => (item.type === 'divider' ? { type: 'gap' } : item))

export const initVerticalMenu = (container) => {
  const layout = createLayout(
    createComponentSection({
      title: 'Vertical menu (expressive)',
      description:
        'The M3 expressive menu: a rounded container holding 44dp items 2dp apart. An item is a small rectangle at rest and rounds off as it is hovered, focused, pressed or selected. Opening a submenu morphs the container that opened it, so the live menu is the rounder one. Items can carry a second line, a shortcut and an icon. Groups are separated either by a divider across the one surface, or by a gap, which gives each group a surface of its own.'
    }),
    container
  ).component

  layout.body.classList.add('mtrl-content__grid')

  const standardButton = createButton({ text: 'Standard', variant: 'filled' })
  const standardMenu = createMenu({ opener: standardButton, items, variant: 'vertical' })
  standardMenu.on('select', (event) => console.info('standard:', event.itemId))
  layout.body.appendChild(standardButton.element)

  const vibrantButton = createButton({ text: 'Vibrant', variant: 'tonal' })
  const vibrantMenu = createMenu({
    opener: vibrantButton,
    items,
    variant: 'vertical',
    color: 'vibrant'
  })
  vibrantMenu.on('select', (event) => console.info('vibrant:', event.itemId))
  layout.body.appendChild(vibrantButton.element)

  const gapButton = createButton({ text: 'Gap', variant: 'filled' })
  const gapMenu = createMenu({
    opener: gapButton,
    items: gappedItems,
    variant: 'vertical'
  })
  gapMenu.on('select', (event) => console.info('gap:', event.itemId))
  layout.body.appendChild(gapButton.element)

  const baselineButton = createButton({ text: 'Baseline', variant: 'outlined' })
  const baselineMenu = createMenu({ opener: baselineButton, items })
  layout.body.appendChild(baselineButton.element)
  void baselineMenu
}
