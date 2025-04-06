// src/client/content/components/chips/icons.js
import { createComponentsSectionLayout } from '../../../layout'
import { fLayout, fChip } from 'mtrl'
import { iconFace, iconClose, iconLocation, iconAdd } from '../../../icons'

/**
 * Initializes chips with icons section
 * @param {HTMLElement} container - Container element
 */
export const initChipWithIcons = (container) => {
  const title = 'Chips with Icons'
  const layout = fLayout(createComponentsSectionLayout({ title }), container).component

  // Example with leading icon
  const leadingIconChip = fChip({
    text: 'Leading Icon',
    leadingIcon: iconFace,
    variant: 'filled'
  })
  layout.body.appendChild(leadingIconChip.element)

  // Example with trailing icon
  const trailingIconChip = fChip({
    text: 'Trailing Icon',
    trailingIcon: iconClose,
    variant: 'filled',
    onTrailingIconClick: (chip) => {
      console.log('Trailing icon clicked')
    }
  })
  layout.body.appendChild(trailingIconChip.element)

  // Example with both icons
  const bothIconsChip = fChip({
    text: 'Both Icons',
    leadingIcon: iconLocation,
    trailingIcon: iconClose,
    variant: 'outlined'
  })
  layout.body.appendChild(bothIconsChip.element)

  // Example with icon only
  const iconOnlyChip = fChip({
    leadingIcon: iconAdd,
    variant: 'elevated'
  })
  layout.body.appendChild(iconOnlyChip.element)
}
