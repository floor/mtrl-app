// src/client/content/components/segmented-button/disabled.js
import {
  createComponentsSectionLayout
} from '../../../../layout'

import {
  createStructure,
  createButton
} from 'mtrl'

import {
  createSegmentedButton,
  SelectionMode
} from 'mtrl/src/components/segmented-button'

export const initDisabled = (container) => {
  const title = 'Disabled State'
  const layout = createStructure(createComponentsSectionLayout({
    title,
    description: 'Segmented buttons and individual segments can be disabled to indicate that they are not interactive.',
    class: 'noflex'
  }), container).component

  // Fully disabled segmented button section
  const disabledButtonTitle = document.createElement('h3')
  disabledButtonTitle.textContent = 'Fully Disabled Segmented Button'
  layout.showcase.appendChild(disabledButtonTitle)

  const disabledDescription = document.createElement('p')
  disabledDescription.textContent = 'When the entire segmented button is disabled, all segments are non-interactive. This is useful when the entire control should be temporarily unavailable.'
  layout.showcase.appendChild(disabledDescription)

  // Single-select disabled example
  const disabledSingleSelect = createSegmentedButton({
    mode: SelectionMode.SINGLE,
    disabled: true,
    segments: [
      { text: 'Day', value: 'day', selected: true },
      { text: 'Week', value: 'week' },
      { text: 'Month', value: 'month' }
    ]
  })

  const disabledSingleContainer = document.createElement('div')
  disabledSingleContainer.style.marginBottom = '24px'
  disabledSingleContainer.appendChild(disabledSingleSelect.element)
  layout.showcase.appendChild(disabledSingleContainer)

  // Multi-select disabled example
  const disabledMultiSelect = createSegmentedButton({
    mode: SelectionMode.MULTI,
    disabled: true,
    segments: [
      { text: 'Small', value: 'small', selected: true },
      { text: 'Medium', value: 'medium', selected: true },
      { text: 'Large', value: 'large' }
    ]
  })

  const disabledMultiContainer = document.createElement('div')
  disabledMultiContainer.style.marginBottom = '32px'
  disabledMultiContainer.appendChild(disabledMultiSelect.element)
  layout.showcase.appendChild(disabledMultiContainer)

  // Individually disabled segments section
  const partialDisabledTitle = document.createElement('h3')
  partialDisabledTitle.textContent = 'Partially Disabled Segments'
  layout.showcase.appendChild(partialDisabledTitle)

  const partialDisabledDescription = document.createElement('p')
  partialDisabledDescription.textContent = 'Individual segments can be disabled while keeping others interactive. This is useful for indicating which options are currently unavailable.'
  layout.showcase.appendChild(partialDisabledDescription)

  // Result display panel
  const partialDisabledResult = document.createElement('div')
  partialDisabledResult.className = 'result-panel'
  partialDisabledResult.style.padding = '12px'
  partialDisabledResult.style.backgroundColor = '#f5f5f5'
  partialDisabledResult.style.borderRadius = '4px'
  partialDisabledResult.style.marginBottom = '20px'
  partialDisabledResult.textContent = 'Current selection: Standard'
  layout.showcase.appendChild(partialDisabledResult)

  // Single-select with some disabled segments
  const partialDisabledButton = createSegmentedButton({
    mode: SelectionMode.SINGLE,
    segments: [
      { text: 'Basic', value: 'basic', disabled: true },
      { text: 'Standard', value: 'standard', selected: true },
      { text: 'Premium', value: 'premium' },
      { text: 'Enterprise', value: 'enterprise', disabled: true }
    ]
  })

  partialDisabledButton.on('change', (event) => {
    partialDisabledResult.textContent = `Current selection: ${event.value[0].charAt(0).toUpperCase() + event.value[0].slice(1)}`
    log.info(`Partial disabled button changed to: ${event.value[0]}`)
  })

  const partialDisabledContainer = document.createElement('div')
  partialDisabledContainer.style.marginBottom = '32px'
  partialDisabledContainer.appendChild(partialDisabledButton.element)
  layout.showcase.appendChild(partialDisabledContainer)

  // Dynamic disabling section
  const dynamicDisableTitle = document.createElement('h3')
  dynamicDisableTitle.textContent = 'Programmatically Toggle Disabled State'
  layout.showcase.appendChild(dynamicDisableTitle)

  const dynamicDisableDescription = document.createElement('p')
  dynamicDisableDescription.textContent = 'Segmented buttons can be dynamically enabled or disabled based on application state.'
  layout.showcase.appendChild(dynamicDisableDescription)

  // Interactive example
  const dynamicSegmentedButton = createSegmentedButton({
    mode: SelectionMode.SINGLE,
    segments: [
      { text: 'Option 1', value: 'option1', selected: true },
      { text: 'Option 2', value: 'option2' },
      { text: 'Option 3', value: 'option3' }
    ]
  })

  const dynamicButtonContainer = document.createElement('div')
  dynamicButtonContainer.style.marginBottom = '20px'
  dynamicButtonContainer.appendChild(dynamicSegmentedButton.element)
  layout.showcase.appendChild(dynamicButtonContainer)

  // Controls for toggling disabled state
  const controlsContainer = document.createElement('div')
  controlsContainer.style.display = 'flex'
  controlsContainer.style.gap = '8px'
  controlsContainer.style.marginBottom = '16px'

  const disableAllButton = createButton({
    text: 'Disable All',
    variant: 'outlined'
  })
  disableAllButton.on('click', () => {
    dynamicSegmentedButton.disable()
    log.info('Disabled entire segmented button')
  })

  const enableAllButton = createButton({
    text: 'Enable All',
    variant: 'outlined'
  })
  enableAllButton.on('click', () => {
    dynamicSegmentedButton.enable()
    log.info('Enabled entire segmented button')
  })

  const disableOption2Button = createButton({
    text: 'Disable Option 2',
    variant: 'outlined'
  })
  disableOption2Button.on('click', () => {
    // Find the segment and disable it
    const option2Segment = dynamicSegmentedButton.segments.find(s => s.value === 'option2')
    if (option2Segment) {
      option2Segment.setDisabled(true)
      log.info('Disabled Option 2 segment')
    }
  })

  const enableOption2Button = createButton({
    text: 'Enable Option 2',
    variant: 'outlined'
  })
  enableOption2Button.on('click', () => {
    // Find the segment and enable it
    const option2Segment = dynamicSegmentedButton.segments.find(s => s.value === 'option2')
    if (option2Segment) {
      option2Segment.setDisabled(false)
      log.info('Enabled Option 2 segment')
    }
  })

  controlsContainer.appendChild(disableAllButton.element)
  controlsContainer.appendChild(enableAllButton.element)
  controlsContainer.appendChild(disableOption2Button.element)
  controlsContainer.appendChild(enableOption2Button.element)
  layout.showcase.appendChild(controlsContainer)

  // Accessibility notes
  const accessibilityNote = document.createElement('div')
  accessibilityNote.style.backgroundColor = 'var(--mtrl-sys-color-surface-container)'
  accessibilityNote.style.padding = '16px'
  accessibilityNote.style.borderRadius = '4px'
  accessibilityNote.style.marginTop = '20px'

  const accessibilityTitle = document.createElement('h4')
  accessibilityTitle.textContent = 'Accessibility Considerations'
  accessibilityTitle.style.marginTop = '0'
  accessibilityNote.appendChild(accessibilityTitle)

  const accessibilityText = document.createElement('p')
  accessibilityText.textContent = 'Disabled segments and segmented buttons properly communicate their state to assistive technologies through aria-disabled attributes. When disabling segments, consider providing additional context about why the option is unavailable.'
  accessibilityNote.appendChild(accessibilityText)

  layout.showcase.appendChild(accessibilityNote)
}
