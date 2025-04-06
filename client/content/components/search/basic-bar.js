// src/client/content/components/search/basic-bar.js

import {
  createComponentsSectionLayout
} from '../../../layout'

import {
  fLayout,
  fSearch,
  createElement
} from 'mtrl'

export const initBasicBar = (container) => {
  const title = 'Basic Search Bar'
  const layout = fLayout(createComponentsSectionLayout({ title }), container).component

  // Create a basic search bar
  const searchBar = fSearch({
    placeholder: 'Search',
    showClearButton: true
  })

  // Create the demo structure
  const demoStructure = [
    [createElement, 'container', { class: 'search-basic-demo' }, [
      [createElement, 'description', {
        tag: 'p',
        text: 'The basic search bar provides a simple search field with a leading search icon and clear button.'
      }],
      [createElement, 'searchContainer', { class: 'search-bar-container' }]
    ]]
  ]

  // Create the demo
  const demo = fLayout(demoStructure, layout.body).component

  // Add the search component to its container
  demo.searchContainer.appendChild(searchBar.element)
}
