// src/client/content/components/search/with-avatar.js

import {
  createComponentSection
} from '../../../layout'

import {
  createLayout,
  createSearch,
  createElement,
  createDivider
} from 'mtrl'

export const initWithAvatar = (container) => {
  const title = 'Search Bar with Avatar'
  const layout = createLayout(createComponentSection({ title }), container).component

  // Define avatar
  const avatar = '<img src="https://i.pravatar.cc/100" alt="User avatar">'

  // Define mic icon
  const microphoneIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
    <line x1="12" y1="19" x2="12" y2="23"></line>
    <line x1="8" y1="23" x2="16" y2="23"></line>
  </svg>`

  // Create search with avatar
  const searchWithAvatar = createSearch({
    placeholder: 'Search as John Doe',
    showClearButton: true,
    avatar
  })

  // Create search with avatar and icon
  const searchWithAvatarAndIcon = createSearch({
    placeholder: 'Search with voice as John Doe',
    showClearButton: true,
    trailingIcon: microphoneIcon,
    avatar
  })

  // Create the demo structure
  const demoStructure = [
    [createElement, 'container', { class: 'search-avatar-demo' }, [
      [createElement, 'description', {
        tag: 'p',
        text: 'Search bars can include an avatar to indicate the current user context for the search.'
      }],
      [createElement, 'section1', { class: 'search-avatar-only-section' }, [
        [createElement, 'heading1', {
          tag: 'h3',
          text: 'With avatar only'
        }],
        [createElement, 'searchContainer1', {}]
      ]],
      [createElement, 'divider', { style: { margin: '24px 0' } }],
      [createElement, 'section2', { class: 'search-avatar-icon-section' }, [
        [createElement, 'heading2', {
          tag: 'h3',
          text: 'With avatar and trailing icon'
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
  demo.searchContainer1.appendChild(searchWithAvatar.element)
  demo.searchContainer2.appendChild(searchWithAvatarAndIcon.element)
}
