import {
  iconMore,
  iconDark
} from '../icons'

import {
  navigationStructure
} from '../config'

import {
  createElement as e,
  createNavigationSystem,
  createButton
} from 'mtrl'

export const mainLayout = [
  // [createNavigationSystem, 'navSystem', {
  //   navigationStructure,
  //   expanded: false,
  //   railOptions: {
  //     componentName: 'rail',
  //     position: 'left',
  //     showLabels: true
  //   },
  //   drawerOptions: {
  //     componentName: 'nav',
  //     position: 'left'
  //   }
  // }],

  // [createNavigation, 'rail', {
  //   variant: 'rail',
  //   behavior: 'fixed',
  //   items: mainNavigation
  // }],
  // [createNavigation, 'nav', {
  //   variant: 'drawer',
  //   items: []
  // }],
  [e, 'content', { class: 'mtrl-content' }],
  [createButton, 'moreMenu', { icon: iconMore, iconSize: 'medium', class: 'more-menu', variant: 'outlined', ariaLabel: 'Themes' }],
  [createButton, 'toggleDarkmode', { icon: iconDark, iconSize: 'medium', class: 'toggle-darkmode', variant: 'outlined', ariaLabel: 'Darkmode' }]
]
