// src/client/content/components/app-bars/top/responsive.js
import {
  createComponentsSectionLayoutBox
} from '../../../../layout'

import {
  createLayout,
  createTopAppBar,
  fButton
} from 'mtrl'

export const initResponsiveTopAppBar = (container) => {
  const title = 'Responsive Behavior'

  const layout = createLayout(createComponentsSectionLayoutBox({
    title,
    class: 'noflex'
  }), container).component

  // Create a demo container
  const demoContainer = document.createElement('div')
  demoContainer.className = 'mtrl-content__responsive-demo'
  demoContainer.style.position = 'relative'
  demoContainer.style.height = '400px'
  demoContainer.style.border = '1px solid var(--mtrl-sys-color-outline-variant)'
  demoContainer.style.borderRadius = '8px'
  demoContainer.style.overflow = 'hidden'
  demoContainer.style.marginBottom = '16px'

  // Create the top app bar
  const topBar = createTopAppBar({
    title: 'Responsive App Bar',
    type: 'small'
  })

  // Create leading navigation button
  const menuButton = fButton({
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>',
    variant: 'icon',
    ariaLabel: 'Menu'
  })

  // Create trailing action buttons
  const searchButton = fButton({
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>',
    variant: 'icon',
    ariaLabel: 'Search'
  })

  const favoriteButton = fButton({
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>',
    variant: 'icon',
    ariaLabel: 'Favorite'
  })

  const shareButton = fButton({
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>',
    variant: 'icon',
    ariaLabel: 'Share'
  })

  const moreButton = fButton({
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>',
    variant: 'icon',
    ariaLabel: 'More options'
  })

  // Add elements to the app bar
  topBar.addLeadingElement(menuButton.element)
  topBar.addTrailingElement(searchButton.element)
  topBar.addTrailingElement(favoriteButton.element)
  topBar.addTrailingElement(shareButton.element)
  topBar.addTrailingElement(moreButton.element)

  // Content area below the app bar
  const contentArea = document.createElement('div')
  contentArea.className = 'mtrl-content__app-bar-content'
  contentArea.style.padding = '16px'
  contentArea.style.height = 'calc(100% - 64px)' // Account for top app bar height
  contentArea.style.overflowY = 'auto'

  // Create responsive demo controls
  const controlsSection = document.createElement('div')
  controlsSection.className = 'mtrl-content__responsive-controls'
  controlsSection.style.marginBottom = '24px'

  // Create width slider control
  const widthControl = document.createElement('div')
  widthControl.style.marginBottom = '16px'
  widthControl.innerHTML = `
    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
      <label for="width-slider" style="font-weight: 500;">Simulate screen width:</label>
      <span id="width-value">100%</span>
    </div>
    <input type="range" id="width-slider" min="30" max="100" value="100" style="width: 100%;">
  `

  // Create display of current width
  const currentWidth = document.createElement('div')
  currentWidth.style.padding = '8px 12px'
  currentWidth.style.background = 'var(--mtrl-sys-color-surface-container)'
  currentWidth.style.borderRadius = '8px'
  currentWidth.style.fontSize = '14px'
  currentWidth.style.marginBottom = '16px'
  currentWidth.id = 'current-width-display'
  currentWidth.textContent = 'Current simulated width: 100%'

  // Explanation of responsive behavior
  const responsiveExplanation = document.createElement('div')
  responsiveExplanation.style.fontSize = '14px'
  responsiveExplanation.style.color = 'var(--mtrl-sys-color-on-surface-variant)'
  responsiveExplanation.innerHTML = `
    <p style="margin-bottom: 12px;">
      As the screen width decreases:
    </p>
    <ul style="list-style-type: disc; margin-left: 24px; margin-bottom: 16px;">
      <li>Actions are consolidated into the overflow menu</li>
      <li>The title may be shortened to fit the available space</li>
    </ul>
  `

  // Add controls to section
  controlsSection.appendChild(widthControl)
  controlsSection.appendChild(currentWidth)
  controlsSection.appendChild(responsiveExplanation)

  // Add controls to content area
  contentArea.appendChild(controlsSection)

  // Visualization of actions
  const actionsSection = document.createElement('div')
  actionsSection.className = 'mtrl-content__actions-status'
  actionsSection.style.marginBottom = '16px'

  actionsSection.innerHTML = `
    <h3 style="margin-bottom: 12px;">Visible Actions</h3>
    <div id="visible-actions" style="display: flex; gap: 8px; margin-bottom: 16px;">
      <div class="action-indicator" data-action="search" style="padding: 8px 12px; background: var(--mtrl-sys-color-primary-container); border-radius: 8px; color: var(--mtrl-sys-color-on-primary-container);">Search</div>
      <div class="action-indicator" data-action="favorite" style="padding: 8px 12px; background: var(--mtrl-sys-color-primary-container); border-radius: 8px; color: var(--mtrl-sys-color-on-primary-container);">Favorite</div>
      <div class="action-indicator" data-action="share" style="padding: 8px 12px; background: var(--mtrl-sys-color-primary-container); border-radius: 8px; color: var(--mtrl-sys-color-on-primary-container);">Share</div>
      <div class="action-indicator" data-action="more" style="padding: 8px 12px; background: var(--mtrl-sys-color-primary-container); border-radius: 8px; color: var(--mtrl-sys-color-on-primary-container);">More</div>
    </div>
    
    <h3 style="margin-bottom: 12px;">Overflow Menu</h3>
    <div id="overflow-menu" style="display: flex; flex-direction: column; gap: 8px; padding: 8px; background: var(--mtrl-sys-color-surface-container); border-radius: 8px;">
      <p style="font-style: italic; color: var(--mtrl-sys-color-on-surface-variant);">No actions in overflow menu</p>
    </div>
  `

  contentArea.appendChild(actionsSection)

  // Add the bar and content to the demo container
  demoContainer.appendChild(topBar.element)
  demoContainer.appendChild(contentArea)

  // Initialize lifecycle
  topBar.lifecycle.mount()

  // Wire up the width slider
  const widthSlider = document.getElementById('width-slider')
  const widthValue = document.getElementById('width-value')
  const widthDisplay = document.getElementById('current-width-display')
  const visibleActions = document.getElementById('visible-actions')
  const overflowMenu = document.getElementById('overflow-menu')

  if (widthSlider && widthValue && widthDisplay) {
    // Set up initial app bar width
    topBar.element.style.width = '100%'

    // Update width when slider changes
    widthSlider.addEventListener('input', (e) => {
      const width = e.target.value

      // Update displayed values
      widthValue.textContent = width + '%'
      widthDisplay.textContent = `Current simulated width: ${width}%`

      // Update app bar width
      topBar.element.style.width = width + '%'

      // Simulate responsive behavior based on width
      simulateResponsiveBehavior(width)
    })
  }

  // Function to simulate responsive behavior of the app bar
  function simulateResponsiveBehavior (width) {
    // Get all action indicators
    const actionElements = visibleActions.querySelectorAll('.action-indicator')

    if (!actionElements.length) return

    // Update overflow menu display message
    overflowMenu.innerHTML = '<p style="font-style: italic; color: var(--mtrl-sys-color-on-surface-variant);">No actions in overflow menu</p>'

    // Show or hide actions based on width breakpoints
    if (width <= 40) {
      // Only show the more button at very small widths
      actionElements.forEach(action => {
        if (action.dataset.action !== 'more') {
          action.style.display = 'none'
          addToOverflow(action.dataset.action)
        }
      })
    } else if (width <= 60) {
      // Show more and search at small-medium widths
      actionElements.forEach(action => {
        if (action.dataset.action === 'more' || action.dataset.action === 'search') {
          action.style.display = 'block'
        } else {
          action.style.display = 'none'
          addToOverflow(action.dataset.action)
        }
      })
    } else if (width <= 80) {
      // Hide only share at medium widths
      actionElements.forEach(action => {
        if (action.dataset.action === 'share') {
          action.style.display = 'none'
          addToOverflow(action.dataset.action)
        } else {
          action.style.display = 'block'
        }
      })
    } else {
      // Show all at large widths
      actionElements.forEach(action => {
        action.style.display = 'block'
      })
    }

    // Also update the app bar title with ellipsis as needed
    if (width <= 60) {
      topBar.setTitle('Respon...')
    } else {
      topBar.setTitle('Responsive App Bar')
    }
  }

  // Helper function to add an action to the overflow menu visualization
  function addToOverflow (actionName) {
    // Only proceed if we have overflow menu and the action isn't already there
    if (!overflowMenu) return

    // Clear the default message
    if (overflowMenu.querySelector('p')) {
      overflowMenu.innerHTML = ''
    }

    // Create action entry in overflow
    const actionItem = document.createElement('div')
    actionItem.className = 'overflow-action'
    actionItem.style.padding = '8px 12px'
    actionItem.style.background = 'var(--mtrl-sys-color-secondary-container)'
    actionItem.style.borderRadius = '4px'
    actionItem.style.color = 'var(--mtrl-sys-color-on-secondary-container)'

    // Set appropriate text based on action
    switch (actionName) {
      case 'search':
        actionItem.textContent = 'Search'
        break
      case 'favorite':
        actionItem.textContent = 'Favorite'
        break
      case 'share':
        actionItem.textContent = 'Share'
        break
      default:
        actionItem.textContent = actionName
    }

    // Only add if not already in the overflow menu
    const existing = Array.from(overflowMenu.querySelectorAll('.overflow-action'))
      .find(el => el.textContent === actionItem.textContent)

    if (!existing) {
      overflowMenu.appendChild(actionItem)
    }
  }

  // Add a description
  const description = document.createElement('div')
  description.className = 'mtrl-content__description'
  description.innerHTML = `
    <p>Top app bars adapt to different screen sizes and orientations:</p>
    <ul style="list-style-type: disc; margin-left: 24px; margin-bottom: 16px;">
      <li><strong>Action consolidation:</strong> As screen width decreases, actions are moved into the overflow menu to maintain usability</li>
      <li><strong>Title adaptation:</strong> Long titles may truncate with ellipsis on smaller screens</li>
      <li><strong>Layout flexibility:</strong> The top app bar maintains its core functionality across all screen sizes</li>
    </ul>
    <p>The top app bar should always include the most important actions directly visible, with secondary actions in the overflow menu.</p>
  `

  // Add to layout
  layout.body.appendChild(demoContainer)
  layout.body.appendChild(description)
}
