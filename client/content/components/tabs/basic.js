import {
  createComponentsSectionLayoutBox
} from '../../../layout'

import {
  createStructure,
  createTabs,
  createElement
} from 'mtrl'

export const initBasicTabs = (container) => {
  const title = 'Basic Tabs'

  const layout = createStructure(createComponentsSectionLayoutBox({ title, class: 'noflex' }), container).component

  const box = createElement({ tag: 'div', class: 'mtrl-components__section-box' })

  // Create tabs with predefined items
  const tabs = createTabs({
    tabs: [
      { text: 'Home', value: 'home', state: 'active' },
      { text: 'Favorites', value: 'favorites' },
      { text: 'Profile', value: 'profile' }
    ]
  })

  // Home content
  const homeContent = createElement({
    tag: 'div',
    class: 'mtrl-content__tab-panel',
    id: 'tab-home'
  })
  homeContent.innerHTML = '<p>Welcome to the home tab content.</p>'

  // Favorites content
  const favoritesContent = createElement({
    tag: 'div',
    class: 'mtrl-content__tab-panel hidden',
    id: 'tab-favorites'
  })
  favoritesContent.innerHTML = '<p>Your favorites would be displayed here.</p>'

  // Profile content
  const profileContent = createElement({
    tag: 'div',
    class: 'mtrl-content__tab-panel hidden',
    id: 'tab-profile'
  })
  profileContent.innerHTML = '<p>Your profile information would appear here.</p>'

  // Add content panels to container
  box.appendChild(homeContent)
  box.appendChild(favoritesContent)
  box.appendChild(profileContent)

  // Handle tab changes
  tabs.on('change', (e) => {
    console.log('change', e)
    // Hide all panels
    const panels = box.querySelectorAll('.mtrl-content__tab-panel')
    panels.forEach(panel => panel.classList.add('hidden'))

    // Show the selected panel
    const selectedPanel = box.querySelector(`#tab-${e.value}`)
    if (selectedPanel) {
      selectedPanel.classList.remove('hidden')
    }
  })

  // Add tabs and content to the layout
  layout.body.appendChild(tabs.element)
  layout.body.appendChild(box)
}
