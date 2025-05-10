// src/client/content/components/app-bars/bottom/basic.js
import {
  createComponentSection
} from '../../../../layout'

import {
  createLayout,
  createBottomAppBar,
  createButton
} from 'mtrl'

export const initBasicBottomAppBar = (container) => {
  const title = 'Basic Bottom App Bar'

  const layout = createLayout(createComponentSection({ title, class: 'noflex' }), container).component

  // Create a demo content container
  const demoContainer = document.createElement('div')
  demoContainer.className = 'mtrl-content__bottom-app-bar-demo'
  demoContainer.style.position = 'relative'
  demoContainer.style.height = '300px'
  demoContainer.style.border = '1px solid var(--mtrl-sys-color-outline-variant)'
  demoContainer.style.borderRadius = '8px'
  demoContainer.style.overflow = 'hidden'
  demoContainer.style.marginBottom = '16px'

  // Background text to show it's a demo
  const demoContent = document.createElement('div')
  demoContent.className = 'mtrl-content__demo-text'
  demoContent.innerHTML = `
    <div style="padding: 16px; text-align: center;">
      <p>Basic bottom app bar with action buttons</p>
      <p style="margin-top: 100px; color: var(--mtrl-sys-color-on-surface-variant);">Demo content area</p>
    </div>
  `
  demoContainer.appendChild(demoContent)

  // Create the bottom app bar
  const bottomBar = createBottomAppBar()

  // Create action buttons
  const searchButton = createButton({
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>',
    variant: 'icon',
    ariaLabel: 'Search'
  })

  const favoriteButton = createButton({
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>',
    variant: 'icon',
    ariaLabel: 'Favorite'
  })

  const shareButton = createButton({
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>',
    variant: 'icon',
    ariaLabel: 'Share'
  })

  const settingsButton = createButton({
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>',
    variant: 'icon',
    ariaLabel: 'Settings'
  })

  // Add action buttons to the bar
  bottomBar.addAction(searchButton.element)
  bottomBar.addAction(favoriteButton.element)
  bottomBar.addAction(shareButton.element)
  bottomBar.addAction(settingsButton.element)

  // Add the bar to the demo container
  demoContainer.appendChild(bottomBar.element)

  // Initialize lifecycle
  bottomBar.lifecycle.mount()

  // Add a description
  const description = document.createElement('div')
  description.className = 'mtrl-content__description'
  description.innerHTML = `
    <p>Basic bottom app bar with four action buttons. The bottom app bar provides easy access to key actions on mobile devices, optimizing for thumb reach.</p>
    <p>This example shows a standard implementation with icon buttons for common actions.</p>
  `

  // Add to layout
  layout.showcase.appendChild(demoContainer)
  layout.info.appendChild(description)
}
