import {
  createLayout,
  createCheckbox,
  createElement,
  createButton
} from 'mtrl'

import {
  createComponentsSectionLayout
} from '../../../layout'

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
  layout.info.appendChild(description)
  layout.info.appendChild(controlsWrapper)
  layout.showcase.appendChild(demoWrapper)
}
