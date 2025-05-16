import {
  createLayout,
  createElement,
  throttle
} from 'mtrl'

export const initThrottle = (body) => {
  const layout = createLayout([createElement, { tag: 'section', class: 'mtrl-content__section' },
    [createElement, { tag: 'h2', class: 'mtrl-content__section-title', text: 'Throttle Utility' }],
    [createElement, { tag: 'p', class: 'mtrl-content__description', text: 'Throttle limits the execution frequency of a function, ensuring it runs at most once per specified time period.' }],
    [createElement, 'container', { id: 'throttleDemo', class: 'throttle-demo-container' }]
  ], body)

  const container = layout.get('container')

  // Create explanation for throttle utility
  const throttleExplanation = createElement({
    tag: 'div',
    class: 'throttle-explanation'
  })

  const explanationText = createElement({
    tag: 'p',
    class: 'throttle-explanation__text',
    text: 'Throttling is useful for limiting the rate of execution for expensive operations that might be triggered by high-frequency events like scrolling, resizing, or mouse movements.'
  })

  const bestPracticesText = createElement({
    tag: 'p',
    class: 'throttle-explanation__best-practices',
    text: 'Best used for: scroll events, mouse movement, window resizing, and other continuous events where you need regular updates.'
  })

  throttleExplanation.appendChild(explanationText)
  throttleExplanation.appendChild(bestPracticesText)

  // Create throttle example
  const throttleExample = createElement({
    tag: 'div',
    class: 'throttle-example'
  })

  const exampleTitle = createElement({
    tag: 'h3',
    class: 'throttle-example__title',
    text: 'Throttle Example'
  })

  const exampleCode = createElement({
    tag: 'pre',
    class: 'throttle-example__code',
    text: `import { throttle } from 'mtrl';

// Create a throttled scroll handler
// Will execute at most once every 100ms
const handleScroll = throttle(() => {
  const scrollY = window.scrollY;
  updateScrollIndicator(scrollY);
}, 100);

// Add event listener
window.addEventListener('scroll', handleScroll);

// With options (leading: false will delay first execution)
const handleMouseMove = throttle((e) => {
  updateMousePosition(e.clientX, e.clientY);
}, 50, { leading: true, trailing: true });

element.addEventListener('mousemove', handleMouseMove);`
  })

  // Interactive demo for throttle
  const demoContainer = createElement({
    tag: 'div',
    class: 'throttle-demo__interactive'
  })

  const demoTitle = createElement({
    tag: 'h4',
    class: 'throttle-demo__interactive-title',
    text: 'Interactive Demo'
  })

  const demoDescription = createElement({
    tag: 'p',
    class: 'throttle-demo__interactive-description',
    text: 'Move your mouse inside the box below. Notice how the regular counter updates on every movement, while the throttled counter updates at most once every 500ms.'
  })

  // Create tracking boxes
  const trackingBox = createElement({
    tag: 'div',
    class: 'throttle-tracking-box',
    attributes: {
      tabindex: '0', // Make focusable for accessibility
      role: 'region',
      'aria-label': 'Mouse tracking area for throttle demonstration'
    }
  })

  const countersContainer = createElement({
    tag: 'div',
    class: 'throttle-counters'
  })

  // Regular counter
  const regularCounterContainer = createElement({
    tag: 'div',
    class: 'throttle-counter-container'
  })

  const regularCounterLabel = createElement({
    tag: 'span',
    class: 'throttle-counter-label',
    text: 'Regular events: '
  })

  const regularCounter = createElement({
    tag: 'span',
    class: 'throttle-counter regular',
    text: '0'
  })

  regularCounterContainer.appendChild(regularCounterLabel)
  regularCounterContainer.appendChild(regularCounter)

  // Throttled counter
  const throttledCounterContainer = createElement({
    tag: 'div',
    class: 'throttle-counter-container'
  })

  const throttledCounterLabel = createElement({
    tag: 'span',
    class: 'throttle-counter-label',
    text: 'Throttled events: '
  })

  const throttledCounter = createElement({
    tag: 'span',
    class: 'throttle-counter throttled',
    text: '0'
  })

  throttledCounterContainer.appendChild(throttledCounterLabel)
  throttledCounterContainer.appendChild(throttledCounter)

  // Add coordinate display
  const coordinatesDisplay = createElement({
    tag: 'div',
    class: 'throttle-coordinates'
  })

  countersContainer.appendChild(regularCounterContainer)
  countersContainer.appendChild(throttledCounterContainer)
  countersContainer.appendChild(coordinatesDisplay)

  // Initialize counters and event handlers
  let regularCount = 0
  let throttledCount = 0

  // Create regular handler
  const handleMouseMove = (e) => {
    const rect = trackingBox.getBoundingClientRect()
    const x = Math.round(e.clientX - rect.left)
    const y = Math.round(e.clientY - rect.top)

    // Update regular counter
    regularCount++
    regularCounter.textContent = regularCount

    // Update coordinates
    coordinatesDisplay.textContent = `Position: (${x}, ${y})`

    // Add highlight effect
    regularCounter.classList.add('highlight')
    setTimeout(() => regularCounter.classList.remove('highlight'), 50)
  }

  // Create throttled handler
  const handleThrottledMouseMove = throttle((e) => {
    // Update throttled counter
    throttledCount++
    throttledCounter.textContent = throttledCount

    // Add highlight effect
    throttledCounter.classList.add('highlight')
    setTimeout(() => throttledCounter.classList.remove('highlight'), 250)
  }, 500) // Throttle to once every 500ms

  // Add event listeners
  trackingBox.addEventListener('mousemove', (e) => {
    handleMouseMove(e)
    handleThrottledMouseMove(e)
  })

  // Add reset button
  const resetButton = createElement({
    tag: 'button',
    class: 'throttle-reset-button',
    text: 'Reset Counters'
  })

  resetButton.addEventListener('click', () => {
    regularCount = 0
    throttledCount = 0
    regularCounter.textContent = '0'
    throttledCounter.textContent = '0'
    coordinatesDisplay.textContent = 'Position: (0, 0)'
  })

  // Assemble the demo
  demoContainer.appendChild(demoTitle)
  demoContainer.appendChild(demoDescription)
  demoContainer.appendChild(trackingBox)
  demoContainer.appendChild(countersContainer)
  demoContainer.appendChild(resetButton)

  throttleExample.appendChild(exampleTitle)
  throttleExample.appendChild(exampleCode)
  throttleExample.appendChild(demoContainer)

  // Add everything to container
  container.appendChild(throttleExplanation)
  container.appendChild(throttleExample)
}
