// src/client/content/components/snackbars/index.js

import { createLayout } from 'mtrl-addons'
import { createComponentsLayout, createDocs } from '../../../layout'

import {
  createElement,
  createSnackbar,
  clearSnackbars,
  createButton
} from 'mtrl'
import { SNACKBAR_POSITIONS } from 'mtrl/components/snackbar/constants'

export const createSnackbarsContent = (container) => {
  const info = {
    title: 'Snackbars',
    description: 'Snackbars show short updates about app processes at the bottom of the screen. One at a time, announced but never focused; a snackbar with an action stays until acted on.'
  }
  const layout = createLayout(createComponentsLayout(info), container).component

  createLayout(createSnackbarsLayout(), layout.body)
  createDocs(layout.body, 'components/snackbar.md')
}

// A section of buttons; each button shows the snackbar its config describes
const section = (title, description, buttons) =>
  [createElement, 'section', { class: 'mtrl-content__section' },
    [createElement, 'h2', { class: 'mtrl-content__section-title', text: title }],
    [createElement, 'p', { class: 'mtrl-content__section-description', text: description }],
    [createElement, 'div', {
      class: 'mtrl-content__grid',
      onCreate: (el) => {
        buttons.forEach(({ label, config, run }) => {
          const button = createButton({ text: label, variant: 'tonal' })
          button.on('click', () => {
            if (run) return run()
            const snackbar = createSnackbar(config)
            snackbar.on('close', ({ reason }) => console.info(`snackbar closed: ${reason}`))
            snackbar.show()
          })
          el.appendChild(button.element)
        })
      }
    }]
  ]

export const createSnackbarsLayout = () => [
  section(
    'Message only',
    'Auto-dismisses after 4 seconds by default, 10 with the long preset. Two lines at most; the countdown holds while the pointer is over it.',
    [
      { label: 'Short', config: { message: 'Photo saved to album' } },
      { label: 'Long', config: { message: 'Photo saved to album', duration: 'long' } },
      { label: 'Two lines', config: { message: 'Your changes could not be saved because the connection was lost while uploading the photo' } },
      { label: 'Custom (2 s)', config: { message: 'Copied to clipboard', duration: 2000 } }
    ]
  ),

  section(
    'With an action',
    'A single text button in inverse-primary. With an action the snackbar stays until acted on or dismissed; a long action moves below the text. Escape dismisses it when it has focus.',
    [
      { label: 'Undo', config: { message: 'Message archived', action: 'Undo' } },
      { label: 'Long action', config: { message: 'This conversation was moved to the archive folder', action: 'Restore the conversation' } },
      { label: 'Close icon', config: { message: 'Update available', dismissible: true } },
      { label: 'Action and close', config: { message: 'Message archived', action: 'Undo', dismissible: true } },
      { label: 'Action, 4 s anyway', config: { message: 'Message archived', action: 'Undo', duration: 'short' } }
    ]
  ),

  section(
    'Position',
    'Centred by default. In wide layouts a snackbar can sit at the leading or trailing edge; in compact windows every position keeps a fixed 16dp from each edge.',
    Object.values(SNACKBAR_POSITIONS).map((position) => ({
      label: position,
      config: { message: `Snackbar at the ${position}`, position, action: 'OK' }
    }))
  ),

  section(
    'Queue',
    'Consecutive snackbars appear one at a time, in order. A snackbar with updated information can replace the one on screen and drop the ones waiting.',
    [
      {
        label: 'Three in a row',
        run: () => ['First message', 'Second message', 'Third message'].forEach((message) =>
          createSnackbar({ message, duration: 1500 }).show())
      },
      {
        label: 'Replace',
        run: () => {
          createSnackbar({ message: 'Uploading 1 of 3', duration: 'long' }).show()
          createSnackbar({ message: 'Uploading 2 of 3', duration: 'long' }).show()
          createSnackbar({ message: 'Upload complete', queueBehavior: 'replace', action: 'View' }).show()
        }
      },
      { label: 'Clear all', run: () => clearSnackbars() }
    ]
  )
]
