// src/client/content/components/side-sheets/modal.js

import { createSideSheet, createButton } from 'mtrl'
import { createLayout } from 'mtrl-addons'
import { createComponentSection } from '../../../layout'

export const initModalSideSheet = (container) => {
  const title = 'Modal'
  const description =
    'Floats over the page behind a scrim and takes focus. The header carries a close button; Escape and a click on the scrim also close it.'
  const layout = createLayout(createComponentSection({ title, description }), container).component

  const sheet = createSideSheet({
    title: 'Filters',
    content: `
      <p>Narrow the results without leaving the page.</p>
      <p>Close this sheet with the button above, with Escape, or by clicking outside it.</p>`,
    on: { close: () => console.info('side sheet closed') }
  })

  const opener = createButton({ text: 'Open filters', variant: 'filled' })
  opener.on('click', () => sheet.open())
  layout.showcase.appendChild(opener.element)
}
