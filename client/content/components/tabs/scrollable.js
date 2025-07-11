import { createLayout } from 'mtrl-addons'
import {
  createComponentSection
} from '../../../layout'

import {
  createTabs
} from 'mtrl'

export const initScrollableTabs = (container) => {
  const title = 'Scrollable Tabs'
  const layout = createLayout(createComponentSection({ title, class: 'noflex' }), container).component

  // Create tabs with many items to demonstrate scrolling
  const tabs = createTabs({
    scrollable: true, // Explicitly enable scrolling (though it's enabled by default)
    tabs: [
      { text: 'Home', value: 'home', state: 'active' },
      { text: 'Recent', value: 'recent' },
      { text: 'Favorites', value: 'favorites' },
      { text: 'Trending', value: 'trending' },
      { text: 'Categories', value: 'categories' },
      { text: 'Recommendations', value: 'recommendations' },
      { text: 'History', value: 'history' },
      { text: 'Saved', value: 'saved' },
      { text: 'Playlists', value: 'playlists' },
      { text: 'Settings', value: 'settings' }
    ]
  })

  // Add description text
  const description = document.createElement('p')
  description.className = 'mtrl-content__scrollable-description'
  description.textContent = 'When there are too many tabs to fit in the available space, scrollable tabs allow horizontal scrolling to access all the tabs.'

  // Add tabs to the layout
  layout.showcase.appendChild(tabs.element)
  layout.info.appendChild(description)

  // Set a max width to demonstrate scrolling even on wide screens
  tabs.element.style.maxWidth = '600px'
}
