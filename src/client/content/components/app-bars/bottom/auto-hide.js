// src/client/content/components/app-bars/bottom/auto-hide.js
import {
  createComponentsSectionLayoutBox
} from '../../../../layout'

import {
  FAB_VARIANTS
} from 'mtrl/src/components/fab'

import {
  createLayout,
  createBottomAppBar,
  createButton,
  createFab
} from 'mtrl'

export const initAutoHideBottomAppBar = (container) => {
  const title = 'Auto-Hide on Scroll'

  const layout = createLayout(createComponentsSectionLayoutBox({
    title,
    class: 'noflex'
  }), container).component

  // Create a demo container with scrollable content
  const demoContainer = document.createElement('div')
  demoContainer.className = 'mtrl-content__bottom-app-bar-scroll-demo'
  demoContainer.style.position = 'relative'
  demoContainer.style.height = '400px'
  demoContainer.style.border = '1px solid var(--mtrl-sys-color-outline-variant)'
  demoContainer.style.borderRadius = '8px'
  demoContainer.style.overflow = 'hidden'
  demoContainer.style.marginBottom = '16px'

  // Create scrollable content container
  const scrollContainer = document.createElement('div')
  scrollContainer.className = 'mtrl-content__scroll-container'
  scrollContainer.style.height = '100%'
  scrollContainer.style.overflowY = 'auto'
  scrollContainer.style.padding = '16px'

  // Add scrollable content
  const scrollContent = document.createElement('div')
  scrollContent.innerHTML = `
    <h3 style="margin-bottom: 16px;">Scroll down to see auto-hide behavior</h3>
    <p style="margin-bottom: 12px;">When you scroll down, the bottom app bar will hide automatically.</p>
    <p style="margin-bottom: 12px;">When you scroll back up, it will reappear.</p>
    <p style="margin-bottom: 12px;">This behavior optimizes screen space for content while keeping actions accessible when needed.</p>
    ${Array(20).fill('<p style="margin-bottom: 12px;">Scroll content...</p>').join('')}
    <p style="margin-bottom: 12px;">You've reached the bottom! Try scrolling back up.</p>
  `
  scrollContainer.appendChild(scrollContent)
  demoContainer.appendChild(scrollContainer)

  // Create status indicator
  const statusIndicator = document.createElement('div')
  statusIndicator.className = 'mtrl-content__status-indicator'
  statusIndicator.style.position = 'absolute'
  statusIndicator.style.top = '12px'
  statusIndicator.style.right = '12px'
  statusIndicator.style.background = 'var(--mtrl-sys-color-surface-container-high)'
  statusIndicator.style.padding = '8px 12px'
  statusIndicator.style.borderRadius = '16px'
  statusIndicator.style.fontSize = '14px'
  statusIndicator.style.fontWeight = '500'
  statusIndicator.style.boxShadow = 'var(--mtrl-sys-elevation-level1)'
  statusIndicator.style.zIndex = '1'
  statusIndicator.innerHTML = 'Status: <span class="status-text">Visible</span>'
  demoContainer.appendChild(statusIndicator)

  // Create the bottom app bar with auto-hide enabled
  const bottomBar = createBottomAppBar({
    autoHide: true,
    transitionDuration: 300,
    onVisibilityChange: (visible) => {
      // Update status indicator
      const statusText = statusIndicator.querySelector('.status-text')
      statusText.textContent = visible ? 'Visible' : 'Hidden'
      statusText.style.color = visible
        ? 'var(--mtrl-sys-color-primary)'
        : 'var(--mtrl-sys-color-error)'
    }
  })

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

  // Create a FAB using the dedicated FAB component
  const fab = createFab({
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>',
    ariaLabel: 'Add new item',
    variant: FAB_VARIANTS.PRIMARY
  })

  // Add actions and FAB to the bottom bar
  bottomBar.addAction(searchButton.element)
  bottomBar.addAction(favoriteButton.element)
  bottomBar.addAction(shareButton.element)
  bottomBar.addFab(fab.element)

  // Add the bar to the demo container
  demoContainer.appendChild(bottomBar.element)

  // Initialize lifecycle
  bottomBar.lifecycle.mount()

  // Create a mock scroll event handler for the demo
  // This allows the bottom bar to respond to scrolling inside the container
  scrollContainer.addEventListener('scroll', () => {
    // Keep track of scroll position
    if (!scrollContainer._lastScrollTop) {
      scrollContainer._lastScrollTop = 0
    }

    const currentScrollTop = scrollContainer.scrollTop

    // Determine if scrolling down or up
    if (currentScrollTop > scrollContainer._lastScrollTop + 10) {
      // Scrolling down - hide
      bottomBar.hide()
    } else if (currentScrollTop < scrollContainer._lastScrollTop - 10) {
      // Scrolling up - show
      bottomBar.show()
    }

    // Save current position
    scrollContainer._lastScrollTop = currentScrollTop
  })

  // Add a description
  const description = document.createElement('div')
  description.className = 'mtrl-content__description'
  description.innerHTML = `
    <p>This example demonstrates the auto-hide behavior of the bottom app bar during scrolling:</p>
    <ul style="list-style-type: disc; margin-left: 24px; margin-bottom: 16px;">
      <li>Scrolling <strong>down</strong> hides the bottom app bar to maximize content area.</li>
      <li>Scrolling <strong>up</strong> reveals the bottom app bar again.</li>
      <li>The transition between states is animated for a smooth user experience.</li>
    </ul>
    <p>This pattern is useful for content-heavy applications where maximizing screen space is important.</p>
  `

  // Add to layout
  layout.body.appendChild(demoContainer)
  layout.body.appendChild(description)
}
