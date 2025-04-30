// src/client/content/components/search/docked-view.js

import {
  createComponentSection
} from '../../../layout'

import {
  createLayout,
  createSearch,
  createElement,
  SEARCH_VIEW_MODES,
  SEARCH_VARIANTS
} from 'mtrl'

export const initDockedView = (container) => {
  const title = 'Search View (Docked Mode)'
  const layout = createLayout(createComponentSection({ title }), container).component

  const searchView = createSearch({
    variant: SEARCH_VARIANTS.VIEW,
    viewMode: SEARCH_VIEW_MODES.DOCKED,
    placeholder: 'Search in documents',
    showClearButton: true,
    supportingText: 'Try searching for documents, files, or content',
    suggestions: [
      'Documents',
      'Spreadsheets',
      'Presentations',
      'Images',
      'Shared with me',
      'Recent files'
    ]
  })

  // Create the demo structure
  const demoStructure = [
    [createElement, 'container', { class: 'search-docked-demo' }, [
      [createElement, 'description', {
        tag: 'p',
        text: 'The docked search view provides a contained search experience that overlays on the current content. It\'s ideal for desktop interfaces where screen space is available.'
      }],
      [createElement, 'searchContainer', { class: 'search-docked-container' }]
    ]]
  ]

  // Create the demo
  const demo = createLayout(demoStructure, layout.body).component

  // Add the search component to its container
  demo.searchContainer.appendChild(searchView.element)

  // Add some styling to demonstrate the docked container appropriately
  demo.searchContainer.style.position = 'relative'
  demo.searchContainer.style.height = '400px'
  demo.searchContainer.style.display = 'flex'
  demo.searchContainer.style.justifyContent = 'center'
  demo.searchContainer.style.alignItems = 'flex-start'
  demo.searchContainer.style.padding = '20px'
  demo.searchContainer.style.backgroundColor = '#f5f5f5'
  demo.searchContainer.style.borderRadius = '8px'
}
