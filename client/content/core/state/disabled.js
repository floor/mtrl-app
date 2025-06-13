import {
  createElement,
  createButton,
  createLayout,
  createTextfield
} from 'mtrl'

import {
  createContentSection
} from '../../../layout'

export const initDisabled = (container) => {
  const section = createLayout(createContentSection({
    title: 'Composing state',
    description: 'Compose multiple state managers to create complex behavior from simple building blocks.',
    bodyClass: 'grid'
  }), container).component

  // Create explanation for disabled state
  const disabledExplanation = createElement({
    tag: 'div',
    class: 'state-explanation'
  })

  const explanationText = createElement({
    tag: 'p',
    class: 'state-explanation__text',
    text: 'The Disabled state manager provides a simple interface for toggling the disabled state of components. It ensures consistent disabled behavior across all components.'
  })

  disabledExplanation.appendChild(explanationText)

  // Create disabled example
  const disabledExample = createElement({
    tag: 'div',
    class: 'state-example'
  })

  const exampleTitle = createElement({
    tag: 'h3',
    class: 'state-example__title',
    text: 'Disabled State Management'
  })

  const exampleCode = createElement({
    tag: 'pre',
    class: 'state-example__code',
    text: `// Create a disabled state controller for an element
const disabled = createDisabled(buttonElement);

// Disable the element
disabled.disable();

// Enable the element
disabled.enable();

// Toggle between enabled and disabled
disabled.toggle();

// Check if the element is disabled
if (disabled.isDisabled()) {
  // Do something based on disabled state
}`
  })

  // Create interactive demo for disabled state
  const exampleDemo = createElement({
    tag: 'div',
    class: 'state-example__demo'
  })

  const disabledDemo = createElement({
    tag: 'div',
    class: 'disabled-demo'
  })

  const demoControls = createElement({
    tag: 'div',
    class: 'disabled-controls'
  })

  const toggleButton = createButton({
    text: 'Toggle Disabled State',
    variant: 'filled'
  })

  const componentsContainer = createElement({
    tag: 'div',
    class: 'disabled-components'
  })

  // Create several components to demonstrate disabled state
  const demoButton = createButton({
    text: 'Button Component',
    variant: 'filled'
  })

  const demoOutlinedButton = createButton({
    text: 'Outlined Button',
    variant: 'outlined'
  })

  const demoTextField = createTextfield({
    label: 'Text Field',
    placeholder: 'Enter text here'
  })

  // Add toggle functionality
  toggleButton.on('click', () => {
    // Check if currently disabled
    const isDisabled = demoButton.element.disabled

    if (isDisabled) {
      // Enable all components
      demoButton.element.disabled = false
      demoOutlinedButton.element.disabled = false
      demoTextField.input.disabled = false

      // Update appearance
      demoButton.element.classList.remove('mtrl-button--disabled')
      demoOutlinedButton.element.classList.remove('mtrl-button--disabled')
      demoTextField.element.classList.remove('mtrl-textfield--disabled')
    } else {
      // Disable all components
      demoButton.element.disabled = true
      demoOutlinedButton.element.disabled = true
      demoTextField.input.disabled = true

      // Update appearance
      demoButton.element.classList.add('mtrl-button--disabled')
      demoOutlinedButton.element.classList.add('mtrl-button--disabled')
      demoTextField.element.classList.add('mtrl-textfield--disabled')
    }
  })

  // Assemble the demo
  demoControls.appendChild(toggleButton.element)
  componentsContainer.appendChild(demoButton.element)
  componentsContainer.appendChild(demoOutlinedButton.element)
  componentsContainer.appendChild(demoTextField.element)

  disabledDemo.appendChild(demoControls)
  disabledDemo.appendChild(componentsContainer)
  exampleDemo.appendChild(disabledDemo)

  disabledExample.appendChild(exampleTitle)
  disabledExample.appendChild(exampleCode)
  disabledExample.appendChild(exampleDemo)

  section.body.appendChild(disabledExplanation)
  section.body.appendChild(disabledExample)
}
