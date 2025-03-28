// src/client/content/components/search/transition-example.js

import {
  createComponentsSectionLayout
} from '../../../layout'

import {
  createLayout,
  createSearch,
  createElement
} from 'mtrl'

import {
  SEARCH_VARIANTS,
  SEARCH_VIEW_MODES,
  SEARCH_EVENTS
} from 'mtrl/src/components/search'

export const initTransition = (container) => {
  const title = 'Search Bar to View Mode Transition'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component

  // Create a search bar that will expand into view mode
  const searchBar = createSearch({
    placeholder: 'Search with voice',
    trailingIcon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>',
    showClearButton: true,
    suggestions: [
      'Weather forecast',
      'Traffic updates',
      'News headlines',
      'Sports scores',
      'Stock market update'
    ],
    supportingText: 'Try searching for topics or ask questions'
  })

  // Listen for transition events
  searchBar.on(SEARCH_EVENTS.FOCUS, (event) => {
    updateStatus('Search focused - transitioning to view mode')
  })

  searchBar.on(SEARCH_EVENTS.BLUR, (event) => {
    updateStatus('Search blurred - reverting to bar mode')
  })

  searchBar.on(SEARCH_EVENTS.MODE_CHANGE, (event) => {
    updateStatus(`View mode changed to: ${event.viewMode}`)
  })

  // Create the demo structure
  const demoStructure = [
    [createElement, 'container', { class: 'search-transition-demo' }, [
      [createElement, 'description', {
        tag: 'p',
        text: 'Click on the search bar to see it transition from bar mode to view mode. This demonstrates the natural flow between search states.'
      }],
      [createElement, 'controlPanel', { class: 'control-panel' }, [
        [createElement, 'viewModeToggle', {
          tag: 'div',
          class: 'control-group'
        }, [
          [createElement, 'viewModeLabel', {
            tag: 'span',
            text: 'View Mode:'
          }],
          [createElement, 'dockedButton', {
            tag: 'button',
            class: 'control-button active',
            text: 'Docked'
          }],
          [createElement, 'fullscreenButton', {
            tag: 'button',
            class: 'control-button',
            text: 'Fullscreen'
          }]
        ]]
      ]],
      [createElement, 'statusContainer', { class: 'status-container' }, [
        [createElement, 'statusLabel', {
          tag: 'span',
          text: 'Status: '
        }],
        [createElement, 'statusText', {
          tag: 'span',
          text: 'Ready - click search to expand'
        }]
      ]],
      [createElement, 'searchContainer', { class: 'search-transition-container' }]
    ]]
  ]

  // Create the demo
  const demo = createLayout(demoStructure, layout.body).component

  // Add the search component to its container
  demo.searchContainer.appendChild(searchBar.element)

  // Add styling to demo container
  demo.container.style.position = 'relative'
  demo.searchContainer.style.height = '300px'
  demo.searchContainer.style.display = 'flex'
  demo.searchContainer.style.justifyContent = 'center'
  demo.searchContainer.style.alignItems = 'flex-start'
  demo.searchContainer.style.padding = '20px'
  demo.searchContainer.style.backgroundColor = '#f5f5f5'
  demo.searchContainer.style.borderRadius = '8px'
  demo.searchContainer.style.marginTop = '20px'

  // Style control panel
  demo.controlPanel.style.display = 'flex'
  demo.controlPanel.style.justifyContent = 'center'
  demo.controlPanel.style.marginBottom = '16px'
  demo.controlPanel.style.marginTop = '16px'

  demo.viewModeToggle.style.display = 'flex'
  demo.viewModeToggle.style.alignItems = 'center'
  demo.viewModeToggle.style.gap = '12px'

  demo.dockedButton.style.padding = '8px 16px'
  demo.dockedButton.style.borderRadius = '4px'
  demo.dockedButton.style.border = '1px solid #ccc'
  demo.dockedButton.style.backgroundColor = '#6750A4'
  demo.dockedButton.style.color = 'white'
  demo.dockedButton.style.cursor = 'pointer'

  demo.fullscreenButton.style.padding = '8px 16px'
  demo.fullscreenButton.style.borderRadius = '4px'
  demo.fullscreenButton.style.border = '1px solid #ccc'
  demo.fullscreenButton.style.backgroundColor = 'white'
  demo.fullscreenButton.style.color = '#6750A4'
  demo.fullscreenButton.style.cursor = 'pointer'

  // Style status container
  demo.statusContainer.style.backgroundColor = '#e0e0e0'
  demo.statusContainer.style.padding = '8px 16px'
  demo.statusContainer.style.borderRadius = '4px'
  demo.statusContainer.style.marginTop = '16px'
  demo.statusContainer.style.fontSize = '14px'

  // Helper function to update status
  function updateStatus (message) {
    demo.statusText.textContent = message
  }

  // Add click handlers for buttons
  demo.dockedButton.addEventListener('click', () => {
    searchBar.setViewMode(SEARCH_VIEW_MODES.DOCKED)
    demo.dockedButton.style.backgroundColor = '#6750A4'
    demo.dockedButton.style.color = 'white'
    demo.fullscreenButton.style.backgroundColor = 'white'
    demo.fullscreenButton.style.color = '#6750A4'
    updateStatus('View mode set to DOCKED')
  })

  demo.fullscreenButton.addEventListener('click', () => {
    searchBar.setViewMode(SEARCH_VIEW_MODES.FULLSCREEN)
    demo.fullscreenButton.style.backgroundColor = '#6750A4'
    demo.fullscreenButton.style.color = 'white'
    demo.dockedButton.style.backgroundColor = 'white'
    demo.dockedButton.style.color = '#6750A4'
    updateStatus('View mode set to FULLSCREEN')
  })
}
