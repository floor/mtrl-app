// src/client/content/components/drawer/modal.js

import { createDrawer, createButton } from 'mtrl'
import { createLayout } from 'mtrl-addons'
import { createComponentSection } from '../../../layout'
import { mailItems } from './items'

export const initModalDrawer = (container) => {
  const title = 'Modal'
  const description =
    'Over the page behind a scrim, on surface-container-low at level 1. It is a dialog: focus moves in, Tab cycles inside, Escape or the scrim closes it and focus returns to the opener. Selecting a destination closes it here, the way an app would navigate.'
  const layout = createLayout(createComponentSection({ title, description }), container).component

  const drawer = createDrawer({
    variant: 'modal',
    headline: 'Mail',
    items: mailItems(),
    onSelect: () => drawer.close()
  })
  document.body.appendChild(drawer.element)

  const open = createButton({ text: 'Open modal drawer', variant: 'filled' })
  open.on('click', () => drawer.open())
  layout.showcase.appendChild(open.element)

  const end = createDrawer({
    variant: 'modal',
    position: 'end',
    headline: 'Mail',
    items: mailItems(),
    onSelect: () => end.close()
  })
  document.body.appendChild(end.element)

  const openEnd = createButton({ text: 'Open from the end edge', variant: 'outlined' })
  openEnd.on('click', () => end.open())
  layout.showcase.appendChild(openEnd.element)
}
