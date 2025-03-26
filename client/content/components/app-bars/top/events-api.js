// src/client/content/components/app-bars/top/events-api.js
import {
  createComponentsSectionLayoutBox
} from '../../../../layout'

import {
  createStructure,
  createTopAppBar,
  createButton
} from 'mtrl'

export const initEventsApiTopAppBar = (container) => {
  const title = 'Events & API Methods'

  const layout = createStructure(createComponentsSectionLayoutBox({
    title,
    class: 'noflex'
  }), container).component

  // Create a demo container
  const demoContainer = document.createElement('div')
  demoContainer.className = 'mtrl-content__top-app-bar-demo'
  demoContainer.style.position = 'relative'
  demoContainer.style.height = '350px'
  demoContainer.style.border = '1px solid var(--mtrl-sys-color-outline-variant)'
  demoContainer.style.borderRadius = '8px'
  demoContainer.style.overflow = 'hidden'
  demoContainer.style.marginBottom = '16px'

  // Create event log container
  const logContainer = document.createElement('div')
  logContainer.className = 'mtrl-content__event-log'
  logContainer.style.position = 'absolute'
  logContainer.style.top = '80px' // Below app bar
  logContainer.style.left = '16px'
  logContainer.style.right = '16px'
  logContainer.style.height = '160px'
  logContainer.style.overflow = 'auto'
  logContainer.style.background = 'var(--mtrl-sys-color-surface-container-high)'
  logContainer.style.borderRadius = '8px'
  logContainer.style.padding = '12px'
  logContainer.style.fontSize = '14px'
  logContainer.style.fontFamily = 'monospace'
  logContainer.innerHTML = '<div class="mtrl-content__log-entries"></div>'

  // Create the top app bar with configuration
  const topBar = createTopAppBar({
    title: 'API & Events Demo',
    type: 'small',
    scrollable: true,
    // Register for scroll events through config
    onScroll: (scrolled) => {
      logEvent(`Scroll state changed: ${scrolled ? 'scrolled' : 'at top'} (via config)`)
    }
  })

  // Create leading navigation button
  const backButton = createButton({
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>',
    variant: 'icon',
    ariaLabel: 'Back'
  })

  // Create trailing action buttons
  const searchButton = createButton({
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>',
    variant: 'icon',
    ariaLabel: 'Search'
  })

  const moreButton = createButton({
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>',
    variant: 'icon',
    ariaLabel: 'More options'
  })

  // Add click event listeners to all buttons
  backButton.on('click', () => {
    logEvent('Back button clicked')
  })

  searchButton.on('click', () => {
    logEvent('Search button clicked')
  })

  moreButton.on('click', () => {
    logEvent('More button clicked')
  })

  // Add elements to the app bar
  topBar.addLeadingElement(backButton.element)
  topBar.addTrailingElement(searchButton.element)
  topBar.addTrailingElement(moreButton.element)

  // Add the bar and log to the demo container
  demoContainer.appendChild(topBar.element)
  demoContainer.appendChild(logContainer)

  // Register for scroll events via on method
  // This demonstrates multiple ways of handling the same event
  if (topBar.on) {
    topBar.on('scroll', (event) => {
      logEvent(`Scroll state changed: ${event.scrolled ? 'scrolled' : 'at top'} (via on method)`)
    })
  }

  // Create API control buttons
  const controlsContainer = document.createElement('div')
  controlsContainer.className = 'mtrl-content__api-controls'
  controlsContainer.style.display = 'flex'
  controlsContainer.style.flexWrap = 'wrap'
  controlsContainer.style.gap = '12px'
  controlsContainer.style.position = 'absolute'
  controlsContainer.style.bottom = '16px'
  controlsContainer.style.left = '16px'
  controlsContainer.style.right = '16px'

  // Create control buttons
  const setTitleButton = createButton({
    text: 'Change Title',
    variant: 'filled'
  })

  const toggleScrollButton = createButton({
    text: 'Toggle Scroll State',
    variant: 'outlined'
  })

  const switchTypeButton = createButton({
    text: 'Switch Type',
    variant: 'outlined'
  })

  // Current state tracking
  let currentTitle = 'API & Events Demo'
  let currentType = 'small'
  const titles = ['API & Events Demo', 'New Title', 'Changed Again']
  const types = ['small', 'medium', 'large', 'center']

  // Add event listeners
  setTitleButton.on('click', () => {
    // Cycle through titles
    const index = (titles.indexOf(currentTitle) + 1) % titles.length
    currentTitle = titles[index]
    topBar.setTitle(currentTitle)
    logEvent(`Title changed to: "${currentTitle}"`)
  })

  toggleScrollButton.on('click', () => {
    // Toggle scroll state
    const newScrollState = !topBar.element.classList.contains(`${topBar.getClass('top-app-bar')}--scrolled`)
    topBar.setScrollState(newScrollState)
    logEvent(`Scroll state set to: ${newScrollState ? 'scrolled' : 'at top'}`)
  })

  switchTypeButton.on('click', () => {
    // Cycle through types
    const index = (types.indexOf(currentType) + 1) % types.length
    currentType = types[index]
    topBar.setType(currentType)
    logEvent(`App bar type changed to: ${currentType}`)
  })

  // Function to log events
  function logEvent (message) {
    const logEntries = document.querySelector('.mtrl-content__log-entries')
    if (!logEntries) return

    const entry = document.createElement('div')
    entry.className = 'mtrl-content__log-entry'
    entry.style.borderBottom = '1px solid var(--mtrl-sys-color-outline-variant)'
    entry.style.paddingBottom = '8px'
    entry.style.marginBottom = '8px'

    const time = new Date().toLocaleTimeString()
    entry.innerHTML = `<span style="color: var(--mtrl-sys-color-primary);">[${time}]</span> ${message}`

    logEntries.insertBefore(entry, logEntries.firstChild)

    // Limit the number of log entries
    if (logEntries.children.length > 10) {
      logEntries.removeChild(logEntries.lastChild)
    }
  }

  // Initialize with a log entry
  logEvent('Top app bar initialized')

  // Add control buttons to container
  controlsContainer.appendChild(setTitleButton.element)
  controlsContainer.appendChild(toggleScrollButton.element)
  controlsContainer.appendChild(switchTypeButton.element)
  demoContainer.appendChild(controlsContainer)

  // Initialize lifecycle
  topBar.lifecycle.mount()

  // Log that the component is mounted
  logEvent('Top app bar mounted')

  // Create a scrollable demo for showing scroll events
  const scrollDemo = document.createElement('div')
  scrollDemo.className = 'mtrl-content__scroll-demo'
  scrollDemo.style.height = '80px'
  scrollDemo.style.marginTop = '12px'
  scrollDemo.style.overflow = 'auto'
  scrollDemo.style.border = '1px solid var(--mtrl-sys-color-outline-variant)'
  scrollDemo.style.borderRadius = '8px'
  scrollDemo.style.marginBottom = '16px'

  const scrollContent = document.createElement('div')
  scrollContent.style.padding = '16px'
  scrollContent.innerHTML = `
    <p style="margin-bottom: 12px;">This is a scrollable area to test scroll events.</p>
    ${Array(10).fill('<p style="margin-bottom: 12px;">Scroll content...</p>').join('')}
  `
  scrollDemo.appendChild(scrollContent)

  // Set up scrolling event for custom scroll demo
  scrollDemo.addEventListener('scroll', () => {
    if (scrollDemo.scrollTop > 0) {
      topBar.setScrollState(true)
    } else {
      topBar.setScrollState(false)
    }
  })

  // Add a description
  const description = document.createElement('div')
  description.className = 'mtrl-content__description'
  description.innerHTML = `
    <p>The Top App Bar provides several API methods and events:</p>
    <ul style="list-style-type: disc; margin-left: 24px; margin-bottom: 16px;">
      <li><strong>Title Management:</strong> Use <code>setTitle()</code> and <code>getTitle()</code> to update or retrieve the current title.</li>
      <li><strong>Scroll Events:</strong> Listen for <code>scroll</code> events to respond to scrolling behavior.</li>
      <li><strong>Type Switching:</strong> Use <code>setType()</code> to change between small, medium, large, or center-aligned variants.</li>
      <li><strong>Element Access:</strong> Methods like <code>getHeadlineElement()</code>, <code>getLeadingContainer()</code>, and <code>getTrailingContainer()</code> provide access to key elements.</li>
    </ul>
    <p>Try scrolling in the demo area above or using the control buttons to see the events and API methods in action.</p>
  `

  // Add to layout
  layout.body.appendChild(demoContainer)
  layout.body.appendChild(scrollDemo)
  layout.body.appendChild(description)
}
