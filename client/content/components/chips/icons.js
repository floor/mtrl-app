// src/client/content/components/chips/icons.js
import { createComponentSection } from '../../../layout'
import { createLayout, createChip } from 'mtrl'
import { faceIcon, closeIcon, locationIcon, addIcon } from '../../../icons'

/**
 * Initializes chips with icons section
 * @param {HTMLElement} container - Container element
 */
export const initChipWithIcons = (container) => {
  const title = 'Chips with Icons'
  const layout = createLayout(createComponentSection({ title }), container).component

  // Example with leading icon
  const leadingIconChip = createChip({
    text: 'Leading Icon',
    leadingIcon: faceIcon,
    variant: 'filled'
  })
  layout.body.appendChild(leadingIconChip.element)

  // Example with trailing icon
  const trailingIconChip = createChip({
    text: 'Trailing Icon',
    trailingIcon: closeIcon,
    variant: 'filled',
    onTrailingIconClick: (chip) => {
      console.log('Trailing icon clicked')
    }
  })
  layout.body.appendChild(trailingIconChip.element)

  // Example with both icons
  const bothIconsChip = createChip({
    text: 'Both Icons',
    leadingIcon: locationIcon,
    trailingIcon: closeIcon,
    variant: 'outlined'
  })
  layout.body.appendChild(bothIconsChip.element)

  // Example with icon only
  const iconOnlyChip = createChip({
    leadingIcon: addIcon,
    variant: 'elevated'
  })
  layout.body.appendChild(iconOnlyChip.element)
}
