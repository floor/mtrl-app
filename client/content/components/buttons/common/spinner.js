// src/client/content/components/button/spinner.ts
/**
 * Button spinner example
 */
import {
  createComponentsSectionStructure
} from '../../../../structure'

import {
  createLayout, createButton
} from 'mtrl'

import { spinnerIcon, checkIcon } from '../../../../icons'

/**
 * Initializes spinner button example
 */
export const initSpinnerButton = (container) => {
  const title = 'Button with spinner'
  const structure = createLayout(createComponentsSectionStructure({ title }), container).component

  // Create a regular button
  const button = createButton({
    text: 'Send',
    // icon: sendIcon,
    variant: 'filled'
  })

  // Add click handler to toggle spinner
  button.on('click', () => {
    button.element.classList.add('spinner-button', 'loading')
    button.icon.setIcon(spinnerIcon)

    button.disable()

    setTimeout(() => {
      button.element.classList.remove('loading')

      if (checkIcon) {
        button.icon.setIcon(checkIcon)
      } else {
        button.icon.clearIcon()
      }

      button.enable()
    }, 2000)
  })

  structure.showcase.appendChild(button.element)
}
