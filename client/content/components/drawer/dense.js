// src/client/content/components/drawer/dense.js

import { createDrawer } from 'mtrl'
import { createLayout } from 'mtrl-addons'
import { createComponentSection } from '../../../layout'
import { mailItems } from './items'

export const initDenseDrawer = (container) => {
  const title = 'Dense'
  const description =
    'A compact drawer for admin-style interfaces: 36dp items with a smaller type size and tighter spacing. Selection animates the same way, on a smaller pill.'
  const layout = createLayout(createComponentSection({ title, description }), container).component

  const demo = createLayout(
    [['frame', { class: 'drawer-demo drawer-demo--dense' }]],
    layout.showcase
  ).component

  const drawer = createDrawer({
    variant: 'standard',
    dense: true,
    width: 260,
    headline: 'Mail',
    open: true,
    items: mailItems()
  })
  demo.frame.appendChild(drawer.element)
}
