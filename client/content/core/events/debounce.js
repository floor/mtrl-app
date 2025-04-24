import {
  createLayout,
  createElement,
  debounce
} from 'mtrl'

export const initDebounce = (body) => {
  const layout = createLayout([createElement, { tag: 'section', class: 'mtrl-content__section' },
    [createElement, { tag: 'h2', class: 'mtrl-content__section-title', text: 'Debounce Utility' }],
    [createElement, { tag: 'p', class: 'mtrl-content__description', text: 'Debounce delays function execution until after a specified pause, grouping multiple calls into a single execution.' }],
    [createElement, 'container', { id: 'debounceDemo', class: 'debounce-demo-container' }]
  ], body)

  const container = layout.get('container')

  // Create explanation for debounce utility
  const debounceExplanation = createElement({
    tag: 'div',
    class: 'debounce-explanation'
  })

  const explanationText = createElement({
    tag: 'p',
    class: 'debounce-explanation__text',
    text: 'Debouncing is useful when you want to wait until a user has stopped interacting before triggering an action. It postpones function execution until after a specified delay has passed since the last call.'
  })

  const bestPracticesText = createElement({
    tag: 'p',
    class: 'debounce-explanation__best-practices',
    text: 'Best used for: search inputs, form validation, window resizing, and other user interactions where you want to wait for a pause in activity.'
  })

  debounceExplanation.appendChild(explanationText)
  debounceExplanation.appendChild(bestPracticesText)

  // Create debounce example
  const debounceExample = createElement({
    tag: 'div',
    class: 'debounce-example'
  })

  const exampleTitle = createElement({
    tag: 'h3',
    class: 'debounce-example__title',
    text: 'Debounce Example'
  })

  const exampleCode = createElement({
    tag: 'pre',
    class: 'debounce-example__code',
    text: `import { debounce } from 'mtrl';

// Create a debounced search handler
// Will only execute 300ms after the user stops typing
const handleSearch = debounce((searchTerm) => {
  // Make API call with search term
  fetchSearchResults(searchTerm);
}, 300);

// Add event listener
searchInput.addEventListener('input', (e) => {
  handleSearch(e.target.value);
});

// With options (leading: true will execute immediately on first call)
const handleResize = debounce(() => {
  recalculateLayout();
}, 200, { 
  leading: false,    // Don't execute on leading edge
  maxWait: 1000      // Force execution after 1 second
});

window.addEventListener('resize', handleResize);`
  })

  // Interactive demo for debounce
  const demoContainer = createElement({
    tag: 'div',
    class: 'debounce-demo__interactive'
  })

  const demoTitle = createElement({
    tag: 'h4',
    class: 'debounce-demo__interactive-title',
    text: 'Interactive Demo'
  })

  const demoDescription = createElement({
    tag: 'p',
    class: 'debounce-demo__interactive-description',
    text: 'Type in the search box below. Notice how the search only triggers after you stop typing for 500ms.'
  })

  // Create search demo
  const searchContainer = createElement({
    tag: 'div',
    class: 'debounce-search-container'
  })

  const searchLabel = createElement({
    tag: 'label',
    class: 'debounce-search-label',
    text: 'Search:',
    attrs: {
      for: 'debounce-search-input'
    }
  })

  const searchInput = createElement({
    tag: 'input',
    class: 'debounce-search-input',
    attrs: {
      type: 'text',
      id: 'debounce-search-input',
      placeholder: 'Type to search...'
    }
  })

  const eventLogContainer = createElement({
    tag: 'div',
    class: 'debounce-event-log-container'
  })

  const eventLogTitle = createElement({
    tag: 'h5',
    class: 'debounce-event-log-title',
    text: 'Event Log'
  })

  const eventLog = createElement({
    tag: 'div',
    class: 'debounce-event-log'
  })

  const clearLogButton = createElement({
    tag: 'button',
    class: 'debounce-clear-log-button',
    text: 'Clear Log'
  })

  eventLogContainer.appendChild(eventLogTitle)
  eventLogContainer.appendChild(eventLog)
  eventLogContainer.appendChild(clearLogButton)

  // Add result display
  const searchResults = createElement({
    tag: 'div',
    class: 'debounce-search-results'
  })

  const searchResultsTitle = createElement({
    tag: 'h5',
    class: 'debounce-search-results-title',
    text: 'Search Results'
  })

  const searchResultsContent = createElement({
    tag: 'div',
    class: 'debounce-search-results-content',
    text: 'Type something in the search box above'
  })

  searchResults.appendChild(searchResultsTitle)
  searchResults.appendChild(searchResultsContent)

  // Set up event handlers
  const addLogEntry = (type, text) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', millisecond: true })
      .replace(/(\d+)\.(\d+)/, '$1:$2') // Format milliseconds with colon

    const entry = createElement({
      tag: 'div',
      class: `debounce-log-entry ${type}`
    })

    const entryTimestamp = createElement({
      tag: 'span',
      class: 'debounce-log-timestamp',
      text: timestamp
    })

    const entryText = createElement({
      tag: 'span',
      class: 'debounce-log-text',
      text
    })

    entry.appendChild(entryTimestamp)
    entry.appendChild(entryText)
    eventLog.appendChild(entry)

    // Auto-scroll to bottom
    eventLog.scrollTop = eventLog.scrollHeight

    // Limit log entries
    if (eventLog.children.length > 20) {
      eventLog.removeChild(eventLog.children[0])
    }
  }

  // Create regular input handler
  const handleInput = (e) => {
    const value = e.target.value
    addLogEntry('input', `Input event: "${value}"`)
  }

  // Create debounced search handler
  const handleSearch = debounce((value) => {
    addLogEntry('search', `DEBOUNCED: Searching for "${value}"`)

    // Simulate search results
    const results = value.trim() === ''
      ? 'Type something in the search box above'
      : `Found ${Math.floor(Math.random() * 10) + 1} results for "${value}"`

    searchResultsContent.textContent = results
    searchResultsContent.classList.add('highlight')

    setTimeout(() => {
      searchResultsContent.classList.remove('highlight')
    }, 300)
  }, 750) // 500ms debounce

  // Add event listeners
  searchInput.addEventListener('input', (e) => {
    handleInput(e)
    handleSearch(e.target.value)
  })

  clearLogButton.addEventListener('click', () => {
    eventLog.innerHTML = ''
    addLogEntry('system', 'Log cleared')
  })

  // Assemble the search demo
  searchContainer.appendChild(searchLabel)
  searchContainer.appendChild(searchInput)

  // Assemble the demo
  demoContainer.appendChild(demoTitle)
  demoContainer.appendChild(demoDescription)
  demoContainer.appendChild(searchContainer)
  demoContainer.appendChild(eventLogContainer)
  demoContainer.appendChild(searchResults)

  // Add second demo: resize handler
  const resizeDemoContainer = createElement({
    tag: 'div',
    class: 'debounce-resize-demo'
  })

  const resizeDemoTitle = createElement({
    tag: 'h4',
    class: 'debounce-resize-demo-title',
    text: 'Resize Window Demo'
  })

  const resizeDemoDescription = createElement({
    tag: 'p',
    class: 'debounce-resize-demo-description',
    text: 'Resize your browser window. The regular event fires on every resize, while the debounced event only fires after you stop resizing for 500ms.'
  })

  const resizeCounters = createElement({
    tag: 'div',
    class: 'debounce-resize-counters'
  })

  const regularResizeCounter = createElement({
    tag: 'div',
    class: 'debounce-resize-counter'
  })

  const regularResizeLabel = createElement({
    tag: 'span',
    class: 'debounce-resize-label',
    text: 'Regular resize events: '
  })

  const regularResizeValue = createElement({
    tag: 'span',
    class: 'debounce-resize-value regular',
    text: '0'
  })

  regularResizeCounter.appendChild(regularResizeLabel)
  regularResizeCounter.appendChild(regularResizeValue)

  const debouncedResizeCounter = createElement({
    tag: 'div',
    class: 'debounce-resize-counter'
  })

  const debouncedResizeLabel = createElement({
    tag: 'span',
    class: 'debounce-resize-label',
    text: 'Debounced resize events: '
  })

  const debouncedResizeValue = createElement({
    tag: 'span',
    class: 'debounce-resize-value debounced',
    text: '0'
  })

  debouncedResizeCounter.appendChild(debouncedResizeLabel)
  debouncedResizeCounter.appendChild(debouncedResizeValue)

  const windowSizeDisplay = createElement({
    tag: 'div',
    class: 'debounce-window-size',
    text: `Window size: ${window.innerWidth}×${window.innerHeight}`
  })

  resizeCounters.appendChild(regularResizeCounter)
  resizeCounters.appendChild(debouncedResizeCounter)
  resizeCounters.appendChild(windowSizeDisplay)

  const resetResizeButton = createElement({
    tag: 'button',
    class: 'debounce-reset-button',
    text: 'Reset Counters'
  })

  // Set up resize handlers
  let regularResizeCount = 0
  let debouncedResizeCount = 0

  const handleRegularResize = () => {
    regularResizeCount++
    regularResizeValue.textContent = regularResizeCount
    windowSizeDisplay.textContent = `Window size: ${window.innerWidth}×${window.innerHeight}`
    regularResizeValue.classList.add('highlight')
    setTimeout(() => regularResizeValue.classList.remove('highlight'), 100)
  }

  const handleDebouncedResize = debounce(() => {
    debouncedResizeCount++
    debouncedResizeValue.textContent = debouncedResizeCount
    debouncedResizeValue.classList.add('highlight')
    setTimeout(() => debouncedResizeValue.classList.remove('highlight'), 300)
  }, 500)

  window.addEventListener('resize', () => {
    handleRegularResize()
    handleDebouncedResize()
  })

  resetResizeButton.addEventListener('click', () => {
    regularResizeCount = 0
    debouncedResizeCount = 0
    regularResizeValue.textContent = '0'
    debouncedResizeValue.textContent = '0'
  })

  // Assemble resize demo
  resizeDemoContainer.appendChild(resizeDemoTitle)
  resizeDemoContainer.appendChild(resizeDemoDescription)
  resizeDemoContainer.appendChild(resizeCounters)
  resizeDemoContainer.appendChild(resetResizeButton)

  // Assemble all parts
  debounceExample.appendChild(exampleTitle)
  debounceExample.appendChild(exampleCode)
  debounceExample.appendChild(demoContainer)
  debounceExample.appendChild(resizeDemoContainer)

  // Add everything to the container
  container.appendChild(debounceExplanation)
  container.appendChild(debounceExample)

  // Initialize log
  addLogEntry('system', 'Ready to test debouncing')
}
