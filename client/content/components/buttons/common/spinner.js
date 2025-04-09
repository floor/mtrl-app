// src/client/content/components/button/spinner.ts
/**
 * Button spinner example
 */
import {
  createComponentsSectionStructure
} from '../../../../structure'
import {
  fLayout,
  fButton,
  fSnackbar
} from 'mtrl'
import { iconSend, iconSpinner, iconCheck } from '../../../../icons'

/**
 * Initializes spinner button example
 */
export const initSpinnerButton = (container) => {
  const title = 'Button with spinner'
  const structure = fLayout(createComponentsSectionStructure({ title }), container).component

  // Create a regular button
  const button = fButton({
    text: 'Send',
    // icon: iconSend,
    variant: 'filled'
  })

  // Add click handler to toggle spinner
  button.on('click', () => {
    button.element.classList.add('spinner-button', 'loading')
    button.icon.setIcon(iconSpinner)

    button.disable()

    setTimeout(() => {
      button.element.classList.remove('loading')

      if (iconCheck) {
        button.icon.setIcon(iconCheck)
      } else {
        button.icon.clearIcon()
      }

      button.enable()
    }, 2000)
  })

  structure.showcase.appendChild(button.element)
}
