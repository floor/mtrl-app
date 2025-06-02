// src/client/content/components/button/icons.ts
/**
 * Button icons showcase implementation
 * Demonstrates usage of various icon buttons with different states
 * @module src/client/content/components/button/icons
 */
import {
  createComponentSection
} from '../../../../layout'
import {
  createLayout,
  createButton
} from 'mtrl'
import { downloadIcon, bookmarkIcon, likeIcon, sendIcon } from '../../../../icons'

/**
 * Icon button definitions with their labels
 * @type {Array<{icon: string, label: string}>}
 */
const iconButtons = [
  { icon: likeIcon, label: 'Like' },
  { icon: bookmarkIcon, label: 'Bookmark' }
]

/**
 * Button definitions with text and icons
 * @type {Array<{icon: string, label: string}>}
 */
const iconLabelButtons = [
  { icon: downloadIcon, label: 'Download' },
  { icon: sendIcon, label: 'Send' }
]

/**
 * Initializes icon button showcase
 * @param {HTMLElement} container - DOM element to render the showcase
 */
export const initIcons = (container) => {
  const title = 'Buttons icons'
  const layout = createLayout(createComponentSection({ title }), container).component
  const states = ['enabled', 'disabled']
  const variants = ['filled', 'elevated']

  // Create icon-only buttons in enabled and disabled states
  iconButtons.forEach((buttonDef) => {
    states.forEach(state => {
      const disabled = state === 'disabled'
      const btn = createButton({
        icon: buttonDef.icon,
        iconSize: 'medium',
        ariaLabel: buttonDef.label,
        parent: layout.showcase
      })

      if (disabled) btn.disable()
    })
  })

  // Create buttons with icons and text in different variants
  iconLabelButtons.forEach((buttonDef, i) => {
    const labelBtn = createButton({
      icon: buttonDef.icon,
      text: buttonDef.label,
      iconSize: 'medium',
      ariaLabel: buttonDef.label,
      variant: variants[i],
      parent: layout.showcase
    })
  })
}
