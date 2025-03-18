// src/client/content/components/app-bars/bottom/programmatic.js
import {
  createComponentsSectionLayoutBox
} from '../../../../layout'

import {
  createLayout,
  createBottomAppBar,
  createButton,
  createSnackbar,
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

export const initProgrammaticBottomAppBar = (container) => {
  const title = 'Programmatic Control'

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

  // Create status display
  const statusDisplay = document.createElement('div')
  statusDisplay.className = 'mtrl-content__status-display'
  statusDisplay.style.padding = '16px'
  statusDisplay.style.textAlign = 'center'
  statusDisplay.innerHTML = `
    <p style="margin-bottom: 8px;">Current status: <span id="bar-status">Visible</span></p>
    <p>Use the buttons below to control the bottom app bar.</p>
  `
  demoContainer.appendChild(statusDisplay)

  // Create the bottom app bar
  const bottomBar = createBottomAppBar({
    hasFab: true
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

  // Create a FAB using the proper FAB component
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

  // Create control buttons
  const controlsContainer = document.createElement('div')
  controlsContainer.className = 'mtrl-content__controls'
  controlsContainer.style.display = 'flex'
  controlsContainer.style.flexWrap = 'wrap'
  controlsContainer.style.gap = '12px'
  controlsContainer.style.marginBottom = '16px'

  // Show button
  const showButton = createButton({
    text: 'Show Bar',
    variant: 'filled'
  })

  // Hide button
  const hideButton = createButton({
    text: 'Hide Bar',
    variant: 'outlined'
  })

  // Add action button
  const addActionButton = createButton({
    text: 'Add Action',
    variant: 'outlined'
  })

  // Remove action button
  const removeActionButton = createButton({
    text: 'Remove Action',
    variant: 'outlined'
  })

  // Add/remove FAB buttons
  const addFabButton = createButton({
    text: 'Add FAB',
    variant: 'outlined'
  })

  const removeFabButton = createButton({
    text: 'Remove FAB',
    variant: 'outlined'
  })

  // Add event handlers
  showButton.on('click', () => {
    bottomBar.show()
    updateStatus('Visible')
  })

  hideButton.on('click', () => {
    bottomBar.hide()
    updateStatus('Hidden')
  })

  // Track added actions
  let actionCount = 3 // Start with 3 actions already added

  addActionButton.on('click', () => {
    // Prevent adding too many actions
    if (actionCount >= 4) {
      const snackbar = createSnackbar({
        message: 'Maximum of 4 actions reached'
      })
      snackbar.show()

      return
    }

    actionCount++

    // Create a new action
    const newButton = createButton({
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>',
      variant: 'icon',
      ariaLabel: 'Settings'
    })

    bottomBar.addAction(newButton.element)
    updateStatus(`Added action (${actionCount}/4)`)
  })

  removeActionButton.on('click', () => {
    if (actionCount <= 1) {
      const snackbar = createSnackbar({
        message: 'Must have at least one action'
      })
      snackbar.show()
      return
    }

    // Get the actions container
    const actionsContainer = bottomBar.getActionsContainer()

    // Remove the last action
    if (actionsContainer.lastChild) {
      actionsContainer.removeChild(actionsContainer.lastChild)
      actionCount--
      updateStatus(`Removed action (${actionCount}/4)`)
    }
  })

  // Track FAB state
  let hasFab = true

  addFabButton.on('click', () => {
    if (hasFab) {
      const snackbar = createSnackbar({
        message: 'FAB is already added'
      })
      snackbar.show()
      return
    }

    // Create and add a new FAB
    const newFab = createButton({
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>',
      variant: 'filled',
      ariaLabel: 'Add new item'
    })
    newFab.element.classList.add(`${newFab.getClass('button')}--circular`)

    bottomBar.addFab(newFab.element)
    hasFab = true
    updateStatus('FAB added')
  })

  removeFabButton.on('click', () => {
    if (!hasFab) {
      const snackbar = createSnackbar({
        message: 'No FAB to remove'
      })
      snackbar.show()
      return
    }

    // Get the FAB container
    const fabContainer = bottomBar.element.querySelector(`.${bottomBar.getClass('bottom-app-bar')}-fab-container`)

    // Clear the FAB container
    if (fabContainer) {
      fabContainer.innerHTML = ''
      hasFab = false

      // Update class to indicate no FAB
      bottomBar.element.classList.remove(`${bottomBar.getClass('bottom-app-bar')}--with-fab`)

      updateStatus('FAB removed')
    }
  })

  // Function to update status display
  function updateStatus (status) {
    const statusElement = document.getElementById('bar-status')
    if (statusElement) {
      statusElement.textContent = status

      // Highlight the status briefly
      statusElement.style.color = 'var(--mtrl-sys-color-primary)'
      statusElement.style.fontWeight = '500'

      setTimeout(() => {
        statusElement.style.color = ''
        statusElement.style.fontWeight = ''
      }, 1000)
    }
  }

  // Add all control buttons to the container
  controlsContainer.appendChild(showButton.element)
  controlsContainer.appendChild(hideButton.element)
  controlsContainer.appendChild(addActionButton.element)
  controlsContainer.appendChild(removeActionButton.element)
  controlsContainer.appendChild(addFabButton.element)
  controlsContainer.appendChild(removeFabButton.element)

  // Add a description
  const description = document.createElement('div')
  description.className = 'mtrl-content__description'
  description.innerHTML = `
    <p>The bottom app bar can be controlled programmatically:</p>
    <ul style="list-style-type: disc; margin-left: 24px; margin-bottom: 16px;">
      <li><strong>Show/Hide:</strong> Control visibility with the <code>show()</code> and <code>hide()</code> methods.</li>
      <li><strong>Add/Remove Actions:</strong> Add or remove action buttons dynamically.</li>
      <li><strong>Add/Remove FAB:</strong> Add or remove the floating action button (FAB).</li>
    </ul>
    <p>These methods allow you to adapt the bar's behavior and content based on user interactions or application state.</p>
  `

  // Add everything to layout
  layout.body.appendChild(demoContainer)
  layout.body.appendChild(controlsContainer)
  layout.body.appendChild(description)
}
