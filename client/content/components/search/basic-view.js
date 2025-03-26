// src/client/content/components/search/basic-view.js

import {
  createComponentsSectionLayout
} from '../../../layout'

import {
  createStructure,
  createSearch,
  createElement
} from 'mtrl'

export const SEARCH_VARIANTS = {
  BAR: 'bar',
  VIEW: 'view'
}

export const initBasicView = (container) => {
  const title = 'Search View (Full Screen Mode)'
  const layout = createStructure(createComponentsSectionLayout({ title }), container).component

  const searchView = createSearch({
    variant: SEARCH_VARIANTS.VIEW,
    placeholder: 'Search items',
    showClearButton: true,
    fullWidth: true,
    suggestions: [
      'Recent searches',
      'Popular searches',
      'Trending topics'
    ]
  })

  // Create the demo structure
  const demoStructure = [
    [createElement, 'container', { class: 'search-view-demo' }, [
      [createElement, 'description', {
        tag: 'p',
        text: 'The search view provides a full-screen search experience with suggestions and results. It can be used as the primary focus for search-oriented interfaces.'
      }],
      [createElement, 'searchContainer', { class: 'search-view-container' }]
    ]]
  ]

  // Create the demo
  const demo = createStructure(demoStructure, layout.body).component

  // Add the search component to its container
  demo.searchContainer.appendChild(searchView.element)
}
