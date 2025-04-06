// src/client/content/components/search/disabled.js

import {
  createComponentsSectionLayout
} from '../../../layout'

import {
  fLayout,
  fSearch,
  fButton,
  createElement
} from 'mtrl'

export const initDisabled = (container) => {
  const title = 'Disabled Search'
  const layout = fLayout(createComponentsSectionLayout({ title }), container).component

  // Disabled search bar
  const disabledSearch = fSearch({
    placeholder: 'Search (disabled)',
    disabled: true,
    showClearButton: true
  })

  // Create a search that can be toggled between enabled and disabled
  const toggleableSearch = fSearch({
    placeholder: 'Click button to toggle disabled state',
    showClearButton: true
  })

  // Create a button to toggle the disabled state
  const toggleButton = fButton({
    text: 'Toggle Disabled State',
    variant: 'outlined'
  })

  // Add click event to toggle button
  toggleButton.on('click', () => {
    if (toggleableSearch.isDisabled()) {
      toggleableSearch.enable()
      toggleButton.text.setText('Disable Search')
    } else {
      toggleableSearch.disable()
      toggleButton.text.setText('Enable Search')
    }
  })

  // Create the demo structure
  const demoStructure = [
    [createElement, 'container', { class: 'search-disabled-demo' }, [
      [createElement, 'description', {
        tag: 'p',
        text: 'Search component can be disabled to prevent user interaction.'
      }],
      [createElement, 'section1', { class: 'search-disabled-section' }, [
        [createElement, 'heading1', {
          tag: 'h3',
          text: 'Permanently Disabled'
        }],
        [createElement, 'disabledContainer', {}]
      ]],
      [createElement, 'spacer', {
        style: { height: '32px' }
      }],
      [createElement, 'section2', { class: 'search-toggle-section' }, [
        [createElement, 'heading2', {
          tag: 'h3',
          text: 'Toggle Disabled State'
        }],
        [createElement, 'toggleContainer', {}],
        [createElement, 'buttonContainer', {
          style: { marginTop: '16px' }
        }]
      ]]
    ]]
  ]

  // Create the demo layout
  const demo = fLayout(demoStructure, layout.body).component

  // Add components to their containers
  demo.disabledContainer.appendChild(disabledSearch.element)
  demo.toggleContainer.appendChild(toggleableSearch.element)
  demo.buttonContainer.appendChild(toggleButton.element)
}
