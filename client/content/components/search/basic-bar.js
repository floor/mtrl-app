// src/client/content/components/search/basic-bar.js

import {
  createComponentsSectionLayout
} from '../../../layout'

import {
  createLayout,
  createSearch,
  createElement
} from 'mtrl'

export const initBasicBar = (container) => {
  const title = 'Basic Search Bar'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component

  // Component show case
  const searchBar = createSearch({
    placeholder: 'Search',
    showClearButton: true
  })

  // Create the demo structure

  // // Component show case
  const demo = createLayout([
    [createElement, 'container', { class: 'search-basic-demo' }, [
      [createElement, 'description', {
        tag: 'p',
        text: 'The basic search bar provides a simple search field with a leading search icon and clear button.'
      }],
      [createElement, 'searchContainer', { class: 'search-bar-container' }]
    ]]
  ], layout.info).component

  // Add the search component to its container
  demo.searchContainer.appendChild(searchBar.element)
}
