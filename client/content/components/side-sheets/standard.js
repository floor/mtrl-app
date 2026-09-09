// src/client/content/components/side-sheets/standard.js

import { createSideSheet, createButton } from 'mtrl'
import { createLayout } from 'mtrl-addons'
import { createComponentSection } from '../../../layout'

export const initStandardSideSheet = (container) => {
  const title = 'Standard'
  const description =
    'Docked beside the page on a plain surface, with no scrim. The page stays usable, so this suits content a reader refers to while working.'
  const layout = createLayout(createComponentSection({ title, description }), container).component

  const sheet = createSideSheet({
    variant: 'standard',
    title: 'Details',
    content: '<p>The page behind this sheet still scrolls and still takes clicks.</p>'
  })

  const toggle = createButton({ text: 'Toggle details', variant: 'tonal' })
  toggle.on('click', () => sheet.toggle())
  layout.showcase.appendChild(toggle.element)
}
