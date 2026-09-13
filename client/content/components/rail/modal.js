// src/client/content/components/rail/modal.js

import { createNavigationRail, createButton } from 'mtrl'
import { createLayout } from 'mtrl-addons'
import { createComponentSection } from '../../../layout'
import { railItems } from './items'

export const initModalRail = (container) => {
  const title = 'Modal'
  const description =
    'For compact and medium windows: the expanded rail opens over the page as a native dialog on surface-container, behind a scrim. Escape, the scrim or the menu button collapse it, and collapsing hides it entirely. Selecting a destination closes it here, the way an app would navigate.'
  const layout = createLayout(createComponentSection({ title, description }), container).component

  const rail = createNavigationRail({
    layout: 'modal',
    items: railItems(),
    ariaLabel: 'Mail',
    onSelect: () => rail.collapse()
  })
  document.body.appendChild(rail.element)

  const open = createButton({ text: 'Open modal rail', variant: 'filled' })
  open.on('click', () => rail.expand())
  layout.showcase.appendChild(open.element)
}
