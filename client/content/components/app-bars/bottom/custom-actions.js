// src/client/content/components/app-bars/bottom/custom-actions.js
import {
  createComponentsSectionLayoutBox
} from '../../../../layout'

import {
  fLayout,
  fBottomAppBar,
  fButton,
  fFab
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

export const initCustomActionsBottomAppBar = (container) => {
  const title = 'Custom Actions & Context'

  const layout = fLayout(createComponentsSectionLayoutBox({
    title,
    class: 'noflex'
  }), container).component

  // Create a demo container
  const demoContainer = document.createElement('div')
  demoContainer.className = 'mtrl-content__bottom-app-bar-demo'
  demoContainer.style.position = 'relative'
  demoContainer.style.height = '400px'
  demoContainer.style.border = '1px solid var(--mtrl-sys-color-outline-variant)'
  demoContainer.style.borderRadius = '8px'
  demoContainer.style.overflow = 'hidden'
  demoContainer.style.marginBottom = '16px'

  // Create a content area to display the current mode
  const contentArea = document.createElement('div')
  contentArea.className = 'mtrl-content__context-display'
  contentArea.style.padding = '16px'
  contentArea.style.textAlign = 'center'
  contentArea.style.height = 'calc(100% - 80px)'
  contentArea.style.overflowY = 'auto'

  // Display initial content
  const updateContentArea = (mode) => {
    let content = ''

    if (mode === 'navigation') {
      content = `
        <h3 style="margin-bottom: 16px;">Navigation Mode</h3>
        <div style="text-align: center; margin-bottom: 24px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" 
            stroke="var(--mtrl-sys-color-primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        </div>
        <p>The bottom app bar displays navigation actions like Home, Favorites, and Profile.</p>
        <p style="margin-top: 12px;">This mode is useful for helping users navigate between main sections of the app.</p>
      `
    } else if (mode === 'editing') {
      content = `
        <h3 style="margin-bottom: 16px;">Editing Mode</h3>
        <div style="text-align: center; margin-bottom: 24px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" 
            stroke="var(--mtrl-sys-color-error)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </div>
        <p>The bottom app bar has switched to editing mode with actions like Save, Delete, and Format.</p>
        <p style="margin-top: 12px;">Context-specific actions help users focus on the current task.</p>
      `
    } else if (mode === 'selection') {
      content = `
        <h3 style="margin-bottom: 16px;">Selection Mode</h3>
        <div style="text-align: center; margin-bottom: 24px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" 
            stroke="var(--mtrl-sys-color-secondary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 11 12 14 22 4"></polyline>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
          </svg>
        </div>
        <p>Selection mode allows users to manage multiple items with actions like Select All, Delete, and Share.</p>
        <p style="margin-top: 12px;">This mode is ideal for batch operations on selected items.</p>
      `
    }

    contentArea.innerHTML = content
  }

  // Initial content display
  updateContentArea('navigation')
  demoContainer.appendChild(contentArea)

  // Create bottom app bars for different modes
  const navigationBar = fBottomAppBar({
    hasFab: true
  })

  const editingBar = fBottomAppBar()

  const selectionBar = fBottomAppBar()

  // Create navigation mode actions
  const homeButton = fButton({
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>',
    variant: 'icon',
    ariaLabel: 'Home'
  })

  const favoritesButton = fButton({
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>',
    variant: 'icon',
    ariaLabel: 'Favorites'
  })

  const profileButton = fButton({
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>',
    variant: 'icon',
    ariaLabel: 'Profile'
  })

  // Create editing mode actions
  const saveButton = fButton({
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>',
    variant: 'icon',
    ariaLabel: 'Save'
  })

  const deleteButton = fButton({
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>',
    variant: 'icon',
    ariaLabel: 'Delete'
  })

  const formatButton = fButton({
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="21" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="21" y1="18" x2="3" y2="18"></line></svg>',
    variant: 'icon',
    ariaLabel: 'Format'
  })

  const undoButton = fButton({
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 14 4 9 9 4"></polyline><path d="M20 20v-7a4 4 0 0 0-4-4H4"></path></svg>',
    variant: 'icon',
    ariaLabel: 'Undo'
  })

  // Create selection mode actions
  const selectAllButton = fButton({
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="9" x2="15" y2="15"></line><line x1="15" y1="9" x2="9" y2="15"></line></svg>',
    variant: 'icon',
    ariaLabel: 'Select All'
  })

  const shareSelectionButton = fButton({
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>',
    variant: 'icon',
    ariaLabel: 'Share Selection'
  })

  const copySelectionButton = fButton({
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>',
    variant: 'icon',
    ariaLabel: 'Copy Selection'
  })

  const deleteSelectionButton = fButton({
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>',
    variant: 'icon',
    ariaLabel: 'Delete Selection'
  })

  // Create FAB for primary action using the dedicated FAB component
  const addFab = fFab({
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>',
    ariaLabel: 'Add new item',
    variant: FAB_VARIANTS.PRIMARY
  })

  // Add actions to navigation bar
  navigationBar.addAction(homeButton.element)
  navigationBar.addAction(favoritesButton.element)
  navigationBar.addAction(profileButton.element)
  navigationBar.addFab(addFab.element)

  // Add actions to editing bar
  editingBar.addAction(saveButton.element)
  editingBar.addAction(formatButton.element)
  editingBar.addAction(undoButton.element)
  editingBar.addAction(deleteButton.element)

  // Add actions to selection bar
  selectionBar.addAction(selectAllButton.element)
  selectionBar.addAction(copySelectionButton.element)
  selectionBar.addAction(shareSelectionButton.element)
  selectionBar.addAction(deleteSelectionButton.element)

  // Start with navigation bar
  let currentBar = navigationBar
  demoContainer.appendChild(navigationBar.element)
  navigationBar.lifecycle.mount()

  // Create context switcher
  const contextSwitcher = document.createElement('div')
  contextSwitcher.className = 'mtrl-content__context-switcher'
  contextSwitcher.style.display = 'flex'
  contextSwitcher.style.gap = '8px'
  contextSwitcher.style.marginBottom = '16px'

  // Create buttons for switching context
  const modes = [
    { name: 'Navigation Mode', value: 'navigation' },
    { name: 'Editing Mode', value: 'editing' },
    { name: 'Selection Mode', value: 'selection' }
  ]

  modes.forEach(mode => {
    const button = fButton({
      text: mode.name,
      variant: mode.value === 'navigation' ? 'filled' : 'outlined'
    })

    button.on('click', () => {
      // Remove active bar
      if (currentBar) {
        currentBar.element.remove()
      }

      // Add new bar based on selected mode
      if (mode.value === 'navigation') {
        currentBar = navigationBar
        demoContainer.appendChild(navigationBar.element)
      } else if (mode.value === 'editing') {
        currentBar = editingBar
        demoContainer.appendChild(editingBar.element)
      } else if (mode.value === 'selection') {
        currentBar = selectionBar
        demoContainer.appendChild(selectionBar.element)
      }

      // Update content area
      updateContentArea(mode.value)

      // Update button styles
      contextSwitcher.querySelectorAll('button').forEach(btn => {
        btn.classList.remove(`${button.getClass('button')}--filled`)
        btn.classList.add(`${button.getClass('button')}--outlined`)
      })
      button.element.classList.remove(`${button.getClass('button')}--outlined`)
      button.element.classList.add(`${button.getClass('button')}--filled`)
    })

    contextSwitcher.appendChild(button.element)
  })

  // Add a description
  const description = document.createElement('div')
  description.className = 'mtrl-content__description'
  description.innerHTML = `
    <p>Bottom app bars can adapt to different contexts, showing different actions depending on the current mode:</p>
    <ul style="list-style-type: disc; margin-left: 24px; margin-bottom: 16px;">
      <li><strong>Navigation Mode:</strong> Provides navigation between app sections, with a FAB for the primary action.</li>
      <li><strong>Editing Mode:</strong> Shows context-specific editing actions.</li>
      <li><strong>Selection Mode:</strong> Provides operations for working with selected items.</li>
    </ul>
    <p>Switching between contexts provides a consistent location for actions while optimizing for the current task.</p>
  `

  // Add everything to layout
  layout.body.appendChild(demoContainer)
  layout.body.appendChild(contextSwitcher)
  layout.body.appendChild(description)
}
