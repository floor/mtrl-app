import {
  createComponentsSectionLayout
} from '../../../config'

import {
  createLayout,
  createTabs,
  createElement
} from 'mtrl'

export const initIconTabs = (container) => {
  const title = 'Tabs with Icons'
  const layout = createLayout(createComponentsSectionLayout({ title }), container).component

  // Define SVG icons
  const homeIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>`

  const heartIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>`

  const userIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>`

  // Create tabs with icons only
  const iconOnlyTabs = createTabs({
    tabs: [
      { icon: homeIcon, value: 'home', state: 'active' },
      { icon: heartIcon, value: 'favorites' },
      { icon: userIcon, value: 'profile' }
    ]
  })

  // Create tabs with icons and text
  const iconTextTabs = createTabs({
    tabs: [
      { text: 'Home', icon: homeIcon, value: 'home', state: 'active' },
      { text: 'Favorites', icon: heartIcon, value: 'favorites' },
      { text: 'Profile', icon: userIcon, value: 'profile' }
    ]
  })

  // Create section labels
  const iconOnlyLabel = createElement({
    tag: 'p',
    class: 'mtrl-content__subsection-label',
    text: 'Icon only:'
  })

  const iconTextLabel = createElement({
    tag: 'p',
    class: 'mtrl-content__subsection-label',
    text: 'Icons with text:'
  })

  // Add tabs to the layout
  layout.body.appendChild(iconOnlyLabel)
  layout.body.appendChild(iconOnlyTabs.element)
  layout.body.appendChild(iconTextLabel)
  layout.body.appendChild(iconTextTabs.element)
}
