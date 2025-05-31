import {
  createComponentSection
} from '../../../layout'

import {
  createLayout,
  createProgress,
  createElement,
  createTextfield,
  createButton,
  PROGRESS_VARIANTS
} from 'mtrl'

/**
 * Initializes the interactive progress section
 * @param {HTMLElement} container - Container element
 */
export const initInteractiveProgress = (container) => {
  const title = 'Interactive Progress Demo'
  const layout = createLayout(createComponentSection({ title, class: 'noflex' }), container).component

  // Create linear and circular progress indicators for interaction
  const linearProgress = createProgress({
    variant: PROGRESS_VARIANTS.LINEAR,
    value: 50,
    showLabel: true
  })

  const circularProgress = createProgress({
    variant: PROGRESS_VARIANTS.CIRCULAR,
    value: 50
  })

  // Create controls wrapper
  const progressIndicators = createElement({
    tag: 'div',
    class: 'progress-indicators'
  })

  progressIndicators.appendChild(circularProgress.element)
  progressIndicators.appendChild(linearProgress.element)

  layout.showcase.appendChild(progressIndicators)

  // Create controls
  const controls = createElement({
    tag: 'div',
    class: 'progress-controls'
  })
  layout.info.appendChild(controls)

  // Value input
  const valueInput = createTextfield({
    label: 'Value (0-100)',
    variant: 'outlined',
    value: '50'
  })

  valueInput.element.addEventListener('input', (e) => {
    const value = parseInt(e.target.value, 10)
    if (!isNaN(value) && value >= 0 && value <= 100) {
      linearProgress.setValue(value)
      circularProgress.setValue(value)
    }
  })

  controls.appendChild(valueInput.element)

  // Buttons container
  const buttonsContainer = createElement({
    tag: 'div',
    class: 'buttons-container'
  })
  controls.appendChild(buttonsContainer)

  // // Preset buttons
  // const createPresetButton = (value) => {
  //   const button = createButton({
  //     text: `${value}%`,
  //     variant: 'outlined'
  //   })

  //   button.on('click', () => {
  //     linearProgress.setValue(value)
  //     circularProgress.setValue(value)
  //     valueInput.setValue(value.toString())
  //   })

  //   buttonsContainer.appendChild(button.element)
  // }

  // [0, 25, 50, 75, 100].forEach(createPresetButton)

  // // Toggle determiniate/indeterminate
  // const toggleButton = createButton({
  //   text: 'Toggle Indeterminate',
  //   variant: 'filled'
  // })

  // toggleButton.on('click', () => {
  //   const isIndeterminate = linearProgress.isIndeterminate()
  //   linearProgress.setIndeterminate(!isIndeterminate)
  //   circularProgress.setIndeterminate(!isIndeterminate)

  //   toggleButton.setText(isIndeterminate ? 'Toggle Indeterminate' : 'Switch to Determinate')

  //   // Enable/disable value controls based on state
  //   valueInput.element.disabled = !isIndeterminate
  //   document.querySelectorAll('.buttons-container button').forEach(
  //     btn => { btn.disabled = !isIndeterminate }
  //   )
  // })

  // controls.appendChild(toggleButton.element)

  // // Toggle disabled state
  // const disableButton = createButton({
  //   text: 'Toggle Disabled',
  //   variant: 'tonal'
  // })

  // disableButton.on('click', () => {
  //   const isDisabled = linearProgress.isDisabled()
  //   if (isDisabled) {
  //     linearProgress.enable()
  //     circularProgress.enable()
  //     disableButton.setText('Disable')
  //   } else {
  //     linearProgress.disable()
  //     circularProgress.disable()
  //     disableButton.setText('Enable')
  //   }
  // })

  // controls.appendChild(disableButton.element)
}
