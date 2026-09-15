// src/client/content/components/buttons/icon-buttons/colors.js

import { createIconButton } from 'mtrl'
import { createLayout } from 'mtrl-addons'
import { createComponentSection } from '../../../../layout'
import { likeIcon, favoriteIcon, settingsIcon } from '../../../../icons'

const variants = ['filled', 'tonal', 'outlined', 'standard']

export const initColorStyles = (container) => {
  const title = 'Colour styles'
  const description =
    'Filled, tonal, outlined and standard, each three times: a plain action, a toggle at rest, and a toggle selected. Toggles carry aria-pressed and swap to the filled icon when selected.'
  const layout = createLayout(createComponentSection({ title, description }), container).component

  const rows = createLayout(
    variants.map((variant) => [variant, { class: 'icon-buttons-row' }]),
    layout.showcase
  ).component

  variants.forEach((variant) => {
    const row = rows[variant]
    row.appendChild(
      createIconButton({ variant, icon: settingsIcon, ariaLabel: `${variant} settings` }).element
    )
    row.appendChild(
      createIconButton({
        variant,
        toggle: true,
        icon: favoriteIcon,
        selectedIcon: likeIcon,
        ariaLabel: `${variant} favourite`
      }).element
    )
    row.appendChild(
      createIconButton({
        variant,
        toggle: true,
        selected: true,
        icon: favoriteIcon,
        selectedIcon: likeIcon,
        ariaLabel: `${variant} favourite, selected`
      }).element
    )
  })
}
