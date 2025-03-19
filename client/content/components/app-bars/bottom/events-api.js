// src/client/content/components/app-bars/bottom/events-api.js
import {
  createComponentsSectionLayoutBox
} from '../../../../layout'

import {
  createLayout,
  createBottomAppBar,
  createButton,
  createFab
} from 'mtrl'

/**
 * FAB variants for styling
 */
export const FAB_VARIANTS = {
  /** Primary container color with on-primary-container icons */
  PRIMARY: 'primary',
  /** Secondary container color with on-secondary-container icons */
  SECONDARY: 'secondary',
  /** Tertiary container color with on-tertiary-container icons */
  TERTIARY: 'tertiary',
  /** Surface color with primary color icons */
  SURFACE: 'surface'
}

export const initEventsApiBottomAppBar = (container) => {
  const title = 'Events & API Methods'

  const layout = createLayout(createComponentsSectionLayoutBox({
    title,
    class: 'noflex'
  }), container).component

  // Create a demo container
  const demoContainer = document.createElement('div')
  demoContainer.className = 'mtrl-content__bottom-app-bar-demo'
  demoContainer.style.position = 'relative'
  demoContainer.style.height = '300px'
  demoContainer.style.border = '1px solid var(--mtrl-sys-color-outline-variant)'
  demoContainer.style.borderRadius = '8px'
  demoContainer.style.overflow = 'hidden'
  demoContainer.style.marginBottom = '16px'

  // Create event log container
  const logContainer = document.createElement('div')
  logContainer.className = 'mtrl-content__event-log'
  logContainer.style.position = 'absolute'
  logContainer.style.top = '16px'
  logContainer.style.left = '16px'
  logContainer.style.right = '16px'
  logContainer.style.maxHeight = '200px'
  logContainer.style.overflow = 'auto'
  logContainer.style.background = 'var(--mtrl-sys-color-surface-container-high)'
  logContainer.style.borderRadius = '8px'
  logContainer.style.padding = '12px'
  logContainer.style.fontSize = '14px'
  logContainer.style.fontFamily = 'monospace'
  logContainer.innerHTML = '<div class="mtrl-content__log-entries"></div>'
  demoContainer.appendChild(logContainer)

  // Create the bottom app bar with configuration
  const bottomBar = createBottomAppBar({
    hasFab: true,
    autoHide: true,
    transitionDuration: 300,
    // Register for visibility change events through config
    onVisibilityChange: (visible) => {
      logEvent(`Visibility changed: ${visible ? 'visible' : 'hidden'} (via config)`)
    }
  })

  // Create action buttons
  const homeButton = createButton({
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>',
    variant: 'icon',
    ariaLabel: 'Home'
  })

  const searchButton = createButton({
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>',
    variant: 'icon',
    ariaLabel: 'Search'
  })

  const notificationButton = createButton({
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>',
    variant: 'icon',
    ariaLabel: 'Notifications'
  })

  // Create a FAB using the proper FAB component
  const fab = createFab({
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>',
    ariaLabel: 'Add new item',
    variant: FAB_VARIANTS.PRIMARY
  })

  // Add click event listeners to all buttons
  homeButton.on('click', () => {
    logEvent('Home button clicked')
  })

  searchButton.on('click', () => {
    logEvent('Search button clicked')
  })

  notificationButton.on('click', () => {
    logEvent('Notification button clicked')
  })

  fab.on('click', () => {
    logEvent('FAB clicked - Primary action')
  })

  // Add actions and FAB to the bottom bar
  bottomBar.addAction(homeButton.element)
  bottomBar.addAction(searchButton.element)
  bottomBar.addAction(notificationButton.element)
  bottomBar.addFab(fab.element)

  // Add the bar to the demo container
  demoContainer.appendChild(bottomBar.element)

  // Register for visibility change events via on method
  // This demonstrates multiple ways of handling the same event
  if (bottomBar.on) {
    bottomBar.on('visibilityChange', (event) => {
      logEvent(`Visibility changed: ${event.visible ? 'visible' : 'hidden'} (via on method)`)
    })
  }

  // Create API control buttons
  const controlsContainer = document.createElement('div')
  controlsContainer.className = 'mtrl-content__api-controls'
  controlsContainer.style.display = 'flex'
  controlsContainer.style.flexWrap = 'wrap'
  controlsContainer.style.gap = '12px'
  controlsContainer.style.marginBottom = '16px'

  // Toggle visibility button
  const toggleVisibilityButton = createButton({
    text: 'Toggle Visibility',
    variant: 'filled'
  })

  // Check visibility button
  const checkVisibilityButton = createButton({
    text: 'Check Visibility',
    variant: 'outlined'
  })

  // Simulate scroll button (to trigger auto-hide)
  const simulateScrollButton = createButton({
    text: 'Simulate Scroll',
    variant: 'outlined'
  })

  // Add event listeners
  toggleVisibilityButton.on('click', () => {
    if (bottomBar.isVisible()) {
      bottomBar.hide()
    } else {
      bottomBar.show()
    }
    logEvent(`Visibility manually toggled to: ${bottomBar.isVisible() ? 'visible' : 'hidden'}`)
  })

  checkVisibilityButton.on('click', () => {
    logEvent(`Current visibility state: ${bottomBar.isVisible() ? 'visible' : 'hidden'}`)
  })

  simulateScrollButton.on('click', () => {
    // Simulate a scroll event sequence
    logEvent('Simulating scroll down...')

    // First hide (simulate scroll down)
    bottomBar.hide()

    // Then after delay, show again (simulate scroll up)
    setTimeout(() => {
      logEvent('Simulating scroll up...')
      bottomBar.show()
    }, 1500)
  })

  // Function to log events
  function logEvent (message) {
    const logEntries = logContainer.querySelector('.mtrl-content__log-entries')
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
  logEvent('Bottom app bar initialized')

  // Initialize lifecycle
  bottomBar.lifecycle.mount()

  // Log that the component is mounted
  logEvent('Bottom app bar mounted')

  // Add control buttons to container
  controlsContainer.appendChild(toggleVisibilityButton.element)
  controlsContainer.appendChild(checkVisibilityButton.element)
  controlsContainer.appendChild(simulateScrollButton.element)

  // Add a description
  const description = document.createElement('div')
  description.className = 'mtrl-content__description'
  description.innerHTML = `
    <p>The Bottom App Bar provides several API methods and events:</p>
    <ul style="list-style-type: disc; margin-left: 24px; margin-bottom: 16px;">
      <li><strong>Events:</strong> Listen for events like <code>visibilityChange</code> to react to bar state changes.</li>
      <li><strong>API Methods:</strong> Use methods like <code>show()</code>, <code>hide()</code>, and <code>isVisible()</code> to control the bar.</li>
      <li><strong>Configuration Callbacks:</strong> Provide callback functions in the initial configuration for key events.</li>
    </ul>
    <p>The event system allows you to respond to user interactions and state changes in a flexible way.</p>
  `

  // Add everything to layout
  layout.body.appendChild(demoContainer)
  layout.body.appendChild(controlsContainer)
  layout.body.appendChild(description)
}
