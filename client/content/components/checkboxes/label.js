import {
  createLayout,
  createCheckbox
} from 'mtrl'

import {
  createComponentSection
} from '../../../layout'

export const initLabelPositions = (container) => {
  const title = 'Label Positions'
  const layout = createLayout(createComponentSection({ title }), container).component

  // Create a description element
  // const description = createElement({ tag: 'p', class: 'section-description' })
  // description.textContent = 'Checkbox labels can be positioned either at the start or end of the checkbox.'
  // description.style.marginBottom = '16px'
  // layout.body.appendChild(description)

  // Label at end (default)
  const endLabelCheckbox = createCheckbox({
    label: 'Label at End (Default)',
    labelPosition: 'end'
  })
  layout.body.appendChild(endLabelCheckbox.element)

  // Label at start
  const startLabelCheckbox = createCheckbox({
    label: 'Label at Start',
    labelPosition: 'start'
  })
  layout.body.appendChild(startLabelCheckbox.element)

  // Disabled with start label
  const disabledStartLabelCheckbox = createCheckbox({
    label: 'Disabled with Start Label',
    labelPosition: 'start',
    disabled: true
  })
  layout.body.appendChild(disabledStartLabelCheckbox.element)
}
