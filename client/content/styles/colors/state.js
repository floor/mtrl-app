import {
  createLayout,
  createElement,
  fButton
} from 'mtrl'

import { createContentSection } from '../../../layout/content'

export const createColorState = (container) => {
  const body = createLayout(createContentSection({
    title: 'State Colors',
    description: 'State colors communicate the status of components and provide visual feedback for interactions.',
    class: 'state-colors'
  }), container).get('body')

  // Create state color tokens with visual examples
  const stateColors = [
    { name: 'hover', label: 'Hover', desc: 'Applied when the cursor hovers over an interactive element.' },
    { name: 'focus', label: 'Focus', desc: 'Applied when an element receives keyboard focus.' },
    { name: 'active', label: 'Active', desc: 'Applied during the active/pressed state of an element.' },
    { name: 'disabled', label: 'Disabled', desc: 'Applied to elements that are currently not interactive.' }
  ]

  // Create state colors container
  const stateColorsGrid = createElement({
    tag: 'div',
    class: 'color-state-grid'
  })

  stateColors.forEach(state => {
    // Create state container
    const stateContainer = createElement({
      tag: 'div',
      class: 'state-color-container'
    })

    // Create state example
    const stateExample = createElement({
      tag: 'div',
      class: `state-color-example state-${state.name}`,
      text: state.label
    })

    // Create state info
    const stateInfo = createElement({
      tag: 'div',
      class: 'state-color-info'
    })

    // State label
    const stateLabel = createElement({
      tag: 'div',
      class: 'state-color-label',
      text: `${state.label} State`
    })

    // State description
    const stateDesc = createElement({
      tag: 'div',
      class: 'state-color-value',
      text: state.desc
    })

    stateInfo.appendChild(stateLabel)
    stateInfo.appendChild(stateDesc)
    stateContainer.appendChild(stateExample)
    stateContainer.appendChild(stateInfo)
    stateColorsGrid.appendChild(stateContainer)
  })

  body.appendChild(stateColorsGrid)
}
