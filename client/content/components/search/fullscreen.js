// src/client/content/components/search/fullscreen-view.js

import {
  createComponentsSectionLayout
} from '../../../layout'

import {
  createLayout,
  createSearch,
  createElement,
  SEARCH_VARIANTS,
  SEARCH_VIEW_MODES
} from 'mtrl'

export const initFullscreenView = (container) => {
  const title = 'Search View (Fullscreen Mode)'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component

  const searchView = createSearch({
    variant: SEARCH_VARIANTS.VIEW,
    viewMode: SEARCH_VIEW_MODES.FULLSCREEN,
    placeholder: 'Search products',
    showClearButton: true,
    supportingText: 'Try searching for products, categories, or brands',
    trailingIcon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>',
    suggestions: [
      {
        text: 'Electronics',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>'
      },
      {
        text: 'Clothing & Apparel',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z"></path></svg>'
      },
      {
        text: 'Home & Kitchen',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>'
      },
      {
        text: 'Books & Media',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>'
      }
    ]
  })

  // Create the demo structure
  const demoStructure = [
    [createElement, 'container', { class: 'search-fullscreen-demo' }, [
      [createElement, 'description', {
        tag: 'p',
        text: 'The fullscreen search view provides an immersive search experience that takes over the entire viewport. It\'s optimized for mobile devices and focused search interactions.'
      }],
      [createElement, 'toggleButton', {
        tag: 'button',
        class: 'toggle-fullscreen-button',
        text: 'Toggle Fullscreen Mode'
      }],
      [createElement, 'searchContainer', { class: 'search-fullscreen-container' }]
    ]]
  ]

  // Create the demo
  const demo = createLayout(demoStructure, layout.body).component

  // Add the search component to its container
  demo.searchContainer.appendChild(searchView.element)

  // For demo purposes: When in fullscreen mode, we'll simulate it rather than actually making it fullscreen
  // This way users can still see the demo container
  demo.searchContainer.style.position = 'relative'
  demo.searchContainer.style.height = '500px'
  demo.searchContainer.style.overflow = 'hidden'
  demo.searchContainer.style.backgroundColor = '#f5f5f5'
  demo.searchContainer.style.borderRadius = '8px'
  demo.searchContainer.style.marginTop = '16px'

  // Add toggle button functionality
  demo.toggleButton.addEventListener('click', () => {
    const currentMode = searchView.getViewMode()
    if (currentMode === SEARCH_VIEW_MODES.FULLSCREEN) {
      searchView.setViewMode(SEARCH_VIEW_MODES.DOCKED)
      demo.toggleButton.textContent = 'Switch to Fullscreen Mode'
    } else {
      searchView.setViewMode(SEARCH_VIEW_MODES.FULLSCREEN)
      demo.toggleButton.textContent = 'Switch to Docked Mode'
    }
  })
}
