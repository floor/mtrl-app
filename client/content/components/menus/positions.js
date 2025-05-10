import {
  createComponentSection
} from '../../../layout'

import {
  createLayout,
  createMenu,
  createChips
} from 'mtrl'

export const initPositionsMenu = (container) => {
  const title = 'Menu Positions'
  const layout = createLayout(createComponentSection({ title }), container).component

  const positions = ['bottom-start', 'bottom', 'bottom-end', 'top-start', 'top', 'top-end', 'right-start', 'right', 'right-end', 'left-start', 'left', 'left-end']
  const menuOptions = {
    items: [
      { name: 'refresh', text: 'Refresh' },
      { name: 'settings', text: 'Settings' },
      { type: 'divider' },
      { name: 'keyboard', text: 'Keyboard shortcuts' },
      { name: 'help', text: 'Help' }
    ]
  }

  const chips = createChips({
    scrollable: false,
    multiSelect: false, // Enable multiple selection
    class: 'placement-chips',
    label: 'Select placement'
  })

  for (let i = 0; i < positions.length; i++) {
    const position = positions[i]
    chips.addChip({
      text: position.charAt(0).toUpperCase() + position.slice(1), // Capitalize first letter
      value: position,
      // variant: 'filter',
      selectable: true, // Explicitly make it selectable
      class: `position-chip position-${position}`
    })

    const chip = chips.getChips(position)[i]

    menuOptions.opener = chip
    menuOptions.position = position
    createMenu(menuOptions)
  }

  layout.showcase.appendChild(chips.element)
}
