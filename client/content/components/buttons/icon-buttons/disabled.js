// src/client/content/components/buttons/icon-buttons/disabled.js

import { createIconButton } from 'mtrl'
import { createLayout } from 'mtrl-addons'
import { createComponentSection } from '../../../../layout'
import { settingsIcon, likeIcon } from '../../../../icons'

const variants = ['filled', 'tonal', 'outlined', 'standard']

export const initDisabled = (container) => {
  const title = 'Disabled'
  const description =
    'Every colour style disabled, as a plain action and as a selected toggle. Containers drop to on-surface at 10%, icons to on-surface at 38%.'
  const layout = createLayout(createComponentSection({ title, description }), container).component

  const rows = createLayout(
    [
      ['plain', { class: 'icon-buttons-row' }],
      ['selected', { class: 'icon-buttons-row' }]
    ],
    layout.showcase
  ).component

  variants.forEach((variant) => {
    rows.plain.appendChild(
      createIconButton({ variant, disabled: true, icon: settingsIcon, ariaLabel: `${variant} disabled` }).element
    )
    rows.selected.appendChild(
      createIconButton({ variant, disabled: true, toggle: true, selected: true, icon: likeIcon, ariaLabel: `${variant} selected disabled` }).element
    )
  })
}
