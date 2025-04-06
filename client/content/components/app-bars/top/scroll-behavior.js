// src/client/content/components/app-bars/top/scroll-behavior.js
import {
  createComponentsSectionLayoutBox
} from '../../../../layout'

import {
  fLayout,
  fTopAppBar,
  fButton
} from 'mtrl'

export const initScrollBehaviorTopAppBar = (container) => {
  const title = 'Scroll Behavior'

  const layout = fLayout(createComponentsSectionLayoutBox({
    title,
    class: 'noflex'
  }), container).component

  // Create a demo container with two columns for different scroll behaviors
  const demoContainer = document.createElement('div')
  demoContainer.className = 'mtrl-content__scroll-behaviors'
  demoContainer.style.display = 'flex'
  demoContainer.style.gap = '24px'
  demoContainer.style.marginBottom = '16px'

  // Create the standard scrolling behavior demo
  const standardScrollContainer = createScrollDemo('standard', 'Color Change on Scroll', false)

  // Create the compress effect demo for medium top app bar
  const compressScrollContainer = createScrollDemo('compress', 'Compress Effect', true)

  // Add containers to the demo section
  demoContainer.appendChild(standardScrollContainer)
  demoContainer.appendChild(compressScrollContainer)

  // Add a description
  const description = document.createElement('div')
  description.className = 'mtrl-content__description'
  description.innerHTML = `
    <p>Top app bars have two key scroll behaviors:</p>
    <ul style="list-style-type: disc; margin-left: 24px; margin-bottom: 16px;">
      <li><strong>Color change:</strong> The top app bar fills with a surface container color to create visual separation from content when scrolling.</li>
      <li><strong>Compress effect:</strong> Medium and large app bars can compress to the small size when scrolling down, optimizing screen space.</li>
    </ul>
    <p>These behaviors help maintain context while maximizing content area. The app bar returns to its original state when scrolled back to the top.</p>
  `

  // Add to layout
  layout.body.appendChild(demoContainer)
  layout.body.appendChild(description)
}

/**
 * Creates a demo container showing a specific scroll behavior
 * @param {string} behaviorType - Type of scroll behavior ('standard' or 'compress')
 * @param {string} behaviorTitle - Display name for the behavior
 * @param {boolean} compressible - Whether to make the app bar compressible
 * @returns {HTMLElement} The demo container element
 */
function createScrollDemo (behaviorType, behaviorTitle, compressible) {
  // Create container for this scroll behavior demo
  const container = document.createElement('div')
  container.className = `mtrl-content__scroll-demo mtrl-content__scroll-demo-${behaviorType}`
  container.style.flex = '1'
  container.style.position = 'relative'
  container.style.border = '1px solid var(--mtrl-sys-color-outline-variant)'
  container.style.borderRadius = '8px'
  container.style.overflow = 'hidden'
  container.style.height = '400px'

  // Create the top app bar with appropriate configuration
  const topBar = fTopAppBar({
    title: behaviorTitle,
    type: compressible ? 'medium' : 'small',
    scrollable: true,
    compressible
  })

  // Create leading navigation button
  const backButton = fButton({
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>',
    variant: 'icon',
    ariaLabel: 'Back'
  })

  // Create trailing action button
  const moreButton = fButton({
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>',
    variant: 'icon',
    ariaLabel: 'More options'
  })

  // Add elements to the app bar
  topBar.addLeadingElement(backButton.element)
  topBar.addTrailingElement(moreButton.element)

  // Create scrollable content container
  const scrollContainer = document.createElement('div')
  scrollContainer.className = 'mtrl-content__scroll-container'
  scrollContainer.style.height = '100%'
  scrollContainer.style.overflowY = 'auto'

  // Determine initial content offset based on app bar height
  const appBarHeight = compressible ? '112px' : '64px'
  scrollContainer.style.paddingTop = appBarHeight

  // Create content for scrolling
  const scrollContent = document.createElement('div')
  scrollContent.style.padding = '16px'
  scrollContent.innerHTML = `
    <h3 style="margin-bottom: 16px;">${behaviorTitle}</h3>
    <p style="margin-bottom: 12px;">Scroll down to see the behavior.</p>
    <p style="margin-bottom: 12px;">This demonstrates the ${behaviorType} scroll behavior of the top app bar.</p>
    ${compressible
      ? '<p style="margin-bottom: 12px;">As you scroll down, the medium app bar will compress to a small app bar.</p>'
      : '<p style="margin-bottom: 12px;">As you scroll down, the app bar will change its background color.</p>'}
    <p style="margin-bottom: 24px;">Scroll back to the top to see the app bar return to its original state.</p>
    ${Array(20).fill('<p style="margin-bottom: 12px;">Scroll content...</p>').join('')}
    <p style="margin-bottom: 12px;">You've reached the bottom! Try scrolling back up.</p>
  `
  scrollContainer.appendChild(scrollContent)

  // Add status indicator
  const statusIndicator = document.createElement('div')
  statusIndicator.className = 'mtrl-content__status-indicator'
  statusIndicator.style.position = 'absolute'
  statusIndicator.style.bottom = '12px'
  statusIndicator.style.right = '12px'
  statusIndicator.style.background = 'var(--mtrl-sys-color-surface-container-high)'
  statusIndicator.style.padding = '8px 12px'
  statusIndicator.style.borderRadius = '16px'
  statusIndicator.style.fontSize = '14px'
  statusIndicator.style.fontWeight = '500'
  statusIndicator.style.boxShadow = 'var(--mtrl-sys-elevation-level1)'
  statusIndicator.style.zIndex = '1'
  statusIndicator.innerHTML = 'Status: <span class="status-text">At Top</span>'

  // Listen for scroll state changes
  topBar.on('scroll', (event) => {
    const statusText = statusIndicator.querySelector('.status-text')
    if (statusText) {
      statusText.textContent = event.scrolled ? 'Scrolled' : 'At Top'
      statusText.style.color = event.scrolled
        ? 'var(--mtrl-sys-color-secondary)'
        : 'var(--mtrl-sys-color-primary)'
    }
  })

  // Set up scrolling event for custom scroll container
  scrollContainer.addEventListener('scroll', () => {
    // Forward scroll events to the app bar
    if (scrollContainer.scrollTop > 0) {
      topBar.setScrollState(true)
    } else {
      topBar.setScrollState(false)
    }
  })

  // Add the bar, scroll container and status indicator to the demo container
  container.appendChild(topBar.element)
  container.appendChild(scrollContainer)
  container.appendChild(statusIndicator)

  // Initialize lifecycle
  topBar.lifecycle.mount()

  return container
}
