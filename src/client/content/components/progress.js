// src/client/content/components/progress.js
import { capitalize } from '../../core/utils'

import {
  contentLayout,
  createComponentsSectionLayout
} from '../../config'

import {
  createLayout,
  createElement,
  createButton,
  createTextfield
} from 'mtrl'

import createProgress, { PROGRESS_VARIANTS, PROGRESS_SIZES } from 'mtrl/src/components/progress'

/**
 * Creates the main Progress component showcase
 * @param {HTMLElement} container - The container element to append content to
 */
export const createProgressContent = (container) => {
  const info = {
    title: 'Progress Indicators',
    description: 'Progress indicators express an unspecified wait time or display the length of a process'
  }

  container.classList.add('components')

  const layout = createLayout(contentLayout(info), container).component

  initLinearProgress(layout.body)
  initCircularProgress(layout.body)
  initIndeterminateProgress(layout.body)
  initProgressSizes(layout.body)
  initBufferProgress(layout.body)
  initInteractiveProgress(layout.body)
}

/**
 * Initializes the linear progress section
 * @param {HTMLElement} container - Container element
 */
export const initLinearProgress = (container) => {
  const title = 'Linear Progress'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component

  // Create determinate linear progress
  const progress25 = createProgress({
    variant: PROGRESS_VARIANTS.LINEAR,
    value: 25
  })
  layout.body.appendChild(progress25.element)

  const progress50 = createProgress({
    variant: PROGRESS_VARIANTS.LINEAR,
    value: 50
  })
  layout.body.appendChild(progress50.element)

  const progress75 = createProgress({
    variant: PROGRESS_VARIANTS.LINEAR,
    value: 75
  })
  layout.body.appendChild(progress75.element)

  const progress100 = createProgress({
    variant: PROGRESS_VARIANTS.LINEAR,
    value: 100
  })
  layout.body.appendChild(progress100.element)

  // Create a progress with label
  const progressWithLabel = createProgress({
    variant: PROGRESS_VARIANTS.LINEAR,
    value: 42,
    showLabel: true
  })
  layout.body.appendChild(progressWithLabel.element)
}

/**
 * Initializes the circular progress section
 * @param {HTMLElement} container - Container element
 */
export const initCircularProgress = (container) => {
  const title = 'Circular Progress'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component

  // With the fix in place, we can now use circular progress indicators
  const circularContainer = createElement({
    tag: 'div',
    class: 'circular-indicators'
  })
  layout.body.appendChild(circularContainer)

  // Create determinate circular progress indicators
  const progress25 = createProgress({
    variant: PROGRESS_VARIANTS.CIRCULAR,
    value: 25
  })
  circularContainer.appendChild(progress25.element)

  const progress50 = createProgress({
    variant: PROGRESS_VARIANTS.CIRCULAR,
    value: 50
  })
  circularContainer.appendChild(progress50.element)

  const progress75 = createProgress({
    variant: PROGRESS_VARIANTS.CIRCULAR,
    value: 75
  })
  circularContainer.appendChild(progress75.element)

  const progress100 = createProgress({
    variant: PROGRESS_VARIANTS.CIRCULAR,
    value: 100
  })
  circularContainer.appendChild(progress100.element)
}

/**
 * Initializes the indeterminate progress section
 * @param {HTMLElement} container - Container element
 */
export const initIndeterminateProgress = (container) => {
  const title = 'Indeterminate Progress'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component

  // Create indeterminate linear progress
  const indeterminateLinear = createProgress({
    variant: PROGRESS_VARIANTS.LINEAR,
    indeterminate: true
  })
  layout.body.appendChild(indeterminateLinear.element)

  // Create indeterminate circular progress
  const indeterminateCircular = createProgress({
    variant: PROGRESS_VARIANTS.CIRCULAR,
    indeterminate: true
  })
  layout.body.appendChild(indeterminateCircular.element)

  // Create disabled indeterminate linear progress
  const disabledLinear = createProgress({
    variant: PROGRESS_VARIANTS.LINEAR,
    indeterminate: true,
    disabled: true
  })
  layout.body.appendChild(disabledLinear.element)

  // Create disabled indeterminate circular progress
  const disabledCircular = createProgress({
    variant: PROGRESS_VARIANTS.CIRCULAR,
    indeterminate: true,
    disabled: true
  })
  layout.body.appendChild(disabledCircular.element)
}

/**
 * Initializes the progress sizes section
 * @param {HTMLElement} container - Container element
 */
export const initProgressSizes = (container) => {
  const title = 'Progress Sizes'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component

  // Linear progress in different sizes
  const sizes = Object.values(PROGRESS_SIZES)

  const linearContainer = createElement({
    tag: 'div',
    class: 'progress-group'
  })
  layout.body.appendChild(linearContainer)

  const linearHeader = createElement({
    tag: 'h3',
    class: 'mtrl-content__subsection-title',
    text: 'Linear Progress Sizes'
  })
  linearContainer.appendChild(linearHeader)

  sizes.forEach(size => {
    const progress = createProgress({
      variant: PROGRESS_VARIANTS.LINEAR,
      size,
      value: 60
    })

    const label = createElement({
      tag: 'div',
      class: 'size-label',
      text: capitalize(size)
    })

    const wrapper = createElement({
      tag: 'div',
      class: 'progress-item'
    })

    wrapper.appendChild(label)
    wrapper.appendChild(progress.element)
    linearContainer.appendChild(wrapper)
  })

  // Circular progress in different sizes
  const circularContainer = createElement({
    tag: 'div',
    class: 'progress-group'
  })
  layout.body.appendChild(circularContainer)

  const circularHeader = createElement({
    tag: 'h3',
    class: 'mtrl-content__subsection-title',
    text: 'Circular Progress Sizes'
  })
  circularContainer.appendChild(circularHeader)

  // Create a flex container for circular progress items
  const circularItemsContainer = createElement({
    tag: 'div',
    class: 'circular-items'
  })
  circularContainer.appendChild(circularItemsContainer)

  sizes.forEach(size => {
    const progress = createProgress({
      variant: PROGRESS_VARIANTS.CIRCULAR,
      size,
      value: 75
    })

    const label = createElement({
      tag: 'div',
      class: 'size-label',
      text: capitalize(size)
    })

    const wrapper = createElement({
      tag: 'div',
      class: 'progress-item circular'
    })

    wrapper.appendChild(label)
    wrapper.appendChild(progress.element)
    circularItemsContainer.appendChild(wrapper)
  })
}

/**
 * Initializes the buffer progress section
 * @param {HTMLElement} container - Container element
 */
export const initBufferProgress = (container) => {
  const title = 'Buffer Progress'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component

  // Create progress with buffer indicator
  const progress = createProgress({
    variant: PROGRESS_VARIANTS.LINEAR,
    value: 40,
    buffer: 70,
    showLabel: true
  })
  layout.body.appendChild(progress.element)

  // Create another progress with buffer indicator
  const progress2 = createProgress({
    variant: PROGRESS_VARIANTS.LINEAR,
    value: 20,
    buffer: 90
  })
  layout.body.appendChild(progress2.element)
}

/**
 * Initializes the interactive progress section
 * @param {HTMLElement} container - Container element
 */
export const initInteractiveProgress = (container) => {
  const title = 'Interactive Progress Demo'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component

  // Create linear and circular progress indicators for interaction
  const linearProgress = createProgress({
    variant: PROGRESS_VARIANTS.LINEAR,
    value: 0,
    showLabel: true
  })

  const circularProgress = createProgress({
    variant: PROGRESS_VARIANTS.CIRCULAR,
    value: 0
  })

  // Create controls wrapper
  const progressIndicators = createElement({
    tag: 'div',
    class: 'progress-indicators'
  })

  progressIndicators.appendChild(linearProgress.element)
  progressIndicators.appendChild(circularProgress.element)
  layout.body.appendChild(progressIndicators)

  // Create controls
  const controls = createElement({
    tag: 'div',
    class: 'progress-controls'
  })
  layout.body.appendChild(controls)

  // Value input
  const valueInput = createTextfield({
    label: 'Value (0-100)',
    variant: 'outlined',
    value: '0'
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

  // Preset buttons
  const createPresetButton = (value) => {
    const button = createButton({
      text: `${value}%`,
      variant: 'outlined'
    })

    button.on('click', () => {
      linearProgress.setValue(value)
      circularProgress.setValue(value)
      valueInput.setValue(value.toString())
    })

    buttonsContainer.appendChild(button.element)
  }

  [0, 25, 50, 75, 100].forEach(createPresetButton)

  // Toggle determiniate/indeterminate
  const toggleButton = createButton({
    text: 'Toggle Indeterminate',
    variant: 'filled'
  })

  toggleButton.on('click', () => {
    const isIndeterminate = linearProgress.isIndeterminate()
    linearProgress.setIndeterminate(!isIndeterminate)
    circularProgress.setIndeterminate(!isIndeterminate)

    toggleButton.setText(isIndeterminate ? 'Toggle Indeterminate' : 'Switch to Determinate')

    // Enable/disable value controls based on state
    valueInput.element.disabled = !isIndeterminate
    document.querySelectorAll('.buttons-container button').forEach(
      btn => { btn.disabled = !isIndeterminate }
    )
  })

  controls.appendChild(toggleButton.element)

  // Toggle disabled state
  const disableButton = createButton({
    text: 'Toggle Disabled',
    variant: 'tonal'
  })

  disableButton.on('click', () => {
    const isDisabled = linearProgress.isDisabled()
    if (isDisabled) {
      linearProgress.enable()
      circularProgress.enable()
      disableButton.setText('Disable')
    } else {
      linearProgress.disable()
      circularProgress.disable()
      disableButton.setText('Enable')
    }
  })

  controls.appendChild(disableButton.element)
}
