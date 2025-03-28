// src/client/content/components/search/with-icons.js

import {
  createComponentsSectionLayout
} from '../../../layout'

import {
  createLayout,
  createSearch,
  createElement,
  createDivider
} from 'mtrl'

export const initWithIcons = (container) => {
  const title = 'Search Bar with Multiple Icons'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component

  // Define icons
  const microphoneIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
    <line x1="12" y1="19" x2="12" y2="23"></line>
    <line x1="8" y1="23" x2="16" y2="23"></line>
  </svg>`

  const settingsIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>`

  // Create search with one trailing icon
  const searchOneIcon = createSearch({
    placeholder: 'Search with voice',
    showClearButton: true,
    trailingIcon: microphoneIcon
  })

  // Create search with two trailing icons
  const searchTwoIcons = createSearch({
    placeholder: 'Search with voice and settings',
    showClearButton: true,
    trailingIcon: microphoneIcon,
    trailingIcon2: settingsIcon
  })

  // Create the demo structure
  const demoStructure = [
    [createElement, 'container', { class: 'search-icons-demo' }, [
      [createElement, 'description', {
        tag: 'p',
        text: 'Search bars can include additional icons for voice search, filtering, or other actions.'
      }],
      [createElement, 'section1', { class: 'search-one-icon-section' }, [
        [createElement, 'heading1', {
          tag: 'h3',
          text: 'With one trailing icon'
        }],
        [createElement, 'searchContainer1', {}]
      ]],
      [createElement, 'divider', { style: { margin: '24px 0' } }],
      [createElement, 'section2', { class: 'search-two-icons-section' }, [
        [createElement, 'heading2', {
          tag: 'h3',
          text: 'With two trailing icons'
        }],
        [createElement, 'searchContainer2', {}]
      ]]
    ]]
  ]

  // Create the demo
  const demo = createLayout(demoStructure, layout.body).component

  // // Add divider
  // const divider = createDivider()
  // demo.divider.appendChild(divider.element)

  // Add search components to their containers
  demo.searchContainer1.appendChild(searchOneIcon.element)
  demo.searchContainer2.appendChild(searchTwoIcons.element)
}
