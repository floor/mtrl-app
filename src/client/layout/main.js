import {
  iconMtrl,
  iconComponents,
  iconGetstarted,
  iconStyles,
  iconCore,
  iconMore,
  iconDark
} from '../icons'

import {
  createElement as e,
  createNavigation,
  createButton
} from 'mtrl'

export const mainLayout = [
  [createNavigation, 'rail', {
    variant: 'rail',
    behavior: 'fixed',
    items: [
      { id: 'home', icon: iconMtrl, label: 'Home' },
      { id: 'getstarted', icon: iconGetstarted, label: 'Get Started' },
      { id: 'core', icon: iconCore, label: 'Core' },
      { id: 'styles', icon: iconStyles, label: 'Styles' },
      { id: 'components', icon: iconComponents, label: 'Components' }
    ]
  }],
  [createNavigation, 'nav', {
    variant: 'drawer',
    items: []
  }],
  [e, 'content', { class: 'mtrl-content' }],
  [createButton, 'moreMenu', { icon: iconMore, iconSize: 'medium', class: 'more-menu', variant: 'outlined', ariaLabel: 'Themes' }],
  [createButton, 'toggleDarkmode', { icon: iconDark, iconSize: 'medium', class: 'toggle-darkmode', variant: 'outlined', ariaLabel: 'Darkmode' }]
]
