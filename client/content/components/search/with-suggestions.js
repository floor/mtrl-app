// src/client/content/components/search/with-suggestions.js

import {
  createComponentSection
} from '../../../layout'

import {
  createLayout,
  createSearch,
  SEARCH_VARIANTS
} from 'mtrl'

export const initWithSuggestions = (container) => {
  const title = 'Search with Suggestions'
  const layout = createLayout(createComponentSection({ title }), container).component

  // Define icons for suggestions
  const historyIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>`

  const trendingIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
    <polyline points="17 6 23 6 23 12"></polyline>
  </svg>`

  const suggestionList = [
    { text: 'Recent search 1', icon: historyIcon },
    { text: 'Recent search 2', icon: historyIcon },
    { text: 'Recent search 3', icon: historyIcon },
    { text: 'Trending topic 1', icon: trendingIcon },
    { text: 'Trending topic 2', icon: trendingIcon }
  ]

  // Create search with suggestions
  const searchWithSuggestions = createSearch({
    variant: SEARCH_VARIANTS.VIEW,
    placeholder: 'Search with suggestions',
    showClearButton: true,
    suggestions: suggestionList,
    showDividers: true,
    minWidth: 500
  })

  // Add functionality to demonstrate live filtering
  searchWithSuggestions.on('input', (event) => {
    const value = event.value.toLowerCase()
    if (value) {
      // Filter suggestions based on input
      const filteredSuggestions = suggestionList.filter(item =>
        item.text.toLowerCase().includes(value)
      )
      searchWithSuggestions.setSuggestions(filteredSuggestions)
    } else {
      // Show all suggestions when input is empty
      searchWithSuggestions.setSuggestions(suggestionList)
    }
  })

  // Add a paragraph explaining the component
  const description = document.createElement('p')
  description.textContent = 'Search view can display suggestions that update as the user types. Try typing to see the suggestions filter in real-time.'
  layout.info.appendChild(description)

  // Add the search component
  layout.showcase.appendChild(searchWithSuggestions.element)

  // Add instructions
  const instructions = document.createElement('p')
  instructions.style.fontSize = '14px'
  instructions.style.marginTop = '16px'
  instructions.innerHTML = '<strong>Try it:</strong> Click on the search field and type to see the suggestions filter in real-time.'
  layout.info.appendChild(instructions)
}
