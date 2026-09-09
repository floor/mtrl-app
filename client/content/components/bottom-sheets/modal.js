// src/client/content/components/bottom-sheets/modal.js

import { createBottomSheet, createButton } from 'mtrl'
import { createLayout } from 'mtrl-addons'
import { createComponentSection } from '../../../layout'

export const initModalSheet = (container) => {
  const title = 'Modal'
  const description =
    'Covers the page with a scrim and takes focus, for a task that has to finish before anything else continues. Escape or a click on the scrim closes it.'
  const layout = createLayout(createComponentSection({ title, description }), container).component

  const sheet = createBottomSheet({
    title: 'Share this file',
    content: `
      <p>Anyone with the link can open it. Drag the handle to expand the sheet,
      or flick it down to dismiss.</p>
      <p>Press Escape, or click outside, to close.</p>`,
    on: { close: () => console.info('modal sheet closed') }
  })

  const opener = createButton({ text: 'Open modal sheet', variant: 'filled' })
  opener.on('click', () => sheet.open())
  layout.showcase.appendChild(opener.element)
}
