// client/content/components/buttons/button-groups/labels.js

import { createComponentSection } from '../../../../layout'
import { createLayout } from 'mtrl-addons'
import { createButtonGroup } from 'mtrl'
import { searchIcon, locationIcon, settingsIcon } from '../../../../icons'

export const initLabels = (container) => {
  const layout = createLayout(createComponentSection({
    title: 'Labels on the selected button',
    description: 'labels: "selected": buttons with an icon and a text stay icon-only until selected; the selected button widens to reveal its text (M3 Expressive connected group).',
    class: 'noflex'
  }), container).component

  const group = createButtonGroup({
    kind: 'connected',
    selection: 'single',
    required: true,
    labels: 'selected',
    variant: 'tonal',
    ariaLabel: 'Mode',
    buttons: [
      { icon: searchIcon, text: 'Explore', value: 'explore', selected: true },
      { icon: locationIcon, text: 'Taxi', value: 'taxi' },
      { icon: settingsIcon, text: 'Islands', value: 'islands' }
    ]
  })

  const wrap = document.createElement('div')
  wrap.style.marginBottom = '16px'
  wrap.appendChild(group.element)
  layout.showcase.appendChild(wrap)
}
