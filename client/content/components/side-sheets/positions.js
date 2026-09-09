// src/client/content/components/side-sheets/positions.js

import { createSideSheet, createButton } from 'mtrl'
import { createLayout } from 'mtrl-addons'
import { createComponentSection } from '../../../layout'

export const initSideSheetPositions = (container) => {
  const title = 'Edges'
  const description =
    'Positions are logical rather than physical, so a sheet docked to the end sits on the right in English and on the left in Arabic, without reconfiguring.'
  const layout = createLayout(createComponentSection({ title, description }), container).component

  for (const position of ['end', 'start']) {
    const sheet = createSideSheet({
      position,
      title: `Docked ${position}`,
      content: `<p>This sheet is docked to the <strong>${position}</strong> edge.</p>`
    })
    const button = createButton({ text: `Open ${position}`, variant: 'outlined' })
    button.on('click', () => sheet.open())
    layout.showcase.appendChild(button.element)
  }
}
