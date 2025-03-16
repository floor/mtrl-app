// src/client/content/components/app-bars/top/custom-actions.js
import {
  createComponentsSectionLayoutBox
} from '../../../../layout'

import {
  createLayout,
  createTopAppBar,
  createButton
} from 'mtrl'

export const initCustomActionsTopAppBar = (container) => {
  const title = 'Custom Actions & Context'

  const layout = createLayout(createComponentsSectionLayoutBox({
    title,
    class: 'noflex'
  }), container).component

  // Create a demo container
  const demoContainer = document.createElement('div')
  demoContainer.className = 'mtrl-content__top-app-bar-demo'
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
  contentArea.style.height = 'calc(100% - 64px)'
  contentArea.style.overflowY = 'auto'

  // Display initial content
  const updateContentArea = (mode) => {
    let content = ''

    if (mode === 'browse') {
      content = `
        <h3 style="margin-bottom: 16px;">Browse Mode</h3>
        <div style="text-align: center; margin-bottom: 24px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" 
            stroke="var(--mtrl-sys-color-primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
        </div>
        <p>The top app bar displays browsing actions like Search, Filter, and View options.</p>
        <p style="margin-top: 12px;">This mode is useful for content exploration and discovery.</p>
      `
    } else if (mode === 'edit') {
      content = `
        <h3 style="margin-bottom: 16px;">Edit Mode</h3>
        <div style="text-align: center; margin-bottom: 24px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" 
            stroke="var(--mtrl-sys-color-error)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </div>
        <p>The top app bar has switched to editing mode with Save, Discard, and Format actions.</p>
        <p style="margin-top: 12px;">Context-specific actions help users focus on the current editing task.</p>
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
        <p>Selection mode shows the number of selected items and provides batch actions like Delete, Share, and Archive.</p>
        <p style="margin-top: 12px;">The top app bar adapts to show the most relevant actions for selection operations.</p>
      `
    }

    contentArea.innerHTML = content
  }

  // Initial content display
  updateContentArea('browse')

  // Create top app bars for different modes
  const browseBar = createTopAppBar({
    title: 'Library',
    type: 'small'
  })

  const editBar = createTopAppBar({
    title: 'Edit Document',
    type: 'small'
  })

  const selectionBar = createTopAppBar({
    title: '3 Selected',
    type: 'small'
  })

  // Create browse mode actions
  const backButton = createButton({
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>',
    variant: 'icon',
    ariaLabel: 'Back'
  })

  const searchButton = createButton({
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>',
    variant: 'icon',
    ariaLabel: 'Search'
  })

  const filterButton = createButton({
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>',
    variant: 'icon',
    ariaLabel: 'Filter'
  })

  const moreButton = createButton({
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>',
    variant: 'icon',
    ariaLabel: 'More options'
  })

  // Create edit mode actions
  const closeButton = createButton({
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
    variant: 'icon',
    ariaLabel: 'Close'
  })

  const saveButton = createButton({
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>',
    variant: 'icon',
    ariaLabel: 'Save'
  })

  const undoButton = createButton({
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 14 4 9 9 4"></polyline><path d="M20 20v-7a4 4 0 0 0-4-4H4"></path></svg>',
    variant: 'icon',
    ariaLabel: 'Undo'
  })

  const formatButton = createButton({
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="21" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="21" y1="18" x2="3" y2="18"></line></svg>',
    variant: 'icon',
    ariaLabel: 'Format'
  })

  // Create selection mode actions
  const closeSelectionButton = createButton({
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
    variant: 'icon',
    ariaLabel: 'Cancel selection'
  })

  const selectAllButton = createButton({
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3h18v18H3z"></path></svg>',
    variant: 'icon',
    ariaLabel: 'Select all'
  })

  const deleteButton = createButton({
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>',
    variant: 'icon',
    ariaLabel: 'Delete'
  })

  const shareSelectionButton = createButton({
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>',
    variant: 'icon',
    ariaLabel: 'Share selection'
  })

  // Add elements to the browse bar
  browseBar.addLeadingElement(backButton.element)
  browseBar.addTrailingElement(searchButton.element)
  browseBar.addTrailingElement(filterButton.element)
  browseBar.addTrailingElement(moreButton.element)

  // Add elements to the edit bar
  editBar.addLeadingElement(closeButton.element)
  editBar.addTrailingElement(formatButton.element)
  editBar.addTrailingElement(undoButton.element)
  editBar.addTrailingElement(saveButton.element)

  // Add elements to the selection bar
  selectionBar.addLeadingElement(closeSelectionButton.element)
  selectionBar.addTrailingElement(selectAllButton.element)
  selectionBar.addTrailingElement(deleteButton.element)
  selectionBar.addTrailingElement(shareSelectionButton.element)

  // Start with browse bar
  let currentBar = browseBar
  demoContainer.appendChild(browseBar.element)
  demoContainer.appendChild(contentArea)
  browseBar.lifecycle.mount()

  // Create context switcher
  const contextSwitcher = document.createElement('div')
  contextSwitcher.className = 'mtrl-content__context-switcher'
  contextSwitcher.style.display = 'flex'
  contextSwitcher.style.gap = '8px'
  contextSwitcher.style.marginBottom = '16px'

  // Create buttons for switching context
  const modes = [
    { name: 'Browse Mode', value: 'browse' },
    { name: 'Edit Mode', value: 'edit' },
    { name: 'Selection Mode', value: 'selection' }
  ]

  modes.forEach(mode => {
    const button = createButton({
      text: mode.name,
      variant: mode.value === 'browse' ? 'filled' : 'outlined'
    })

    button.on('click', () => {
      // Remove active bar
      if (currentBar) {
        currentBar.element.remove()
      }

      // Add new bar based on selected mode
      if (mode.value === 'browse') {
        currentBar = browseBar
        demoContainer.insertBefore(browseBar.element, contentArea)
      } else if (mode.value === 'edit') {
        currentBar = editBar
        demoContainer.insertBefore(editBar.element, contentArea)
      } else if (mode.value === 'selection') {
        currentBar = selectionBar
        demoContainer.insertBefore(selectionBar.element, contentArea)
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
    <p>Top app bars can adapt to different contexts, showing different actions depending on the current mode:</p>
    <ul style="list-style-type: disc; margin-left: 24px; margin-bottom: 16px;">
      <li><strong>Browse Mode:</strong> Provides navigation and content exploration actions</li>
      <li><strong>Edit Mode:</strong> Shows context-specific editing actions</li>
      <li><strong>Selection Mode:</strong> Displays the number of selected items and batch operation actions</li>
    </ul>
    <p>Adapting the top app bar to the current context helps users focus on their current task while maintaining a consistent location for navigation and actions.</p>
  `

  // Add everything to layout
  layout.body.appendChild(demoContainer)
  layout.body.appendChild(contextSwitcher)
  layout.body.appendChild(description)
}
