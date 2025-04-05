import {
  createComponentsSectionLayoutBox
} from '../../../layout'

import {
  createLayout,
  fTabs,
  createElement
} from 'mtrl'

export const initDynamicContent = (container) => {
  const title = 'Dynamic Content'
  const layout = createLayout(createComponentsSectionLayoutBox({ title, class: 'noflex' }), container).component

  // Create tabs
  const tabs = fTabs({
    tabs: [
      { text: 'Information', value: 'info', state: 'active' },
      { text: 'Settings', value: 'settings' },
      { text: 'History', value: 'history' }
    ]
  })

  // Create a content container
  const contentContainer = createElement({
    tag: 'div',
    class: 'mtrl-content__tab-dynamic-content'
  })

  // Function to load content based on selected tab
  const loadContent = (tabValue) => {
    let content = ''

    switch (tabValue) {
      case 'info':
        content = `
          <h3>Product Information</h3>
          <p>This product is designed to help you manage your tasks effectively.</p>
          <ul>
            <li>Easy to use interface</li>
            <li>Cloud synchronization</li>
            <li>Multiple device support</li>
          </ul>
        `
        break
      case 'settings':
        content = `
          <h3>Settings</h3>
          <div class="settings-form">
            <div class="setting-group">
              <label>Notification preferences:</label>
              <select>
                <option>All notifications</option>
                <option>Important only</option>
                <option>None</option>
              </select>
            </div>
            <div class="setting-group">
              <label>Display theme:</label>
              <select>
                <option>System default</option>
                <option>Light</option>
                <option>Dark</option>
              </select>
            </div>
          </div>
        `
        break
      case 'history':
        content = `
          <h3>Recent Activity</h3>
          <div class="history-list">
            <div class="history-item">
              <div class="history-time">Today, 10:24 AM</div>
              <div class="history-description">Settings updated</div>
            </div>
            <div class="history-item">
              <div class="history-time">Yesterday, 3:45 PM</div>
              <div class="history-description">New content added</div>
            </div>
            <div class="history-item">
              <div class="history-time">May 15, 2025, 9:30 AM</div>
              <div class="history-description">Account created</div>
            </div>
          </div>
        `
        break
      default:
        content = '<p>Select a tab to view content.</p>'
    }

    contentContainer.innerHTML = content
  }

  // Listen for tab changes
  tabs.on('change', (e) => {
    loadContent(e.value)
  })

  // Load initial content
  loadContent('info')

  // Add components to the layout
  layout.body.appendChild(tabs.element)
  layout.body.appendChild(contentContainer)
}
