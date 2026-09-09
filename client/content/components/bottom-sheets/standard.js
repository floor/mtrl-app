// src/client/content/components/bottom-sheets/standard.js

import { createBottomSheet, createButton } from 'mtrl'
import { createLayout } from 'mtrl-addons'
import { createComponentSection } from '../../../layout'

export const initStandardSheet = (container) => {
  const title = 'Standard'
  const description =
    'No scrim, and the page stays usable alongside it. Use it for content a reader refers to while working, rather than a task that blocks.'
  const layout = createLayout(createComponentSection({ title, description }), container).component

  const sheet = createBottomSheet({
    variant: 'standard',
    title: 'Nearby places',
    content: '<p>The page behind this sheet still scrolls and still takes clicks.</p>'
  })

  const open = createButton({ text: 'Show', variant: 'tonal' })
  open.on('click', () => sheet.open())
  const close = createButton({ text: 'Hide', variant: 'outlined' })
  close.on('click', () => sheet.close())

  layout.showcase.appendChild(open.element)
  layout.showcase.appendChild(close.element)
}
