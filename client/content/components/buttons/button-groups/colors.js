// client/content/components/buttons/button-groups/colors.js

import { createComponentSection } from '../../../../layout'
import { createLayout } from 'mtrl-addons'
import { createButtonGroup } from 'mtrl'
import { editIcon } from '../../../../icons'

export const initColors = (container) => {
  const layout = createLayout(createComponentSection({
    title: 'Colour',
    description: 'Button groups have no colour properties. They take the toggle button colours: filled (surface container, selected primary), tonal (secondary container, selected secondary), outlined (selected inverse surface). Text and standard icon buttons are avoided: they have no container treatment. Elevated is not recommended.',
    class: 'noflex'
  }), container).component

  for (const variant of ['filled', 'tonal', 'outlined']) {
    const group = createButtonGroup({
      kind: 'connected',
      selection: 'single',
      variant,
      ariaLabel: variant,
      buttons: [
        { icon: editIcon, text: 'Label', value: 'a', selected: true },
        { icon: editIcon, text: 'Label', value: 'b' },
        { icon: editIcon, text: 'Label', value: 'c' }
      ]
    })
    const row = document.createElement('div')
    row.style.cssText = 'display:flex;align-items:center;gap:16px;margin-bottom:16px'
    const label = document.createElement('code')
    label.textContent = variant
    label.style.width = '5em'
    row.appendChild(label)
    row.appendChild(group.element)
    layout.showcase.appendChild(row)
  }
}
