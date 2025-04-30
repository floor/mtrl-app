// src/client/content/components/search/events-api.js

import {
  createComponentsSectionLayout
} from '../../../layout'

import {
  createLayout,
  createSearch,
  createButton,
  createElement,
  SEARCH_EVENTS
} from 'mtrl'

export const initEventsAPI = (container) => {
  const title = 'Using Events and API'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component

  const showcase = createLayout([
    [createSearch, 'search', {
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
    }]
  ], layout.showcase).component

  const search = showcase.search

  // Create a structure for our UI
  const info = createLayout([
    [createElement, 'container', { class: 'search-demo-container' }, [
      [createElement, 'description', {
        tag: 'p',
        text: 'The search component provides a rich API and events system to integrate with your application.'
      }],
      [createElement, 'instructions', {
        tag: 'p',
        innerHTML: '<strong>Try it:</strong> Click the buttons below to interact with the search component via its API. All events and actions will be displayed in the log.'
      }],
      [createElement, 'buttonsContainer', {
        class: 'search-buttons-container',
        style: {
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          marginTop: '16px'
        }
      },

      [createButton, 'valueButton', { text: 'Set Value to "Hello World"', variant: 'outlined' }],
      [createButton, 'clearButton', {
        text: 'Clear Search',
        variant: 'outlined'
      }],
      [createButton, 'focusButton', {
        text: 'Focus Search',
        variant: 'outlined'
      }],
      [createButton, 'placeholderButton', {
        text: 'Change Placeholder',
        variant: 'outlined'
      }],
      [createButton, 'submitButton', {
        text: 'Submit Search',
        variant: 'filled',
        color: 'primary'
      }]
      ],
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
          height: '200px',
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
  ], layout.info).component

  console.log('info', info)

  // Add event handlers to buttons
  info.valueButton.on('click', () => {
    search.setValue('Hello World')
    appendToLog('Set value to "Hello World"')
  })

  info.clearButton.on('click', () => {
    search.clear()
    appendToLog('Cleared search')
  })

  info.focusButton.on('click', () => {
    search.focus()
    appendToLog('Focused search via API')
  })

  info.placeholderButton.on('click', () => {
    search.setPlaceholder('New placeholder text')
    appendToLog('Changed placeholder text')
  })

  info.submitButton.on('click', () => {
    search.submit()
    appendToLog('Submitted search via API')
  })

  // Add the search component
  layout.showcase.appendChild(search.element)

  // Add divider
  // const divider = createDivider()
  // demo.dividerContainer.appendChild(divider.element)

  // Function to append events to the log
  function appendToLog (message) {
    const entry = document.createElement('div')
    entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`
    entry.style.borderBottom = '1px solid var(--mtrl-sys-color-outline-variant)'
    entry.style.padding = '4px 0'

    info.logContent.appendChild(entry)

    // Auto-scroll to bottom
    info.logContainer.scrollTop = info.logContainer.scrollHeight
  }
}
