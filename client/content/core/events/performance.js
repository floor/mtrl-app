import {
  createElement
} from 'mtrl'

export const initPerformanceUtils = (body) => {
  const layout = createLayout([createElement, { tag: 'section', class: 'mtrl-content__section' },
    [createElement, { tag: 'h2', class: 'mtrl-content__section-title', text: 'Performance Utilities' }],
    [createElement, { tag: 'p', class: 'mtrl-content__description', text: 'Performance utilities like throttle and debounce help optimize event handlers that might fire rapidly.' }],
    [createElement, 'container', { id: 'performanceUtils', class: 'performance-utils-container' }]
  ], body)

  const container = layout.get('container')

  // Create explanation for performance utilities
  const perfExplanation = createElement({
    tag: 'div',
    class: 'event-explanation'
  })

  const explanationText = createElement({
    tag: 'p',
    class: 'event-explanation__text',
    text: 'Performance utilities like throttle and debounce help optimize event handlers that might fire rapidly, such as scroll, resize, or input events.'
  })

  perfExplanation.appendChild(explanationText)

  // Create performance utilities example
  const perfExample = createElement({
    tag: 'div',
    class: 'event-example'
  })

  const exampleTitle = createElement({
    tag: 'h3',
    class: 'event-example__title',
    text: 'Throttle and Debounce'
  })

  const exampleCode = createElement({
    tag: 'pre',
    class: 'event-example__code',
    text: `import { throttle, debounce } from 'mtrl/core/events';

import { createLayout } from 'mtrl-addons'
// Throttle: Limit execution to once per 100ms
events.on('scroll', throttle((e) => {
  updateScrollPosition(e.scrollY);
}, 100));

// Debounce: Only execute after 300ms of inactivity
events.on('input', debounce((e) => {
  searchProducts(e.target.value);
}, 300));`
  })

  // Demo for performance utilities
  const exampleDemo = createElement({
    tag: 'div',
    class: 'event-example__demo'
  })

  const perfDemo = createElement({
    tag: 'div',
    class: 'perf-demo'
  })

  const searchContainer = createElement({
    tag: 'div',
    class: 'search-container'
  })

  const searchLabel = createElement({
    tag: 'label',
    class: 'search-label',
    text: 'Type to search (debounced):'
  })

  const searchInput = createElement({
    tag: 'input',
    class: 'search-input',
    attributes: {
      type: 'text',
      placeholder: 'Type something...'
    }
  })

  const searchResults = createElement({
    tag: 'div',
    class: 'search-results',
    text: 'Results will appear after you stop typing...'
  })

  // Simulate debounced search
  let debounceTimeout
  searchInput.addEventListener('input', (e) => {
    searchResults.textContent = 'Waiting for you to stop typing...'

    clearTimeout(debounceTimeout)
    debounceTimeout = setTimeout(() => {
      const query = e.target.value.trim()
      if (query) {
        searchResults.textContent = `Searching for: "${query}"`
      } else {
        searchResults.textContent = 'Enter a search term'
      }
    }, 500) // 500ms debounce
  })

  searchContainer.appendChild(searchLabel)
  searchContainer.appendChild(searchInput)
  searchContainer.appendChild(searchResults)

  perfDemo.appendChild(searchContainer)
  exampleDemo.appendChild(perfDemo)

  perfExample.appendChild(exampleTitle)
  perfExample.appendChild(exampleCode)
  perfExample.appendChild(exampleDemo)

  container.appendChild(perfExplanation)
  container.appendChild(perfExample)
}
