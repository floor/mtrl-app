// src/client/content/components/checkboxes.js
import { capitalize } from '../../core/utils'

import {
  componentsLayout,
  createComponentsSectionLayout
} from '../../layout'

import {
  createLayout,
  createCheckbox,
  createButton,
  createElement
} from 'mtrl'

export const createCheckboxesContent = (container) => {
  const info = {
    title: 'Checkboxes',
    description: 'Checkboxes let users select one or more items from a list, or turn an item on or off'
  }

  const layout = createLayout(componentsLayout(info), container).component

  initBasicCheckboxes(layout.body)
  initLabelPositions(layout.body)
  initIndeterminateCheckboxes(layout.body)
}

export const initBasicCheckboxes = (container) => {
  const title = 'Basic Checkboxes'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component

  // Default checkbox
  const defaultCheckbox = createCheckbox({
    label: 'Default'
  })
  layout.body.appendChild(defaultCheckbox.element)

  // Checked checkbox
  const checkedCheckbox = createCheckbox({
    label: 'Checked',
    checked: true
  })
  layout.body.appendChild(checkedCheckbox.element)

  // Disabled checkbox
  const disabledCheckbox = createCheckbox({
    label: 'Disabled',
    disabled: true
  })
  layout.body.appendChild(disabledCheckbox.element)

  // Disabled and checked checkbox
  const disabledCheckedCheckbox = createCheckbox({
    label: 'Disabled',
    disabled: true,
    checked: true
  })
  layout.body.appendChild(disabledCheckedCheckbox.element)
}

export const initLabelPositions = (container) => {
  const title = 'Label Positions'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component

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

export const initIndeterminateCheckboxes = (container) => {
  const title = 'Indeterminate State'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component

  // Create a wrapper for the demo
  const demoWrapper = createElement({ class: 'indeterminate-checkbox-demo' })

  // Parent checkbox (will control indeterminate state)
  const parentCheckbox = createCheckbox({
    label: 'Select All Items',
    indeterminate: true
  })
  demoWrapper.appendChild(parentCheckbox.element)

  // Child checkboxes container
  const childrenContainer = createElement({ class: 'checkbox-children' })
  childrenContainer.style.marginLeft = '24px'
  childrenContainer.style.marginTop = '8px'
  childrenContainer.style.display = 'flex'
  childrenContainer.style.flexDirection = 'column'

  // Child checkboxes
  const childCheckboxes = [
    createCheckbox({ label: 'Item 1' }),
    createCheckbox({ label: 'Item 2' }),
    createCheckbox({ label: 'Item 3' })
  ]

  // Add child checkboxes to container
  childCheckboxes.forEach(checkbox => {
    childrenContainer.appendChild(checkbox.element)
  })

  // Update parent state based on children
  const updateParentState = () => {
    const checkedCount = childCheckboxes.filter(cb => cb.isChecked()).length

    if (checkedCount === 0) {
      parentCheckbox.uncheck()
      parentCheckbox.setIndeterminate(false)
    } else if (checkedCount === childCheckboxes.length) {
      parentCheckbox.check()
      parentCheckbox.setIndeterminate(false)
    } else {
      parentCheckbox.setIndeterminate(true)
    }
  }

  // Add event listeners to child checkboxes
  childCheckboxes.forEach(checkbox => {
    checkbox.on('change', () => {
      updateParentState()
    })
  })

  // Handle parent checkbox changes
  parentCheckbox.on('change', () => {
    const isChecked = parentCheckbox.isChecked()
    parentCheckbox.setIndeterminate(false)

    // Update all child checkboxes
    childCheckboxes.forEach(checkbox => {
      if (isChecked) {
        checkbox.check()
      } else {
        checkbox.uncheck()
      }
    })
  })

  // Add description text
  const description = createElement({ tag: 'p', class: 'demo-description' })
  description.textContent = 'The parent checkbox shows an indeterminate state when some but not all child items are selected.'
  description.style.marginTop = '16px'
  description.style.fontSize = '14px'
  description.style.color = 'var(--mtrl-sys-color-on-surface-variant)'

  // Add manual controls
  const controlsWrapper = createElement({ class: 'demo-controls' })
  controlsWrapper.style.marginTop = '16px'
  controlsWrapper.style.display = 'flex'
  controlsWrapper.style.gap = '8px'

  const setIndeterminateBtn = createButton({
    text: 'Set Indeterminate',
    variant: 'outlined',
    size: 'small'
  })

  setIndeterminateBtn.on('click', () => {
    parentCheckbox.setIndeterminate(true)
  })

  controlsWrapper.appendChild(setIndeterminateBtn.element)

  // Assemble the demo
  demoWrapper.appendChild(childrenContainer)
  demoWrapper.appendChild(description)
  demoWrapper.appendChild(controlsWrapper)
  layout.body.appendChild(demoWrapper)
}
