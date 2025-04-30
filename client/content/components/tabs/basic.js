import {
  createComponentSection
} from '../../../layout'

import {
  createLayout,
  createTabs,
  addClass,
  removeClass
} from 'mtrl'

export const initBasicTabs = (container) => {
  const title = 'Tabs'

  const layout = createLayout(createComponentSection({ title }), container).component

  const tabsLayout = createLayout([
    { layout: { type: 'flex' }, style: { width: '80%' } },
    [createTabs, 'tabs', {
      tabs: [
        { text: 'Home', value: 'home', state: 'active' },
        { text: 'Favorites', value: 'favorites' },
        { text: 'Profile', value: 'profile' }
      ]
    }],
    ['home', { tag: 'div', class: 'content__tab-panel', attrs: { id: 'panel-home' } }],
    ['favorites', { tag: 'div', class: 'content__tab-panel hidden', attrs: { id: 'panel-favorites' } }],
    ['profile', { tag: 'div', class: 'content__tab-panel hidden', attrs: { id: 'panel-profile' } }]
  ], layout.showcase)

  const { tabs, home, favorites, profile } = tabsLayout.component
  home.innerHTML = '<p>Welcome to the home tab content.</p>'
  favorites.innerHTML = '<p>Your favorites would be displayed here.</p>'
  profile.innerHTML = '<p>Your profile information would appear here.</p>'

  const panels = [home, favorites, profile]

  // Handle tab changes
  tabs.on('change', (e) => {
    console.log('change', e.value)
    // Hide all panels
    panels.forEach(panel => addClass(panel, 'hidden'))

    // Show the selected panel
    const selectedPanel = layout.body.querySelector(`#panel-${e.value}`)
    console.log('selectedPanel', selectedPanel)
    if (selectedPanel) {
      removeClass(selectedPanel, 'hidden')
    }
  })
}
