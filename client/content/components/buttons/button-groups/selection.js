// client/content/components/buttons/button-groups/selection.js

import { createComponentSection } from '../../../../layout'
import { createLayout } from 'mtrl-addons'
import { createButtonGroup } from 'mtrl'

export const initSelection = (container) => {
  const layout = createLayout(createComponentSection({
    title: 'Selection',
    description: 'selection: "none" | "single" | "multi". With required, the last selected button cannot be deselected. The change event carries the selected values. The two examples are different kinds: a connected group sits 2dp apart, a standard group uses the size gap (12dp at size s).',
    class: 'noflex'
  }), container).component

  const status = document.createElement('p')
  status.textContent = 'Selected: (nothing yet)'

  const single = createButtonGroup({
    kind: 'connected',
    selection: 'single',
    required: true,
    variant: 'tonal',
    ariaLabel: 'Period',
    buttons: [
      { text: 'Day', value: 'day', selected: true },
      { text: 'Week', value: 'week' },
      { text: 'Month', value: 'month' }
    ]
  })
  single.on('change', (event) => {
    status.textContent = `Single, required: ${event.values.join(', ')}`
  })

  const multi = createButtonGroup({
    kind: 'standard',
    selection: 'multi',
    variant: 'outlined',
    ariaLabel: 'Formatting',
    buttons: [
      { text: 'Bold', value: 'bold', selected: true },
      { text: 'Italic', value: 'italic' },
      { text: 'Underline', value: 'underline' }
    ]
  })
  multi.on('change', (event) => {
    status.textContent = `Multi: ${event.values.join(', ') || 'none'}`
  })

  const api = document.createElement('p')
  api.innerHTML = 'API: <code>getSelected()</code>, <code>isSelected(value)</code>, <code>select(value)</code>, <code>deselect(value)</code>, <code>toggle(value)</code>. Programmatic changes emit <code>change</code> without an <code>originalEvent</code>.'

  for (const [label, el] of [
    ['Connected, single selection, required', single.element],
    ['Standard, multi selection', multi.element]
  ]) {
    const heading = document.createElement('h3')
    heading.textContent = label
    layout.showcase.appendChild(heading)
    const wrap = document.createElement('div')
    wrap.style.marginBottom = '24px'
    wrap.appendChild(el)
    layout.showcase.appendChild(wrap)
  }
  layout.showcase.appendChild(status)
  layout.showcase.appendChild(api)
}
