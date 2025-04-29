// src/client/content/components/search/events-api.js

import {
  createComponentsSectionLayout
} from '../../../layout'

import {
  createLayout,
  createSearch,
  createButton,
  createDivider,
  createElement,
  SEARCH_EVENTS
} from 'mtrl'

export const initEventsAPI = (container) => {
  const title = 'Using Events and API'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component

  // Create the search component with event handlers
  const search = createSearch({
    placeholder: 'Type and submit',
    showClearButton: true,
    on: {
      // Log input changes
      [SEARCH_EVENTS.INPUT]: (event) => {
        console.log(`Input value: "${event.value}"`)
      },
      // Show when search is submitted
      [SEARCH_EVENTS.SUBMIT]: (event) => {
        console.log(`Search submitted: "${event.value}"`)
        // Update the event log
        appendToLog(`Search submitted: "${event.value}"`)
      },
      // Track focus events
      [SEARCH_EVENTS.FOCUS]: () => {
        console.log('Search focused')
        appendToLog('Search focused')
      },
      // Track blur events
      [SEARCH_EVENTS.BLUR]: () => {
        console.log('Search blurred')
        appendToLog('Search blurred')
      }
    }
  })

  // Create buttons for the demo
  const setValueButton = createButton({
    text: 'Set Value to "Hello World"',
    variant: 'outlined'
  })

  const clearButton = createButton({
    text: 'Clear Search',
    variant: 'outlined'
  })

  const focusButton = createButton({
    text: 'Focus Search',
    variant: 'outlined'
  })

  const placeholderButton = createButton({
    text: 'Change Placeholder',
    variant: 'outlined'
  })

  const submitButton = createButton({
    text: 'Submit Search',
    variant: 'filled',
    color: 'primary'
  })

  // Add event handlers to buttons
  setValueButton.on('click', () => {
    search.setValue('Hello World')
    appendToLog('Set value to "Hello World"')
  })

  clearButton.on('click', () => {
    search.clear()
    appendToLog('Cleared search')
  })

  focusButton.on('click', () => {
    search.focus()
    appendToLog('Focused search via API')
  })

  placeholderButton.on('click', () => {
    search.setPlaceholder('New placeholder text')
    appendToLog('Changed placeholder text')
  })

  submitButton.on('click', () => {
    search.submit()
    appendToLog('Submitted search via API')
  })

  // Create a structure for our UI
  const demoStructure = [
    [createElement, 'container', { class: 'search-demo-container' }, [
      [createElement, 'description', {
        tag: 'p',
        text: 'The search component provides a rich API and events system to integrate with your application.'
      }],
      [createElement, 'instructions', {
        tag: 'p',
        innerHTML: '<strong>Try it:</strong> Click the buttons below to interact with the search component via its API. All events and actions will be displayed in the log.'
      }],
      [createElement, 'searchContainer', { class: 'search-container' }],
      [createElement, 'buttonsContainer', {
        class: 'search-buttons-container',
        style: {
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          marginTop: '16px'
        }
      }],
      [createElement, 'dividerContainer', {
        style: { margin: '20px 0' }
      }],
      [createElement, 'logContainer', {
        class: 'search-log-container',
        style: {
          marginTop: '16px',
          padding: '12px',
          backgroundColor: 'var(--mtrl-sys-color-surface-container-high)',
          borderRadius: '4px',
          border: '1px solid var(--mtrl-sys-color-outline-variant)',
          maxHeight: '200px',
          overflowY: 'auto'
        }
      }, [
        [createElement, 'logTitle', {
          tag: 'h4',
          text: 'Event Log',
          style: { margin: '0 0 8px 0' }
        }],
        [createElement, 'logContent', {
          style: {
            fontFamily: 'monospace',
            fontSize: '14px'
          }
        }]
      ]]
    ]]
  ]

  // Create the demo layout
  const demo = createLayout(demoStructure, layout.body).component

  // Add the search component
  demo.searchContainer.appendChild(search.element)

  // Add the buttons
  demo.buttonsContainer.appendChild(setValueButton.element)
  demo.buttonsContainer.appendChild(clearButton.element)
  demo.buttonsContainer.appendChild(focusButton.element)
  demo.buttonsContainer.appendChild(placeholderButton.element)
  demo.buttonsContainer.appendChild(submitButton.element)

  // Add divider
  // const divider = createDivider()
  // demo.dividerContainer.appendChild(divider.element)

  // Function to append events to the log
  function appendToLog (message) {
    const entry = document.createElement('div')
    entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`
    entry.style.borderBottom = '1px solid var(--mtrl-sys-color-outline-variant)'
    entry.style.padding = '4px 0'

    demo.logContent.appendChild(entry)

    // Auto-scroll to bottom
    demo.logContainer.scrollTop = demo.logContainer.scrollHeight
  }
}
