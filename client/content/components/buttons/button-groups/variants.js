// client/content/components/buttons/button-groups/variants.js

import { createComponentSection } from '../../../../layout'
import { createLayout } from 'mtrl-addons'
import { createButtonGroup } from 'mtrl'
import { editIcon, favoriteIcon, shareIcon, bookmarkIcon } from '../../../../icons'

const row = (parent, label, group, note) => {
  const heading = document.createElement('h3')
  heading.textContent = label
  parent.appendChild(heading)
  if (note) {
    const p = document.createElement('p')
    p.textContent = note
    parent.appendChild(p)
  }
  const wrap = document.createElement('div')
  wrap.style.marginBottom = '32px'
  wrap.appendChild(group.element)
  parent.appendChild(wrap)
}

export const initVariants = (container) => {
  const layout = createLayout(createComponentSection({
    title: 'Variants',
    description: 'Standard groups apply padding between round buttons; connected groups share a container with 2dp between buttons. Selecting a button in a connected group changes the shape of that button only.',
    class: 'noflex'
  }), container).component

  row(layout.showcase, 'Standard, actions', createButtonGroup({
    kind: 'standard',
    variant: 'tonal',
    buttons: [
      { icon: editIcon, ariaLabel: 'Edit', value: 'edit' },
      { icon: favoriteIcon, text: 'Favourite', value: 'favourite' },
      { icon: shareIcon, ariaLabel: 'Share', value: 'share' },
      { icon: bookmarkIcon, ariaLabel: 'Bookmark', value: 'bookmark' }
    ]
  }), 'selection: "none" (default): plain buttons, round.')

  row(layout.showcase, 'Standard, single selection', createButtonGroup({
    kind: 'standard',
    selection: 'single',
    variant: 'tonal',
    buttons: [
      { icon: editIcon, ariaLabel: 'Edit', value: 'edit' },
      { icon: favoriteIcon, ariaLabel: 'Favourite', value: 'favourite', selected: true },
      { icon: shareIcon, ariaLabel: 'Share', value: 'share' },
      { icon: bookmarkIcon, ariaLabel: 'Bookmark', value: 'bookmark' }
    ]
  }), 'The selected button squares off (toggle button shape morph); the others stay round.')

  row(layout.showcase, 'Connected, single selection', createButtonGroup({
    kind: 'connected',
    selection: 'single',
    variant: 'tonal',
    buttons: [
      { text: '8 oz', value: '8' },
      { text: '12 oz', value: '12', selected: true },
      { text: '16 oz', value: '16' },
      { text: '20 oz', value: '20' }
    ]
  }), 'Round outer ends, 8dp inner corners at size s; the selected button becomes a full pill wherever it sits.')

  row(layout.showcase, 'Connected, square', createButtonGroup({
    kind: 'connected',
    shape: 'square',
    selection: 'single',
    variant: 'tonal',
    buttons: [
      { icon: editIcon, ariaLabel: 'Edit', value: 'edit', selected: true },
      { icon: favoriteIcon, ariaLabel: 'Favourite', value: 'favourite' },
      { icon: shareIcon, ariaLabel: 'Share', value: 'share' }
    ]
  }), 'shape: "square": the outer corners take the inner-corner size of the group.')
}
