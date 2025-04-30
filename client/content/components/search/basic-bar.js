// src/client/content/components/search/basic-bar.js

import {
  createComponentSection
} from '../../../layout'

import {
  createLayout,
  createSearch,
  createElement
} from 'mtrl'

export const initBasicBar = (container) => {
  const title = 'Basic Search Bar'
  const layout = createLayout(createComponentSection({ title }), container).component

  // Create the demo structure

  // // Component show case
  const showcase = createLayout([
    [createSearch, 'search', {
      placeholder: 'Search',
      showClearButton: true
    }]
  ], layout.showcase).component

  const searchComponent = showcase.search

  const info = createLayout([
    [createElement, 'container', { class: 'search-basic-demo' }, [
      [createElement, 'description', {
        tag: 'p',
        text: 'The basic search bar provides a simple search field with a leading search icon and clear button.'
      }],
      [createElement, 'searchContainer', { class: 'search-bar-container' }]
    ]]
  ], layout.info).component
}
