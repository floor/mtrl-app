import {
  createComponentsSectionLayoutBox
} from '../../../layout'

import {
  createLayout,
  createTabs,
  createButton
} from 'mtrl'

export const initEventsAPI = (container) => {
  const title = 'Events & API Methods'
  const layout = createLayout(createComponentsSectionLayoutBox({ title, class: 'noflex' }), container).component

  // Create tabs with callback handlers
  const tabs = createTabs({
    tabs: [
      { text: 'Dashboard', value: 'dashboard', state: 'active' },
      { text: 'Analytics', value: 'analytics' },
      { text: 'Reports', value: 'reports' }
    ],
    on: {
      // Log changes through the configuration
      change: (event) => {
        logEvent(`Tab changed to: ${event.value}`)
      }
    }
  })

  // Create a log container
  const logContainer = document.createElement('div')
  logContainer.className = 'mtrl-content__event-log'
  logContainer.innerHTML = '<h4>Event Log</h4><div class="log-entries"></div>'

  // Create API example controls
  const apiControlsContainer = document.createElement('div')
  apiControlsContainer.className = 'mtrl-content__api-controls'

  // Add a button to get active tab
  const getActiveButton = createButton({
    text: 'Get Active Tab',
    variant: 'outlined'
  })

  // Add a button to disable tabs
  const disableTabButton = createButton({
    text: 'Disable Reports Tab',
    variant: 'outlined'
  })

  // Add a button to enable tabs
  const enableTabButton = createButton({
    text: 'Enable Reports Tab',
    variant: 'outlined'
  })

  // Add a button to add badge
  const addBadgeButton = createButton({
    text: 'Add Badge to Analytics',
    variant: 'outlined'
  })

  // Function to log events
  function logEvent (message) {
    const logEntries = logContainer.querySelector('.log-entries')
    const entry = document.createElement('div')
    entry.className = 'log-entry'

    const time = new Date().toLocaleTimeString()
    entry.innerHTML = `<span class="log-time">${time}</span> ${message}`

    logEntries.insertBefore(entry, logEntries.firstChild)

    // Limit the number of log entries
    if (logEntries.children.length > 5) {
      logEntries.removeChild(logEntries.lastChild)
    }
  }

  // Also register for change events directly through the on method
  tabs.on('change', (event) => {
    // This will display along with the handler registered in the config
    console.log(`Tab changed event: ${event.value}`)
  })

  // Set up button event handlers
  getActiveButton.on('click', () => {
    const activeTab = tabs.getActiveTab()
    logEvent(`Active tab: ${activeTab ? activeTab.getValue() : 'none'}`)
  })

  disableTabButton.on('click', () => {
    const allTabs = tabs.getTabs()
    const reportsTab = allTabs.find(tab => tab.getValue() === 'reports')

    if (reportsTab) {
      reportsTab.disable()
      logEvent('Reports tab disabled')
    }
  })

  enableTabButton.on('click', () => {
    const allTabs = tabs.getTabs()
    const reportsTab = allTabs.find(tab => tab.getValue() === 'reports')

    if (reportsTab) {
      reportsTab.enable()
      logEvent('Reports tab enabled')
    }
  })

  addBadgeButton.on('click', () => {
    const allTabs = tabs.getTabs()
    const analyticsTab = allTabs.find(tab => tab.getValue() === 'analytics')

    if (analyticsTab) {
      analyticsTab.setBadge('3')
      logEvent('Badge added to Analytics tab')
    }
  })

  // Add components to the layout
  apiControlsContainer.appendChild(getActiveButton.element)
  apiControlsContainer.appendChild(disableTabButton.element)
  apiControlsContainer.appendChild(enableTabButton.element)
  apiControlsContainer.appendChild(addBadgeButton.element)

  layout.body.appendChild(tabs.element)
  layout.body.appendChild(apiControlsContainer)
  layout.body.appendChild(logContainer)
}
