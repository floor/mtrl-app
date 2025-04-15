// src/client/content/components/app-bars/top/basic.js
import {
  createComponentsSectionLayoutBox
} from '../../../../layout'

import {
  createLayout,
  createTopAppBar,
  createButton
} from 'mtrl'

export const initBasicTopAppBar = (container) => {
  const title = 'Basic Top App Bar'

  const layout = createLayout(createComponentsSectionLayoutBox({ title, class: 'noflex' }), container).component

  // Create a demo content container
  const demoContainer = document.createElement('div')
  demoContainer.className = 'mtrl-content__top-app-bar-demo'
  demoContainer.style.position = 'relative'
  demoContainer.style.height = '300px'
  demoContainer.style.border = '1px solid var(--mtrl-sys-color-outline-variant)'
  demoContainer.style.borderRadius = '8px'
  demoContainer.style.overflow = 'hidden'
  demoContainer.style.marginBottom = '16px'

  // Create the top app bar with default configuration
  const topBar = createTopAppBar({
    title: 'Page Title',
    type: 'small'
  })

  // Create leading navigation button (back button)
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

  // Add elements to the app bar
  topBar.addLeadingElement(backButton.element)
  topBar.addTrailingElement(searchButton.element)
  topBar.addTrailingElement(moreButton.element)

  // Content area below the app bar
  const contentArea = document.createElement('div')
  contentArea.className = 'mtrl-content__app-bar-content'
  contentArea.style.padding = '16px'
  contentArea.style.height = 'calc(100% - 64px)' // Account for top app bar height
  contentArea.style.overflowY = 'auto'
  contentArea.innerHTML = `
    <p style="margin-bottom: 12px;">This is a simple top app bar with:</p>
    <ul style="list-style-type: disc; margin-left: 24px; margin-bottom: 16px;">
      <li>A leading back navigation button</li>
      <li>A page title</li>
      <li>Trailing action buttons (search and more)</li>
    </ul>
    <p style="margin-top: 16px; color: var(--mtrl-sys-color-on-surface-variant);">Content area below the top app bar</p>
  `

  // Add the bar and content to the demo container
  demoContainer.appendChild(topBar.element)
  demoContainer.appendChild(contentArea)

  // Initialize lifecycle
  topBar.lifecycle.mount()

  // Add a description
  const description = document.createElement('div')
  description.className = 'mtrl-content__description'
  description.innerHTML = `
    <p>The small top app bar is the standard top app bar for most use cases. It has a default height of 64dp and includes:</p>
    <ul style="list-style-type: disc; margin-left: 24px; margin-bottom: 16px;">
      <li><strong>Leading navigation icon:</strong> Usually a back or menu button, depending on screen context</li>
      <li><strong>Title:</strong> Showing the current screen name or app title</li>
      <li><strong>Trailing actions:</strong> Common actions for the current screen</li>
    </ul>
    <p>The top app bar remains visible as users scroll, providing consistent access to navigation and actions.</p>
  `

  // Add to layout
  layout.body.appendChild(demoContainer)
  layout.body.appendChild(description)
}
