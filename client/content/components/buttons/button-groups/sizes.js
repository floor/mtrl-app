// client/content/components/buttons/button-groups/sizes.js

import { createComponentSection } from '../../../../layout'
import { createLayout } from 'mtrl-addons'
import { createButtonGroup } from 'mtrl'
import { editIcon, favoriteIcon, shareIcon } from '../../../../icons'

const SIZES = ['xs', 's', 'm', 'l', 'xl']

export const initSizes = (container) => {
  const layout = createLayout(createComponentSection({
    title: 'Sizes',
    description: 'M3 size tokens. Heights 32, 40, 56, 96, 136dp; standard gaps 18, 12, 8, 8, 8dp; connected gap 2dp; inner corners 4, 8, 8, 16, 20dp.',
    class: 'noflex'
  }), container).component

  for (const kind of ['standard', 'connected']) {
    const heading = document.createElement('h3')
    heading.textContent = kind === 'standard' ? 'Standard' : 'Connected'
    layout.showcase.appendChild(heading)
    for (const size of SIZES) {
      const group = createButtonGroup({
        kind,
        size,
        selection: 'single',
        variant: 'tonal',
        ariaLabel: `Size ${size}`,
        buttons: [
          { icon: editIcon, ariaLabel: 'Edit', value: 'edit' },
          { icon: favoriteIcon, ariaLabel: 'Favourite', value: 'favourite', selected: true },
          { icon: shareIcon, ariaLabel: 'Share', value: 'share' }
        ]
      })
      const row = document.createElement('div')
      row.style.cssText = 'display:flex;align-items:center;gap:16px;margin-bottom:16px'
      const label = document.createElement('code')
      label.textContent = size
      label.style.width = '2em'
      row.appendChild(label)
      row.appendChild(group.element)
      layout.showcase.appendChild(row)
    }
  }
}
