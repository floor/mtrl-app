// src/client/content/components/bottom-sheets/states.js

import { createBottomSheet, createButton } from 'mtrl'
import { createLayout } from 'mtrl-addons'
import { createComponentSection } from '../../../layout'

export const initSheetStates = (container) => {
  const title = 'Partial and expanded'
  const description =
    'A sheet opens to a peek height that says what it holds, and expands to show the rest. Dragging the handle past 56dp, or flicking it, settles it at the next height.'
  const layout = createLayout(createComponentSection({ title, description }), container).component

  const sheet = createBottomSheet({
    title: 'Sheet states',
    content: '<p>Drag the handle up to expand, down to collapse, and down again to dismiss.</p>',
    on: {
      stateChange: ({ state, previous }) => console.info(`sheet: ${previous} to ${state}`)
    }
  })

  for (const [text, run] of [
    ['Peek', () => sheet.open()],
    ['Expand', () => sheet.expand()],
    ['Collapse', () => sheet.collapse()],
    ['Close', () => sheet.close()]
  ]) {
    const button = createButton({ text, variant: 'tonal' })
    button.on('click', run)
    layout.showcase.appendChild(button.element)
  }
}
